import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactConfetti from "react-confetti";

interface PointSuccessModalProps {
  modalOpen: boolean;
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  points: number;
  emoji?: string;
}

export default function PointSuccessModal({
  modalOpen,
  show,
  onClose,
  title = "Well Done! 🎉",
  message = "You just earned some points!",
  points,
  emoji = "🌟",
}: PointSuccessModalProps) {
  const confettiRef = useRef<HTMLDivElement>(null);
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (confettiRef.current) {
      const { offsetWidth: width, offsetHeight: height } = confettiRef.current;
      setConfettiSize({ width, height });
    }
  }, [modalOpen]);

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
      <div ref={confettiRef} className="relative overflow-hidden">
        {show && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <ReactConfetti
              width={confettiSize.width}
              height={confettiSize.height}
              numberOfPieces={200}
              recycle={false}
            />
          </div>
        )}

        <div className="flex justify-center z-20 relative mb-2">
          <div className="w-[98px] h-[98px] text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        <h2 className="text-[24px] font-bold text-center text-[#9013fe] mb-[10px]">
          {title}
        </h2>

        <div className="text-[36px] font-extrabold my-[10px] bg-gradient-to-br from-[#9013fe] to-[#FF9FF5] text-center  bg-clip-text text-transparent [text-shadow:1px_1px_3px_rgba(0,0,0,0.1)]">
          +{points} Points
        </div>

        <div className="flex justify-center space-x-1 mb-1">
          <span className="animate-bounce">✨</span>
          <span className="animate-bounce">{emoji}</span>
          <span className="animate-bounce">🎯</span>
        </div>

        <p className="text-gray-600 text-[15px] text-center leading-[1.6] mb-[25px]">
          {message}
        </p>
      </div>
    </Modal>
  );
}
