import React from "react";

interface NavigationTabsProps {
  activeNav: string;
  onNavChange: (navOption: string) => void;
  options: string[];
}

/**
 * Navigation tabs component for switching between views
 * Now visible on all screen sizes
 */
const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeNav,
  onNavChange,
  options,
}) => {
  
  return (
    <div className="inline-flex items-center space-x-1 md:space-x-3 lg:space-x-6">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onNavChange(option)}
          className={`px-3 py-1 md:px-4 md:py-2 h-10 rounded-full text-md md:text-base transition-colors duration-200 whitespace-nowrap ${
            activeNav === option
              ? "bg-[#9013FE33] font-semibold"
              : "hover:bg-[#9013FE1A] font-medium"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;
