import { Modal } from "antd";
import { useEffect } from "react";

interface PointErrorModalProps {
  modalOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function PointErrorModal({
  modalOpen,
  onClose,
  title = "Already Claimed 🎯",
  message = "You've already claimed this reward today. Come back tomorrow or try other rewards.",
}: PointErrorModalProps) {
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <Modal
      width="100%"
      style={{ top: 20, maxWidth: 380, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      footer={null}
      centered
      onOk={onClose}
      onCancel={onClose}
    >
      <div className="relative overflow-hidden px-2">
        <div className="flex justify-center mb-4">
          <div className="w-[80px] h-[80px] text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>

        <h2 className="text-[22px] font-semibold text-center text-[#DC2626] mb-2">
          {title}
        </h2>

        <p className="text-gray-600 text-[15px] text-center leading-[1.6] mb-[25px]">
          {message}
        </p>
      </div>
    </Modal>
  );
}
