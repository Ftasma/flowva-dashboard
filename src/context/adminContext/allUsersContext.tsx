import React, { createContext, useCallback, useContext, useState } from "react";
import { getAllUsers } from "../../hooks/admin/user-insight";

type ReferredUsers = {
  name: string;
  email: string;
};

type UserData = {
  id: string;
  email: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  referrer_email: string | null;
  referrer_name?: string | null;
  reffered_users: ReferredUsers[];
  created_at: string;
  raw_user_meta_data?: {
    avatar_url: string;
  };
  raw_app_meta_data?: {
    providers: string[];
    role: string;
  };
  name?: string;
  referral_count?: number;
  total_points?: number;
  profile_pic?: string;
  current_streak?: number;
  country: string;
  is_banned: boolean;
  city: string;
  flag: string;
  is_author: boolean;
};

type AllUsersContextType = {
  users: UserData[];
  total: number;
  page: number;
  perPage: number;
  status: string;
  search: string;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchUsers: (
    page?: number,
    perPage?: number,
    status?: string,
    search?: string,
    sortColumn?: string,
    sortOrder?: "asc" | "desc"
  ) => Promise<void>;
  setSearch: (val: string) => void;
  setSort: (column: string, order: "asc" | "desc") => void;
  refetch: () => Promise<void>;
};

const AllUsersContext = createContext<AllUsersContextType | undefined>(
  undefined
);

export const AllUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(
    async (
      p: number = page,
      l: number = perPage,
      s: string = status,
      q: string = search,
      sc: string = sortColumn,
      so: "asc" | "desc" = sortOrder
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllUsers(p, l, s, q, sc, so);
        //infinite scroll
        // if (p === 1) {
        //   setUsers(res.users || []);
        // } else {
        //   setUsers((prev) => [...prev, ...(res.users || [])]);
        // }

        setUsers(res.users || []);

        setTotal(res.total || 0);
        setPage(p);
        setPerPage(l);
        setStatus(s);
        setSearch(q);
        setSortColumn(sc);
        setSortOrder(so);

        setHasMore(res.pagination?.hasMore ?? (res.users?.length || 0) >= l);
      } catch (err: any) {
        console.error("Failed to fetch users:", err);
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, status, search, sortColumn, sortOrder]
  );

  const setSort = (column: string, order: "asc" | "desc") => {
    setSortColumn(column);
    setSortOrder(order);
    fetchUsers(1, perPage, status, search, column, order);
  };

  const refetch = useCallback(async () => {
    await fetchUsers(1, perPage, status, search, sortColumn, sortOrder);
  }, [fetchUsers, perPage, status, search, sortColumn, sortOrder]);

  return (
    <AllUsersContext.Provider
      value={{
        users,
        total,
        page,
        perPage,
        status,
        search,
        sortColumn,
        sortOrder,
        loading,
        error,
        hasMore,
        fetchUsers,
        setSearch,
        setSort,
        refetch,
      }}
    >
      {children}
    </AllUsersContext.Provider>
  );
};

export const useAllUsers = () => {
  const ctx = useContext(AllUsersContext);
  if (!ctx) {
    throw new Error("useAllUsers must be used within AllUsersProvider");
  }
  return ctx;
};
