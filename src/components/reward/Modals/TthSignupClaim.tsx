import { Modal } from "antd";
import { CloudDownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { sendRewardClaim } from "../../../services/rewardService";
import { toast } from "react-toastify";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { logUserActivity } from "../../../services/user/activityTrack";
import { useCurrentUser } from "../../../context/CurrentUserContext";
interface TtsModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toolName: string;
  points: string;
}
export default function TtsSignupClaim({
  openModal,
  setModalOpen,
  toolName,
  points,
}: TtsModalProps) {
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedFile) return;

    setLoading(true);
    if (currentUser)
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("file", selectedFile);
        formData.append("acct-email", currentUser?.email);
        formData.append("tool-name", toolName);
        formData.append("ponts", points);

        await sendRewardClaim(formData);
        await NotificationHelpers.onRewardClaimRequest(Number(points));
        await logUserActivity({
          userId: currentUser?.id,
          action: `Submit claim for ${toolName} sign up`,
          metadata: {
            service: "reward",
            tool_name: { toolName },
          },
        });
        toast.success("Your claim was submitted successfully! 🎉");
        setModalOpen(false);
        setEmail("");
        setSelectedFile(null);
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <Modal
      open={openModal}
      footer={null}
      title={<h1 className="md:text-lg">Claim Your {points} Points</h1>}
      centered
      onCancel={() => setModalOpen(false)}
    >
      {toolName === "Reclaim" && (
        <>
          <p className="text-[0.9rem] text-[#6c757d]">
            Sign up for {toolName} (free, no payment needed), then fill the form
            below:
          </p>
          <li className="text-[0.9rem] text-[#6c757d]">
            <ul>1️⃣ Enter your {toolName} sign-up email.</ul>
            <ul>
              2️⃣ Upload a screenshot of your {toolName} profile showing your
              email.
            </ul>
          </li>
          <p className="text-[0.9rem] text-[#6c757d]">
            After verification, you’ll get {points} Flowva Points! 🎉😊
          </p>
        </>
      )}

      {toolName === "Perplexity" && (
        <>
          <p className="text-[0.9rem] text-[#6c757d]">
            Sign up for {toolName} with your <strong>student email</strong>{" "}
            (free, no payment needed), then follow the steps below:
          </p>
          <li className="text-[0.9rem] text-[#6c757d]">
            <ul>1️⃣ Sign up using your student email.</ul>
            <ul>2️⃣ Download the {toolName} app.</ul>
            <ul>3️⃣ Ask one question to the AI inside the app.</ul>
          </li>
          <p className="text-[0.9rem] text-[#6c757d]">
            After completing these steps, upload a screenshot showing you’ve
            done them, and you’ll earn <strong>1000 Flowva Points</strong>! 🎉😊
          </p>
        </>
      )}
      <form onSubmit={handleSubmit} className="mt-3">
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2 text-[#111827]"
        >
          Email used on {toolName}
        </label>
        <div className="relative group w-full mb-5">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className=" peer w-full border text-base py-[10px] px-[14px]  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
            required
          />
          <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
        </div>
        <label
          htmlFor="file"
          className="block text-sm mb-[0.5rem] font-medium text-[#111827]"
        >
          Upload screenshot (mandatory)
        </label>
        <label className="p-[0.5rem] cursor-pointer hover:bg-[rgba(29,28,28,0.05)] block border border-dashed border-[#e9ecef] rounded-[8px] bg-[#f9f9f9] transition-all duration-200">
          <p className="text-center flex justify-center gap-[0.5rem]">
            <CloudDownloadIcon />

            <span className="text-base">Choose file</span>
          </p>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>
        {selectedFile && (
          <p className="mt-2 text-xs text-[#6c757d] text-center">
            Selected file:{" "}
            <span className="font-medium">{selectedFile.name}</span>
          </p>
        )}
        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={() => setModalOpen(false)}
            type="button"
            className="p-[0.5rem_1rem] rounded-[8px] font-semibold transition-all duration-200 hover:bg-[#d1d5db] bg-[#e9ecef] text-[#020617]"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="p-[0.5rem_1rem] rounded-[8px] font-semibold transition-all duration-200 bg-[#9103fe] text-white hover:bg-[#FF8687]"
          >
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
