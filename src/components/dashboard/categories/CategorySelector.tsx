import React, { useState, useEffect } from "react";
import { Select, SelectProps } from "antd";
import { UserProfile } from "../../../context/UseProfileContext";
import { useDefaultTools } from "../../../context/DefaultToolsContext";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  userProfileData: UserProfile | null;
  activeNav: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  userProfileData,
  activeNav,
}) => {
  const { categories } = useDefaultTools();

  // When user profile loads, automatically select their interest only in Recommended view
  useEffect(() => {
    if (userProfileData?.interest && activeNav === "Recommended") {
      // Check if the user's interest exists in our categories
      if (categories?.includes(userProfileData.interest)) {
        setTimeout(() => {
          onCategoryChange(userProfileData.interest as string);
        }, 0);
      }
    }
  }, [userProfileData, onCategoryChange, activeNav, categories]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDropdownOpen]);

  const updatedCategories = ["All Tool Categories", ...(categories || [])];

  // Remove "All Tool Categories" first
  const [firstCategory, ...rest] = updatedCategories;

  // Sort the rest alphabetically (case-insensitive)
  const sortedCategories = [
    firstCategory,
    ...rest.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
  ];

  const options: SelectProps["options"] = sortedCategories.map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <div className="w-[220px] self-start">
      <Select
        placeholder="Select a category"
        style={{ width: "100%" }}
        value={selectedCategory}
        className="custom-select"
        onChange={(value) => {
          onCategoryChange(value);
          setIsDropdownOpen(false);
        }}
        onDropdownVisibleChange={setIsDropdownOpen}
        options={options}
        optionFilterProp="label"
        filterOption={(input, option) =>
          (option?.label as string).toLowerCase().includes(input.toLowerCase())
        }
      />
    </div>
  );
};

export default CategorySelector;
