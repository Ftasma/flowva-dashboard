import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { Icons } from "../../../../icons";
import { ToolSubscription } from "../types";
import { getNextBillingDate } from "../../../../utils/helper";
interface ModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  subscription: ToolSubscription | null;
}

export default function RenewalUpdateModal({
  modalOpen,
  setModalOpen,
  subscription,
}: ModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  if (!subscription) return;

  return (
    <Modal
      width="100%"
      bodyStyle={{
        backgroundColor: "rgb(30, 159, 30)",
        color: "white",
      }}
      style={{ top: 20, maxWidth: 380, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      className="green-modal"
      footer={null}
      closeIcon={<span className="custom-close-icon">×</span>}
      centered
      onCancel={() => setModalOpen(false)}
    >
      <div className="h-[150px] grid place-items-center justify-center text-center text-base">
        <FontAwesomeIcon className="text-4xl" icon={Icons.CheckCircle} />
        <p>
          Your {subscription?.name} subscription payment has been recorded. Next
          renewal will be on{" "}
          {formatDate(
            getNextBillingDate(
              subscription?.nextBilling,
              subscription?.billingCycle
            )
          )}
        </p>
      </div>
    </Modal>
  );
}
