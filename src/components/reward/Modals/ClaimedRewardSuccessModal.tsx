import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { Player } from "@lottiefiles/react-lottie-player";
import confetti from "../claimAnimation.json";
import { rewardContentMap } from "../rewardContentMap";
import { IconButton } from "../Refer";
import { Icons } from "../../../icons";

interface ModalData {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReward: string | null;
}

export default function ClaimedRewardSuccessModal({
  modalOpen,
  setModalOpen,
  selectedReward,
}: ModalData) {
  const confettiRef = useRef<HTMLDivElement>(null);
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });

  const rewardPoints = rewardContentMap[selectedReward as string]?.points;

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

  const shareMessage = `🎉 I just claimed a "${selectedReward}" reward on Flowva!

Flowva is a platform where you discover top tools, earn exclusive rewards, and grow with a vibrant community.

✨ Join me on Flowva and start earning too — sign up now and get rewarded: https://flowvahub.com`;

  const openSocial = (platform: string) => {
    const encoded = encodeURIComponent(shareMessage);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${encoded}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?summary=${encoded}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encoded}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <Modal
      width="100%"
      style={{ top: 20, maxWidth: 400, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      footer={null}
      destroyOnClose
      centered
      onCancel={() => setModalOpen(false)}
    >
      <div
        ref={confettiRef}
        className="relative overflow-hidden py-6 px-4 text-center"
      >
        {modalOpen && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <ReactConfetti
              width={confettiSize.width}
              height={confettiSize.height}
              numberOfPieces={250}
              recycle={false}
              gravity={0.3}
            />
          </div>
        )}

        <div className="relative z-20 flex flex-col items-center">
          <div className="w-[90px] h-[90px] rounded-full bg-green-100 flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-500 w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[#9013fe] mb-2 capitalize">
            Congratulations!
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            You've successfully claimed the <strong>{selectedReward}</strong>{" "}
            reward.
          </p>
          <p className="text-sm text-gray-600">
            {rewardPoints} point{rewardPoints !== 1 ? "s" : ""} has been
            deducted from your total Points.
          </p>

          <div className="mt-1">
            <Player
              autoplay
              loop
              keepLastFrame
              src={confetti}
              style={{ height: "120px", width: "120px" }}
            />
            <h2 className="text-center font-semibold text-[#9103fe] mt-6">
              🎁&nbsp;Share your win and earn 50 Flowva points!
            </h2>
            <p className="text-center text-sm">
              Let others know about your reward:
            </p>
            <div className="flex justify-center gap-[1rem] mt-[1rem]">
              <IconButton
                platform="facebook"
                color="#1877F2"
                icon={Icons.Facebook}
                onClick={openSocial}
              />
              <IconButton
                platform="x"
                color="black"
                icon={Icons.X}
                onClick={openSocial}
              />
              <IconButton
                platform="linkedin"
                color="#0077B5"
                icon={Icons.Linkedin}
                onClick={openSocial}
              />
              <IconButton
                platform="whatsapp"
                color="#25D366"
                icon={Icons.Whatsapp}
                onClick={openSocial}
              />
            </div>
            <p className="text-center text-sm">
              Send proof to{" "}
              <a className="text-[#9103fe]" href="mailto:support@flowvahub.com">
                support@flowvahub.com
              </a>{" "}
              to claim 50 points
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
