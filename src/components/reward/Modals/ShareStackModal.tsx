import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { Icons } from "../../../icons";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import {
  Collection,
  useCollectionsContext,
} from "../../../context/CollectionsContext";
import { Share2 } from "lucide-react";
import ShareModal from "../../dashboard/Modals/ShareModal";

interface ModalData {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<
    React.SetStateAction<null | "try" | "review" | "share" | "tow">
  >;
}

export default function ShareStackModal({
  modalOpen,
  setModalOpen,
}: ModalData) {
  const { currentUser } = useCurrentUser();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState<string>("");
  const [data, setData] = useState<Collection>();
  const {
    collections,
    setUserId: setCollectionUserId,
  } = useCollectionsContext();

  useEffect(() => {
    if (currentUser) {
      setCollectionUserId(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <Modal
      width="100%"
      style={{ top: 20, maxWidth: 380, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      footer={null}
      centered
      onOk={() => setModalOpen(null)}
      onCancel={() => setModalOpen(null)}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Share Your Stack</h2>
        {collections.length === 0 && (
          <div className="flex justify-center">
            <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[#E9D4FF] text-[#9013FE]">
              <FontAwesomeIcon icon={Icons.layerGroup} />
            </div>
          </div>
        )}
        {collections.length > 0 ? (
          <p className="text-gray-600 mb-4">
            Share a stack to earn 25 points!
          </p>
        ) : (
          <p className="text-gray-600 mb-4">
            You have no stack created yet, go to Tech Stack to create one.
          </p>
        )}

        <div className="space-y-2 h-full m-h-[300px] overflow-y-auto">
          {collections.map((collection, index) => (
            <div
              key={index}
              onClick={() => {
                setShareItemId(collection.id.toString());
                setData(collection);
                setShareModalOpen(true)
              }}
              className="transition-all cursor-pointer duration-200 rounded-[12px] p-4 hover:bg-[rgba(144,19,254,0.05)] hover:-translate-y-0.5  flex items-center justify-between"
            >
              <div className="flex items-center">
                <div
                  className={`relative h-7 flex justify-center items-center w-7 rounded-md overflow-hidden text-white bg-[#9013fe]`}
                >
                  {collection.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-start">{collection.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="min-w-[80px] text-center px-2 py-1 rounded-full font-semibold text-sm bg-[#eef2ff] text-[#9013f3]">
                  +25 pts
                </span>
                <Share2 />
              </div>
            </div>
          ))}
        </div>
        {currentUser && (
          <ShareModal
            open={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            itemId={shareItemId}
            data={data}
            itemType={"collection"}
            userId={currentUser.id}
          />
        )}
      </div>
    </Modal>
  );
}
