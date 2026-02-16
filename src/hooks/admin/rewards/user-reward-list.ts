import { supabase } from "../../subscriptions/useToolsSubscriptions";

export async function getAllUserRewards(
  page: number,
  perPage: number,
  search: string = "",
  sortColumn: string = "total_points",
  sortOrder: "asc" | "desc" = "desc"
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        rewards: [],
        total: 0,
        pagination: { page, perPage, count: 0, hasMore: false },
      };
    }

    const token = session.access_token;

    const url =
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-reward-list` +
      `?page=${page}&perPage=${perPage}` +
      `&search=${encodeURIComponent(search)}` +
      `&sortColumn=${encodeURIComponent(sortColumn)}` +
      `&sortOrder=${encodeURIComponent(sortOrder)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching user rewards:", error);
    throw error;
  }
}