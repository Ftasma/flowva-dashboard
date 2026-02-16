import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

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

export function useToolByLibraryId(toolId: string | null) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!toolId) return;

    const fetchTool = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("library_tools")
          .select(
            `
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
            `
          )
          .eq("id", toolId)
          .single();

        if (error || !data) throw error || new Error("No data found");

        const rawTool = (
          data.is_custom ? data.custom_tools : data.default_tools
        ) as any;

        const toolObj = Array.isArray(rawTool) ? rawTool[0] : rawTool;

        if (toolObj) {
          setTool({
            id: data.id,
            title: toolObj.title,
            description: toolObj.description,
            url: toolObj.url,
            toolLogo: toolObj.icon_url,
            category: toolObj.category,
            isCustom: data.is_custom,
            defaultToolId: data.default_tool_id || undefined,
            customToolId: data.custom_tool_id || undefined,
          });
        } else {
          setTool(null);
        }
      } catch (err) {
        console.error("Error fetching tool:", err);
        setTool(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolId]);

  return { tool, loading };
}
