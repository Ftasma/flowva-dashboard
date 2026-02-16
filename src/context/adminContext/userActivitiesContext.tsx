// UserActivitiesContext.tsx
import React, { createContext, useCallback, useContext, useState } from "react";
import { getUserActivities } from "../../hooks/admin/overview";


type UserActivity = {
  user_id: string;
  action: string;
  metadata: Record<string, any> | null;
  created_at: string;
  user_profiles?: {
    name: string;
    email: string;
  };
};

type UserActivitiesContextType = {
  activities: UserActivity[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  fetchActivities: (page?: number, limit?: number) => Promise<void>;
  refetch: () => Promise<void>;
};

const UserActivitiesContext = createContext<UserActivitiesContextType | undefined>(
  undefined
);

export const UserActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (p: number = page, l: number = limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserActivities(p, l);
      setActivities(res.activities || []);
      setTotal(res.total || 0);
      setPage(p);
      setLimit(l);
    } catch (err: any) {
      console.error("Failed to fetch activities:", err);
      setError(err.message || "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const refetch = useCallback(async () => {
    await fetchActivities(page, limit);
  }, [fetchActivities, page, limit]);

  return (
    <UserActivitiesContext.Provider
      value={{
        activities,
        total,
        page,
        limit,
        loading,
        error,
        fetchActivities,
        refetch,
      }}
    >
      {children}
    </UserActivitiesContext.Provider>
  );
};

export const useUserActivities = () => {
  const ctx = useContext(UserActivitiesContext);
  if (!ctx) {
    throw new Error("useUserActivities must be used within UserActivitiesProvider");
  }
  return ctx;
};
