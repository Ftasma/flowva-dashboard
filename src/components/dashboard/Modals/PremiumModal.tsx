import React, { useState } from "react";
import { Modal, Button } from "antd";
import {
  StarFilled,
  ShareAltOutlined,
  LineChartOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./PremiumModal.css";

interface PremiumModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isVisible, onClose }) => {
  const [premium, setPremium] = useState<boolean>(false);
  const premiumFeatures = [
    {
      icon: <StarFilled />,
      text: "Unlimited collections and tools",
    },
    {
      icon: <ShareAltOutlined />,
      text: "Advanced sharing and collaboration",
    },
    {
      icon: <LineChartOutlined />,
      text: "Detailed usage analytics",
    },
    {
      icon: <DollarOutlined />,
      text: "Subscription optimization tools",
    },
    {
      icon: <ThunderboltOutlined />,
      text: "Priority customer support",
    },
  ];

  const hadleUpgrade = () => {
    setPremium(true);
  };
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      closeIcon={<CloseOutlined />}
      className="premium-modal"
    >
      <div className="premium-modal-content">
        <h2 className="text-2xl font-semibold mb-2">Unlock Premium Features</h2>
        <p className="text-base mb-6">
          Upgrade to Flowva Pro to access these powerful features and more.
        </p>
        {premium ? (
          <div>
            <p className="text-2xl text-center font-semibold"> Coming soon🔒</p>
          </div>
        ) : (
          <div className="premium-features">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="premium-feature">
                <span
                  className="premium-feature-icon"
                  style={{ color: "#9013FE" }}
                >
                  {feature.icon}
                </span>
                <span className="premium-feature-text">{feature.text}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          type="primary"
          size="large"
          block
          onClick={hadleUpgrade}
          className="upgrade-btn"
          style={{
            backgroundColor: "#9013FE",
            borderColor: "#9013FE",
            height: "48px",
            marginTop: "24px",
            marginBottom: "16px",
            borderRadius: "100px",
            fontWeight: 500,
          }}
        >
          Upgrade to Pro - $9.99/month
        </Button>

        <p className="text-sm text-center text-gray-600">
          Try free for 14 days. Cancel anytime.
        </p>
      </div>
    </Modal>
  );
};

export default PremiumModal;
