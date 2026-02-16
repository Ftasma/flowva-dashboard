import { useState, useEffect } from "react";
export interface PublicBlogQueryParams {
  search?: string | null;
  category?: string | null;
  page?: number;
  limit?: number;
}

export async function getPublicBlogsData(params: PublicBlogQueryParams = {}) {
  try {
    const url = `${
      import.meta.env.VITE_SUPABASE_URL
    }/functions/v1/get-all-blogs`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
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
    console.error("Failed to fetch public blogs:", error);
    throw error;
  }
}

export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover_image_url?: string;
  publish_date?: string;
  created_at?: string;
  user_profiles?: {
    id: string;
    name: string;
    last_name: string;
    profile_pic?: string;
  };
  attachments?: { file_url: string; file_name: string }[];
  blog_tags?: string[];
}

// Related blog type (simpler)
export interface RelatedBlog {
  id: string;
  title: string;
  summary: string;
  user_profiles?: {
    id: string;
    name: string;
    last_name: string;
    profile_pic?: string;
  };
  publish_date?: string;
  blog_tags?: string[];
  cover_image_url?: string;
  created_at?: string;
}

export const useBlogById = (id?: string) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${
          import.meta.env.VITE_SUPABASE_URL
        }/functions/v1/get-blog-by-id`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch blog");

        // ✅ Set both blog and related blogs
        setBlog(data.blog);
        setRelatedBlogs(data.relatedBlogs || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return { blog, relatedBlogs, loading, error };
};
