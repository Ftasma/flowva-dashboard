// components/SummaryCard.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  change?: {
    text: string;
    positive?: boolean;
    icon?: LucideIcon;
  };
  icon?: LucideIcon;
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? "cursor-pointer hover:-translate-y-1" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-600 font-medium">{title}</h3>
        {Icon && (
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon size={18} className="text-purple-600" />
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>

      {change && (
        <div
          className={`flex items-center text-sm ${
            change.positive === true
              ? "text-green-600"
              : change.positive === false
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {change.icon && <change.icon size={14} className="mr-1" />}
          {change.text}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
