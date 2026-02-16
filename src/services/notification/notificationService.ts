import supabase from "../../lib/supabase";

export type NotificationType =
  | "tool_added"
  | "tool_removed"
  | "stack_created"
  | "stack_deleted"
  | "welcome_new_user"
  | "tool_added_to_stack"
  | "tool_removed_from_stack"
  | "share_invite"
  | "share_success"
  | "share_accepted"
  | "reward_request"
  | "subscription_added"
  | "reminder_setting_updated"
  | "subscription_added"
  | "subscription_removed"
  | "subscription_reminder"
  | "subscription_renewed"
  | "subscription_updated"
  | "tool_deprecated"
  | "tool_shared"
  | "stack_shared"
  | "email_delivery_failure"
  | "claimed_reward";

export interface NotificationPayload {
  title: string;
  body: string;
  item_id?: string;
  item_type?: string;
  token?: string;
  icon: string;
  link: string;
  metadata?: Record<string, any>;
}

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  payload: NotificationPayload;
  relatedToken?: string;
}

export const createNotificationFunction = async ({
  userId,
  type,
  payload,
  relatedToken,
}: CreateNotificationParams) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  const content = JSON.stringify(payload);

  await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      type,
      content,
      related_token: relatedToken || null,
      read: false,
      created_at: new Date().toISOString(),
    }),
  });
};

class NotificationService {
  /**
   * Create a notification in the database
   */
  async createNotification({
    userId,
    type,
    payload,
    relatedToken,
  }: CreateNotificationParams): Promise<void> {
    try {
      await createNotificationFunction({
        userId,
        type,
        payload,
        relatedToken,
      });
    } catch (error) {
      console.error("Error creating notification via Edge Function:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Failed to mark notification as read:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) {
        console.error("Failed to mark all notifications as read:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        console.error("Failed to delete notification:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId: string, limit?: number) {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Failed to fetch notifications:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Event-specific notification creators

  /**
   * Tool added to library
   */
  async notifyToolAdded(
    userId: string,
    toolName: string,
    toolId?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "tool_added",
      payload: {
        title: "New Tool Successfully Added",
        body: `<strong>${toolName}</strong> is now available in your library. Explore it now!`,
        icon: "plus-circle",
        link: `/tools/${toolId}`,
        metadata: { toolId, toolName },
      },
    });
  }

  /**
   * Tool removed from library
   */
  async notifyToolRemoved(userId: string, toolName: string): Promise<void> {
    await this.createNotification({
      userId,
      type: "tool_removed",
      payload: {
        title: "Tool Removed from Your Library",
        body: `<strong>${toolName}</strong> has been removed from your library. You can always re-add it later if needed.`,
        icon: "minus-circle",
        link: "/library",
        metadata: { toolName },
      },
    });
  }

  /**
   * New stack created
   */
  async notifyStackCreated(
    userId: string,
    stackName: string,
    stackId?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "stack_created",
      payload: {
        title: "New Stack Successfully Created",
        body: `Your stack <strong>${stackName}</strong> is ready to use. Start organizing your tools now.`,
        icon: "layers",
        link: `/stacks/${stackId}`,
        metadata: { stackId, stackName },
      },
    });
  }

  /**
   * Stack deleted
   */
  async notifyStackDeleted(userId: string, stackName: string): Promise<void> {
    await this.createNotification({
      userId,
      type: "stack_deleted",
      payload: {
        title: "Stack Removed from Your Library",
        body: `The stack <strong>${stackName}</strong> has been successfully deleted.`,
        icon: "trash",
        link: "/stacks",
        metadata: { stackName },
      },
    });
  }

