import { supabase } from "../../subscriptions/useToolsSubscriptions";


export async function getAuthorsData() {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("Missing access token");
      return {
        status: 401,
        error: "Authentication required",
      };
    }

    const token = session.access_token;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-authors`;


    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, 
        Authorization: `Bearer ${token}`, 
      },
    });

    // Parse JSON safely
    let responseData;
    try {
      responseData = await res.json();
    } catch {
      responseData = { success: true };
    }

    if (!res.ok) {
      throw new Error(responseData.error || responseData.details || `HTTP ${res.status}`);
    }

    return responseData;
  } catch (error: any) {
    console.error("Failed to fetch authors data:", error);
    throw error;
  }
}
