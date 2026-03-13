import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { Icons } from "../../../../icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { adminBroadcast } from "../../../../services/admin/userService";
import { toast } from "react-toastify";
import supabase from "../../../../lib/supabase";
import { appendSignInButton } from "../../../../utils/emailTemplates";

interface BroadcastModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BroadcastModal({
  openModal,
  setModalOpen,
}: BroadcastModalProps) {
  const [category, setCategory] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  // 🟣 Prefill when category changes
  useEffect(() => {
    if (category === "unverified") {
      setSubject("Please verify your Flowva account");
      setMessage(`
        <p>Hi there,</p>

        <p>We noticed you haven’t verified your Flowva account yet. 
        Verifying your email not only helps keep your account secure but also unlocks the full Flowva experience.</p>

        <p>With Flowva, you can:</p>
        <ul>
          <li>🔎 <strong>Discover</strong> the best digital tools tailored for your needs</li>
          <li>📂 <strong>Organize & manage</strong> all your tools in one simple dashboard</li>
          <li>🎁 <strong>Track subscriptions</strong> effortlessly and never miss a renewal</li>
          <li>💎 <strong>Earn exclusive rewards</strong> as you explore and engage</li>
        </ul>

        <p>Simply click the button below to complete your verification and start enjoying all these benefits:</p>
      `);
    } else if (category === "not_onboarded") {
      setSubject("Complete your Flowva onboarding 🎉");
      setMessage(`
    <p>Hi there,</p>

    <p>Thanks for joining Flowva! 🎊 You’re just one step away from unlocking the full power of Flowva.</p>

    <p>By completing your onboarding, you’ll be able to:</p>
    <ul>
      <li>✨ Personalize your dashboard with the tools you actually use</li>
      <li>📊 Get tailored insights & recommendations for better productivity</li>
      <li>🛠 Seamlessly manage subscriptions and never miss renewals</li>
      <li>🏆 Earn rewards while exploring and engaging with new tools</li>
    </ul>

    <p>Click the button below to signin, finish setting up your Flowva account and make the most out of it:</p>
  `);
    } else {
      setSubject("");
      setMessage("");
    }
  }, [category]);

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
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message.");
      return;
    }

    try {
      setLoading(true);

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
            setLoading(false);
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
          setLoading(false);
          return;
        }
        setIsUploading(false);
      }


      const finalEmailMessage = appendSignInButton(finalMessage);

      const result = await adminBroadcast(subject, finalEmailMessage, category);

      if (result?.success) {
        toast.success(result.message || "Message sent successfully ✅");
        setSubject("");
        setMessage("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setModalOpen(false);
      } else {
        toast.error(result?.message || "Failed to send message ❌");
      }
    } catch (err: any) {
      console.error("Broadcast error:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={openModal}
      footer={null}
      title={
        <h1 className="md:text-lg flex items-center gap-2 font-semibold">
          <FontAwesomeIcon icon={Icons.Message} /> Broadcast Email
        </h1>
      }
      centered
      onCancel={() => setModalOpen(false)}
    >
      <div className="flex flex-col gap-4">
        {/* Category Selector */}
        <div>
          <label className="block text-sm font-medium mb-1">
            User Category
          </label>
          <Select
            defaultValue="all"
            style={{ width: "100%" }}
            value={category}
            className="custom-select"
            onChange={setCategory}
            options={[
              { value: "all", label: "All users" },
              { value: "verified", label: "Verified users" },
              { value: "unverified", label: "Unverified users" },
              { value: "banned", label: "Banned users" },
              { value: "not_onboarded", label: "Not Onboarded users" },
            ]}
          />
        </div>

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
          <div className="relative group w-full mb-5">
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="peer w-full border text-base py-[10px] px-[14px] border-[#EDE9FE] transition-all ease-linear duration-200 rounded-md outline-none focus:border-[#9013fe]"
              required
            />
            <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(144,19,254,0.1)]"></div>
          </div>
        </div>

        {/* Message (React Quill) */}
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
            {loading || isUploading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
