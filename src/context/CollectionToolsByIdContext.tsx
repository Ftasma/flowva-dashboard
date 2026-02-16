import { createContext, useContext, useState, useCallback } from "react";
import supabase from "../lib/supabase";

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  toolLogo: string;
  category: string[];
  position: number;
  isCustom: boolean;
}

interface CollectionToolsByIdContextType {
  collectionToolsMap: Record<string, Tool[]>;
  loadingMap: Record<string, boolean>;
  errorMap: Record<string, string | null>;
  fetchToolsByCollectionId: (collectionId: string) => Promise<void>;
}

const CollectionToolsByIdContext = createContext<CollectionToolsByIdContextType | null>(null);

export const useCollectionToolsByIdContext = () => {
  const context = useContext(CollectionToolsByIdContext);
  if (!context) {
    throw new Error("useCollectionToolsByIdContext must be used within a CollectionToolsProvider");
  }
  return context;
};

export const CollectionToolsByIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [collectionToolsMap, setCollectionToolsMap] = useState<Record<string, Tool[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

  const fetchToolsByCollectionId = useCallback(async (collectionId: string) => {
    if (!collectionId) return;

    setLoadingMap(prev => ({ ...prev, [collectionId]: true }));
    setErrorMap(prev => ({ ...prev, [collectionId]: null }));

    const { data, error } = await supabase
      .from("collection_has_tools")
      .select(
        `
        id,
        position,
        library_tool_id,
        library_tools!inner (
          is_custom,
          default_tool_id,
          custom_tool_id,
          default_tools (
            id, title, description, url, icon_url, category
          ),
          custom_tools (
            id, title, description, url, icon_url, category
          )
        )
      `
      )
      .eq("collection_id", collectionId);

    if (error) {
      console.error("Error fetching tools for collection:", error);
      setErrorMap(prev => ({ ...prev, [collectionId]: "Failed to load tools." }));
      setCollectionToolsMap(prev => ({ ...prev, [collectionId]: [] }));
    } else {
      const mapped = (data || [])
        .map((entry: any) => {
          const libTool = entry.library_tools as any;
          const raw = libTool?.is_custom
            ? libTool.custom_tools
            : libTool.default_tools;

          if (!raw) return null;

          return {
            id: raw.id,
            title: raw.title,
            description: raw.description,
            url: raw.url,
            toolLogo: raw.icon_url,
            category: raw.category,
            position: entry.position,
            isCustom: libTool?.is_custom ?? false,
          };
        })
        .filter(Boolean) as Tool[];

      setCollectionToolsMap(prev => ({
        ...prev,
        [collectionId]: mapped.sort((a, b) => a.position - b.position),
      }));
    }

    setLoadingMap(prev => ({ ...prev, [collectionId]: false }));
  }, []);

  return (
    <CollectionToolsByIdContext.Provider
      value={{
        collectionToolsMap,
        loadingMap,
        errorMap,
        fetchToolsByCollectionId,
      }}
    >
      {children}
    </CollectionToolsByIdContext.Provider>
  );
};
