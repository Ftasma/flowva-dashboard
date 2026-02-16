import React, { useState, useEffect } from "react";
import { Spin, Empty } from "antd";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useCollectionTools } from "../../../context/CollectionToolsContext";

// Type for the modal props
interface ViewCollectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  collectionId: string;
  userId: string;
}

// The collection view modal component
const ViewCollectionModal: React.FC<ViewCollectionModalProps> = ({
  isVisible,
  onClose,
  collectionId,
  userId,
}) => {
  const { collectionTools, loading, setUserId, refetch } = useCollectionTools();

  const [collection, setCollection] = useState<{
    name: string;
    description: string | null;
  }>({
    name: "",
    description: null,
  });

  // Get current location from React Router for navigation tracking
  const location = useLocation();
  const pathRef = React.useRef(location.pathname);

  useEffect(() => {
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setUserId(userId);
      refetch();
    }
  }, [isVisible, userId, refetch]);

  // Close modal ONLY if navigation path changes
  useEffect(() => {
    // Only close if the path actually changed from what it was when the modal opened
    if (isVisible && location.pathname !== pathRef.current) {
      onClose();
    }
  }, [location.pathname, onClose, isVisible]);

  // Filter tools for the current collection
  const currentCollectionTools = collectionTools.filter(
    (tool) => tool.collectionId === collectionId
  );

  // Set collection details when tools are loaded
  useEffect(() => {
    if (currentCollectionTools.length > 0) {
      const first = currentCollectionTools[0];
      setCollection((prev) => {
        if (
          prev.name === first.collectionName &&
          prev.description === (first.description || null)
        ) {
          return prev; // prevent unnecessary state update
        }
        return {
          name: first.collectionName,
          description: first.description || null,
        };
      });
    }
  }, [currentCollectionTools]);

  // Handle external link click
  const handleToolClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const modalStyle = {
    display: isVisible ? "flex" : "none",
  };

  // Add event handler to prevent clicks within modal from propagating
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="view-stack-modal fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50 justify-center items-center"
      style={modalStyle}
      onClick={onClose} // Close when clicking background
    >
      <div
        className="view-stack-content bg-white p-6 rounded-xl w-11/12 max-w-md shadow-lg relative border border-purple-200"
        onClick={handleModalContentClick} // Prevent clicks from closing when on content
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-black">
            {collection.name}
          </h3>
        </div>

        {collection.description && (
          <p className="text-gray-600 text-sm mb-5 leading-relaxed">
            {collection.description}
          </p>
        )}

        <div className="mb-6">
          {loading ? (
            <div className="flex justify-center py-6">
              <Spin size="default" />
            </div>
          ) : currentCollectionTools.length === 0 ? (
            <Empty description="No tools in this collection" className="my-4" />
          ) : (
            currentCollectionTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center hover:bg-[rgba(144,_19,_254,_0.1)] p-2 rounded-s-md cursor-pointer"
                onClick={() => handleToolClick(tool.url)}
              >
                <div className="flex justify-between  items-center w-full">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8">
                      <img
                        src={tool?.toolLogo}
                        className="w-full h-full"
                        alt="logo"
                      />
                    </div>
                    <div className="font-medium text-gray-800">
                      {tool.title}
                    </div>
                  </div>

                  <FontAwesomeIcon
                    className="text-[#9013FE]"
                    icon={Icons.ExternalLink}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="w-full py-3 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewCollectionModal;