  /**
   * Tool added to stack
   */
  async notifyToolAddedToStack(
    userId: string,
    toolName: string,
    stackName: string,
    stackId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "tool_added_to_stack",
      payload: {
        title: "Tool Successfully Added to Stack",
        body: `<strong>${toolName}</strong> has been added to your <strong>${stackName}</strong> stack. Check it out to manage or customize.`,
        icon: "plus",
        link: `/stacks/${stackId}`,
        metadata: { toolName, stackName, stackId },
      },
    });
  }

  /**
   * Tool removed from stack
   */
  async notifyToolRemovedFromStack(
    userId: string,
    toolName: string,
    stackName: string,
    stackId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "tool_removed_from_stack",
      payload: {
        title: "Tool Removed from Your Stack",
        body: `<strong>${toolName}</strong> has been removed from your <strong>${stackName}</strong> stack.`,
        icon: "minus",
        link: `/stacks/${stackId}`,
        metadata: { toolName, stackName, stackId },
      },
    });
  }

  /**
   *  Share invite received
   */

  async notifyItemShared(
    userId: string,
    sharedBy: string,
    itemType: "tool" | "stack",
    itemId: string,
    shareToken: string
  ) {
    const title =
      itemType === "tool" ? "Tool Shared with You" : "Stack Shared with You";

    const body = `<strong>${sharedBy}</strong> shared a <strong>${itemType}</strong> with you.`;

    await this.createNotification({
      userId,
      type: `${itemType}_shared` as NotificationType,
      payload: {
        title,
        body,
        token: shareToken,
        item_id: itemId,
        item_type: itemType,
        icon: itemType === "tool" ? "share" : "folder-share",
        link: "",
        metadata: {
          sharedBy,
          itemType,
        },
      },
    });
  }

  /**
   * Share invite received
   */
  // async notifyShareInvite(
  //   userId: string,
  //   itemType: string,
  //   shareToken: string,
  //   sharedBy?: string
  // ): Promise<void> {
  //   await this.createNotification({
  //     userId,
  //     type: "share_invite",
  //     payload: {
  //       title: `You've Been Invited to a Shared ${itemType}`,
  //       body: sharedBy
  //         ? `${sharedBy} has invited you to collaborate on a ${itemType}.`
  //         : `You've received an invitation to access a shared ${itemType}.`,
  //       icon: "share",
  //       link: `/share/${shareToken}`,
  //       metadata: { itemType, sharedBy },
  //     },
  //     relatedToken: shareToken,
  //   });
  // }

  /**
   * Share successful
   */
  async notifyShareSuccess(
    userId: string,
    itemType: string,
    recipientName: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "share_success",
      payload: {
        title: "Share Successful",
        body: `Your <strong>${itemType}</strong> was successfully shared with <strong>${recipientName}</strong>.`,
        icon: "check-circle",
        link: "/library",
        metadata: { itemType, recipientName },
      },
    });
  }

  /**
   * Share accepted
   */
  async notifyShareAccepted(
    userId: string,
    itemType: string,
    acceptedBy: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "share_accepted",
      payload: {
        title: `${itemType} Access Accepted`,
        body: `<strong>${acceptedBy}</strong> has accepted your Shared <strong>${itemType}</strong>.`,
        icon: "user-check",
        link: "/library",
        metadata: { itemType, acceptedBy },
      },
    });
  }
  /**
   * Item added to user's library or stack
   */
  async notifyItemAddedSuccess(
    userId: string,
    itemType: "tool" | "stack",
    itemName: string
  ): Promise<void> {
    const capitalizedItemType =
      itemType.charAt(0).toUpperCase() + itemType.slice(1);

    await this.createNotification({
      userId,
      type: itemType === "tool" ? "tool_added" : "stack_created",
      payload: {
        title: `${capitalizedItemType} Added Successfully`,
        body: `<strong>${itemName}</strong> has been successfully added to your ${itemType}.`,
        icon: itemType === "tool" ? "plus-circle" : "layers",
        link: `/${itemType}s}`,
        metadata: { itemType, itemName },
      },
    });
  }

  /**
   * New subscription added
   */
  async notifySubscriptionAdded(
    userId: string,
    toolName: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "subscription_added",
      payload: {
        title: "You're Subscribed!",
        body: `Your subscription to <strong>${toolName}</strong> has been successfully activated. A renewal reminder will be sent 7 days before your next billing date.`,
        icon: "credit-card",
        link: `/subscriptions`,
        metadata: { toolName },
      },
    });
  }

  /**
   * Subscription updated
   */
  async notifySubscriptionUpdated(
    userId: string,
    toolName: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "subscription_updated",
      payload: {
        title: "Subscription Updated",
        body: `Your subscription to <strong>${toolName}</strong> has been updated.`,
        icon: "edit",
        link: "/subscriptions",
        metadata: { toolName },
      },
    });
  }

  /**
   * Subscription removed
   */
  async notifySubscriptionRemoved(
    userId: string,
    toolName: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "subscription_removed",
      payload: {
        title: "Subscription Removed",
        body: `Your subscription to <strong>${toolName}</strong> has been successfully removed. You can resubscribe at any time from your subscriptions page.`,
        icon: "credit-card",
        link: "/subscriptions",
        metadata: { toolName },
      },
    });
  }

  /**
   * Reminder setting updated
   */
  async notifyReminderSettingUpdated(
    userId: string,
    toolName: string,
    timing?: string,
    timeOfDay?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "reminder_setting_updated",
      payload: {
        title: "Reminder Setting Updated",
        body: `Your reminder for <strong>${toolName}</strong> has been updated. You'll be notified ${timing?.replace(
          "-",
          " "
        )}${
          timeOfDay ? ` at <strong>${timeOfDay}</strong>` : ""
        } before the billing date.`,
        icon: "clock",
        link: `/subscriptions`,
        metadata: { toolName, timing, timeOfDay },
      },
    });
  }

  /**
   * Subscription bill reminder
   */
  async notifySubscriptionReminder(
    userId: string,
    toolName: string,
    amount: number,
    dueDate: string,
    subscriptionId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "subscription_reminder",
      payload: {
        title: "Upcoming Subscription Payment",
        body: `Heads up! Your <strong>${toolName}</strong> subscription payment of <strong>$${amount.toFixed(
          2
        )}</strong> is due on <strong>${new Date(
          dueDate
        ).toLocaleDateString()}</strong>.`,
        icon: "clock",
        link: `/subscriptions/${subscriptionId}`,
        metadata: { toolName, amount, dueDate, subscriptionId },
      },
    });
  }

  /**
   * Subscription renewed
   */
  async notifySubscriptionRenewed(
    userId: string,
    toolName: string,
    nextBillDate: string,
    subscriptionId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "subscription_renewed",
      payload: {
        title: "Subscription Successfully Renewed",
        body: `You subscription to <strong>${toolName}</strong> has been updated. Your next billing date is <strong>${new Date(
          nextBillDate
        ).toLocaleDateString()}</strong>.`,
        icon: "refresh-cw",
        link: `/subscriptions/${subscriptionId}`,
        metadata: { toolName, nextBillDate, subscriptionId },
      },
    });
  }
  /**
   * Tool deprecated
   */
  async notifyToolDeprecated(
    userId: string,
    toolName: string,
    toolId: string,
    reason?: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "tool_deprecated",
      payload: {
        title: "Tool No Longer Available",
        body: `${toolName} in your library is no longer available${
          reason ? `: ${reason}` : "."
        }.`,
        icon: "alert-triangle",
        link: `/tools/${toolId}`,
        metadata: { toolName, toolId, reason },
      },
    });
  }

  /**
   * Email delivery failure
   */
  async notifyEmailDeliveryFailure(
    userId: string,
    subject: string,
    reason: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "email_delivery_failure",
      payload: {
        title: "Email Delivery Failed",
        body: `Failed to deliver "${subject}": ${reason}`,
        icon: "mail-x",
        link: "/settings/notifications",
        metadata: { subject, reason },
      },
    });
  }

  //notif-welcome new user

  async notifyWelcomeNewUser(userId: string, userName?: string): Promise<void> {
    await this.createNotification({
      userId,
      type: "welcome_new_user",
      payload: {
        title: `Welcome${userName ? `, ${userName}` : ""}!`,
        body: `We're thrilled to have you on board! Explore powerful tools, build your personal stack, and start unlocking rewards through daily streaks, referrals, and more. Your journey to smarter productivity starts here.`,
        icon: "smile",
        link: "/getting-started",
        metadata: { userName },
      },
    });
  }

  /**
   * Reward successfully claimed
   */
  async notifyClaimedReward(
    userId: string,
    rewardName: string,
    pointsUsed: number
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: "claimed_reward",
      payload: {
        title: "Reward Claimed Successfully",
        body: `You've just claimed the <strong>${rewardName}</strong> reward! 🎉 <strong>${pointsUsed}</strong> point${
          pointsUsed !== 1 ? "s" : ""
        } have been deducted from your total.`,
        icon: "gift",
        link: "/rewards/history",
        metadata: { rewardName, pointsUsed },
      },
    });
  }

  // reward request
  async notifyRewardClaimed(userId: string, points: number): Promise<void> {
    await this.createNotification({
      userId,
      type: "reward_request",
      payload: {
        title: "Reward Claim Submitted 🎁",
        body: `Your claim for <strong>${points}</strong> Flowva points has been submitted. Once verified, the points will be added to your account. 🎉`,
        icon: "",
        link: "/rewards",
        metadata: { points },
      },
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
