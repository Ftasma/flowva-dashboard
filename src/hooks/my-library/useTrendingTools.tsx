import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { LibraryTool } from "../../interfaces/toolsData";

export function useTrendingTools() {
  const [trendingTools, setTrendingTools] = useState<LibraryTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTools = async () => {
      setLoading(true);

      // Step 1: Fetch tool reviews
      const { data: reviews, error } = await supabase
        .from("tool_reviews")
        .select("tool_id");

      if (error) {
        console.error("Error fetching tool reviews:", error);
        setTrendingTools([]);
        setLoading(false);
        return;
      }

      //  Count reviews per tool_id
      const countMap: Record<string, number> = {};
      reviews.forEach(({ tool_id }) => {
        if (tool_id) {
          countMap[tool_id] = (countMap[tool_id] || 0) + 1;
        }
      });

      //  Get top 10 tool_ids
      const topToolIds = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id]) => id);

      if (topToolIds.length === 0) {
        setTrendingTools([]);
        setLoading(false);
        return;
      }

      //  Fetch default_tools data
      const { data: tools, error: toolError } = await supabase
        .from("default_tools")
        .select("id, title, description, category, url, oauth_provider, icon_url")
        .in("id", topToolIds);

      if (toolError) {
        console.error("Error fetching default tools:", toolError);
        setTrendingTools([]);
        setLoading(false);
        return;
      }

      // Format as LibraryTool[] and preserve order
      const sortedLibraryTools = topToolIds
        .map((id) => {
          const tool = tools.find((t) => t.id === id);
          if (!tool) return null;

          const formatted: LibraryTool = {
            id: tool.id,
            libraryId: "",
            title: tool.title,
            description: tool.description,
            category: tool.category,
            url: tool.url,
            oauth_provider: tool.oauth_provider,
            toolLogo: tool.icon_url,
            isCustom: false,
            isAiTool: false,
          };

          return formatted;
        })
        .filter(Boolean) as LibraryTool[];

      setTrendingTools(sortedLibraryTools);
      setLoading(false);
    };

    fetchTrendingTools();
  }, []);

  return { trendingTools, loading };
}
