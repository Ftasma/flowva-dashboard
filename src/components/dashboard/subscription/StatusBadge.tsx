// components/StatusBadge.tsx
import React from "react";
import { ToolSubscription } from "./types";

interface StatusBadgeProps {
  status: ToolSubscription["status"];
  // status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const styles = {
    active: "bg-green-100 text-green-800 border-green-200",
    expiring: "bg-red-100 text-red-800 border-red-200",
    issue: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const labels = {
    active: "Active",
    expiring: "Renewing Soon",
    issue: "Issue",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <span
      className={`
      inline-flex items-center rounded-full font-semibold border
      ${styles[status]}
      ${sizes[size]}
    `}
    >
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
