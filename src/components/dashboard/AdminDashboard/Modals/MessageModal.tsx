import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Icons } from "../../../../icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import supabase from "../../../../lib/supabase";
import { toast } from "react-toastify";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSubject("");
      setMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;

    let finalMessage = message;

    if (selectedFile) {
      setIsUploading(true);
      try {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `headers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("email_images")
          .upload(filePath, selectedFile);

        if (uploadError) {
          toast.error("Failed to upload image. Please ensure the bucket 'email_images' exists and is public.");
          setIsUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("email_images")
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        finalMessage = `<div style="text-align: center; margin-bottom: 20px;"><img src="${imageUrl}" alt="Email Header Image" style="max-width: 100%; border-radius: 8px;" /></div>` + finalMessage;
      } catch (error) {
        console.error("Upload Error:", error);
        toast.error("An error occurred uploading the image.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSend?.({ recipients: selectedEmails, subject, message: finalMessage });
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
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#111827]">
            Header Image (Optional)
          </label>
          {previewUrl ? (
            <div className="relative w-full max-w-[200px]">
              <img src={previewUrl} alt="Preview" className="w-full rounded-md border" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow"
              >
                <FontAwesomeIcon icon={Icons.Close} />
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          )}
        </div>

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
            disabled={loading || isUploading}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!subject.trim() || loading || isUploading}
            className="px-4 py-2 text-sm font-medium rounded-md text-white cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "#9013fe" }}
          >
            {loading || isUploading ? "Sending.." : "Send"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
