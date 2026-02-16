import { supabase } from "../subscriptions/useToolsSubscriptions";

export async function getAllUsers(
  page: number,
  perPage: number,
  status: string = "all",
  search: string = "",
  sortColumn: string = "created_at",
  sortOrder: "asc" | "desc" = "desc"
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return {
        users: [],
        total: 0,
        pagination: { page, perPage, count: 0, hasMore: false },
      };
    }
    const token = session.access_token;

    const url =
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-all-users` +
      `?page=${page}&perPage=${perPage}&status=${encodeURIComponent(status)}` +
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
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function getUserDatas() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/user-datas`;

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
    console.error("Error fetching users data:", error);
    throw error;
  }
}
