import { createContext, useCallback, useContext, useState } from "react";
import { getAllUserRewards } from "../../../hooks/admin/rewards/user-reward-list";

export type UserRewardData = {
  user_id: string;
  email: string;
  name?: string;
  total_points: number;
  total_claimed_rewards: number;
  total_points_redeemed: number;
};

type UserRewardsContextType = {
  rewards: UserRewardData[];
  total: number;
  page: number;
  perPage: number;
  search: string;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchRewards: (
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

const UserRewardsContext = createContext<UserRewardsContextType | undefined>(
  undefined
);

export const UserRewardsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rewards, setRewards] = useState<UserRewardData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("total_points");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchRewards = useCallback(
    async (
      p: number = page,
      l: number = perPage,
      q: string = search,
      sc: string = sortColumn,
      so: "asc" | "desc" = sortOrder
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllUserRewards(p, l, q, sc, so);
        setRewards(res.rewards || []);
        setTotal(res.total || 0);
        setPage(p);
        setPerPage(l);
        setSearch(q);
        setSortColumn(sc);
        setSortOrder(so);
        setHasMore(res.pagination?.hasMore ?? (res.rewards?.length || 0) >= l);
      } catch (err: any) {
        console.error("Failed to fetch rewards:", err);
        setError(err.message || "Failed to fetch rewards");
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, search, sortColumn, sortOrder]
  );

  const setSort = (column: string, order: "asc" | "desc") => {
    setSortColumn(column);
    setSortOrder(order);
    fetchRewards(1, perPage, search, column, order);
  };

  const refetch = useCallback(async () => {
    await fetchRewards(1, perPage, search, sortColumn, sortOrder);
  }, [fetchRewards, perPage, search, sortColumn, sortOrder]);

  return (
    <UserRewardsContext.Provider
      value={{
        rewards,
        total,
        page,
        perPage,
        search,
        sortColumn,
        sortOrder,
        loading,
        error,
        hasMore,
        fetchRewards,
        setSearch,
        setSort,
        refetch,
      }}
    >
      {children}
    </UserRewardsContext.Provider>
  );
};

export const useUserRewards = () => {
  const ctx = useContext(UserRewardsContext);
  if (!ctx) {
    throw new Error("useUserRewards must be used within UserRewardsProvider");
  }
  return ctx;
};