import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CollectionModal from "./CollectionModal";
import MiniPremiumModal from "./MiniPremiumModal";
import {
  createOrUpdateCollection,
  CollectionFormData,
} from "../../../services/upsertCollection.service";
import { toast } from "react-toastify";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { useCollectionsContext } from "../../../context/CollectionsContext";

interface UserTypeConfig {
  name: string;
  isPremium: boolean;
  collectionLimit: number;
  labelClass: string;
  getLabel: (collectionsCount: number) => string;
}

const USER_TYPES: Record<string, UserTypeConfig> = {
  free: {
    name: "free",
    isPremium: false,
    collectionLimit: 3,
    labelClass: "bg-purple-100 text-purple-700",
    getLabel: (collectionsCount: number) =>
      `${collectionsCount}/3 free stacks used`,
  },
  premium: {
    name: "premium",
    isPremium: true,
    collectionLimit: 10,
    labelClass: "bg-blue-100 text-blue-700",
    getLabel: () => "Premium Account",
  },
  teams: {
    name: "teams",
    isPremium: true,
    collectionLimit: 30,
    labelClass: "bg-green-100 text-green-700",
    getLabel: () => "Teams Account",
  },
};

const CURRENT_USER_TYPE = "free";
const userConfig = USER_TYPES[CURRENT_USER_TYPE];

export interface CollectionItem {
  id: string;
  name: string;
  count: number;
}

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCollections: CollectionItem[]) => void;
  collections: CollectionItem[];
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collections,
}) => {
  const [selectedCollections, setSelectedCollections] = useState<
    CollectionItem[]
  >([]);

  const { currentUser } = useCurrentUser();
  const { fetchCollections, setUserId } = useCollectionsContext();

  useEffect(() => {
    if (currentUser) setUserId(currentUser.id);
  }, [currentUser]);

  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<CollectionFormData>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCollections([]);
    }
  }, [isOpen]);

  const toggleCollectionSelection = (collection: CollectionItem) => {
    setSelectedCollections((prev) => {
      const exists = prev.some((col) => col.id === collection.id);
      if (exists) {
        return prev.filter((col) => col.id !== collection.id);
      } else {
        return [...prev, collection];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedCollections);
    onClose();
  };

  const openCreate = () => {
    if (collections.length < userConfig.collectionLimit) {
      setInitialData(undefined);
      setCollectionModalOpen(true);
    } else {
      setPremiumModalVisible(true);
    }
  };

  const hidePremiumModal = () => setPremiumModalVisible(false);

  const handleUpgrade = () => {
    toast.success(
      "This would upgrade your account to premium in a real implementation!"
    );
    hidePremiumModal();
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

        setCollectionModalOpen(false);
        await fetchCollections();

        if (
          !formData.id &&
          userConfig.name === "free" &&
          collections.length + 1 >= userConfig.collectionLimit
        ) {
          setTimeout(() => {
            setPremiumModalVisible(true);
          }, 1500);
        }

        onClose(); // Refresh modal to reload collections
      } else {
        toast.error(`Save failed: ${error}`);
      }
      if (status === 200) {
        await NotificationHelpers.onStackCreated(
          formData.name,
          currentUser?.id
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={400}
        className="rounded-lg"
        closeIcon={<span className="text-gray-500 text-2xl">&times;</span>}
        title={<div className="text-xl font-bold">Add to Stack</div>}
      >
        <div className="max-h-64 overflow-y-auto my-6">
          {collections.map((collection) => {
            const isSelected = selectedCollections.some(
              (col) => col.id === collection.id
            );

            return (
              <div
                key={collection.id}
                className={`p-4 border rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-purple-50 border-purple-500"
                    : "border-gray-200 hover:bg-gray-100 hover:border-purple-500"
                }`}
                onClick={() => toggleCollectionSelection(collection)}
              >
                <div className="font-semibold">{collection.name}</div>
                <div className="text-sm text-gray-500">
                  {collection.count} tools
                </div>
              </div>
            );
          })}

          {collections.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No collections available
              <div className="mt-4">
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={openCreate}
                  className="rounded-[100px] h-11"
                  style={{ backgroundColor: "#9013FE", borderColor: "#9013FE" }}
                >
                  New Tech Stack
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={selectedCollections.length === 0}
            className="h-11 p-2 rounded-[100px]"
            style={{
              backgroundColor: "#9333ea",
              borderColor: "#9333ea",
              width: "100%",
              color: "white",
              fontSize: "16px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.borderColor = "#000000";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#9333ea";
              e.currentTarget.style.borderColor = "#9333ea";
            }}
          >
            Add to Selected Stack
          </Button>
        </div>
      </Modal>

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
    </>
  );
};

export default AddToCollectionModal;
