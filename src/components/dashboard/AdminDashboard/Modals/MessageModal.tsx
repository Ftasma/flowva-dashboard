import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Icons } from "../../../../icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface MessageModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEmails: string[];
  loading: boolean;
  onSend?: (data: {
    recipients: string[];
    subject: string;
    message: string;
  }) => void;
}

export default function MessageModal({
  openModal,
  setModalOpen,
  selectedEmails,
  loading,
  onSend,
}: MessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSubject("");
      setMessage("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) return;
    onSend?.({ recipients: selectedEmails, subject, message });
  };

  const title =
    selectedEmails.length === 1
      ? `Send Message to ${selectedEmails[0]}`
      : `Send Message to ${selectedEmails.length} Users`;

  return (
    <Modal
      open={openModal}
      footer={null}
      title={
        <h1 className="md:text-lg flex items-center gap-2 font-semibold">
          <FontAwesomeIcon icon={Icons.Message} /> {title}
        </h1>
      }
      centered
      onCancel={() => setModalOpen(false)}
    >
      <div className="flex flex-col gap-4">
        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium mb-2 text-[#111827]"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="w-full border text-base py-[10px] px-[14px] border-[#EDE9FE] transition-all ease-linear duration-200 rounded-md outline-none focus:border-[#9013fe]"
            required
          />
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-2 text-[#111827]"
          >
            Message
          </label>
          <div className="h-[250px] mb-6">
            <ReactQuill
              theme="snow"
              value={message}
              onChange={setMessage}
              placeholder="Type your message here..."
              className="h-full flex flex-col"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!subject.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer"
            style={{ backgroundColor: "#9013fe" }}
          >
            {loading ? "Sending.." : "Send"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
