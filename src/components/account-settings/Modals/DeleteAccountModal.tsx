import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import supabase from "../../../lib/supabase";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDelete = async () => {
    if (confirmation !== "DELETE") return;

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        throw new Error("No active session found.");
      }

      const url = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/delete-user`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || result.message || "Failed to delete");

      toast.success("Account deleted successfully.");

      await supabase.auth.signOut();
      localStorage.removeItem("authenticated");
      localStorage.removeItem("hasProfile");
      localStorage.removeItem("profileId");

      navigate("/signin");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      title={<h1 className="md:text-lg font-semibold">Delete Account</h1>}
      className="w-full max-w-[550px]"
    >
      <div className="modal-body text-center">
        <div className="text-[#EF4444] text-[3rem] mb-[1rem]">
          <FontAwesomeIcon icon={Icons.Warning} />
        </div>
        <h3 className="mb-[1rem] font-semibold">
          Are you sure you want to delete your account?
        </h3>
        <p className="mb-[1.5rem]">
          This action cannot be undone. All your data will be permanently
          deleted.
        </p>
        <label htmlFor="deleteConfirmation">Type "DELETE" to confirm:</label>
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="mt-2 w-full rounded-md p-3 text-base border border-gray-300 focus:border-purple-500 outline-none"
          placeholder="DELETE"
        />
      </div>
      <div className="w-full flex flex-col gap-2 mt-4">
        <button
          onClick={onClose}
          className="w-full px-4 py-3 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading || confirmation !== "DELETE"}
          className={`w-full px-4 py-3 transition-all duration-300 ease-in-out rounded-md text-sm font-medium 
    ${
      confirmation === "DELETE" && !loading
        ? "text-white bg-[#EF4444] hover:bg-[#DC2626] hover:translate-y-[-2px]"
        : "bg-[#eaeaeb] text-gray-500 cursor-not-allowed"
    }`}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
