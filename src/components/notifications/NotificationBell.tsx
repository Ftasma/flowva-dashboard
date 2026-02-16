import { useState, useRef, useEffect } from "react";
import NotificationSettingsModal from "./NotificationSettings";
import AllNotificationsModal from "./AllNotificationsModal";
import { toast } from "react-toastify";
import {
  Notification,
  NotificationContent,
  getNotificationStyle,
  renderIcon,
  formatNotificationTime,
  getNotificationPriority,
} from "../../utils/notifications/notifications.utils";
import "./notifications.css";
import { useNotificationContext } from "../../context/NotificationContext";
import NotificationContentModal from "./NotificationContentModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { IconButton } from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ConfirmationModal from "../dashboard/Modals/ConfirmationModal";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError,
  } = useNotificationContext();

  const [open, setOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] =
    useState<Notification | null>(null);
  const [deleteMode, setDeleteMode] = useState<"single" | "all" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openMoreMenuId, setOpenMoreMenuId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [processingNotifications, setProcessingNotifications] = useState<
    Set<string>
  >(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [view, setView] = useState<boolean>(false);
  const [content, setContent] = useState<Notification | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

  const highPriorityTypes = [
    "share_invite",
    "subscription_reminder",
    "tool_deprecated",
    "email_delivery_failure",
  ];

  const [localHighPriorityCount, setLocalHighPriorityCount] = useState(
    notifications.filter((n) => !n.read && highPriorityTypes.includes(n.type))
      .length
  );

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setLocalUnreadCount(unread);

    const highPriority = notifications.filter(
      (n) => !n.read && highPriorityTypes.includes(n.type)
    ).length;
    setLocalHighPriorityCount(highPriority);
  }, [notifications]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = () => setOpen((o) => !o);
  const isPulsing = localUnreadCount > 0;
  const hasHighPriority = localHighPriorityCount > 0;

  const handleMarkAllAsRead = async () => {
    if (localUnreadCount === 0) return;

    setIsMarkingAllAsRead(true);
    setLocalUnreadCount(0);

    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
      setLocalUnreadCount(unreadCount); // Revert on error
    } finally {
      setIsMarkingAllAsRead(false);
    }
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

  const handleNotificationClick = async (notification: Notification) => {
    setView(open);
    setContent(notification);
    if (processingNotifications.has(notification.id)) return;

    if (!notification.read) {
      setProcessingNotifications((prev) => new Set(prev).add(notification.id));

      try {
        await markAsRead(notification.id);
      } catch (err) {
        toast.error("Failed to mark as read");
      } finally {
        setProcessingNotifications((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notification.id);
          return newSet;
        });
      }
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (notifications.length === 0) return;

    setProcessingNotifications(new Set(notifications.map((n) => n.id)));

    try {
      await Promise.all(notifications.map((n) => deleteNotification(n.id)));

      toast.success("All notifications deleted");
    } catch (err) {
      toast.error("Failed to delete all notifications");
    } finally {
      setProcessingNotifications(new Set());
    }
  };

  const handleDeleteNotification = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (processingNotifications.has(notificationId)) return;

    setProcessingNotifications((prev) => new Set(prev).add(notificationId));

    try {
      await deleteNotification(notificationId);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    } finally {
      setProcessingNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      if (deleteMode === "single" && notificationToDelete) {
        await handleDeleteNotification(
          notificationToDelete.id,
          new MouseEvent("click") as any
        );
        setNotificationToDelete(null);
      } else if (deleteMode === "all") {
        await handleDeleteAllNotifications();
      }
    } catch (err) {
      console.error("Deletion failed", err);
      toast.error("Failed to delete notification(s)");
    } finally {
      setDeleting(false);
      setOpenModal(false);
      setDeleteMode(null);
    }
  };

  const handleCloseModal = () => {
    setNotificationToDelete(null);
    setDeleteMode(null);
    setOpenModal(false);
  };

  const displayedNotifications = notifications.slice(0, 3);
  const shouldShowViewAll = notifications.length >= 4;

  const handleDeleteAll = () => {
    setDeleteMode("all");
    setOpenModal(true);
  };

  return (
    <>
      <div className="notification-container group" ref={containerRef}>
        <button
          className={`notification-bell ${isPulsing ? "has-unread" : ""} ${
            hasHighPriority ? "high-priority" : ""
          }`}
          onClick={togglePopup}
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <FontAwesomeIcon
            className="text-[#2D3748] group-hover:text-[#9013fe]"
            icon={Icons.Bell}
          />
          {localUnreadCount > 0 && (
            <span
              className={`notification-badge ${
                hasHighPriority ? "high-priority" : ""
              }`}
            >
              {localUnreadCount > 99 ? "99+" : localUnreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="notification-popup active">
            <div className="notification-header">
              <div className="notification-title">
                Notifications
                {localHighPriorityCount > 0 && (
                  <span
                    className="priority-indicator"
                    title="High priority notifications"
                  >
                    {localHighPriorityCount}
                  </span>
                )}
              </div>
              <div className="notification-actions">
                <button
                  className="notification-action"
                  disabled={isMarkingAllAsRead || localUnreadCount === 0}
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                >
                  {isMarkingAllAsRead ? "Marking..." : "Mark all as read"}
                </button>

                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="notification-action"
                    title="Notification settings"
                  >
                    Delete All
                  </button>
                )}
              </div>
            </div>

            <div className="notification-body">
              {loading ? (
                <div className="notification-loading">
                  <div className="loading-spinner" />
                  <span>Loading notifications...</span>
                </div>
              ) : displayedNotifications.length > 0 ? (
                displayedNotifications.map((notification: Notification) => {
                  const content: NotificationContent = JSON.parse(
                    notification.content
                  );
                  const style = getNotificationStyle(notification.type);
                  const priority = getNotificationPriority(notification.type);
                  const isProcessing = processingNotifications.has(
                    notification.id
                  );

                  return (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      } ${priority === "high" ? "high-priority" : ""} ${
                        isProcessing ? "processing" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-content">
                        <div
                          className="notification-icon"
                          style={{
                            backgroundColor: style.backgroundColor,
                            color: style.color,
                          }}
                        >
                          {renderIcon(style.icon)}
                        </div>
                        <div className="notification-info">
                          <div className="notification-message">
                            <div>
                              <strong>{content.title}</strong>
                              <p className="truncate max-w-[210px]  md:max-w-[300px]">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: content.body,
                                  }}
                                />
                              </p>
                            </div>
                          </div>
                          <div className="notification-time">
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
                                prev === notification.id
                                  ? null
                                  : notification.id
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
                <div className="notification-empty">
                  <div className="empty-icon">🔔</div>
                  <div className="empty-text">No notifications</div>
                  <div className="empty-subtext">You're all caught up!</div>
                </div>
              )}
            </div>

            {shouldShowViewAll && (
              <div className="notification-footer">
                <button
                  className="view-all"
                  onClick={() => setIsAllNotificationsOpen(true)}
                >
                  View all notifications ({notifications.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isSettingsOpen && (
        <NotificationSettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
      {isAllNotificationsOpen && (
        <AllNotificationsModal
          onClose={() => setIsAllNotificationsOpen(false)}
          notifications={notifications}
          loading={deleting}
          handleConfirmDelete={handleConfirmDelete}
          setDeleteMode={setDeleteMode}
          handleCloseModal={handleCloseModal}
          deleteMode={deleteMode}
          handleDeleteAll={handleDeleteAll}
          openModal={openModal}
          setOpenModal={setOpenModal}
          processingNotifications={processingNotifications}
          setOpen={setOpen}
          setNotificationToDelete={setNotificationToDelete}
          handleNotificationClick={handleNotificationClick}
          deleteAllNotifications={handleDeleteAllNotifications}
        />
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
        loading={deleting}
        onClose={handleCloseModal}
        onClick={handleConfirmDelete}
      />
    </>
  );
}
