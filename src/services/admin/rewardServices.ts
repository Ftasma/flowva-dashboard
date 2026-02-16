import supabase from "../../lib/supabase";

export async function sendPointReward(
  email: string,
  rewardPoints: number,
  rewardType: string
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        status: 401,
        success: false,
        message: "Authentication required",
      };
    }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/point-reward`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email, rewardType, rewardPoints }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to send reward email",
      };
    }

    return {
      status: 200,
      success: true,
      message: `Reward email sent to ${email}`,
      data,
    };
  } catch (error: any) {
    console.error("Error sending reward points:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function trigger(page = 1) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        status: 401,
        success: false,
        message: "Authentication required",
      };
    }

    const res = await fetch(
      `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/moosend-awaiting-list?page=${page}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to send reward email",
      };
    }

    return {
      status: 200,
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error sending reward points:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function trigger2(page = 1) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        status: 401,
        success: false,
        message: "Authentication required",
      };
    }

    const res = await fetch(
      `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/moosend-not-onboarded-list?page=${page}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to process page",
      };
    }

    return {
      status: 200,
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error triggering function:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

//users point history
export async function userPointHistory(userId: string) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        status: 401,
        success: false,
        message: "Authentication required",
      };
    }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-point-history`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to process page",
      };
    }

    return {
      status: 200,
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error triggering function:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function userClaimedRewards(userId: string) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        status: 401,
        success: false,
        message: "Authentication required",
      };
    }

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claimed-rewards-history`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to process page",
      };
    }

    return {
      status: 200,
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error triggering function:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}
