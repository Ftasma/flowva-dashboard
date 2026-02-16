import React, { useState } from "react";
import { filterToolsByQuery } from "./toolsFilterUtils";
import SearchComponent from "./SearchComponent";

interface EnhancedSearchComponentProps {
  onSearchResults: (results: Tool[]) => void;
  tools: Tool[];
  setSearch: React.Dispatch<React.SetStateAction<string>>,
}

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
const EnhancedSearchComponent: React.FC<EnhancedSearchComponentProps> = ({
  onSearchResults,
  tools,
  setSearch
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // If input is empty, reset search
    if (!query.trim()) {
      onSearchResults([]);
      return;
    }
    setSearch(query)
    const results = filterToolsByQuery(query, tools);
    
    onSearchResults(results);
  };

  return <SearchComponent onSearch={handleSearch} currentQuery={searchQuery} />;
};

export default EnhancedSearchComponent;
