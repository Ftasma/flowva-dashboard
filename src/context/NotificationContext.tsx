import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import supabase from "../lib/supabase";
import notificationService from "../services/notification/notificationService";
import type {
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
  RealtimePostgresDeletePayload,
} from "@supabase/supabase-js";

import { useMemo } from "react";

export interface NotificationRecord {
  id: string;
  user_id: string;
  type: string;
  content: string;
  related_token: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: NotificationRecord[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  highPriorityCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  refresh: () => void;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
        prev.map((n) => {
          if (n.id !== id) return n;
          return n.read ? n : { ...n, read: true };
        })
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
      setNotifications((prev) =>
        prev.map((n) => (n.read ? n : { ...n, read: true }))
      );
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

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time updates
  useEffect(() => {
    const setupRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("notifications:realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
          },
          (
            payload:
              | RealtimePostgresInsertPayload<NotificationRecord>
              | RealtimePostgresUpdatePayload<NotificationRecord>
              | RealtimePostgresDeletePayload<NotificationRecord>
          ) => {
            const record = (payload.new || payload.old) as NotificationRecord;

            if (record.user_id !== user.id) return;

            if (payload.eventType === "INSERT") {
              setNotifications((prev) => {
                const seen = new Set<string>();
                const newNotification = payload.new as NotificationRecord;

                const combined = [newNotification, ...prev];

                const deduped = combined.filter((n) => {
                  if (seen.has(n.id)) return false;
                  seen.add(n.id);
                  return true;
                });

                return deduped;
              });
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) => {
                  if (n.id !== payload.new?.id) return n;

                  const updated = payload.new as NotificationRecord;

                  // Preserve "read: true" if already marked read
                  return {
                    ...updated,
                    read: n.read || updated.read,
                  };
                })
              );
            } else if (payload.eventType === "DELETE") {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old?.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const highPriorityCount = useMemo(
    () =>
      notifications.filter(
        (n) =>
          !n.read &&
          [
            "share_invite",
            "subscription_reminder",
            "tool_deprecated",
            "email_delivery_failure",
          ].includes(n.type)
      ).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
}
