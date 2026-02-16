import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

interface ConfirmationModalProps {
  visible: boolean;
  message: string;
  title: string;
  loading?: boolean;
  withReason?: boolean;
  onClose: () => void;
  onClick: (reason?: string) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  visible,
  title,
  onClose,
  withReason = false,
  loading,
  onClick,
}) => {
  const [reason, setReason] = useState(
    "Suspicious activities (spamming account), which is against Flowvahub policies."
  );

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);
  return (
    <Modal
      open={visible}
      onCancel={() => {
        onClose();
        setReason(
          "Suspicious activities (spamming account), which is against Flowvahub policies."
        );
      }}
      title={title}
      footer={null}
      centered
      width={400}
    >
      <hr />
      <p
        dangerouslySetInnerHTML={{
          __html: message,
        }}
        className="mt-1"
      />

      {/* Input for ban reason */}
      {withReason && (
        <textarea
          rows={3}
          placeholder="Enter reason for ban..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-3"
          required
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 24,
          gap: 12,
        }}
      >
        <Button
          className="rounded-[100px] h-9 py-2 hover:!border-gray-500 hover:!text-black"
          onClick={() => {
            onClose();
            setReason(
              "Suspicious activities (spamming account), which is against Flowvahub policies."
            );
          }}
          disabled={loading}
        >
          No
        </Button>
        <Button
          className={`rounded-[100px] text-white h-9 py-2 ${
            !loading && (!withReason || reason.trim())
              ? "hover:!bg-red-500 hover:!text-white"
              : ""
          }`}
          style={{ backgroundColor: "#e89c9c", borderColor: "#ed9595" }}
          onClick={() => onClick(withReason ? reason : undefined)}
          disabled={loading || (withReason && !reason.trim())}
        >
          {loading && <div className="form-loader"></div>} Yes
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
