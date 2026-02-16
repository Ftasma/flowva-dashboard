import { supabase } from "../../subscriptions/useToolsSubscriptions";

export async function getRewardsMetricsData(
  startDate?: string,
  endDate?: string
) {
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

    // Build URL with optional date range
    const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rewards-overview`;
    const url = new URL(baseUrl);
    if (startDate && endDate) {
      url.searchParams.append("startDate", startDate);
      url.searchParams.append("endDate", endDate);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      responseData = { success: true };
    }

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          responseData.details ||
          `Metrics fetch failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
}