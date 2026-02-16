import { useState } from "react";
import Categories from "../../components/dashboard/categories/Categories";
import EnhancedSearchComponent from "../../components/dashboard/search/EnhancedSearchComponent";
import { useSidebar } from "../../context/SidebarContext";
import "react-loading-skeleton/dist/skeleton.css";
import NotificationBell from "../../components/notifications/NotificationBell";
import { useDefaultTools } from "../../context/DefaultToolsContext";

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

const Discover = () => {
  const { allTools, isLoading: toolsLoading } = useDefaultTools();
  const { toggleMobileMenu } = useSidebar();

  // Track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Tool[]>([]);

  const handleSearchResults = (results: Tool[]) => {
    if (searchString.length < 2 && results.length === 0) {
      setHasSearched(false);
    } else {
      setHasSearched(true);
    }
    setSearchResults(results);
  };

  const handleCategoryClick = async (url: string | undefined) => {
    setHasSearched(false);
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Determine which tools to display
  // If search has been performed, use searchResults
  // Otherwise, use allTools when loaded
  const displayedTools = hasSearched ? searchResults : allTools || [];

  return (
    <div className="relative bg-gray-50 ">
      <div className="sticky md:-top-1 top-0 z-20 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <div className=" bg-gray-50 flex justify-between items-center w-full">
          <div className="flex gap-3 items-center">
            <button className="lg:hidden" onClick={toggleMobileMenu}>
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={28}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                  ></path>{" "}
                </g>
              </svg>
            </button>
            <h1 className="text-xl md:text-[1.5rem] overflow-hidden font-medium md:text-2xl  ">
              Discover
            </h1>
          </div>
        </div>
        <div className="mt-2">
          <NotificationBell />
        </div>
      </div>

      <div
        id="main-scroll-container"
        className="overflow-y-auto pb-3 md:pt-0 mt-3 h-[calc(100vh-px)] lg:h-[calc(100vh-94px)] lg:scrollbar-hidden"
      >
        <div className="mb-4 md:mb-6 px-2 ">
          <EnhancedSearchComponent
            onSearchResults={handleSearchResults}
            tools={allTools}
            setSearch={setSearchString}
          />
        </div>
        <Categories
          onCategoryClick={handleCategoryClick}
          filteredTools={toolsLoading ? undefined : displayedTools}
          query={hasSearched}
        />
      </div>
    </div>
  );
};

export default Discover;
