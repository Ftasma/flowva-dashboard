// import { useEffect, useState, useCallback } from "react";
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

// export interface LibraryTool {
//   id: string;
//   libraryId: string;
//   title: string;
//   description: string;
//   toolLogo?: string;
//   isAITool?: boolean;
//   isAitool?: boolean;
//   isAiTool?: boolean;
//   url: string;
//   oauth_provider: string;
//   category: string[];
//   isCustom?: boolean;
// }

// type RawLibraryEntry = {
//   id: string;
//   is_custom: boolean;
//   default_tool_id: string | null;
//   custom_tool_id: string | null;
//   default_tools?: {
//     id: string;
//     title: string;
//     created_at?: Date;
//     description: string;
//     category: string[];
//     url: string;
//     oauth_provider: string;
//     icon_url: string;
//   } | null;
//   custom_tools?: {
//     id: string;
//     title: string;
//     description: string;
//     category: string[];
//     url: string;
//     oauth_provider: string;
//     icon_url: string;
//   } | null;
// };

// export function useLibraryTools(userId: string | null) {
//   const [tools, setTools] = useState<Tool[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Create a fetchTools function that can be called to refresh the tools list
//   const fetchTools = useCallback(async () => {
//     if (!userId) {
//       setTools([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     const { data, error } = (await supabase
//       .from("library_tools")
//       .select(
//         `
//         id,
//         is_custom,
//         created_at,
//         default_tool_id,
//         custom_tool_id,
//         default_tools (
//           id, title, description, category, url, oauth_provider, icon_url
//         ),
//         custom_tools (
//           id, title, description, category, url, oauth_provider, icon_url
//         )
//       `
//       )
//       .eq("user_id", userId)) as unknown as {
//       data: RawLibraryEntry[] | null;
//       error: any;
//     };

//     if (error) {
//       console.error("Error fetching tools:", error);
//       setLoading(false);
//       return;
//     }

//     // Create an array without nulls
//     const validTools: Tool[] = [];

//     (data || []).forEach((entry) => {
//       const raw = entry.is_custom ? entry.custom_tools : entry.default_tools;

//       if (raw) {
//         // Create a tool with the correct interface
//         const tool: LibraryTool = {
//           id: raw.id,
//           libraryId: entry.id,
//           title: raw.title,
//           description: raw.description,
//           category: raw.category,
//           url: raw.url,
//           oauth_provider: raw.oauth_provider,
//           toolLogo: raw.icon_url,
//           isCustom: entry.is_custom,
//           isAiTool: false,
//         };

//         validTools.push(tool);
//       }
//     });

//     setTools(validTools);
//     setLoading(false);
//   }, [userId]);

//   // Call fetchTools on initial component mount and whenever userId changes
//   useEffect(() => {
//     fetchTools();
//   }, [userId, fetchTools]);

//   return { tools, loading, refreshTools: fetchTools };
// }
