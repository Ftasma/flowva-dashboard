import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserDatas } from "../../hooks/admin/user-insight";

type CountryStat = {
  country: string;
  iso2: string;
  iso3: string;
  count: number;
};

type UserStats = {
  totals: {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    bannedUsers: number;
    notOnboardedUsers: number;
    onboardedUsers: number;
  };
  breakdown: {
    usersByCountry: CountryStat[];
  };
};

type UserDatasContextType = {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  refetch: () => Promise<void>;
};

const UserDatasContext = createContext<UserDatasContextType | undefined>(
  undefined
);

export const UserDatasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserDatas();
      setStats(res);
    } catch (err: any) {
      console.error("Failed to fetch user stats:", err);
      setError(err.message || "Failed to fetch user stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <UserDatasContext.Provider
      value={{
        stats,
        loading,
        error,
        fetchStats,
        refetch,
      }}
    >
      {children}
    </UserDatasContext.Provider>
  );
};

export const useUserDatas = () => {
  const ctx = useContext(UserDatasContext);
  if (!ctx) {
    throw new Error("useUserDatas must be used within UserDatasProvider");
  }
  return ctx;
};
