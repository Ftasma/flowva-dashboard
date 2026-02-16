import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import flowvaLogo from "../../../assets/flowva_logo.png";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserProfile } from "../../../context/UseProfileContext";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { Icons } from "../../../icons";
import CloseIcon from "../../common/closeIcon";
import { useSidebar } from "../../../context/SidebarContext";

const SECTION_PATHS: Record<string, string> = {
  Overview: "dashboard",
  "User Insights": "user-insights",
  Engagement: "engagement",
  "Tool Management": "tool-management",
  "User Management": "user-management",
  Campaigns: "campaigns",
  Rewards: "rewards",
  Blog: "blog",
  "Admin Tools": "tools-admin",
  "Admin Settings": "settings",
  "Admin Profile": "profile",
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

const AdminSidebar: React.FC<SidebarProps> = ({ onSelect }) => {
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
    const currentPath = location.pathname.split("/")[2] || "dashboard";
    const sectionName = PATH_TO_SECTION[currentPath] || "Overview";
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
    navigate(path ? `/admin/${path}` : "/admin/dashboard");
  };

  const mainMenuItems = [
    { name: "Overview", icon: Icons.Tachometer },
    { name: "User Insights", icon: Icons.Users },
    { name: "Engagement", icon: Icons.Chart },
    { name: "Tool Management", icon: Icons.Tools },
    { name: "User Management", icon: Icons.UserPlus },
    { name: "Campaigns", icon: Icons.BullHorn },
    { name: "Rewards", icon: Icons.Gift },
    { name: "Blog", icon: Icons.Blog },
    { name: "Admin Tools", icon: Icons.Cog },
    { name: "Admin Settings", icon: Icons.Slider },
    { name: "Admin Profile", icon: Icons.Settings },
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
}> = ({ mainMenuItems, selectedItem, handleNavItemClick }) => (
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
                flex items-center text-base gap-3 px-3 p-[0.5rem] mb-[0.5rem] rounded-[8px] cursor-pointer  duration-200 transition-all
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
  </div>
);

export default AdminSidebar;
