export interface Tool {
  id: string ;
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
export const filterToolsByQuery = (
  query: string,
  tools: Tool[]
): Tool[] => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return tools;
  }

  const lowerQuery = trimmedQuery.toLowerCase();

 

  const filtered = tools.filter((tool) => {
    const inTitle = tool.title.toLowerCase().includes(lowerQuery);
    const inDesc = tool.description?.toLowerCase().includes(lowerQuery);
    const inCategory = tool.category?.some((cat) =>
      cat.toLowerCase().includes(lowerQuery)
    );
    return inTitle || inDesc || inCategory;
  });

  // Return [] explicitly if nothing matched
  return filtered.length > 0 ? filtered : [];
};
