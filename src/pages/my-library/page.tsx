import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionCard from "../../components/my-library/Cards/ActionCard";
import { PlusOutlined, StarFilled, SwapOutlined } from "@ant-design/icons";
import LibraryCardGrid from "../../components/my-library/Cards/LibraryCardGrid";
import { useSidebar } from "../../context/SidebarContext";
import CardSkeleton from "../../components/skeletons/CardSkeleton";
import AddNewToolsModal from "../../components/my-library/Modals/AddNewToolsModal";
import { useLibraryToolsContext } from "../../context/LibraryToolsContext";
import NotificationBell from "../../components/notifications/NotificationBell";
import { useCurrentUser } from "../../context/CurrentUserContext";

const MyLibrary: React.FC = () => {
  const { currentUser, loading: userLoading } = useCurrentUser();

  const { toggleMobileMenu } = useSidebar();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { tools, loading, refreshTools, setUserId } = useLibraryToolsContext();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id);
    }
  }, [currentUser]);

  const navigate = useNavigate();

  const handleCardClick = async (url?: string) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  const handleAddNewTools = () => {
    setModalOpen(true);
  };

  return (
    <div className="relative bg-gray-50 ">
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
            <h1 className="text-xl md:text-[1.5rem] font-medium ">Library</h1>
          </div>
          <div className="mt-2">
            <NotificationBell />
          </div>
        </div>
      </div>
      <div>
        <div className="lg:h-[calc(100vh-90px)] [scrollbar-width:none] [-ms-overflow-style:none] overflow-x-hidden">
          <p className="mb-[1.5rem] text-gray-600">
            Your personal library of tools.
          </p>
          {/* Quick actions */}
          <div className="flex flex-col md:flex-row gap-8 justify-between mt-4">
            <ActionCard
              title="Add New Tool"
              description="Save a new tool to your library"
              icon={<PlusOutlined className="text-purple-600 text-lg" />}
              onClick={handleAddNewTools}
            />
            <AddNewToolsModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              onToolAdded={refreshTools}
              hideTab={false}
            />
            <ActionCard
              title="Compare Tools"
              description="Evaluate tools side-by-side"
              icon={<SwapOutlined className="text-purple-600 text-lg" />}
              onClick={() =>
                navigate("/dashboard/library/compare", { replace: false })
              }
            />
            <ActionCard
              title="Tool Reviews"
              description="Share your experiences"
              icon={<StarFilled className="text-purple-600 text-lg" />}
              onClick={() =>
                navigate("/dashboard/library/reviews", { replace: false })
              }
            />
          </div>

          {/* Show loading or error state */}
          <div className=" mt-10 pb-8">
            {loading || userLoading ? (
              <CardSkeleton cards={8} />
            ) : tools.length === 0 ? (
              <p className="text-gray-500">No tools in your library yet.</p>
            ) : (
              <LibraryCardGrid
                tools={tools}
                onCardClick={handleCardClick}
                refreshTools={refreshTools}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLibrary;
