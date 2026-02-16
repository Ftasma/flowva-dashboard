import { Modal } from "antd";
import ToolDiscountModalContent from "../ToolDicountModalContent";
import { useUserProfile } from "../../../context/UseProfileContext";
import RewardModalContent from "./RewardModalContent";
import { useEffect } from "react";
import PaypalInternationalModalContent from "../PaypalInternationalContent";
interface ModalData {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedReward: string | null;
  onSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GiftClaimModal({
  modalOpen,
  setModalOpen,
  selectedReward,
  onSuccess,
}: ModalData) {
  const { refetchRewardData } = useUserProfile();

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

  if (!selectedReward) return null;

  const renderModalContent = () => {
    switch (selectedReward) {
      case "Tool Discounts":
        return (
          <ToolDiscountModalContent
            setModalOpen={setModalOpen}
            refetchRewardData={refetchRewardData}
            onSuccess={onSuccess}
          />
        );
      case "$5 PayPal International":
        return (
          <PaypalInternationalModalContent
            selectedReward={selectedReward}
            setModalOpen={setModalOpen}
            refetchRewardData={refetchRewardData}
            onSuccess={onSuccess}
          />
        );
      default:
        return (
          <RewardModalContent
            selectedReward={selectedReward}
            setModalOpen={setModalOpen}
            refetchRewardData={refetchRewardData}
            onSuccess={onSuccess}
          />
        );
    }
  };
  return (
    <Modal
      width="100%"
      style={{ top: 20, maxWidth: 380, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      footer={null}
      destroyOnClose
      centered
      onOk={() => setModalOpen(false)}
      onCancel={() => setModalOpen(false)}
    >
      {renderModalContent()}
    </Modal>
  );
}
