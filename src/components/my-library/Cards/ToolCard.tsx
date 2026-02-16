import React, { useMemo } from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { IconButton } from "@mui/material";
import { Tool } from "../../../interfaces/toolsData";
import { useNavigate } from "react-router-dom";
export type ToolCardVariant = "homepage" | "library" | "collection";

// Define props interface with TypeScript types
interface ToolCardProps {
  variant?: ToolCardVariant;
  title: string;
  tool: Tool;
  category?: string[];
  description: string;
  url: string;
  toolLogo?: string;
  isSupported?: boolean;
  onVisit: (url: string) => void;
  onAddToLibrary?: () => void;
  onShare?: () => void;
  onAddToCollection?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  // Collection-specific props
  isCollection?: boolean;
  count?: number;
  color?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  variant = "homepage",
  title,
  category = [],
  description,
  url,
  toolLogo,
  tool,
  onAddToLibrary,
  onShare,
  onAddToCollection,
  onDelete,
  onEdit,
  onVisit,
  // Collection-specific props
  isCollection = false,
  count,
  color = "#9013FE", // Default color for tools, custom for collections
}) => {
  const navigate = useNavigate();

  const backgroundColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  // Random background color for the placeholder when no logo is provided
  const randomBgColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[randomIndex];
  }, [title]);

  // Icon type definition
  type IconAction = {
    text: string;
    onClick?: () => void;
    tooltip: string;
  };
  const handleConnect = async () => {
    // setIsLoading(true);

    navigate("/dashboard/subscriptions", {
      state: { tool, showModal: true, modal: "addSubscription" },
    });
  };

  // Determine the icons for the top-right actions based on the variant
  const topRightIcons = useMemo<IconAction[]>(() => {
    if (isCollection) {
      return [
        { text: "Share", onClick: onShare, tooltip: "Share" },
        { text: "Edit", onClick: onEdit, tooltip: "Edit" },
        { text: "Remove", onClick: onDelete, tooltip: "Remove" },
      ];
    } else if (variant === "homepage") {
      return [
        {
          text: "Add to Library",
          onClick: onAddToLibrary,
          tooltip: "Add to Library",
        },
        { text: "Share", onClick: onShare, tooltip: "Share" },
      ];
    } else {
      return [
        {
          text: "Add to Stack",
          onClick: onAddToCollection,
          tooltip: "Add to Stack",
        },
        { text: "Track Sub", onClick: handleConnect, tooltip: "Track Sub" },
        { text: "Share", onClick: onShare, tooltip: "Share" },
        { text: "Remove", onClick: onDelete, tooltip: "Remove" },
      ];
    }
  }, [
    variant,
    isCollection,
    onAddToLibrary,
    onShare,
    onAddToCollection,
    onDelete,
    onEdit,
  ]);

  // Determine button text based on card type
  const buttonText = isCollection ? "View Collection" : "Visit Tool";

  // Determine border color based on card type
  const borderColor = isCollection ? color : "#9013FE";

  // Define the background style for collections
  const backgroundStyle = isCollection
    ? {
        background: `linear-gradient(135deg, ${color}1A 0%, #ffffff 100%)`,
      }
    : {};

  const handleVisit = async () => {
    onVisit(url);
  };

  return (
    <div
      className=" w-full min-h-[250px] bg-white rounded-[10px]  shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-transform duration-200 cursor-pointer flex flex-col hover:-translate-y-[5px]"
      style={{
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: borderColor,
        ...backgroundStyle,
      }}
    >
      {/* Header area with icon and actions */}
      <div className="p-6 flex justify-between items-center">
        {/* Icon or Placeholder */}
        {toolLogo && !isCollection ? (
          <div className="w-[50px] h-[50px] rounded-[10px] flex items-center justify-center">
            <img
              src={toolLogo}
              alt={title}
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
        ) : (
          <div
            className={`w-[50px] h-[50px] rounded-[10px] flex items-center justify-center text-white text-2xl ${
              !isCollection ? randomBgColor : ""
            }`}
            style={{ backgroundColor: isCollection ? color : undefined }}
          >
            {title.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Top-Right Action Icons - visible on hover */}
        <div className="relative group">
          <IconButton>
            <MoreVertOutlinedIcon />
          </IconButton>

          <div className="flex flex-col absolute z-10 min-w-40 -right-4 mt-2 rounded-md w-fit opacity-0 group-hover:opacity-100 px-3 py-2 bg-white shadow-lg border transition-opacity duration-200">
            {topRightIcons.map(({ text: IconComponent, onClick }, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick && onClick();
                }}
                className="bg-transparent border-none text-left w-full px-2 py-1 text-sm text-gray-700 hover:text-[#9013FE] hover:bg-gray-100 rounded transition-colors duration-150"
              >
                {IconComponent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area with title, category/count, description */}
      <div className="px-6 pb-6 flex-grow flex flex-col">
        <h3 className="font-bold mb-2 text-lg text-black">{title}</h3>

        {/* Display count for collections or categories for tools */}
        <div className="text-sm text-gray-500 mb-4">
          {isCollection ? (
            <span>
              {count} {count === 1 ? "tool" : "tools"}
            </span>
          ) : (
            category.map((cat, index) => (
              <span key={index} className="capitalize">
                {cat}
                {index < category.length - 1 ? ", " : ""}
              </span>
            ))
          )}
        </div>

        {/* Description */}
        <div className="text-base mb-6 flex-grow text-black">
          <p className="line-clamp-4">{description}</p>
        </div>

        {/* Footer with Button */}
        <div className="mt-auto flex justify-between gap-5">
          <button
            onClick={handleVisit}
            className="w-full bg-[#9013fe] hover:bg-black h-[50px] text-white border-none rounded-[50px] font-bold cursor-pointer transition-colors duration-200 flex items-center justify-center text-base"
          >
            {buttonText} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
