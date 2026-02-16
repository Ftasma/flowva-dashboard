import React, { useEffect, useState } from "react";
import FeedbackModal from "./Modals/FeedbackModal";

interface FeedbackButtonProps {
  className?: string;
  onFeedbackClick?: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  className = "",
  onFeedbackClick,
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    if (onFeedbackClick) {
      onFeedbackClick();
    } else {
      setShowModal(true);
    }
  };

  const buttonText = "Feedback";

  const buttonSizeClasses =
    windowWidth < 640 ? "px-4 py-1.5 text-md" : "px-4 py-2";

  return (
    <>
      <button
        className={`${buttonSizeClasses} bg-[#9013FE] text-white rounded-full hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center ${className}`}
        onClick={handleClick}
        aria-label="Provide feedback"
      >
        <span>{buttonText}</span>
      </button>

      {showModal && (
        <FeedbackModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </>
  );
};

export default FeedbackButton;
