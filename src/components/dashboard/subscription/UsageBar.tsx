// components/UsageBar.tsx
import React from "react";

interface UsageBarProps {
  usage: number;
  height?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  className?: string;
}

export const UsageBar: React.FC<UsageBarProps> = ({
  usage,
  height = "md",
  showPercentage = true,
  className = "",
}) => {
  const getColor = (usage: number) => {
    if (usage >= 70) return "bg-green-500";
    if (usage >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const heights = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${heights[height]}`}
      >
        <div
          className={`h-full transition-all duration-500 rounded-full ${getColor(
            usage
          )}`}
          style={{ width: `${Math.min(100, Math.max(0, usage))}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-xs text-gray-600 min-w-10 text-right font-medium">
          {usage}%
        </span>
      )}
    </div>
  );
};

export default UsageBar;
