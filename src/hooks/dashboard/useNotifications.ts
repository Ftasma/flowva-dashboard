// hooks/dashboard/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import supabase from "../../lib/supabase";
import notificationService from "../../services/notification/notificationService";
// import { notificationService } from "../../services/notificationService";

export interface NotificationRecord {
  id: string;
  user_id: string;
  type: string;
  content: string;
  related_token: string | null;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      const data = await notificationService.getUserNotifications(user.id);
      setNotifications(data as NotificationRecord[]);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError(err instanceof Error ? err.message : "Failed to mark as read");
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await notificationService.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError(
        err instanceof Error ? err.message : "Failed to mark all as read"
      );
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete notification"
      );
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setNotifications((prev) => [
                payload.new as NotificationRecord,
                ...prev,
              ]);
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.new.id
                    ? (payload.new as NotificationRecord)
                    : n
                )
              );
            } else if (payload.eventType === "DELETE") {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter((n) => {
    if (n.read) return false;
    const highPriorityTypes = [
      "share_invite",
      "subscription_reminder",
      "tool_deprecated",
      "email_delivery_failure",
    ];
    return highPriorityTypes.includes(n.type);
  }).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    highPriorityCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications,
    clearError,
  };
}
