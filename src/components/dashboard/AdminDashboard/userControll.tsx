import Skeleton from "react-loading-skeleton";
import { useUserProfile } from "../../../context/UseProfileContext";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import NotificationBell from "../../notifications/NotificationBell";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useNavigate } from "react-router-dom";
import supabase from "../../../lib/supabase";



export default function UserControll() {
  const { userProfileData, loading: userProfileLoading } = useUserProfile();
  const { currentUser, loading: currentUserLoading } = useCurrentUser();
  const loading = userProfileLoading || currentUserLoading;

  const userProfilePic = userProfileData?.profile_pic;
  const userAvatarUrl =
    userProfileData?.profile_pic || currentUser?.avatarUrl || "";
  const userName = userProfileData?.name || currentUser?.name || "User";
  const userEmail = currentUser?.email || "";

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("authenticated");
      localStorage.removeItem("hasProfile");
      localStorage.removeItem("profileId");

      navigate("/admin/signin", { replace: true });
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const items: MenuProps["items"] = [
  {
    label: (
      <div className="group">
        <button className="flex items-center gap-3 text-base group-hover:text-black">
          <FontAwesomeIcon className="text-lg" icon={Icons.User} />
          Edit Profile
        </button>
      </div>
    ),
    key: "0",
  },
  {
    label: (
      <div className="group">
        <button onClick={handleLogout} className="flex items-center gap-3 text-base group-hover:text-red-500">
          <FontAwesomeIcon className="text-lg" icon={Icons.Signout} />
          Logout
        </button>
      </div>
    ),
    key: "1",
  },
];

  return (
    <div className="flex items-center gap-3 w-fit">
      <NotificationBell />
      <div className="mt-auto py-2 relative flex justify-center">
        <div className="absolute top-0 left-4 right-4 " />
        {loading ? (
          <Skeleton height={50} width={200} />
        ) : (
          <div className="w-full flex items-center justify-between px-4">
            <div className="flex items-center border-none">
              <Dropdown menu={{ items }} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <button className="w-[40px] border-none h-[40px] relative overflow-hidden rounded-full font-semibold mr-[0.75rem] flex items-center justify-center  text-[#9013FE] bg-[#E9D4FF]">
                    {userProfilePic ? (
                      <img
                        src={userProfilePic}
                        className="object-cover h-full w-full"
                        alt="avatar"
                      />
                    ) : userAvatarUrl ? (
                      <img
                        src={userAvatarUrl}
                        alt="User avatar"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <p className="font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </p>
                    )}
                  </button>
                </a>
              </Dropdown>
              <div className="text-start">
                <span className="text-[0.9rem] font-semibold">Admin</span>
                <p className="text-[0.8rem] text-[#718096] truncate overflow-x-hidden max-w-[153px]">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
