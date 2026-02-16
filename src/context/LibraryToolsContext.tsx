import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

interface LibraryToolsContextType {
  tools: Tool[];
  loading: boolean;
  refreshTools: () => Promise<void>;
  setUserId: (id: string | null) => void;
}

const LibraryToolsContext = createContext<LibraryToolsContextType | undefined>(
  undefined
);

export const LibraryToolsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    if (!userId) {
      setTools([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = (await supabase
      .from("library_tools")
      .select(
        `
        id,
        is_custom,
        created_at,
        default_tool_id,
        custom_tool_id,
        default_tools (
          id, title, description, category, url, oauth_provider, icon_url
        ),
        custom_tools (
          id, title, description, category, url, oauth_provider, icon_url
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })) as unknown as {
      data: RawLibraryEntry[] | null;
      error: any;
    };

    if (error) {
      console.error("Error fetching tools:", error);
      setLoading(false);
      return;
    }

    const validTools: Tool[] = [];

    (data || []).forEach((entry) => {
      const raw = entry.is_custom ? entry.custom_tools : entry.default_tools;

      if (raw) {
        validTools.push({
          id: raw.id,
          libraryId: entry.id,
          title: raw.title,
          description: raw.description,
          category: raw.category,
          url: raw.url,
          toolLogo: raw.icon_url,
          isCustom: entry.is_custom,
          isAiTool: false,
        });
      }
    });

    setTools(validTools);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return (
    <LibraryToolsContext.Provider
      value={{
        tools,
        loading,
        refreshTools: fetchTools,
        setUserId,
      }}
    >
      {children}
    </LibraryToolsContext.Provider>
  );
};

export const useLibraryToolsContext = () => {
  const context = useContext(LibraryToolsContext);
  if (!context) {
    throw new Error(
      "useLibraryToolsContext must be used within a LibraryToolsProvider"
    );
  }
  return context;
};

// Define this separately (same as your existing interface)
type RawLibraryEntry = {
  id: string;
  is_custom: boolean;
  default_tool_id: string | null;
  custom_tool_id: string | null;
  default_tools?: {
    id: string;
    title: string;
    created_at?: Date;
    description: string;
    category: string[];
    url: string;
    oauth_provider: string;
    icon_url: string;
  } | null;
  custom_tools?: {
    id: string;
    title: string;
    description: string;
    category: string[];
    url: string;
    oauth_provider: string;
    icon_url: string;
  } | null;
};
