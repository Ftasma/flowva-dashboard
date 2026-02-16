import React, { useState, useRef, useEffect } from "react";
import CardGrid from "../Cards/HomeCardGrid";
import NoResultsMessage from "../search/NoResultsMessage";
import CategorySelector from "./CategorySelector";
import NavigationTabs from "./NavigationTabs";
import CardSkeleton from "../../skeletons/CardSkeleton";
import { useTrendingTools } from "../../../hooks/my-library/useTrendingTools";
import { useUserProfile } from "../../../context/UseProfileContext";
import { useDefaultTools } from "../../../context/DefaultToolsContext";

interface CategoriesProps {
  onCategoryClick: (url: string | undefined) => Promise<void>;
  filteredTools?: Tool[];
  query: boolean;
}

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

const Categories: React.FC<CategoriesProps> = ({
  onCategoryClick,
  filteredTools,
  query,
}) => {
  const { userProfileData } = useUserProfile();
  const { allTools, isLoading } = useDefaultTools();
  const [selectedCategory, setSelectedCategory] = useState("All Tool Categories");
  const [activeNav, setActiveNav] = useState("Recommended");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { trendingTools, loading: trendingLoading } = useTrendingTools();

  // Navigation options
  const navigationOptions = ["Recommended", "Featured", "Trending"];
  const featuredTools = ["Reclaim", "Campaigner", "Keeper", "Clickup", "Brevo", "Fiverr", "Crankwheel", "Logome","Melio", "Navan", "NiceJob", "Oyester"];

  // Set initial category based on user profile when data loads
  useEffect(() => {
    if (
      userProfileData?.interest &&
      activeNav === "Recommended" &&
      !isLoading
    ) {
      setSelectedCategory(userProfileData.interest);
    }
  }, [userProfileData, isLoading, activeNav]);

  const getFilteredTools = (): Tool[] => {
    if (isLoading) return [];

    if (query) {
      // Always return filteredTools, even if it's an empty array
      return filteredTools ?? [];
    }

    const base = allTools;

    // FEATURED tab
    if (activeNav === "Featured") {
      return featuredTools
        .map((name) => base.find((tool) => tool.title === name))
        .filter((tool): tool is Tool => !!tool);
    }

    // TRENDING tab
    if (activeNav === "Trending") {
      return trendingLoading ? [] : trendingTools;
    }
    // Return all Tools
    if (selectedCategory.toLowerCase() === "all tool categories") {
      return base;
    }
    // Filter by category
    return base.filter((tool) => {
      const categories = Array.isArray(tool.category)
        ? tool.category
        : [tool.category];
      return categories.includes(selectedCategory);
    });
  };

  const displayedTools = getFilteredTools();


    return (
      <div>
        {/* Header section with category selector and navigation tabs - sticky */}
        <div className="sticky -top-[1px] md:top-0 z-10 bg-gray-50 px-2 py-3 lg:py-6">
          {/* Mobile layout - stacked */}
          <div className="flex items-center flex-col md:hidden gap-5">
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              userProfileData={userProfileData}
              activeNav={activeNav}
            />

            <div className="overflow-x-auto">
              <NavigationTabs
                activeNav={activeNav}
                onNavChange={(option) => {
                  setActiveNav(option);
                  if (option === "Recommended" && userProfileData?.interest) {
                    setSelectedCategory(userProfileData.interest);
                  }
                }}
                options={navigationOptions}
              />
            </div>
          </div>

          {/* Desktop layout with exact center alignment */}
          <div className="hidden md:flex items-center   ">
            {/* Left-aligned category selector */}
            <div>
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                userProfileData={userProfileData}
                activeNav={activeNav}
              />
            </div>

            {/* Absolutely centered navigation tabs */}
            <div className="ml-16">
              <NavigationTabs
                activeNav={activeNav}
                onNavChange={(option) => {
                  setActiveNav(option);
                  if (option !== "Recommended") {
                    // setSelectedCategory("Discover");
                  } else if (
                    option === "Recommended" &&
                    userProfileData?.interest
                  ) {
                    setSelectedCategory(userProfileData.interest);
                  }
                }}
                options={navigationOptions}
              />
            </div>
          </div>
        </div>

        {/* Content area with minimal spacing */}
        {isLoading ? (
          <div className="text-center py-8">
            <CardSkeleton cards={8} />{" "}
          </div>
        ) : (
          <div className=" md:mt-6 px-2 pb-3 overflow-hidden">
            <div ref={scrollContainerRef}>
              {query ? (
                displayedTools.length === 0 ? (
                  <NoResultsMessage />
                ) : (
                  <CardGrid
                    tools={displayedTools}
                    onCardClick={onCategoryClick}
                  />
                )
              ) : activeNav === "Featured" ? (
                <CardGrid
                  tools={displayedTools}
                  onCardClick={onCategoryClick}
                />
              ) : activeNav === "Trending" ? (
                <CardGrid
                  tools={displayedTools}
                  onCardClick={onCategoryClick}
                />
              ) : (
                <div className="mb-2">
                  <CardGrid
                    tools={displayedTools}
                    onCardClick={onCategoryClick}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
};

export default Categories;
