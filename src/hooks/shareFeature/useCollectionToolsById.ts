import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

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

export function useCollectionToolsById(collectionId: string | null) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionId) return;

    const fetchTools = async () => {
      setLoading(true);
      setError(null);

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
        setError("Failed to load tools.");
        setTools([]);
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

        setTools(mapped.sort((a, b) => a.position - b.position));
      }

      setLoading(false);
    };

    fetchTools();
  }, [collectionId]);

  return { tools, loading, error };
}
