"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getEngagementData } from "../../hooks/admin/user-engagement";

// --- Types for API Response ---
type ToolData = {
  name: string;
  users: number;
};

type EngagementData = {
  dailyCounts: Record<string, number>;
  topTools: ToolData[]; 
};

type EngagementContextType = {
  data: EngagementData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// --- Context Creation ---
const EngagementContext = createContext<EngagementContextType | undefined>(
  undefined
);

export const EngagementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getEngagementData();
      setData(res);
    } catch (err: any) {
      console.error("Engagement fetch error:", err);
      setError(err.message || "Failed to load engagement data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <EngagementContext.Provider
      value={{
        data,
        loading,
        error,
        refetch: fetchData,
      }}
    >
      {children}
    </EngagementContext.Provider>
  );
};

export function useEngagement() {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error("useEngagement must be used within an EngagementProvider");
  }
  return ctx;
}
