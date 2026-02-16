import { Modal } from "antd";

interface ModalProps {
  inAppModalVisible: boolean;
  setInAppModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function GoogleAuthWebviewBlockerModal({
  inAppModalVisible,
  setInAppModalVisible,
}: ModalProps) {
  return (
    <Modal
      open={inAppModalVisible}
      onCancel={() => setInAppModalVisible(false)}
      footer={null}
      centered
    >
      <h2 className="text-xl font-semibold text-[#6D28D9] mb-3">
        Google Sign-In Not Supported Here
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        You're currently using an in-app browser (e.g., LinkedIn, Twitter,
        Instagram), which blocks Google Sign-In for security reasons.
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Please open this page in your preferred browser (like{" "}
        <strong>Chrome</strong> or <strong>Safari</strong>) to continue.
      </p>
      <a
        className="w-full bg-[#9013FE] hover:bg-[#6D28D9] text-white font-medium py-2 px-4 rounded-md transition-colors"
        href={window.location.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Browser
      </a>
    </Modal>
  );
}
