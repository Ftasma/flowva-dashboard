import React, { useState, useEffect } from "react";

interface ExtensionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  title?: string;
  message?: string;
  downloadButtonText?: string;
}

const ExtensionPopup: React.FC<ExtensionPopupProps> = ({
  isOpen,
  onClose,
  onDownload,
  title = "Download Chrome Extension",
  message = "To continue, please install our Chrome extension. It's required to access all features.",
  downloadButtonText = "Download Extension",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };

    checkMobile();

    // Recheck on resize in case of orientation change
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-3xl w-full min-h-[280px] sm:min-h-[320px] shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 sm:top-6 sm:right-8 font-semibold text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xs sm:text-sm"
          aria-label="Skip for now"
        >
          Skip for Now
        </button>

        <div className="text-center mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {title}
          </h2>
          <p className="mb-8 sm:mb-12 text-gray-700 text-base sm:text-lg">
            {isMobile
              ? "To get started, install our Chrome extension. For mobile, use Kiwi or Yandex Browser, or switch to a laptop for full functionality."
              : message}
          </p>
          <div className="flex justify-center">
            <button
              onClick={onDownload}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#9013FE] text-white rounded-full text-base sm:text-lg font-semibold hover:bg-purple-600 transition-colors duration-300"
            >
              {downloadButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPopup;
