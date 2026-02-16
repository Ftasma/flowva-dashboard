import { MyTechStackHeader } from "./MyTechStackHeader";
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import ToolCard from "../dashboard/Cards/ToolCard";
import { toast } from "react-toastify";
import { deleteItem } from "../../services/deleteService";
import {
  createOrUpdateCollection,
  CollectionFormData,
} from "../../services/upsertCollection.service";
import MiniPremiumModal from "../dashboard/Modals/MiniPremiumModal";
import ViewCollectionModal from "../dashboard/Modals/ViewCollection";
import { useSidebar } from "../../context/SidebarContext";
import CollectionModal from "../dashboard/Modals/CollectionModal";
import ShareModal from "../dashboard/Modals/ShareModal";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import TechStackCardSkeleton from "../skeletons/TechStackSkeleton";
import { useCollectionsContext } from "../../context/CollectionsContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { Collection } from "../../context/CollectionsContext";
import ConfirmationModal from "../dashboard/Modals/ConfirmationModal";
import { logUserActivity } from "../../services/user/activityTrack";

// Define user types as an object with boolean flags
// interface UserTypeConfig {
//   name: string;
//   isPremium: boolean;
//   collectionLimit: number;
//   labelClass: string;
//   getLabel: (collectionsCount: number) => string;
// }

// User type configurations
// const USER_TYPES: Record<string, UserTypeConfig> = {
//   free: {
//     name: "free",
//     isPremium: false,
//     collectionLimit: 3,
//     labelClass: "bg-purple-100 text-purple-700",
//     getLabel: (collectionsCount: number) =>
//       `${collectionsCount}/3 free stacks used`,
//   },
//   premium: {
//     name: "premium",
//     isPremium: true,
//     collectionLimit: 10,
//     labelClass: "bg-blue-100 text-blue-700",
//     getLabel: () => "Premium Account",
//   },
//   teams: {
//     name: "teams",
//     isPremium: true,
//     collectionLimit: 30,
//     labelClass: "bg-green-100 text-green-700",
//     getLabel: () => "Teams Account",
//   },
// };

// HARDCODED USER TYPE - Change this to test different user types

interface ModalData {
  colId: string;
  colName: string;
}

