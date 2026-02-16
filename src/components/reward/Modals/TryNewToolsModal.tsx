import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { Icons } from "../../../icons";
import { useDefaultTools } from "../../../context/DefaultToolsContext";
import { useEffect, useState } from "react";
import { handleDailyClaim } from "../../../services/rewardService";
import { useUserProfile } from "../../../context/UseProfileContext";
import { Tool } from "../../../interfaces/toolsData";
import PointSuccessModal from "./SuccessModal";
import PointErrorModal from "./ErrorModal";
import { logUserActivity } from "../../../services/user/activityTrack";
import { useCurrentUser } from "../../../context/CurrentUserContext";

interface ModalData {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<
    React.SetStateAction<null | "try" | "review" | "share" | "tow">
  >;
}

export default function TryNewToolsModal({
  modalOpen,
  setModalOpen,
}: ModalData) {
  const { allTools } = useDefaultTools();
  const { refetchUserProfile } = useUserProfile();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { currentUser } = useCurrentUser();

  const featuredTools = ["PicWish", "Clickup"];
  const partneredTools = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

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
      onOk={() => setModalOpen(null)}
      onCancel={() => setModalOpen(null)}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Try a New Tool</h2>
        <p className="text-gray-600 mb-6">
          Select any tool and get 10 points instantly!
        </p>
        <div className="space-y-2">
          {partneredTools.map((tool, index) => (
            <div
              onClick={async () => {
                window.open(tool.url, "_blank");
                const res = await handleDailyClaim("try");
                if (res?.status === 409) {
                  setErrorModal(true);
                  return;
                }

                await logUserActivity({
                  userId: currentUser?.id as string,
                  action: `Tried a new tool`,
                  metadata: {
                    service: "reward",
                    toolName: tool.title,
                    pointsAwarded: 10,
                  },
                });

                setShowModal(true);
                setShowConfetti(true);
                refetchUserProfile();
              }}
              key={index}
              className="transition-all duration-200 rounded-[12px] p-4 hover:bg-[rgba(144,19,254,0.05)] hover:-translate-y-0.5  flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="relative h-6 w-6 overflow-hidden">
                  <img
                    src={tool.toolLogo}
                    className="w-full h-full"
                    alt="logo"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{tool.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="min-w-[80px] text-center px-2 py-1 rounded-full font-semibold text-sm bg-[#eef2ff] text-[#9013f3]">
                  +10 pts
                </span>
                <FontAwesomeIcon icon={Icons.ExternalLink} />
              </div>
            </div>
          ))}
        </div>
        <PointSuccessModal
          modalOpen={showModal}
          show={showConfetti}
          onClose={() => setShowModal(false)}
          points={10}
          title=" Try Successful! 🚀"
          message="You just earned points for trying a new tool!"
          emoji="🛠️"
        />
        <PointErrorModal
          modalOpen={errorModal}
          onClose={() => setErrorModal(false)}
          title="Already Claimed 🎯"
          message="You've already claimed this reward today. Come back tomorrow or try other rewards."
        />
      </div>
    </Modal>
  );
}
