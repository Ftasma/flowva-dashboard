// context/DefaultToolsContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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

interface DefaultToolsContextType {
  allTools: Tool[];
  regularTools: Tool[];
  aiTools: Tool[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

const DefaultToolsContext = createContext<DefaultToolsContextType | undefined>(
  undefined
);

export const DefaultToolsProvider = ({ children }: { children: ReactNode }) => {
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      if (allTools.length > 0) return;
      try {
        const { data, error } = await supabase
          .from("default_tools")
          .select("*");
        if (error) throw error;

        if (data) {
          const formattedTools = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            url: item.url,
            toolLogo: item.icon_url,
            isAiTool: item.is_ai_tool,
          }));
          setAllTools(formattedTools);

          const allCategories = new Set<string>();
          formattedTools.forEach((tool) => {
            if (Array.isArray(tool.category)) {
              tool.category.forEach((cat) => allCategories.add(cat));
            } else if (typeof tool.category === "string") {
              allCategories.add(tool.category);
            }
          });
          setCategories(Array.from(allCategories));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching tools:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const regularTools = allTools.filter((tool) => !tool.isAiTool);
  const aiTools = allTools.filter((tool) => tool.isAiTool);

  return (
    <DefaultToolsContext.Provider
      value={{
        allTools,
        regularTools,
        aiTools,
        categories,
        isLoading,
        error,
      }}
    >
      {children}
    </DefaultToolsContext.Provider>
  );
};

export const useDefaultTools = (): DefaultToolsContextType => {
  const context = useContext(DefaultToolsContext);
  if (context === undefined) {
    throw new Error(
      "useDefaultTools must be used within a DefaultToolsProvider"
    );
  }
  return context;
};
