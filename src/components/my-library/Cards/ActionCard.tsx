import React from "react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div
      className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm cursor-pointer transition-all duration-300 ease-in-out flex-1 min-w-[200px] hover:translate-y-[-3px] hover:shadow-lg"
      onClick={onClick}
    >
      <div className="bg-gray-100 p-4 rounded-full flex items-center justify-center">
        <div className="text-black transition-colors duration-300 justify-center items-center flex group-hover:text-purple-600">
          <div className=" w-fit flex justify-center items-center">{icon}</div>
        </div>
      </div>
      <div className="action-text">
        <h3 className="text-lg font-semibold m-0 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 m-0">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;
