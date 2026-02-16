import React from "react";
import { Modal, Button } from "antd";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const MiniPremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => (
  <Modal
    open={visible}
    onCancel={onClose}
    footer={null}
    centered
    style={{ textAlign: "center" }}
    width={400}
  >
    <h2 style={{ color: "#9013FE", marginBottom: 16 }}>Premium Feature</h2>
    <p>
      Creating unlimited Tech Stacks is a premium feature. Upgrade to Flowva Pro
      to unlock this and many other powerful features.
    </p>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 24,
        gap: 12,
      }}
    >
      <Button className="rounded-[100px] h-9 py-2" onClick={onClose}>
        Not Now
      </Button>
      <Button
        type="primary"
        className="rounded-[100px] h-9 py-2"
        style={{ backgroundColor: "#9013FE", borderColor: "#9013FE" }}
        onClick={onUpgrade}
      >
        Upgrade Now
      </Button>
    </div>
  </Modal>
);

export default MiniPremiumModal;
