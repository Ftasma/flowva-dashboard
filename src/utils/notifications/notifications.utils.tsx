import React from "react";

import {
  PlusCircle,
  MinusCircle,
  Layers,
  Trash,
  Plus,
  Minus,
  Share,
  CheckCircle,
  UserCheck,
  CreditCard,
  Clock,
  RefreshCw,
  AlertTriangle,
  MailX,
  Bell,
  User,
  Package,
  Gift,
  Smile,
  Target,
  Flame,
} from "lucide-react";

export interface Notification {
  id: string;
  content: string;
  type: string;
  read: boolean;
  created_at: string;
  related_token?: string | null;
  user_id?: string;
}

interface NotificationStyle {
  backgroundColor: string;
  color: string;
  icon: string;
}

export interface NotificationContent {
  title: string;
  body: string;
  icon: string;
  link: string;
  metadata?: Record<string, any>;
}

export const getNotificationStyle = (type: string): NotificationStyle => {
  const styles: Record<string, NotificationStyle> = {
    // Library management
    tool_added: {
      backgroundColor: "#e7f5e7",
      color: "#2d7d32",
      icon: "plus-circle",
    },
    tool_removed: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      icon: "minus-circle",
    },
    //reward
    claimed_reward: {
      backgroundColor: "#e7f5e7",
      color: "#2d7d32",
      icon: "gift",
    },
    reward: {
      backgroundColor: "#e7f5e7",
      color: "#2d7d32",
      icon: "gift",
    },
    referral_milestone: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      icon: "target",
    },

    //welcome new user
    welcome_new_user: {
      backgroundColor: "#e7f5e7",
      color: "#2d7d32",
      icon: "smile",
    },

    // Stack management
    stack_created: {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      icon: "layers",
    },
    stack_deleted: {
      backgroundColor: "#fce4ec",
      color: "#ad1457",
      icon: "trash",
    },
    tool_added_to_stack: {
      backgroundColor: "#f3e5f5",
      color: "#7b1fa2",
      icon: "plus",
    },
    tool_removed_from_stack: {
      backgroundColor: "#fff3e0",
      color: "#ef6c00",
      icon: "minus",
    },

    // Sharing
    share_invite: {
      backgroundColor: "#f3e8ff",
      color: "#9013fe",
      icon: "user-plus",
    },
    share_success: {
      backgroundColor: "#e7f5e7",
      color: "#2d7d32",
      icon: "check-circle",
    },
    share_accepted: {
      backgroundColor: "#e1f5fe",
      color: "#0277bd",
      icon: "user-check",
    },

    // Subscriptions
    subscription_added: {
      backgroundColor: "#f3e5f5",
      color: "#7b1fa2",
      icon: "credit-card",
    },
    subscription_updated: {
      backgroundColor: "#f3e5f5",
      color: "#7b1fa2",
      icon: "credit-card",
    },
    subscription_removed: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      icon: "credit-card",
    },
    subscription_reminder: {
      backgroundColor: "#fff8e1",
      color: "#f57c00",
      icon: "clock",
    },
    reminder_setting_updated: {
      backgroundColor: "#e7f5e7",
      color: "#2d7d32",
      icon: "clock",
    },
    subscription_renewed: {
      backgroundColor: "#e8f5e8",
      color: "#2e7d32",
      icon: "refresh-cw",
    },

    // Alerts
    tool_deprecated: {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
      icon: "alert-triangle",
    },
    email_delivery_failure: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      icon: "mail-x",
    },
    streak_reminder: {
      backgroundColor: "#fed7aa",
      color: "#ea580c",
      icon: "flame",
    },
    // Default
    default: {
      backgroundColor: "#eef2ff",
      color: "#9013fe",
      icon: "info",
    },
  };

  return styles[type] || styles.default;
};

export const renderIcon = (iconName: string, size: number = 16) => {
  const iconProps = { size, strokeWidth: 2 };

  const icons: Record<string, React.ReactElement> = {
    "plus-circle": <PlusCircle {...iconProps} />,
    "minus-circle": <MinusCircle {...iconProps} />,
    layers: <Layers {...iconProps} />,
    trash: <Trash {...iconProps} />,
    plus: <Plus {...iconProps} />,
    minus: <Minus {...iconProps} />,
    share: <Share {...iconProps} />,
    "check-circle": <CheckCircle {...iconProps} />,
    "user-check": <UserCheck {...iconProps} />,
    "credit-card": <CreditCard {...iconProps} />,
    clock: <Clock {...iconProps} />,
    "refresh-cw": <RefreshCw {...iconProps} />,
    "alert-triangle": <AlertTriangle {...iconProps} />,
    "mail-x": <MailX {...iconProps} />,
    flame: <Flame {...iconProps} />,
    smile: <Smile {...iconProps} />,
    target: <Target />,
    gift: <Gift {...iconProps} />,
    bell: <Bell {...iconProps} />,
    user: <User {...iconProps} />,
    package: <Package {...iconProps} />,
  };
  const iconKey = iconName.toLowerCase();
  return icons[iconKey] || icons["bell"];
};

export const getNotificationPriority = (
  type: string
): "high" | "medium" | "low" => {
  const priorities: Record<string, "high" | "medium" | "low"> = {
    share_invite: "high",
    subscription_reminder: "high",
    tool_deprecated: "high",
    email_delivery_failure: "high",

    share_accepted: "medium",
    subscription_renewed: "medium",
    subscription_added: "medium",

    tool_added: "low",
    tool_removed: "low",
    stack_created: "low",
    stack_deleted: "low",
    tool_added_to_stack: "low",
    tool_removed_from_stack: "low",
    share_success: "low",
  };

  return priorities[type] || "medium";
};

export const formatNotificationTime = (timestamp: string): string => {
  const now = new Date();
  const notificationTime = new Date(
    timestamp.endsWith("Z") ? timestamp : timestamp + "Z"
  );

  if (isNaN(notificationTime.getTime())) {
    return "Invalid time";
  }

  const diffInSeconds = Math.floor(
    (now.getTime() - notificationTime.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return notificationTime.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: Record<string, Notification[]> = {};

  notifications.forEach((notification) => {
    const date = new Date(notification.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;

    if (date.toDateString() === today.toDateString()) {
      groupKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Yesterday";
    } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
      groupKey = "This week";
    } else {
      groupKey = date.toLocaleDateString();
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });

  return groups;
};
