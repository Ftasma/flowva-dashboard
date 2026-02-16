import React from "react";

interface ProgressBarProps {
  currentPage: number;
  totalPages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentPage,
  totalPages,
}) => {
  // Generate an array of length totalPages to create segments
  const segments = Array.from({ length: totalPages });

  return (
    <div className="fixed top-[15px] sm:top-[20px] md:top-[25px] left-0 right-0 w-full z-10">
      <div className="w-full h-[10px] sm:h-[12px] md:h-[15px] flex gap-4 sm:gap-8 px-4">
        {segments.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-full rounded-full ${
              index < currentPage ? "bg-[#9013FE]" : "bg-[#D9D9D9B2]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
