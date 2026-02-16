// components/ServiceIcon.tsx
import React from "react";

interface ServiceIconProps {
  name: string;
  icon: string | null;
  color?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  name,
  icon,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  // const predefinedColors: { [key: string]: string } = {
  //   "Microsoft 365": "#00A4EF",
  //   Figma: "#0ACF83",
  //   Slack: "#4A154B",
  //   Adobe: "#FF0000",
  //   Zoom: "#2D8CFF",
  //   "Adobe XD": "#FF61F6",
  //   "Google Workspace": "#4285F4",
  //   Notion: "#000000",
  //   Spotify: "#1DB954",
  //   Netflix: "#E50914",
  // };

  // const iconColor = predefinedColors[name] || color;


  return (
    <div
      className={`
        ${sizes[size]}
        rounded-lg
        flex items-center justify-center
        font-bold text-white
        ${className}
      `}
      // style={{ backgroundColor: iconColor as string }}
      title={name}
    >
      <img src={icon as string} />
    </div>
  );
};

export default ServiceIcon;
