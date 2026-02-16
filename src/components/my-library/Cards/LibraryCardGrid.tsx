import React, { useEffect, useState } from "react";
import ToolCard from "./ToolCard";
import { toast } from "react-toastify";
import { addToCollection } from "../../../services/collectionService";
import AddToCollectionModal from "../Modals/AddToCollectionModal";
import { CollectionItem } from "../Modals/AddToCollectionModal";
import { deleteItem } from "../../../services/deleteService";
import CardSkeleton from "../../skeletons/CardSkeleton";
import { Tool } from "../../../interfaces/toolsData";
import ShareModal from "../../dashboard/Modals/ShareModal";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { useCollectionsContext } from "../../../context/CollectionsContext";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { logUserActivity } from "../../../services/user/activityTrack";
import ConfirmationModal from "../../dashboard/Modals/ConfirmationModal";

interface CardGridProps {
  tools: Tool[];
  onCardClick: (url: string | undefined) => Promise<void>;
  refreshTools: () => Promise<void>; // Added refresh function prop
}

interface ModalData {
  libraryId: string;
  title: string;
}

const LibraryCardGrid: React.FC<CardGridProps> = ({
  tools,
  onCardClick,
  refreshTools,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolToShare, setToolToShare] = useState<Tool | null>(null);
  const [deleteTool, setDeleteTool] = useState<ModalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const {
    currentUser,
    loading: userLoading,
    error: userError,
  } = useCurrentUser();

  const { collections, fetchCollections, setUserId } = useCollectionsContext();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id);
    }
  }, [currentUser]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState<string>("");
  const [shareItemType, setShareItemType] = useState<"tool" | "collection">(
    "tool"
  );
  const handleAddToCollection = async (
    selectedCollectionIds: CollectionItem[]
  ) => {
    if (!selectedTool || !currentUser?.id) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    let allSuccess = true;

    for (const collection of selectedCollectionIds) {
      const result = await addToCollection(
        currentUser.id,
        selectedTool.libraryId,
        collection.id
      );

      if (result.status === 200) {
        toast.success(`Added "${selectedTool.title}" to a stack`);
         await logUserActivity({
        userId: currentUser.id,
        action: "Added tool to a stack",
        metadata: {
          service: 'stack',
          toolName: selectedTool.title,
          collectionName: collection.name,
          collectionId: collection.id,
          serviceName: "library_tools",
        },
      });
        await NotificationHelpers.onToolAddedToStack(
          selectedTool.title,
          collection.name,
          collection.id,
          currentUser?.id
        );
      } else {
        toast.info(
          `Failed to add to collection: ${result.error || "Unknown error"}`
        );
        console.error(result);
        allSuccess = false;
      }
    }

    if (allSuccess) {
      await fetchCollections();
    }

    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleDeleteData = async (libraryId: string, title: string) => {
    setDeleteTool({
      libraryId,
      title,
    });
    setOpenModal(true);
  };

  const handleDelete = async (libraryId: string, title: string) => {
    if (!currentUser?.id) {
      toast.error("Please log in to remove.");
      return;
    }
    setLoading(true);
    const { status, error } = await deleteItem(
      currentUser.id,
      "library_tools",
      libraryId
    );
    setLoading(false);
    if (status === 200) {
      toast.success("Tool removed successfully.");
      setOpenModal(false);
      await logUserActivity({
      userId: currentUser.id,
      action: "Removed a tool",
      metadata: {
        service: 'stack',
        toolName: title,
        libraryId,
      },
    });
      await NotificationHelpers.onToolRemoved(title, currentUser.id);
      await fetchCollections();
      await refreshTools(); // Call refreshTools to update the UI
    } else {
      toast.error(`Failed to remove tool: ${error}`);
    }
  };

  // Optional: handle loading / not‑logged‑in state
  if (userLoading) return <CardSkeleton cards={8} />;
  if (userError) return <p>Error loading user</p>;
  if (!currentUser)
    return <p>Please log in to add tools to your collection.</p>;

  const collectionItems: CollectionItem[] = (collections || []).map((col) => ({
    id: col.id,
    name: col.name,
    count: col.count,
  }));

  
  const handleShareClick = (tool: Tool) => {
    if (tool.id) {
      setToolToShare(tool);
      setShareItemId(tool.libraryId.toString());
      setShareItemType("tool");
      setIsShareModalOpen(true);
    } else {
      toast.error("Cannot share tool without an ID");
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTool) handleDelete(deleteTool?.libraryId, deleteTool?.title);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {tools.map((tool) => (
        <>
          <ToolCard
            variant="library"
            key={tool.id}
            tool={tool}
            title={tool.title}
            category={tool.category}
            description={tool.description}
            url={tool.url}
            toolLogo={tool.toolLogo}
            onVisit={() => onCardClick(tool.url)}
            onAddToCollection={() => {
              setSelectedTool(tool);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDeleteData(tool.libraryId, tool.title)}
            onShare={() => handleShareClick(tool)}
          />
        </>
      ))}
      {currentUser && isShareModalOpen && (
        <ShareModal
          open={isShareModalOpen}
          tool={toolToShare}
          onClose={() => setIsShareModalOpen(false)}
          itemId={shareItemId}
          itemType={shareItemType}
          userId={currentUser.id}
        />
      )}

      <AddToCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddToCollection}
        collections={collectionItems}
      />
      <ConfirmationModal
        message={`Are you sure you want to remove ${deleteTool?.title}?`}
        title="Confirm to Remove Tool"
        visible={openModal}
        loading={loading}
        onClose={handleCloseModal}
        onClick={handleConfirmDelete}
      />
    </div>
  );
};

export default LibraryCardGrid;
