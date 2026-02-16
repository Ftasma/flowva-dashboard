import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase";
import { toast } from "react-toastify";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { logUserActivity } from "../../../services/user/activityTrack";
import { extractStoragePath } from "../../../utils/helper";
import { Modal } from "antd";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchUserProfile: () => void;
}
const UploadModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  refetchUserProfile,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null);
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedAvatar(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleClearImage = () => {
    setSelectedAvatar(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    setLoading(true);

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const userId = currentUser?.id;

    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("profile_pic")
      .eq("user_id", userId)
      .single();

    const currentUrl = userProfile?.profile_pic;
    const oldPath = currentUrl ? extractStoragePath(currentUrl) : null;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      setLoading(false);
      return;
    }

    // Step 3: Delete old image (if it exists)
    if (oldPath) {
      await supabase.storage.from("avatars").remove([oldPath]);
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ profile_pic: publicUrl })
      .eq("user_id", userId);

    setLoading(false);

    if (updateError) {
      console.error("Update failed:", updateError.message);
      return;
    }

    toast.success("Profile picture uploaded successfully");
    await logUserActivity({
      userId: userId as string,
      action: "Uploaded Profile Picture",
      metadata: {
        newImageUrl: publicUrl,
      },
    });

    await refetchUserProfile();
    onClose();
    handleClearImage();
  };

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

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        <h1 className="md:text-lg font-semibold">Upload Profile Picture</h1>
      }
      centered
      footer={null}
      className="w-full max-w-[550px] [scrollbar-width:none] [-ms-overflow-style:none]"
    >
      <div className="p-2">
        <div className="modal-body">
          <label htmlFor="avatarFileInput">
            <input
              type="file"
              id="avatarFileInput"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="text-center mab-[1.5rem]">
              <span className="inline-flex cursor-pointer justify-center items-center w-fit p-[0.75rem_1rem] rounded-[8px] text-[0.9rem] transition-all duration-300 ease-in-out border-none text-center text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]">
                <FontAwesomeIcon
                  className="mr-[.3rem]"
                  icon={Icons.FolderOpen}
                />
                Select Image
              </span>
            </div>
          </label>
          {selectedAvatar && (
            <div className="flex justify-center mt-3">
              <img
                id="avatarPreview"
                src={selectedAvatar}
                alt="Preview"
                className="relative object-cover w-[150px] h-[150px] rounded-full mb-[1rem] overflow-hidden"
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            onClick={() => {
              onClose();
              handleClearImage();
            }}
            className="inline-flex justify-center items-center p-[0.75rem_1rem] rounded-[8px] text-[0.9rem] transition-all duration-300 ease-in-out text-center w-full bg-transparent border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F7FAFC] hover:border-[#E9D4FF]"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="inline-flex justify-center items-center p-[0.75rem_1rem] rounded-[8px] text-[0.9rem] transition-all duration-300 ease-in-out border-none text-center w-full text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
