import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase";

export interface Tool {
  id: string;
  libraryId?: any;
  title: string;
  description: string;
  toolLogo?: string;
  isAITool?: boolean;
  isAitool?: boolean;
  isAiTool?: boolean;
  usersIcon?: string;
  url: string;
  category: string[];
  bgColor?: string;
  textColor?: string;
  isCustom?: boolean;
}

type CollectionToolEntry = {
  id: string;
  collection_id: string;
  library_tool_id: string;
  position: number;
  collections?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  library_tools?: {
    id: string;
    is_custom: boolean;
    default_tool_id: string | null;
    custom_tool_id: string | null;
    default_tools?: {
      id: string;
      title: string;
      description: string;
      icon_url: string;
      category: string[];
      url: string;
    } | null;
    custom_tools?: {
      id: string;
      title: string;
      description: string;
      category: string[];
      icon_url: string;
      url: string;
    } | null;
  } | null;
};

export type CollectionTool = Tool & {
  collectionId: string;
  collectionName: string;
  position: number;
};

interface CollectionToolsContextType {
  collectionTools: CollectionTool[];
  setUserId: (id: string | null) => void;
  loading: boolean;
  refetch: () => void;
}

const CollectionToolsContext = createContext<CollectionToolsContextType>({
  collectionTools: [],
  setUserId: () => {},
  loading: true,
  refetch: () => {},
});

export const useCollectionTools = () => useContext(CollectionToolsContext);

export const CollectionToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collectionTools, setCollectionTools] = useState<CollectionTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [lastFetchedUserId, setLastFetchedUserId] = useState<string | null>(null);

  const setUserId = (id: string | null) => {
    setUserIdState((prev) => (prev === id ? prev : id));
  };

  const fetchCollectionTools = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = (await supabase
      .from("collection_has_tools")
      .select(
        `
        id,
        collection_id,
        library_tool_id,
        position,
        collections (
          id, name, description
        ),
        library_tools (
          id,
          is_custom,
          default_tool_id,
          custom_tool_id,
          default_tools (
            id, title, icon_url, description, category, url
          ),
          custom_tools (
            id, title, description, category, url, icon_url
          )
        )
      `
      )
      .eq("user_id", userId)) as unknown as {
      data: CollectionToolEntry[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching collection tools:", error);
      setLoading(false);
      return;
    }

    const validCollectionTools: CollectionTool[] = [];

    (data || []).forEach((entry) => {
      if (!entry.library_tools || !entry.collections) return;

      const libraryEntry = entry.library_tools;
      const isCustom = libraryEntry.is_custom;
      const raw = isCustom ? libraryEntry.custom_tools : libraryEntry.default_tools;

      if (raw) {
        validCollectionTools.push({
          id: raw.id,
          libraryId: libraryEntry.id,
          title: raw.title,
          description: raw.description,
          category: raw.category,
          toolLogo: raw.icon_url,
          url: raw.url,
          isCustom: isCustom,
          isAiTool: false,
          collectionId: entry.collection_id,
          collectionName: entry.collections.name,
          position: entry.position || 0,
        });
      }
    });

    validCollectionTools.sort((a, b) => a.position - b.position);
    setCollectionTools(validCollectionTools);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId && userId !== lastFetchedUserId) {
      fetchCollectionTools();
      setLastFetchedUserId(userId);
    }
  }, [userId, lastFetchedUserId, fetchCollectionTools]);

  return (
    <CollectionToolsContext.Provider
      value={{
        collectionTools,
        setUserId,
        loading,
        refetch: fetchCollectionTools,
      }}
    >
      {children}
    </CollectionToolsContext.Provider>
  );
};
