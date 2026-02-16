import { Modal } from "antd";
import {
  Notification,
  NotificationContent,
  formatNotificationTime,
  getNotificationStyle,
  renderIcon,
} from "../../utils/notifications/notifications.utils";
import NotificationContentModal from "./NotificationContentModal";
import { useEffect, useRef, useState } from "react";
import ConfirmationModal from "../dashboard/Modals/ConfirmationModal";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { IconButton } from "@mui/material";

interface AllNotificationsModalProps {
  onClose: () => void;
  notifications: Notification[];
  handleNotificationClick: (notification: Notification) => void;
  deleteAllNotifications: () => Promise<void>;
  loading: boolean;
  openModal: boolean;
  handleConfirmDelete: () => void;
  handleCloseModal: () => void;
  handleDeleteAll: () => void;
  setNotificationToDelete: React.Dispatch<
    React.SetStateAction<Notification | null>
  >;
  setDeleteMode: React.Dispatch<React.SetStateAction<"single" | "all" | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteMode: "single" | "all" | null;
  processingNotifications: Set<string>;
}

function AllNotificationsModal({
  onClose,
  notifications,
  handleNotificationClick,
  handleConfirmDelete,
  setNotificationToDelete,
  processingNotifications,
  handleCloseModal,
  handleDeleteAll,
  setOpenModal,
  setDeleteMode,
  openModal,
  deleteMode,
  setOpen,
  loading,
}: AllNotificationsModalProps) {
  const [view, setView] = useState<boolean>(false);
  const [content, setContent] = useState<Notification | null>(null);
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMessageRead = (notification: Notification) => {
    setContent(notification);
    handleNotificationClick(notification);
    setView(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setOpenMoreMenuId(null); // close the open more menu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <p>All Notifications</p>{" "}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="mr-10 text-sm text-gray-400 hover:text-red-600"
            >
              Delete All
            </button>
          )}
        </div>
      }
      styles={{
        footer: {
          display: "flex",
          justifyContent: "center",
        },
        body: {
          padding: "0px",
        },
        content: {
          padding: "22px",
        },
      }}
      open={true}
      onCancel={onClose}
      centered
      footer={[
        <button
          key="close"
          className="rounded-[100px] p-[0.70rem_.5rem]  md:p-[0.75rem_1rem] text-xs font-semibold flex justify-center items-center gap-2 min-w-[120px] whitespace-nowrap border-none md:text-[0.95rem] transition-all duration-200 bg-[#9013FE] hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px] text-white"
          onClick={onClose}
        >
          Close
        </button>,
      ]}
      width={500}
    >
      <div className="all-notifications-list ">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const content: NotificationContent = JSON.parse(
              notification.content
            );
            const style = getNotificationStyle(notification.type);
            const isProcessing = processingNotifications.has(notification.id);
            return (
              <div
                onClick={() => {
                  handleMessageRead(notification);
                }}
                key={notification.id}
                className={`notification-list-item  cursor-pointer flex justify-between ${
                  !notification.read ? "unread" : ""
                } `}
              >
                <div className="notification-list-content  min-w-[190px]  ">
                  <div
                    className="notification-list-icon"
                    style={{
                      backgroundColor: style.backgroundColor,
                      color: style.color,
                    }}
                  >
                    {renderIcon(style.icon)}
                  </div>
                  <div className="notification-list-info">
                    <div className="notification-list-title">
                      {content.title}
                    </div>
                    <div className="notification-list-body truncate max-w-[190px]  md:max-w-[300px]">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: content.body,
                        }}
                      />
                    </div>
                    <div className="notification-list-time">
                      {/* {new Date(notification.created_at).toLocaleDateString()} */}
                      {formatNotificationTime(notification.created_at)}
                    </div>
                  </div>
                </div>
                <div className="notification-actions">
                  <div className="relative">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMoreMenuId((prev) =>
                          prev === notification.id ? null : notification.id
                        );
                      }}
                    >
                      <MoreHorizOutlinedIcon sx={{ fontSize: "15px" }} />
                    </IconButton>

                    {openMoreMenuId === notification.id && (
                      <div className="absolute right-0 top-full mt-2 z-10 min-w-[100px] rounded-md bg-white shadow-lg border p-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotificationToDelete(notification);
                            setDeleteMode("single");
                            setOpenModal(true);
                            setOpenMoreMenuId(null);
                          }}
                          disabled={isProcessing}
                          className="w-full text-left px-2 py-1 flex items-center text-sm text-black hover:text-red-600 hover:bg-gray-100"
                        >
                          <FontAwesomeIcon
                            className=" mr-2 text-xs"
                            icon={Icons.Trash}
                          />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="notification-empty">No notifications available</div>
        )}

        <NotificationContentModal
          data={content}
          modalOpen={view}
          setModalOpen={(open) => {
            if (!open) setContent(null);
            setView(open);
          }}
        />

        <ConfirmationModal
          message={`Are you sure you want to delete ${
            deleteMode === "all" ? "all messages" : "this message"
          }?`}
          title="Confirm Deletion"
          visible={openModal}
          loading={loading}
          onClose={handleCloseModal}
          onClick={handleConfirmDelete}
        />
      </div>
    </Modal>
  );
}

export default AllNotificationsModal;
