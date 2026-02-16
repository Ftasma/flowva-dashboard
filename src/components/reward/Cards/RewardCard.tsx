import React from "react";

interface Reward {
  title: string;
  description: string;
  emoji: string;
  points: string | number;
  status: "locked" | "unlocked" | "comingSoon";
  userTotalPoints: number;
  onClick?: (rewardTitle: string) => void;
}

const RewardCard: React.FC<Reward> = ({
  title,
  description,
  emoji,
  points,
  status,
  userTotalPoints,
  onClick,
}) => {
  const isDisabled = status !== "unlocked" || Number(points) > userTotalPoints;

  return (
    <div
      className={`border ${
        isDisabled ? "opacity-[0.7] cursor-not-allowed" : ""
      } border-[#E9D4FF] bg-white rounded-[12px] p-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all duration-200 ease-linear hover:translate-y-[-5px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]`}
    >
      <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center m-[0_auto_1rem] text-[1.5rem] text-[#9013fe] bg-[#E9D4FF]">
        {emoji}
      </div>
      <h4 className="text-center text-[1.1rem] font-semibold mb-2">{title}</h4>
      <p className="text-center text-[0.9rem] text-[#2D3748] mb-4">
        {description}
      </p>
      <div className="flex items-center justify-center text-[#9013fe] font-semibold mb-4">
        ⭐ {points} pts
      </div>
      <button
        disabled={isDisabled}
         onClick={() => {
          if (!isDisabled && onClick) onClick(title);
        }}
        className={`w-full font-semibold p-[0.75rem] rounded-[8px] transition-all duration-300 ease-in-out ${
          isDisabled
            ? "bg-[#d7e0ed] text-white"
            : "bg-[#9013fe] text-white hover:bg-[#7a0bdf] hover:translate-y-[-2px]"
        }`}
      >
        {status === "unlocked"
          ? "Claim Now"
          : status === "locked"
          ? "Locked"
          : "Coming Soon"}
      </button>
    </div>
  );
};

export default RewardCard;
