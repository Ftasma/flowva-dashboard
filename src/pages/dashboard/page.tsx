import "react-loading-skeleton/dist/skeleton.css";
import { useSidebar } from "../../context/SidebarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import NotificationBell from "../../components/notifications/NotificationBell";
import NavCard from "../../components/flowboard/Cards/NavCardGrid";
import InfoCard from "../../components/flowboard/Cards/InfoCardGrid";
import RecommendedToolsCardGrid from "../../components/flowboard/Cards/RecommendedToolsCardGrid";
import RecentToolsCardGrid from "../../components/flowboard/Cards/RecentTools";
import SubscriptionCardGrid from "../../components/flowboard/Cards/SubscriptionCardGrid";
import RewardCardGrid from "../../components/flowboard/Cards/RewardCardGrid";
import FlowboardIntroSkeleton from "../../components/skeletons/FlowboardIntroSkeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddNewToolsModal from "../../components/my-library/Modals/AddNewToolsModal";

import SubscriptionInActive from "../../components/flowboard/SubscriptionInActive";
import CollectionModal from "../../components/dashboard/Modals/CollectionModal";
import {
  CollectionFormData,
  createOrUpdateCollection,
} from "../../services/upsertCollection.service";
import { toast } from "react-toastify";
import { fetchUserLoginLocation, getGreeting } from "../../utils/helper";
import { useUserProfile } from "../../context/UseProfileContext";
import { useLibraryToolsContext } from "../../context/LibraryToolsContext";
import { useCollectionsContext } from "../../context/CollectionsContext";
import { useSubscriptionContext } from "../../context/SubscriptionContext";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useDefaultTools } from "../../context/DefaultToolsContext";
// import WelcomeBanner from "../../components/flowboard/WelcomeBanner";
import ActiveRewardCardGrid from "../../components/flowboard/Cards/ActiveRewardCardGrid";
import { logUserActivity } from "../../services/user/activityTrack";
import PromoBanner from "../../components/flowboard/PromoBanner";
import supabase from "../../lib/supabase";
// import EventBanner from "../../components/flowboard/EventBanner";

