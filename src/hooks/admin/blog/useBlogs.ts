import { useState, useEffect } from "react";
import { BlogQueryParams, getBlogById, getBlogsData } from "./getBlogs";

export function useBlogs(initialParams: BlogQueryParams = {}) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async (params: BlogQueryParams = {}) => {
    setLoading(true);
    try {
      // handle dateRange conversion
      let transformedParams: any = {
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...initialParams,
        ...params,
      };

      if (transformedParams.dateRange) {
        const [from, to] = transformedParams.dateRange;
        transformedParams.dateFrom = from;
        transformedParams.dateTo = to;
        delete transformedParams.dateRange; // remove old field
      }

      const response = await getBlogsData(transformedParams);

      setBlogs(response.blogs || []);

      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // refetch on initialParams (like default filters)
  useEffect(() => {
    fetchBlogs({ page: 1 });
  }, []);

  return {
    blogs,
    pagination,
    loading,
    error,
    fetchBlogs,
    setPagination,
  };
}


export function useBlog(blogId: string | null) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogById(blogId);
        setBlog(data?.blog || null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  return { blog, loading, error };
}

