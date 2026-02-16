import { supabase } from "../../subscriptions/useToolsSubscriptions";

export interface BlogQueryParams {
  search?: string | null;
  status?: string | null;
  author?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  page?: number;
  limit?: number;
}

export async function getBlogsData(params: BlogQueryParams = {}) {
  try {
    // Get current session
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
    }/functions/v1/admin-get-blog`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    let responseData;
    try {
      responseData = await res.json();
    } catch {
      responseData = { success: true };
    }

    if (!res.ok) {
      throw new Error(
        responseData.error || responseData.details || `HTTP ${res.status}`
      );
    }

    return responseData;
  } catch (error: any) {
    console.error("Failed to fetch blogs data:", error);
    throw error;
  }
}

export async function getBlogById(blogId: string) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        status: 401,
        error: "Authentication required",
      };
    }

    const token = session.access_token;

    const url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/admin-get-blog-by-id`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id: blogId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.details || `HTTP ${res.status}`);
    }

    return data;
  } catch (error: any) {
    console.error("Failed to fetch blog by ID:", error);
    throw error;
  }
}
