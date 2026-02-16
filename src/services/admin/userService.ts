import supabase from "../../lib/supabase";

export async function deleteUsers(userIds: string[]) {
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
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userIds }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to delete user(s)",
      };
    }

    return {
      status: 200,
      success: true,
      message: `Deleted ${userIds.length} user(s) successfully`,
      data,
    };
  } catch (error: any) {
    console.error("Error deleting users:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function banUsers(userIds: string[], reason: string) {
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
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-ban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userIds, reason }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to ban user(s)",
      };
    }

    return {
      status: 200,
      success: true,
      message: `Banned ${userIds.length} user(s) successfully`,
      data,
    };
  } catch (error: any) {
    console.error("Error banning users:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function unbanUsers(userIds: string[]) {
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
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-user-unban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userIds }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to unban user(s)",
      };
    }

    return {
      status: 200,
      success: true,
      message: `Unbanned ${userIds.length} user(s) successfully`,
      data,
    };
  } catch (error: any) {
    console.error("Error unbanning users:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function adminBroadcast(
  subject: string,
  message: string,
  category: string
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
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-broadcast`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ subject, message, category }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to unban user(s)",
      };
    }

    return {
      status: 200,
      success: true,
      message: `Broadcast sent successfully`,
      data,
    };
  } catch (error: any) {
    console.error("Error unbanning users:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}

export async function adminMessage({
  recipients,
  subject,
  message,
}: {
  recipients: string[];
  subject: string;
  message: string;
}) {
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
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ emails: recipients, subject, message }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to send message(s)",
      };
    }

    return {
      status: 200,
      success: true,
      message: `Message sent successfully to ${recipients.length} user(s)`,
      data,
    };
  } catch (error: any) {
    console.error("Error sending messages:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}


export async function toggleAuthorStatus(userId: string, isAuthor: boolean) {
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
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-toggle-author`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, isAuthor }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: res.status,
        success: false,
        message: data?.error || "Failed to toggle author status",
      };
    }

    return {
      status: 200,
      success: true,
      message: `User ${isAuthor ? "granted" : "revoked"} author privileges successfully`,
      data,
    };
  } catch (error: any) {
    console.error("Error toggling author:", error);
    return {
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    };
  }
}