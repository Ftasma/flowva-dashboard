import { supabase } from "../subscriptions/useToolsSubscriptions";

export async function getToolsMetricsData(
  page: number,
  perPage: number,
  search: string = "",
  sortColumn: string = "created_at",
  sortOrder: "asc" | "desc" = "desc",
  category: string = "" // optional filter
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("Missing access token");
      return {
        toolsList: [],
        stats: {},
        pagination: { page, perPage, count: 0, hasMore: false },
      };
    }

    const token = session.access_token;

    // Build query string
    const url =
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tool-metrics` +
      `?page=${page}&perPage=${perPage}` +
      `&search=${encodeURIComponent(search)}` +
      `&sortColumn=${encodeURIComponent(sortColumn)}` +
      `&sortOrder=${encodeURIComponent(sortOrder)}` +
      (category ? `&category=${encodeURIComponent(category)}` : "");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse response safely
    const responseText = await res.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      if (!res.ok) throw new Error(`Error ${res.status}: ${responseText}`);
      responseData = {};
    }

    if (!res.ok) {
      console.error("Error fetching tools metrics:", responseData);
      throw new Error(
        responseData.error ||
          responseData.details ||
          `Request failed with ${res.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching tools metrics data:", error);
    throw error;
  }
}