const MyTechStack: React.FC = () => {
  // const CURRENT_USER_TYPE = "free";
  // const userConfig = useMemo(() => USER_TYPES[CURRENT_USER_TYPE], []);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState<string>("");
  const [shareItemType, setShareItemType] = useState<"tool" | "collection">(
    "tool"
  );
  const { currentUser } = useCurrentUser();
  const {
    collections,
    loading,
    fetchCollections,
    setUserId: setCollectionUserId,
  } = useCollectionsContext();

  useEffect(() => {
    if (currentUser) {
      setCollectionUserId(currentUser.id);
    }
  }, [currentUser]);

  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<CollectionFormData>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [data, setData] = useState<Collection>();
  const { toggleMobileMenu } = useSidebar();

  const [deleteStack, setDeleteStack] = useState<ModalData | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  // Add state for ViewCollectionModal
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  // Close modals on navigation
  useEffect(() => {
    const cleanupModals = () => {
      setViewModalVisible(false);
      setCollectionModalOpen(false);
      setPremiumModalVisible(false);
    };
    return cleanupModals;
  }, []);

  // Show premium modal based on collection count and user type
  // useEffect(() => {
  //   if (loading || userConfig.isPremium) return;

  //   if (collections.length >= userConfig.collectionLimit) {
  //     const timer = setTimeout(() => {
  //       setPremiumModalVisible(true);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [collections.length, loading]);

  const hidePremiumModal = () => setPremiumModalVisible(false);

  const handleUpgrade = () => {
    toast.info("coming soon🔒");
    hidePremiumModal();
  };

  const openCreate = () => {
    setInitialData(undefined);
    setCollectionModalOpen(true);

    // Check if user can create more collections
    // if (collections.length < userConfig.collectionLimit) {
    //   setInitialData(undefined);
    //   setCollectionModalOpen(true);
    // } else {
    //   // Show premium modal if user has reached their limit
    //   setPremiumModalVisible(true);
    // }
  };

  const openEdit = (collection: any) => {
    setInitialData({
      id: collection.id,
      userId: currentUser?.id,
      name: collection.name,
      description: collection.description,
      color: collection.color,
      toolIds: collection.tools?.map((t: any) => t.libraryId) || [],
    });
    setCollectionModalOpen(true);
  };

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

      if (status === 200 || status === 201) {
        toast.success("Tech Stack saved!");
        await logUserActivity({
          userId: currentUser.id,
          action: formData.id ? "Updated a stack" : "Created a stack",
          metadata: {
            service: "stack",
            collectionId: formData.id || "new",
            collectionName: formData.name,
          },
        });

        await NotificationHelpers.onStackCreated(
          formData.name,
          currentUser?.id
        );
        // Close the modal
        setCollectionModalOpen(false);
        // Refetch collections to update the list
        await fetchCollections();

        // If this was a new collection and free user is now at limit, show premium modal
        // if (
        //   !formData.id &&
        //   userConfig.name === "free" &&
        //   collections.length + 1 >= userConfig.collectionLimit
        // ) {
        //   setTimeout(() => {
        //     setPremiumModalVisible(true);
        //   }, 1500);
        // }
      } else {
        toast.error(`Save failed: ${error}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleDelete = async (colId: string, name: string) => {
    if (!currentUser?.id) {
      toast.error("Please log in to delete.");
      return;
    }

    try {
      setIsLoading(true);
      const { status, error } = await deleteItem(
        currentUser.id,
        "collections",
        colId
      );
      setIsLoading(false);
      if (status === 200) {
        toast.success("Tech Stack deleted.");
        setOpenModal(false);
        await NotificationHelpers.onStackDeleted(name, currentUser.id);
        // Refetch collections to update the list
        await fetchCollections();
        await logUserActivity({
          userId: currentUser.id,
          action: "Deleted a stak",
          metadata: {
            service: "stack",
            collectionId: colId,
            collectionName: name,
          },
        });
      } else {
        toast.error(`Delete failed: ${error}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleDeleteData = async (colId: string, colName: string) => {
    setDeleteStack({
      colId,
      colName,
    });
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteStack) handleDelete(deleteStack?.colId, deleteStack?.colName);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Modified handleVisit to open the ViewCollectionModal
  const handleVisit = (col: any) => {
    setSelectedCollectionId(col.id);
    setViewModalVisible(true);
  };

  const handleShareClick = (tool: any) => {
    if (tool.id) {
      setData(tool);
      setShareItemId(tool.id.toString());
      setShareItemType("collection");
      setIsShareModalOpen(true);
    } else {
      toast.error("Cannot share tool without an ID");
    }
  };

  // Close modal handler
  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedCollectionId(null);
  };

  return (
    <div className=" relative bg-gray-50 ">
      <div className="sticky top-0 z-10 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <MyTechStackHeader
          toggleMobileMenu={toggleMobileMenu}
          openCreate={openCreate}
        />
      </div>
      <div>
        <div className="lg:h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden thin-scrollbar">
          <p className="text-gray-600 mb-3">
            Curated Tech Stacks of tools tailored to specific tasks or projects.
          </p>

          {loading ? (
            <div>
              <TechStackCardSkeleton cards={8} />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">
                You haven't created any Tech Stacks yet.
              </p>

              <Button
                type="primary"
                onClick={openCreate}
                className="rounded-[100px] h-11 font-semibold"
                style={{ backgroundColor: "#9013FE", borderColor: "#9013FE" }}
              >
                Create Your First Tech Stack
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((col) => (
                <>
                  <ToolCard
                    key={col.id}
                    // tool={col}
                    variant="collection"
                    title={col.name}
                    description={col.description}
                    url={col.url || ""}
                    onVisit={() => handleVisit(col)}
                    onShare={() => handleShareClick(col)}
                    onDelete={() => handleDeleteData(col.id, col.name)}
                    onEdit={() => openEdit(col)}
                    isCollection
                    count={col.count}
                    color={col.color}
                  />
                </>
              ))}

              {currentUser && (
                <ShareModal
                  open={isShareModalOpen}
                  onClose={() => setIsShareModalOpen(false)}
                  itemId={shareItemId}
                  data={data}
                  itemType={shareItemType}
                  userId={currentUser.id}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <CollectionModal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        onSave={handleSave}
        initialData={initialData}
      />

      <MiniPremiumModal
        visible={premiumModalVisible}
        onClose={hidePremiumModal}
        onUpgrade={handleUpgrade}
      />
      <ConfirmationModal
        message={`Are you sure you want to delete ${deleteStack?.colName}?`}
        title="Confirm to Delete Stack"
        visible={openModal}
        loading={isloading}
        onClose={handleCloseModal}
        onClick={handleConfirmDelete}
      />

      {/* ViewCollectionModal with proper cleanup */}
      {selectedCollectionId && (
        <ViewCollectionModal
          isVisible={viewModalVisible}
          onClose={handleCloseViewModal}
          collectionId={selectedCollectionId}
          userId={currentUser?.id || ""}
        />
      )}
    </div>
  );
};

export default MyTechStack;
