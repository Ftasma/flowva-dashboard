import { supabase } from "../subscriptions/useToolsSubscriptions";

export async function getEngagementData() {
  try {
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
    }/functions/v1/user-engagement`;

    // Make API request
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse response
    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) {
        throw new Error();
      }
      responseData = { success: true };
    }

    // Handle errors
    if (!res.ok) {
      throw new Error(
        responseData.error || responseData.details || `${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}
