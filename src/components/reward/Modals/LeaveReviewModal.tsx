import { Modal } from "antd";
import { useDefaultTools } from "../../../context/DefaultToolsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useEffect, useState } from "react";
import { useReviews } from "../../../hooks/review/useReviews";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import ReviewToolsModal from "./ReviewModal";
import PointSuccessModal from "./SuccessModal";
import { Tool } from "../../../context/CollectionToolsContext";
import PointErrorModal from "./ErrorModal";
import { useUserProfile } from "../../../context/UseProfileContext";

interface ModalData {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<
    React.SetStateAction<null | "try" | "review" | "share" | "tow">
  >;
}

export default function LeaveReviewModal({
  modalOpen,
  setModalOpen,
}: ModalData) {
  const { allTools } = useDefaultTools();
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id.toString() ?? "";
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [errorModal, setErrorModal] = useState(false);

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<{
    id: string;
    title: string;
    desc: string;
    logo: string | undefined;
  } | null>(null);

  const { refetch } = useReviews(selectedTool?.id?.toString(), userId);
  const { refetchUserProfile } = useUserProfile();

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

  const featuredTools = ["Clickworker", "Claude AI"];
  const partneredTools = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

  const handleErrorModal = (val: number) => {
    if (val === 409) {
      setErrorModal(true);
    }
  };
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
        <h2 className="text-2xl font-bold mb-4 text-black">Leave a Review</h2>
        <p className="text-gray-600 mb-6">
          Select a tool to review and earn 15 points
        </p>

        <div className="space-y-2">
          {partneredTools.map((tool, index) => (
            <div
              onClick={() => {
                setSelectedTool({
                  id: tool.id,
                  title: tool.title,
                  desc: tool.description,
                  logo: tool.toolLogo,
                });
                setReviewModalOpen(true);
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
                  +15 pts
                </span>
                <FontAwesomeIcon icon={Icons.ExternalLink} />
              </div>
            </div>
          ))}
        </div>
        <ReviewToolsModal
          modalOpen={reviewModalOpen}
          setModalOpen={setReviewModalOpen}
          toolId={selectedTool?.id || ""}
          toolTitle={selectedTool?.title || ""}
          refresh={refetch}
          refetchPoint={refetchUserProfile}
          setConfetti={setShowConfetti}
          setShowModal={setShowModal}
          handleStatus={handleErrorModal}
        />
        <PointSuccessModal
          modalOpen={showModal}
          show={showConfetti}
          onClose={() => setShowModal(false)}
          points={15}
          title=" Review Successful! ✍️"
          message="Thanks for sharing your feedback. You've earned points for reviewing a tool!"
          emoji="💬"
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
