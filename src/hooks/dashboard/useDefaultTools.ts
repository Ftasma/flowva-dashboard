// import { useEffect, useState } from "react";
// import supabase from "../../lib/supabase";
// export interface Tool {
//   id: string;
//   libraryId?: any;
//   title: string;
//   description: string;
//   toolLogo?: string;
//   isAITool?: boolean;
//   isAitool?: boolean;
//   isAiTool?: boolean;

//   usersIcon?: string;
//   url: string;
//   category: string[];
//   bgColor?: string;
//   textColor?: string;
//   isCustom?: boolean;
// }

// export function useDefaultTools() {
//   const [allTools, setAllTools] = useState<Tool[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTools = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("default_tools")
//           .select("*");

//         if (error) throw error;

//         if (data) {
//           // Transform database fields to match your Tool interface
//           const formattedTools = data.map((item) => ({
//             id: item.id,
//             title: item.title,
//             description: item.description,
//             category: item.category,
//             url: item.url,
//             toolLogo: item.icon_url,
//             isAiTool: item.is_ai_tool,
//           }));
//           setAllTools(formattedTools);

//           // Extract unique categories from the tools
//           const allCategories = new Set<string>();

//           // Add all categories from tools
//           formattedTools.forEach((tool) => {
//             if (Array.isArray(tool.category)) {
//               tool.category.forEach((cat) => allCategories.add(cat));
//             } else if (typeof tool.category === "string") {
//               allCategories.add(tool.category);
//             }
//           });

//           setCategories(Array.from(allCategories));
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error");
//         console.error("Error fetching tools:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTools();
//   }, []);

//   // Derived states that can be used in components
//   const regularTools = allTools.filter((tool) => !tool.isAiTool);
//   const aiTools = allTools.filter((tool) => tool.isAiTool);

//   return {
//     allTools,
//     regularTools,
//     aiTools,
//     categories,
//     isLoading,
//     error,
//   };
// }
