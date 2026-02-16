import supabase from "../../lib/supabase";

export async function getMetricsData(
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
    const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-metrics`;
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


export async function getUserActivities(page: number, limit: number) {
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
    }/functions/v1/user-activities?page=${page}&limit=${limit}`;

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
