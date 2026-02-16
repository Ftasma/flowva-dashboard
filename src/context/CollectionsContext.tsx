import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import supabase from "../lib/supabase";

export interface Collection {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
  url: string;
}

interface CollectionsContextType {
  collections: Collection[];
  loading: boolean;
  fetchCollections: () => Promise<void>;
  setUserId: (id: string | null) => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(
  undefined
);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("collections")
      .select("id, name, description, color, total_tool_count")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching collections:", error);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((col) => ({
      id: col.id,
      name: col.name,
      description: col.description,
      color: col.color,
      count: col.total_tool_count || 0,
      url: `/collections/${col.id}`,
    }));

    setCollections(mapped);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <CollectionsContext.Provider
      value={{ collections, loading, fetchCollections, setUserId }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollectionsContext = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error(
      "useCollectionsContext must be used within a CollectionsProvider"
    );
  }
  return context;
};
