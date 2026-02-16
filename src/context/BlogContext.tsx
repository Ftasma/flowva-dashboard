"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getPublicBlogsData } from "../hooks/blog/useBlogs";

interface Blog {
  id: string;
  title: string;
  summary: string;
  cover_image_url?: string;
  category?: string;
  created_at?: string;
  pinned?: boolean;
  user_profiles?: {
    name: string;
    last_name: string | null;
    profile_pic: string | null;
  };
  blog_tags: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PublicBlogsContextType {
  pinnedBlog: Blog | null;
  blogs: Blog[];
  categories: string[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  filters: Record<string, any>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  refreshBlogs: () => Promise<void>;
}

const PublicBlogsContext = createContext<PublicBlogsContextType | undefined>(
  undefined
);

export const PublicBlogsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pinnedBlog, setPinnedBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({
    page: 1,
    limit: 6,
    search: "",
    category: "",
  });

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicBlogsData(filters);

      // Set pinned blog
      setPinnedBlog(res.pinnedBlog || null);
      setCategories(res.categories || []);
      setPagination(res.pagination || null);

      // Append blogs if page > 1, otherwise replace
      setBlogs((prev) =>
        filters.page > 1 ? [...prev, ...(res.blogs || [])] : res.blogs || []
      );
    } catch (err: any) {
      console.error("Failed to fetch blogs:", err);
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchBlogs();
  }, [JSON.stringify(filters)]);


  return (
    <PublicBlogsContext.Provider
      value={{
        pinnedBlog,
        blogs,
        categories,
        pagination,
        loading,
        error,
        filters,
        setFilters,
        refreshBlogs: fetchBlogs,
      }}
    >
      {children}
    </PublicBlogsContext.Provider>
  );
};

export const usePublicBlogs = (): PublicBlogsContextType => {
  const context = useContext(PublicBlogsContext);
  if (!context) {
    throw new Error("usePublicBlogs must be used within a PublicBlogsProvider");
  }
  return context;
};
