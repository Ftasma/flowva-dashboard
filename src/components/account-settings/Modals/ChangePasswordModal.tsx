import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { Modal } from "antd";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchUserProfile: () => void;
}
interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const PasswordModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  refetchUserProfile,
}) => {
  const { currentUser } = useCurrentUser();

  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);


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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      setLoading(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser?.email ?? "",
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }
      const userId = currentUser?.id;

      const timestamp = new Date().toISOString();

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          password_last_changed: timestamp,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        const { error } = await supabase
          .from("user_profiles")
          .update({ password_updated_at: timestamp })
          .eq("user_id", userId);

        if (error) {
          return;
        }
        await refetchUserProfile();
        toast.success("Password changed successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        onClose();
      }
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      title={<h1 className="md:text-lg font-semibold">Change Password</h1>}
      width={550}
    >
      <div className="space-y-3">
        <div className="flex flex-col mb-4 w-full">
          <label htmlFor="current-password" className="text-sm mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="current-password"
              name="currentPassword"
              onChange={handleChange}
              value={formData.currentPassword}
              className="w-full rounded-md p-3 text-base border border-gray-300 focus:border-purple-500 outline-none"
              placeholder="Current Password"
            />
            <span
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 text-purple-600 text-xs cursor-pointer top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div className="flex flex-col mb-4 w-full">
          <label htmlFor="new-password" className="text-sm mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="new-password"
              name="newPassword"
              onChange={handleChange}
              value={formData.newPassword}
              className="w-full rounded-md p-3 text-base border border-gray-300 focus:border-purple-500 outline-none"
              placeholder="New Password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-purple-600 text-xs cursor-pointer top-1/2 -translate-y-1/2"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div className="flex flex-col mb-4 w-full">
          <label htmlFor="confirm-password" className="text-sm mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              onChange={handleChange}
              value={formData.confirmPassword}
              className="w-full rounded-md p-3 text-base border border-gray-300 focus:border-purple-500 outline-none"
              placeholder="Confirm Password"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-purple-600 text-xs cursor-pointer top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-4 gap-3 w-full">
        <button
          onClick={onClose}
          className="w-full px-4 py-3 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`w-full px-4 py-3 rounded-md text-sm font-medium text-white bg-[#9013fe] hover:bg-purple-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </Modal>
  );
};

export default PasswordModal;
