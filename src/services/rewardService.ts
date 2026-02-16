import supabase from "../lib/supabase";
import NotificationHelpers from "../utils/notifications/notificationHelpers";

let referralHandled = false;

export const handleReferralInsertOnly = async () => {
  if (referralHandled) return;
  referralHandled = true;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const token = session?.access_token;
  const metadata = user?.user_metadata;

  const referralCode =
    metadata?.referral_code || localStorage.getItem("referral_code");

  if (!user || !token || !referralCode) return;

  await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add_referral`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        referred_user_id: user.id,
        referral_code: referralCode,
      }),
    }
  );

  // Cleanup
  await supabase.auth.updateUser({
    data: {
      referral_code: null,
    },
  });
  localStorage.removeItem("referral_code");
};

export const handleSharedItemClaim = async (refetch?: () => void) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const token = session?.access_token;
  const metadata = user?.user_metadata;

  const sharedToken =
    metadata?.shared_token || localStorage.getItem("sharedToken");

  if (!user || !token || !sharedToken) return;

  try {
    const { data: shareRow, error: fetchErr } = await supabase
      .from("shared_items")
      .select("*")
      .eq("token", sharedToken)
      .maybeSingle();

    if (fetchErr || !shareRow) return;

    if (shareRow.recipient_email && shareRow.recipient_email !== user.email) {
      return;
    }

    const alreadyClaimed =
      shareRow.recipient_id === user.id && shareRow.claimed;

    if (!alreadyClaimed) {
      const { data: shares } = await supabase
        .from("shared_items")
        .update({
          recipient_id: user.id,
          recipient_email: user.email,
          claimed: true,
        })
        .eq("id", shareRow.id)
        .select();
      const updatedShare = shares?.[0];
      const senderId = updatedShare?.sender_id;

      const { data: recipientProfile, error } = await supabase
        .from("user_profiles")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile name:", error.message);
        return null;
      }

      const { data: senderProfile } = await supabase
        .from("user_profiles")
        .select("name")
        .eq("user_id", senderId)
        .maybeSingle();

      const senderName = senderProfile?.name || "Someone";
      const recipientName = recipientProfile?.name;

      const itemType = updatedShare.item_type === "tool" ? "tool" : "stack";
      const itemId = updatedShare.item_id;
      const shareToken = updatedShare.token;
      // Reward only if new user
      const isNewUser =
        new Date().getTime() - new Date(user.created_at).getTime() <
        5 * 60 * 1000;

      if (isNewUser && shareRow.sender_id) {
        await handleDailyClaim("share", shareRow.sender_id);
      }

      if (refetch) refetch();

      await NotificationHelpers.onItemShared(
        user?.id as string,
        senderName,
        itemType,
        itemId,
        shareToken
      );
      await NotificationHelpers.onShareSuccess(
        itemType,
        recipientName,
        senderId
      );
    }
  } catch (err) {
    console.error("Share claim error", err);
  } finally {
    // Cleanup
    await supabase.auth.updateUser({
      data: {
        shared_token: null,
        shared_flow: null,
      },
    });

    localStorage.removeItem("sharedToken");
    localStorage.removeItem("sharedFlow");
  }
};

export const handleDailyClaim = async (
  source: "try" | "share" | "review" | "tow",
  userIdOverride?: string
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const userId = userIdOverride ?? session?.user?.id;

  if (!userId || !token) return;

  const url = `${
    import.meta.env.VITE_SUPABASE_URL
  }/functions/v1/earn-more-points`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      source: source,
    }),
  });

  const json = await res.json();

  return {
    status: res.status,
    error: json?.error,
  };
};

export const claimReward = async ({
  rewardTitle,
  rewardPoints,
  userEmail,
  name,
}: {
  rewardTitle: string;
  rewardPoints: number;
  userEmail: string;
  name: string;
  address?: string;
  phone?: string;
  zipCode?: string;
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) return { success: false, message: "User not authenticated" };

  // Fetch user's current total_points
  const { data: profileData, error: profileError } = await supabase
    .from("user_profiles")
    .select("total_points")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError.message);
    return { success: false, message: "Failed to fetch user profile data" };
  }

  const currentPoints = profileData.total_points;

  if (currentPoints < rewardPoints) {
    return { success: false, message: "Insufficient points to claim reward" };
  }

  const newTotalPoints = currentPoints - rewardPoints;

  // Update user's total_points
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ total_points: newTotalPoints })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Update error:", updateError.message);
    return { success: false, message: "Failed to update user points" };
  }

  //  Record the reward claim
  const { error: insertError } = await supabase.from("claimed_rewards").insert([
    {
      user_id: userId,
      reward_title: rewardTitle,
      email: userEmail,
      name,
      points: rewardPoints,
    },
  ]);

  if (insertError) {
    console.error("Insert error:", insertError.message, insertError.details);
    return {
      success: false,
      message: insertError.message,
      details: insertError.details,
    };
  }

  return { success: true, message: "Reward successfully claimed" };
};

export const sendTremendousReward = async ({
  email,
  name,
  rewardTitle,
}: {
  email: string;
  name: string;
  rewardTitle: string;
}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    console.error("Missing access token");
    return {
      status: 401,
      error: "Authentication required",
    };
  }

  const token = session.access_token;
  const url = `${
    import.meta.env.VITE_SUPABASE_URL
  }/functions/v1/send_tremendous_rewards`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rewardTitle,
        email,
        name,
      }),
    });

    const responseText = await res.text();
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      console.warn("Non-JSON response from Tremendous:", responseText);
      json = { raw: responseText };
    }

    if (!res.ok) {
      console.error("Tremendous API error:", json);
    }

    return {
      status: res.status,
      ...json,
    };
  } catch (error: any) {
    console.error("Failed to send tremendous reward:", error);
    return {
      status: 500,
      error: error.message || "Unknown error",
    };
  }
};

export async function sendToolRewardEmail(
  recipientEmail: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  selectedReward: string
) {
  try {
    // Input validation
    if (!recipientEmail) {
      throw new Error("Recipient email is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!htmlBody && !textBody) {
      throw new Error("Either HTML or text content is required");
    }

    // Get auth headers
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("Missing access token");
      return {
        status: 401,
        error: "Authentication required",
      };
    }

    const token = session.access_token;
    const url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/flowa-gift-mail`;

    // Prepare request
    const payload = {
      recipient_email: recipientEmail.trim(),
      subject,
      htmlBody,
      textBody,
      notifyAdmin: true,
      selectedReward,
    };

    // Make API request
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse response
    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) {
        throw new Error(
          `Email sending failed with status ${
            res.status
          }: ${responseText.substring(0, 100)}`
        );
      }
      responseData = { success: true };
    }

    // Handle errors
    if (!res.ok) {
      console.error("Email sending error response:", responseData);
      throw new Error(
        responseData.error ||
          responseData.details ||
          `Email sending failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Error sending share email:", error);
    throw error;
  }
}

export async function sendFlowvaGiftEmail(
  recipientEmail: string,
  subject: string,
  htmlBody: string
) {
  try {
    // Input validation
    if (!recipientEmail) {
      throw new Error("Recipient email is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    // Get auth headers
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("Missing access token");
      return {
        status: 401,
        error: "Authentication required",
      };
    }

    const token = session.access_token;
    const url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/flowa-gift-mail`;

    // Prepare request
    const payload = {
      recipient_email: recipientEmail.trim(),
      subject,
      htmlBody,
      notifyAdmin: false,
    };

    // Make API request
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse response
    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) {
        throw new Error(
          `Email sending failed with status ${
            res.status
          }: ${responseText.substring(0, 100)}`
        );
      }
      responseData = { success: true };
    }

    // Handle errors
    if (!res.ok) {
      console.error("Email sending error response:", responseData);
      throw new Error(
        responseData.error ||
          responseData.details ||
          `Email sending failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Error sending share email:", error);
    throw error;
  }
}

export async function sendFlowvaOptimizationGiftEmail(
  recipientEmail: string,
  subject: string,
  htmlBody: string,
  selectedReward: string
) {
  try {
    // Input validation
    if (!recipientEmail) {
      throw new Error("Recipient email is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    // Get auth headers
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("Missing access token");
      return {
        status: 401,
        error: "Authentication required",
      };
    }

    const token = session.access_token;
    const url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/flowa-gift-mail`;

    // Prepare request
    const payload = {
      recipient_email: recipientEmail.trim(),
      subject,
      htmlBody,
      selectedReward,
      notifyAdmin: true,
    };

    // Make API request
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Parse response
    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) {
        throw new Error(
          `Email sending failed with status ${
            res.status
          }: ${responseText.substring(0, 100)}`
        );
      }
      responseData = { success: true };
    }

    // Handle errors
    if (!res.ok) {
      console.error("Email sending error response:", responseData);
      throw new Error(
        responseData.error ||
          responseData.details ||
          `Email sending failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Error sending share email:", error);
    throw error;
  }
}

export async function sendRewardClaim(formData: FormData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    const url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/send-reward-claim`;

    // Send to Edge Function
    const res = await fetch(url, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Parse response
    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) {
        throw new Error(
          `Email sending failed with status ${
            res.status
          }: ${responseText.substring(0, 100)}`
        );
      }
      responseData = { success: true };
    }

    // Handle errors
    if (!res.ok) {
      console.error("Email sending error response:", responseData);
      throw new Error(
        responseData.error ||
          responseData.details ||
          `Email sending failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Error sending share email:", error);
    throw error;
  }
}
