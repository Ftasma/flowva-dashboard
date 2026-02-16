import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { Select } from "antd";
import supabase from "../../lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import "../../components/dashboard/Modals/custom-tab.css";
import UploadModal from "../../components/account-settings/Modals/UploadModal";
import PasswordModal from "../../components/account-settings/Modals/ChangePasswordModal";
import DeleteAccountModal from "../../components/account-settings/Modals/DeleteAccountModal";
import { useSidebar } from "../../context/SidebarContext";
import { useUserProfile } from "../../context/UseProfileContext";
import NotificationBell from "../../components/notifications/NotificationBell";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import ProfilePicModal from "../../components/dashboard/Modals/ProfilePicModal";
import { logUserActivity } from "../../services/user/activityTrack";

const AccountSettings: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { userProfileData, refetchUserProfile } = useUserProfile();
  const { categories } = useDefaultTools();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [passwordModal, setPasswordModal] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toggleMobileMenu } = useSidebar();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [error, setError] = useState<string | null>(null);

  const enhancedAvatarUrl =
    currentUser?.avatarUrl?.replace(/=s\d+-c/, "=s400-c") ?? "";

  useEffect(() => {
    const checkStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (user?.email) {
        //check for banned
        const { data: banned, error: banError } = await supabase
          .from("banned_emails")
          .select("email")
          .eq("email", user.email.toLowerCase())
          .maybeSingle();

        if (banError) {
          throw new Error("Failed to verify ban status.");
        }

        if (banned) {
          await supabase.auth.signOut();
          setError("Your account has been banned. Contact support.");
          return;
        }
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    if (userProfileData) {
      setFirstName(userProfileData.name);
      setLastName(userProfileData?.last_name ?? "");
    }
  }, [userProfileData]);

  useEffect(() => {
    if (userProfileData?.interest) {
      setSelectedCategory(userProfileData.interest);
    }
  }, [userProfileData]);

  const closeModal = () => {
    setUploadModal(false);
  };
  

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        interest: selectedCategory,
        name: firstName,
        last_name: lastName,
      })
      .eq("user_id", currentUser?.id)
      .select();

    setLoading(false);
    if (updateError) {
      console.error("Update failed:", updateError.message);
      return;
    }
    await logUserActivity({
      userId: currentUser?.id as string,
      action: "Updated profile information",
      metadata: {
        service: "profile",
        interest: selectedCategory,
        name: firstName,
        lastName: lastName,
      },
    });
    await refetchUserProfile();
    toast.success("Changes Saved");
  };

  const closePasswordModal = () => {
    setPasswordModal(false);
  };

  const closeDeleteAcountModal = () => {
    setDeleteAccount(false);
  };

  const handleRemoveProfilePic = async () => {
    const userId = currentUser?.id;

    if (!userId) return;

    const { data: userData, error: fetchError } = await supabase
      .from("user_profiles")
      .select("profile_pic")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch profile pic:", fetchError.message);
      return;
    }

    const profilePicUrl = userData?.profile_pic;

    if (!profilePicUrl) {
      console.warn("No profile picture to remove.");
      return;
    }

    const fileName = profilePicUrl.split("/").pop();
    const filePath = `avatars/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (storageError) {
      console.error(
        "Failed to remove file from storage:",
        storageError.message
      );
      return;
    }

    const { error: dbError } = await supabase
      .from("user_profiles")
      .update({ profile_pic: null })
      .eq("user_id", userId);

    if (dbError) {
      console.error("Failed to update user profile:", dbError.message);
      return;
    }

    toast.success("Profile picture removed successfully");
    await refetchUserProfile();
  };

    if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">{error}</h1>
        <p className="text-base mb-1">Please try again or contact support.</p>
        <p className="text-sm text-gray-500">
          Reach out to{" "}
          <a
            href="mailto:support@flowvahub.com"
            className="text-blue-600 hover:underline"
          >
            support@flowvahub.com
          </a>{" "}
          or via WhatsApp at{" "}
          <a
            href="https://wa.me/15872872064"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            +1 (587) 287-2064
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-50">
      <div className="sticky top-0 z-10 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <div className=" bg-gray-50 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={toggleMobileMenu}>
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={28}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                  ></path>{" "}
                </g>
              </svg>
            </button>

            <h1 className=" text-xl md:text-[1.5rem] font-medium">Settings</h1>
          </div>
          <div className="mt-2">
            <NotificationBell />
          </div>
        </div>
      </div>
      <div className="lg:h-[calc(100vh-99px)] my-3  [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto">
        <div className="grid md:grid-cols-[1fr_1fr] gap-[1.5rem]">
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-[1.5rem] rounded-[12px] border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-[1.5rem]">
              <h2 className="font-semibold text-[1.1rem] flex items-center">
                <FontAwesomeIcon
                  className="mr-[0.75rem] text-[#9013FE]"
                  icon={Icons.User}
                />
                Profile Information
              </h2>
            </div>

            <div className="flex flex-col items-start mb-[1.5rem]">
              <div className=" md:flex items-center mb-[1rem] gap-[1.5rem] w-full">
                <div className="flex justify-center md:block">
                  <div
                    onClick={() => setOpenModal(true)}
                    className="w-[80px] h-[80px] cursor-pointer rounded-full flex items-center mb-[1.5rem] xl:mb-0 justify-center overflow-hidden flex-shrink-0 bg-[#E9D4FF]"
                  >
                    {userProfileData?.profile_pic ? (
                      <img
                        src={userProfileData.profile_pic}
                        className="object-cover w-full h-full"
                      />
                    ) : enhancedAvatarUrl ? (
                      <img
                        src={enhancedAvatarUrl}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-[2rem] text-[#9013FE]">
                        <FontAwesomeIcon icon={Icons.User} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_1fr] gap-[0.75rem] w-full items-center">
                  <button
                    onClick={() => setUploadModal(true)}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer border-none text-center  transition-all duration-300 ease-in-out text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]"
                  >
                    <FontAwesomeIcon
                      icon={Icons.Upload}
                      className="mr-[0.5rem]"
                    />
                    Upload
                  </button>
                  <button
                    onClick={handleRemoveProfilePic}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer  text-center  transition-all duration-300 ease-in-out bg-transparent border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F7FAFC] hover:translate-y-[-2px] hover:border-[#E9D4FF]"
                  >
                    <FontAwesomeIcon
                      icon={Icons.Trash}
                      className="mr-[0.5rem]"
                    />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="grid grid-cols-1 gap-[1rem]"
            >
              <div className="flex flex-col mb-[1rem] w-full">
                <label
                  htmlFor="firstName"
                  className="text-[0.9rem] mb-[0.5rem]"
                >
                  Primary Category
                </label>
                <div className="relative group w-full">
                  <Select
                    showSearch
                    placeholder="Select a category"
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    className="custom-select"
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    options={
                      categories?.map((category) => ({
                        value: category,
                        label: category,
                      })) || []
                    }
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                </div>
              </div>
              <div className="flex items-center gap-[1rem]">
                <div className="flex flex-col mb-[1rem] w-full">
                  <label
                    htmlFor="firstName"
                    className="text-[0.9rem] mb-[0.5rem]"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      defaultValue={firstName ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      className="w-full text-base outline-none focus:border-[#9013fe] peer rounded-[8px] p-[0.75rem] text-[0.9rem] border border-[#E2E8F0] transition-all duration-300 ease-in-out"
                      placeholder="First Name"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                  </div>
                </div>
                <div className="flex flex-col mb-[1rem] w-full">
                  <label
                    htmlFor="lastName"
                    className="text-[0.9rem] mb-[0.5rem]"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      defaultValue={lastName ?? ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setLastName(e.target.value)
                      }
                      className="w-full text-base outline-none focus:border-[#9013fe] peer rounded-[8px] p-[0.75rem] text-[0.9rem] border border-[#E2E8F0] transition-all duration-300 ease-in-out"
                      placeholder="Last Name"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-[1rem]">
                <label htmlFor="email" className="text-[0.9rem] mb-[0.5rem]">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={currentUser?.email}
                    readOnly
                    disabled
                    className="peer rounded-[8px] p-[0.75rem] text-[0.9rem] border border-[#E2E8F0] transition-all duration-300 ease-in-out w-full outline-none focus:border-[#9013fe]"
                    placeholder="ugo@example.com"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                </div>
              </div>

              <div className="flex flex-col mb-[1rem]">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer border-none text-center  transition-all duration-300 ease-in-out text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]"
                >
                  {loading ? (
                    "Saving Changes..."
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={Icons.Save}
                        className="mr-[0.5rem]"
                      />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-[12px] p-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-[1.1rem] flex items-center">
                <FontAwesomeIcon
                  icon={Icons.Lock}
                  className="text-[#9013FE] mr-[0.5rem]"
                />
                Security
              </h2>
            </div>

            <div className="flex flex-col py-[1rem] border-b border-[#E2E8F0]">
              <div className="flex-1 mb-[0.75rem]">
                <div className="mb-[0.25rem] font-semibold">Password</div>

                {userProfileData?.password_updated_at && (
                  <p className="text-[#718096] text-[0.8rem]">
                    Last changed{" "}
                    {formatDistanceToNow(
                      new Date(userProfileData.password_updated_at)
                    )}
                  </p>
                )}
              </div>
              <div className="self-start">
                <button
                  onClick={() => setPasswordModal(true)}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer  text-center  transition-all duration-300 ease-in-out bg-transparent border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F7FAFC] hover:translate-y-[-2px] hover:border-[#E9D4FF]"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="flex flex-col py-[1rem] border-b border-[#E2E8F0]">
              <div className="flex-1 mb-[0.75rem]">
                <div className="mb-[0.25rem] font-semibold">
                  Two-Factor Authentication
                </div>
                <div className="text-[#718096] text-[0.8rem]">
                  Add an extra layer of security
                </div>
              </div>
              <div className="self-start">
                <button className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer  text-center  transition-all duration-300 ease-in-out bg-transparent border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F7FAFC] hover:translate-y-[-2px] hover:border-[#E9D4FF]">
                  Set Up 2FA
                </button>
              </div>
            </div>

            <div className="border border-[rgba(239,_68,_68,_0.2)] p-[1.5rem] bg-[rgba(239,_68,_68,_0.05)] rounded-[8px] mt-[1.5rem]">
              <div className="flex items-center mb-[1rem]">
                <FontAwesomeIcon
                  icon={Icons.Warning}
                  className="mr-[0.75rem] text-[#EF444] text-[1.25rem]"
                />
                <h3 className="font-semibold text-[#EF4444]">Danger Zone</h3>
              </div>
              <p className="text-[0.85rem] text-[#718096] mb-[1.5rem]">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="grid grid-cols-[1fr] gap-[0.75rem]">
                <button
                  onClick={() => setDeleteAccount(true)}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-[8px] text-[0.9rem] font-medium cursor-pointer border-none text-center  transition-all duration-300 ease-in-out bg-[#EF4444] text-white hover:bg-[#DC2626] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(239,_68,_68,_0.2)]"
                  id="deleteAccountBtn"
                >
                  <FontAwesomeIcon
                    icon={Icons.Trash}
                    className="mr-[0.5rem] text-white"
                  />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
          <UploadModal
            refetchUserProfile={refetchUserProfile}
            isOpen={uploadModal}
            onClose={closeModal}
          />
          <PasswordModal
            refetchUserProfile={refetchUserProfile}
            isOpen={passwordModal}
            onClose={closePasswordModal}
          />
          <DeleteAccountModal
            isOpen={deleteAccount}
            onClose={closeDeleteAcountModal}
          />
          <ProfilePicModal
            open={openModal}
            closeModal={setOpenModal}
            imgUrl={userProfileData?.profile_pic ?? enhancedAvatarUrl ?? ""}
            firstName={userProfileData?.name ?? ""}
            lastName={userProfileData?.last_name ?? ""}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
