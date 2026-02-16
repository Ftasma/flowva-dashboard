import React, { useState } from "react";
import ToolCard from "./ToolCard";
import { addToLibrary } from "../../../services/my-library/libraryService";
import { toast } from "react-toastify";
import ShareModal from "../Modals/ShareModal";
import CardSkeleton from "../../skeletons/CardSkeleton";
import { Tool } from "../../../interfaces/toolsData";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { useLibraryToolsContext } from "../../../context/LibraryToolsContext";
import { logUserActivity } from "../../../services/user/activityTrack";

interface CardGridProps {
  tools: Tool[];
  onCardClick: (url: string | undefined) => Promise<void>;
}

const CardGrid: React.FC<CardGridProps> = ({ tools, onCardClick }) => {
  const {
    currentUser,
    loading: userLoading,
    error: userError,
  } = useCurrentUser();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState<string>("");
  const [shareItemType, setShareItemType] = useState<"tool" | "collection">(
    "tool"
  );
  const { refreshTools } = useLibraryToolsContext();

  // Optional: handle loading / not-logged-in state
  if (userLoading) return <CardSkeleton cards={8} />;
  if (userError) return <p>Error loading user</p>;
  if (!currentUser) return <p>Please log in to add tools to your library.</p>;

  // Now, we have currentUser.id
  const handleAddToLibrary = async (tool: Tool) => {
    if (!currentUser?.id) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    if (!tool.id) {
      toast.error("Tool ID is missing. Cannot add to library.");
      return;
    }

    const { status, error, duplicate } = await addToLibrary(
      currentUser.id,
      tool.id.toString()
    );

    if (status === 409 && duplicate) {
      toast.info("This tool is already in your library.");
    } else if (status === 403 && error?.toLowerCase().includes("tool limit")) {
      toast.warning(
        "You've reached your tool limit. Upgrade to Pro to save more tools."
      );
    } else if (status !== 200) {
      toast.error(`Something went wrong: ${error || "Unknown error"}`);
    } else {
      await NotificationHelpers.onToolAdded(tool.title, currentUser?.id);
      toast.success("Tool added successfully!");
      await logUserActivity({
        userId: currentUser?.id,
        action: "Added a tool to library",
        metadata: {
          service: "library",
          toolId: tool.id,
          toolName: tool.title,
        },
      });
      refreshTools();
    }
  };

  const handleShareClick = (tool: Tool) => {
    if (tool.id) {
      setShareItemId(tool.id.toString());
      setShareItemType("tool");
      setIsShareModalOpen(true);
    } else {
      toast.error("Cannot share tool without an ID");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {tools.map((tool) => (
        <ToolCard
          variant="homepage"
          // tool={tool}
          key={tool.title}
          title={tool.title}
          category={tool.category}
          description={tool.description}
          url={tool.url}
          toolLogo={tool.toolLogo}
          onVisit={() => onCardClick(tool.url)}
          onAddToLibrary={() => handleAddToLibrary(tool)}
          onShare={() => handleShareClick(tool)}
          // onPermission={() => {}}
        />
      ))}

      {currentUser && isShareModalOpen && (
        <ShareModal
          open={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          itemId={shareItemId}
          itemType={shareItemType}
          userId={currentUser.id}
        />
      )}
    </div>
  );
};

export default CardGrid;
