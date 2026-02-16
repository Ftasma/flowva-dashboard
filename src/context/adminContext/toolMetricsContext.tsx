"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getToolsMetricsData } from "../../hooks/admin/tools";

export type ToolDetail = {
  name: string;
  category: string[];
  users: number;
  reviews: number;
  rating: string | null;
  status: "Active" | "Inactive";
  actions: string;
};

export type ToolsMetricsData = {
  allTools: number;
  featuredTools: number;
  mostAdded: { title: string; users: number } | null;
  mostReviewed: { title: string; reviews: number } | null;
  addedThisMonth: number;
  featuredAddedThisWeek: number;
  percentChange: { monthlyTools: number; weeklyTools: number };
  toolsList: ToolDetail[];
  total?: number; // for pagination
  pagination?: {
    page: number;
    perPage: number;
    count: number;
    hasMore: boolean;
  };
};

type ToolsMetricsContextType = {
  toolsMetrics: ToolsMetricsData | null;
  loading: boolean;
  error: string | null;
  page: number;
  perPage: number;
  search: string;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  hasMore: boolean;
  fetchTools: (
    page?: number,
    perPage?: number,
    search?: string,
    sortColumn?: string,
    sortOrder?: "asc" | "desc"
  ) => Promise<void>;
  setSearch: (val: string) => void;
  setSort: (column: string, order: "asc" | "desc") => void;
  refetch: () => Promise<void>;
};

const ToolsMetricsContext = createContext<ToolsMetricsContextType | undefined>(
  undefined
);

export const ToolsMetricsProvider = ({ children }: { children: React.ReactNode }) => {
  const [toolsMetrics, setToolsMetrics] = useState<ToolsMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [hasMore, setHasMore] = useState(true);

  const fetchTools = useCallback(
    async (
      p: number = page,
      l: number = perPage,
      q: string = search,
      sc: string = sortColumn,
      so: "asc" | "desc" = sortOrder
    ) => {
      setLoading(true);
      try {
        const res = await getToolsMetricsData(p, l, q, sc, so);

        if (p === 1) {
          setToolsMetrics(res);
        } else {
          // append for infinite scroll if needed
          setToolsMetrics((prev) =>
            prev
              ? { ...res, toolsList: [...prev.toolsList, ...(res.toolsList || [])] }
              : res
          );
        }

        setPage(p);
        setPerPage(l);
        setSearch(q);
        setSortColumn(sc);
        setSortOrder(so);
        setHasMore(res.pagination?.hasMore ?? (res.toolsList?.length || 0) >= l);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tools metrics:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, search, sortColumn, sortOrder]
  );

  const setSort = (column: string, order: "asc" | "desc") => {
    setSortColumn(column);
    setSortOrder(order);
    fetchTools(1, perPage, search, column, order);
  };

  const refetch = useCallback(async () => {
    await fetchTools(1, perPage, search, sortColumn, sortOrder);
  }, [fetchTools, perPage, search, sortColumn, sortOrder]);

  useEffect(() => {
    fetchTools(1, perPage, search, sortColumn, sortOrder);
  }, []);

  return (
    <ToolsMetricsContext.Provider
      value={{
        toolsMetrics,
        loading,
        error,
        page,
        perPage,
        search,
        sortColumn,
        sortOrder,
        hasMore,
        fetchTools,
        setSearch,
        setSort,
        refetch,
      }}
    >
      {children}
    </ToolsMetricsContext.Provider>
  );
};

export const useToolsMetrics = () => {
  const context = useContext(ToolsMetricsContext);
  if (!context) {
    throw new Error("useToolsMetrics must be used within a ToolsMetricsProvider");
  }
  return context;
};
