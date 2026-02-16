import { useState, useEffect } from "react";
import supabase from "../../lib/supabase";

export interface Tool {
  id: string;
  title: string;
  description: string | null;
  category: string[] | null;
  icon_url: string | null;
  url: string | null;
  oauth_provider: string;
  is_ai_tool: boolean;
  created_at: string;
  is_custom: boolean;
}

export function useToolDetails(itemId: string, itemType: string) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId || itemType !== "tool") {
      setTool(null);
      setLoading(false);
      return;
    }

    (async () => {
      // Try custom tools first
      const { data, error } = await supabase
        .from("custom_tools")
        .select("*")
        .eq("id", itemId)
        .single();

      // If not found, try default tools
      if (error || !data) {
        const { data: defaultToolData, error: defaultToolError } =
          await supabase
            .from("default_tools")
            .select("*")
            .eq("id", itemId)
            .single();

        if (!defaultToolError && defaultToolData) {
          // Add is_custom property manually after fetching
          setTool({
            ...defaultToolData,
            is_custom: false,
          } as Tool);
        } else {
          setTool(null);
        }
      } else {
        // Add is_custom property manually after fetching
        setTool({
          ...data,
          is_custom: true,
        } as Tool);
      }

      setLoading(false);
    })();
  }, [itemId, itemType]);

  return { tool, loading };
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string | null;
  is_default: boolean;
  created_by: string;
  created_at: string;
  total_tool_count: number;
  tools?: Tool[];
}

export function useCollectionDetails(itemId: string, itemType: string) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId || itemType !== "collection") {
      setCollection(null);
      setLoading(false);
      return;
    }

    (async () => {
      // Get collection details
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("id", itemId)
        .single();

      if (!error && data) {
        // Get tools in this collection
        const { data: toolsData } = await supabase
          .from("collection_tools")
          .select("tool_id, is_custom")
          .eq("collection_id", itemId);

        const collectionData = data as Collection;
        collectionData.tools = [];

        // Fetch details for each tool
        if (toolsData && toolsData.length > 0) {
          for (const toolRef of toolsData) {
            const table = toolRef.is_custom ? "custom_tools" : "default_tools";
            const { data: toolData } = await supabase
              .from(table)
              .select("*")
              .eq("id", toolRef.tool_id)
              .single();

            if (toolData) {
              // Add is_custom property manually after fetching
              collectionData.tools.push({
                ...toolData,
                is_custom: toolRef.is_custom,
              } as Tool);
            }
          }
        }

        setCollection(collectionData);
      } else {
        setCollection(null);
      }

      setLoading(false);
    })();
  }, [itemId, itemType]);

  return { collection, loading };
}
