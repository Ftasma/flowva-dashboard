import React, { createContext, useContext, useState, useCallback } from "react";
import supabase from "../lib/supabase";

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  toolLogo: string;
  category: string[];
  isCustom: boolean;
  defaultToolId?: string;
  customToolId?: string;
}

interface ToolByLibraryIdContextType {
  fetchToolByLibraryId: (toolId: string) => Promise<void>; // renamed
  toolMap: Record<string, Tool | null>;
  loadingMap: Record<string, boolean>;
}

const ToolByLibraryIdContext = createContext<ToolByLibraryIdContextType | undefined>(undefined);

export const useToolByLibraryIdContext = () => {
  const context = useContext(ToolByLibraryIdContext);
  if (!context) {
    throw new Error("useToolByLibraryIdContext must be used within a ToolByLibraryIdProvider");
  }
  return context;
};

export const ToolByLibraryIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toolMap, setToolMap] = useState<Record<string, Tool | null>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const fetchToolByLibraryId = useCallback(async (toolId: string): Promise<void> => {
    if (!toolId || toolMap[toolId] !== undefined) return;

    setLoadingMap((prev) => ({ ...prev, [toolId]: true }));

    try {
      const { data, error } = await supabase
        .from("library_tools")
        .select(`
          id,
          is_custom,
          default_tool_id,
          custom_tool_id,
          default_tools (
            id, title, description, url, icon_url, category
          ),
          custom_tools (
            id, title, description, url, icon_url, category
          )
        `)
        .eq("id", toolId)
        .single();

      if (error || !data) throw error || new Error("Tool not found");

      const rawTool = data.is_custom ? data.custom_tools : data.default_tools;
      const toolObj = Array.isArray(rawTool) ? rawTool[0] : rawTool;

      if (!toolObj) throw new Error("Invalid tool structure");

      const tool: Tool = {
        id: data.id,
        title: toolObj.title,
        description: toolObj.description,
        url: toolObj.url,
        toolLogo: toolObj.icon_url,
        category: toolObj.category,
        isCustom: data.is_custom,
        defaultToolId: data.default_tool_id || undefined,
        customToolId: data.custom_tool_id || undefined,
      };

      setToolMap((prev) => ({ ...prev, [toolId]: tool }));
    } catch (err) {
      console.error("Error fetching tool by ID:", err);
      setToolMap((prev) => ({ ...prev, [toolId]: null }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [toolId]: false }));
    }
  }, [toolMap]);

  return (
    <ToolByLibraryIdContext.Provider
      value={{ fetchToolByLibraryId, toolMap, loadingMap }}
    >
      {children}
    </ToolByLibraryIdContext.Provider>
  );
};
