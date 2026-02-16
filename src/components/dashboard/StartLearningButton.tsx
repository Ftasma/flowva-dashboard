import React, { useState, useEffect, useRef } from "react";
import closeIcon from "../../assets/close.svg";
import { sendMessageToExtension } from "../../utils/chromeMessaging";

interface StartLearningButtonProps {
  className?: string;
  onClick?: () => void;
  hoverDelay?: number;
  extensionId?: string;
}

const StartLearningButton: React.FC<StartLearningButtonProps> = ({
  className = "",
  onClick,
  hoverDelay = 300,
  extensionId = "",
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContinueClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageToExtension(extensionId, {
        type: "SHOW_MODAL",
        source: "external_app",
        data: { source: "web_app" },
      });

      if (response.status === "error") {
        window.open("https://flowvahub.com/pricing/", "_blank");
        return;
      }

      setIsModalVisible(false);
      if (onClick) onClick();
    } catch (err) {
      console.error("Error communicating with extension:", err);
      window.open("https://flowvahub.com/pricing/", "_blank");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsModalVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsModalVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsModalVisible(false);
    }, hoverDelay);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        className={`px-4 py-2 bg-[#9013FE] text-white rounded-full hover:bg-purple-600 transition-colors duration-300 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <span>+ Get Premium</span>
      </button>

      {isModalVisible && (
        <div
          className="absolute top-full right-0 mt-2 w-[355px] bg-[#9013FE] rounded-2xl p-6 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">
              Level Up Your Learning Game!
            </h3>
            <button
              onClick={handleClose}
              className="hover:bg-purple-600 rounded-full transition-colors"
            >
              <img src={closeIcon} alt="Close" className="w-8 h-8" />
            </button>
          </div>
          <div className="text-white mb-6">
            <p className="text-md">Master any tool, your way.</p>
            <p>Capture your journey, create guides,</p>
            <p>and share with your friends!</p>
          </div>
          <button
            className={`w-full font-semibold py-2 rounded-full transition-colors duration-300 
              ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            onClick={handleContinueClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Go Premium"}
          </button>
          {error && (
            <p className="mt-2 text-red-200 text-sm text-center">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StartLearningButton;
