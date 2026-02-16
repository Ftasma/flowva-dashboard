import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import flowvaLogo from "../../assets/flowva_logo.png";
import UserModal from "./Modals/UserModal";
import { useSidebar } from "../../context/SidebarContext";
import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import CloseIcon from "../common/closeIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { useUserProfile } from "../../context/UseProfileContext";
import { useCurrentUser } from "../../context/CurrentUserContext";

const SECTION_PATHS: Record<string, string> = {
  Home: "",
  Discover: "discover",
  Library: "library",
  "Tech Stack": "tech-stack",
  Subscriptions: "subscriptions",
  "Rewards Hub": "earn-rewards",
  Settings: "account-settings",
};

// Reverse mapping to find section name from path
const PATH_TO_SECTION: Record<string, string> = Object.entries(
  SECTION_PATHS
).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

interface SidebarProps {
  onSelect?: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfileData, loading: userProfileLoading } = useUserProfile();
  const { currentUser, loading: currentUserLoading } = useCurrentUser();
  const { isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } =
    useSidebar();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("Home");
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev);

  // Effect to set the selected item based on the current path
  useEffect(() => {
    // Get the path after /dashboard/
    const pathSegments = location.pathname.split("/");
    const currentPath = pathSegments.length > 2 ? pathSegments[2] : "";
    const sectionName = PATH_TO_SECTION[currentPath] || "Home";
    setSelectedItem(sectionName);
  }, [location.pathname]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    checkIfMobile();
    setHasMounted(true);
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [setIsMobileMenuOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsUserMenuOpen(false);
  };

  const handleNavItemClick = (itemName: string) => {
    setSelectedItem(itemName);

    if (onSelect) onSelect(itemName);
    if (isMobile) setIsMobileMenuOpen(false);

    const path = SECTION_PATHS[itemName] ?? "";
    // Ensures we don't get a trailing slash
    navigate(path ? `/dashboard/${path}` : "/dashboard");
  };

  const mainMenuItems = [
    { name: "Home", icon: Icons.Home },
    { name: "Discover", icon: Icons.Compass },
    { name: "Library", icon: Icons.boxOpen },
    { name: "Tech Stack", icon: Icons.layerGroup },
    { name: "Subscriptions", icon: Icons.CreditCard },
    { name: "Rewards Hub", icon: Icons.Gem },
    { name: "Settings", icon: Icons.Settings },
  ];

  const loading = userProfileLoading || currentUserLoading;
  const userName = userProfileData?.name || currentUser?.name || "User";
  const userAvatarUrl =
    userProfileData?.profile_pic || currentUser?.avatarUrl || "";
  const userEmail = currentUser?.email || "";

  if (!hasMounted) return null;

  return (
    <>
      {!isMobile && (
        <aside className="w-72 overflow-x-hidden flex flex-col h-screen shadow-md border-r border-black/10 text-black font-sans">
          <SidebarContent
            mainMenuItems={mainMenuItems}
            selectedItem={selectedItem}
            handleNavItemClick={handleNavItemClick}
            userProfilePic={userProfileData?.profile_pic}
            userName={userName}
            userEmail={userEmail}
            userAvatarUrl={userAvatarUrl}
            loading={loading}
            toggleUserMenu={toggleUserMenu}
            isUserMenuOpen={isUserMenuOpen}
            handleClickOutside={handleClickOutside}
            setIsUserMenuOpen={setIsUserMenuOpen}
          />
        </aside>
      )}

      {isMobile && isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 z-40 w-64 h-full bg-white text-black font-sans transition-transform duration-300 ease-in-out translate-x-0">
            <button
              onClick={toggleMobileMenu}
              className="absolute right-2 top-2 lg:hidden"
            >
              <CloseIcon />
            </button>
            <SidebarContent
              mainMenuItems={mainMenuItems}
              selectedItem={selectedItem}
              handleNavItemClick={handleNavItemClick}
              userName={userName}
              userProfilePic={userProfileData?.profile_pic}
              userEmail={userEmail}
              userAvatarUrl={userAvatarUrl}
              loading={loading}
              toggleUserMenu={toggleUserMenu}
              isUserMenuOpen={isUserMenuOpen}
              handleClickOutside={handleClickOutside}
              setIsUserMenuOpen={setIsUserMenuOpen}
            />
          </aside>
        </>
      )}
    </>
  );
};

const SidebarContent: React.FC<{
  mainMenuItems: Array<{ name: string; icon: any }>;
  selectedItem: string;
  handleNavItemClick: (name: string) => void;
  userName: string;
  userEmail: string;
  userAvatarUrl: string;
  loading: boolean;
  userProfilePic: string | undefined;
  toggleUserMenu: () => void;
  isUserMenuOpen: boolean;
  handleClickOutside: (e: React.MouseEvent) => void;
  setIsUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  mainMenuItems,
  selectedItem,
  handleNavItemClick,
  userName,
  userEmail,
  userProfilePic,
  userAvatarUrl,
  loading,
  toggleUserMenu,
  isUserMenuOpen,
  handleClickOutside,
  setIsUserMenuOpen,
}) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className=" p-2 px-7  my-2 flex justify-start">
      <img
        src={flowvaLogo}
        loading="eager"
        alt="Flowva Logo"
        className="h-[60px]"
      />
    </div>

    {/* Navigation */}
    <nav className="flex-grow px-4 ">
      <ul>
        {mainMenuItems.map(({ name, icon }) => {
          const isSelected = selectedItem === name;
          return (
            <li
              key={name}
              onClick={() => handleNavItemClick(name)}
              className={`
                flex items-center gap-3 px-4 p-[0.75rem] mb-[0.5rem] rounded-[8px] cursor-pointer  duration-200 transition-all
                ${
                  isSelected
                    ? "bg-[rgba(144,_19,_254,_0.2)] text-[#9013FE]"
                    : "text-black hover:bg-[rgba(144,_19,_254,_0.1)] hover:text-[#9013FE]"
                }
              `}
            >
              <FontAwesomeIcon icon={icon} />
              <span className="tracking-wide truncate">{name}</span>
            </li>
          );
        })}
      </ul>
    </nav>

    {/* User Section */}
    <div className="mt-auto py-3 relative flex justify-center">
      <div className="absolute top-0 left-4 right-4 border-t border-[#64748B]" />
      {loading ? (
        <Skeleton height={50} width={200} />
      ) : (
        <div className="w-full flex items-center justify-between px-4">
          <button
            onClick={toggleUserMenu}
            className="flex items-center border-none"
          >
            <div className="w-[40px] h-[40px] relative overflow-hidden rounded-full font-semibold mr-[0.75rem] flex items-center justify-center  text-[#9013FE] bg-[#E9D4FF]">
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
            </div>
            <div className="text-start">
              <span className="text-[0.9rem] font-semibold">
                {userName.split(" ").length > 1
                  ? userName.split(" ")[0].charAt(0).toUpperCase() +
                    userName.split(" ")[0].slice(1)
                  : userName.charAt(0).toUpperCase() + userName.slice(1)}
              </span>
              <p className="text-[0.8rem] text-[#718096] truncate overflow-x-hidden max-w-[153px]">
                {userEmail}
              </p>
            </div>
          </button>
        </div>
      )}

      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={handleClickOutside}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <UserModal onClose={() => setIsUserMenuOpen(false)} />
        </div>
      )}
    </div>
  </div>
);

export default Sidebar;