const HomeContent = () => {
  const {
    userProfileData,
    loading: profileLoading,
    rewardData,
  } = useUserProfile();
  const { currentUser, loading: currentUserLoading } = useCurrentUser();
  const { toggleMobileMenu } = useSidebar();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    tools,
    loading: libraryToolsLoading,
    refreshTools,
    setUserId,
  } = useLibraryToolsContext();
  const {
    collections,
    loading,
    fetchCollections,
    setUserId: setCollectionUserId,
  } = useCollectionsContext();
  const {
    subscriptions,
    loading: subscriptionsLoading,
    getSummaryStats,
    setUserId: subUserId,
  } = useSubscriptionContext();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id);
      subUserId(currentUser.id);
      setCollectionUserId(currentUser.id);
    }
  }, [currentUser]);

  const { allTools, isLoading } = useDefaultTools();

  const recentTools = [...tools].slice().reverse();

  const handleAddNewTools = () => {
    setModalOpen(true);
  };
  const displayName =
    (!profileLoading && userProfileData?.name) ||
    userProfileData?.name ||
    (!currentUserLoading && currentUser?.name) ||
    "";
  const summaryStats = Number(getSummaryStats().activeSubscriptions.toString());

  const [initialData, setInitialData] = useState<CollectionFormData>();
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const handleSave = async (formData: CollectionFormData) => {
    if (!currentUser?.id) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const { status, error } = await createOrUpdateCollection(
        currentUser.id,
        formData
      );

      if (status === 200) {
        toast.success("Tech Stack saved!");
        await NotificationHelpers.onStackCreated(
          formData.name,
          currentUser?.id
        );
        // Close the modal
        setCollectionModalOpen(false);
        // Refetch collections to update the list
        await fetchCollections();
      } else {
        toast.error(`Save failed: ${error}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  const openCreate = () => {
    setInitialData(undefined);
    setCollectionModalOpen(true);
  };

  useEffect(() => {
    const trackFlowboardVisit = async () => {
      if (!currentUser?.id) return;
      const locationData = await fetchUserLoginLocation();

      await logUserActivity({
        userId: currentUser.id,
        action: "Visited Homepage",
        metadata: { service: "homepage", time: new Date().toISOString() },
      });

      //update last login location
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          country: locationData?.country,
          city: locationData?.city,
          flag: locationData?.flag,
          country_code: locationData?.country_code || null,
          country_code_iso3: locationData?.country_code_iso3 || null,
        })
        .eq("user_id", currentUser?.id);

      if (updateError) {
        console.error("Update failed:", updateError.message);
        return;
      }
    };

    trackFlowboardVisit();
  }, [currentUser?.id]);

  return (
    <div className="relative bg-gray-50 ">
      <div className="sticky top-0 z-20 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0 ">
        <div className=" bg-gray-50 flex justify-between items-center w-full">
          <div className="flex items-center gap-3 ">
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
            <div className="flex w-fit  items-center gap-1">
              <h1 className=" whitespace-nowrap text-xl md:text-[1.5rem] font-medium  ">
                {getGreeting()},
              </h1>
              {currentUserLoading || profileLoading ? (
                <Skeleton width={120} height={24} />
              ) : (
                <span className="text-[#9013FE] text-xl md:text-[1.5rem] truncate w-[120px] md:w-[210px] overflow-hidden block font-medium">
                  {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 w-fit">
            <NotificationBell />
          </div>
        </div>
      </div>
      <div className="lg:h-[calc(100vh-85px)]  [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto">
        <div className="mt-2 flex flex-col 2xl:flex-row items-center gap-5 my-3">
          {/* <WelcomeBanner /> */}
          <PromoBanner /> 
          {/* <EventBanner/> */}
        </div>
        {loading || subscriptionsLoading || libraryToolsLoading ? (
          <FlowboardIntroSkeleton cards={4} />
        ) : tools.length > 0 || summaryStats > 0 ? (
          <InfoCard
            library_tools={tools.length}
            subscriptions={summaryStats}
            collections={collections.length}
          />
        ) : (
          <NavCard />
        )}
        {loading ? (
          <div className="flex justify-center my-1">
            <div className="form-loader"></div>
          </div>
        ) : (
          tools.length === 0 && (
            <div className="bg-white rounded-[12px] p-[2rem] text-center mb-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#E9D4FF] text-[#9013FE] flex justify-center items-center text-[2rem] m-[0_auto_1.5rem]">
                <FontAwesomeIcon icon={Icons.Box} />
              </div>
              <h3 className="font-semibold text-[1.2srem] mb-[0.5rem]">
                No Tools Added Yet
              </h3>
              <p className="text-[#718096] mb-[1.5rem] max-w-[400px] ml-auto mr-auto">
                Start by adding your favorite tools to your library. We'll help
                you track usage, subscriptions, and optimize your stack.
              </p>
              <div className="flex gap-[1rem] justify-center mt-[1.5rem]">
                <button
                  onClick={handleAddNewTools}
                  className="inline-flex items-center w-full justify-center text-xs font-bold md:text-base md:max-w-[350px]  rounded-[50px] border-none text-center transition-all duration-300 ease-in-out text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]"
                >
                  <FontAwesomeIcon
                    className=" mr-[.2rem] md:mr-[0.5rem]"
                    icon={Icons.Plus}
                  />{" "}
                  Add Your First Tool
                </button>
                <button
                  onClick={() => navigate("/dashboard/discover")}
                  className="inline-flex items-center justify-center w-full md:text-base md:max-w-[350px]  font-bold h-[50px] rounded-[50px] text-xs text-center bg-transparent text-[#2D3748] border  border-[#E2E8F0] hover:bg-[#F7FAFC]"
                >
                  <FontAwesomeIcon
                    className="mr-[.2rem] md:mr-[0.5rem]"
                    icon={Icons.Compass}
                  />
                  Discover Tools
                </button>
              </div>
              <AddNewToolsModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                onToolAdded={refreshTools}
                hideTab={false}
              />
            </div>
          )
        )}
        <RecommendedToolsCardGrid tools={allTools} loading={isLoading} />
        {loading ? (
          <div className="flex justify-center my-1">
            <div className="form-loader"></div>
          </div>
        ) : (
          collections.length === 0 && (
            <div className="bg-white rounded-[12px] p-[2rem] text-center mb-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#E9D4FF] text-[#9013FE] flex justify-center items-center text-[2rem] m-[0_auto_1.5rem]">
                <FontAwesomeIcon icon={Icons.layerGroup} />
              </div>
              <h3 className="font-semibold text-[1.2srem] mb-[0.5rem]">
                No Tech Stacks Created
              </h3>
              <p className="text-[#718096] mb-[1.5rem] max-w-[400px] ml-auto mr-auto">
                Create your first tech stack by combining tools from your
                library for specific projects or workflows.
              </p>
              <button
                onClick={openCreate}
                className="w-full md:max-w-[350px]  inline-flex h-[50px] items-center justify-center text-sm md:text-base font-bold  rounded-[50px] border-none text-center transition-all duration-300 ease-in-out text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]"
              >
                <FontAwesomeIcon
                  icon={Icons.Plus}
                  className="mr-[.2rem] md:mr-[0.5rem]"
                />{" "}
                Create Tech Stack
              </button>
            </div>
          )
        )}
        <CollectionModal
          open={collectionModalOpen}
          onClose={() => setCollectionModalOpen(false)}
          onSave={handleSave}
          initialData={initialData}
        />
        {tools.length > 0 && (
          <RecentToolsCardGrid
            tools={recentTools}
            loading={libraryToolsLoading}
          />
        )}

        {subscriptionsLoading ? (
          <div className="flex justify-center my-1">
            <div className="form-loader"></div>
          </div>
        ) : (
          summaryStats === 0 && <SubscriptionInActive />
        )}

        {summaryStats > 0 && (
          <SubscriptionCardGrid subscription={subscriptions} />
        )}

        {rewardData?.totalPoints === 0 ? (
          <RewardCardGrid />
        ) : (
          <ActiveRewardCardGrid />
        )}
      </div>
    </div>
  );
};

export default HomeContent;
