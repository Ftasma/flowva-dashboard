import supabase from "../../lib/supabase";
import notificationService from "../../services/notification/notificationService";

/**
 * Helper functions to trigger notifications for various app events
 * These functions should be called from your existing business logic
 */

export class NotificationHelpers {
  /**
   * Get current user ID
   */
  private static async getCurrentUserId(): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  }

  /**
   * Library Management Events
   */
  static async onToolAdded(toolName: string, userId?: string, toolId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyToolAdded(currentUserId, toolName, toolId);
  }

  static async onToolRemoved(toolName: string, userId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyToolRemoved(currentUserId, toolName);
  }

  /**
   * Stack Management Events
   */
  static async onStackCreated(
    stackName: string,
    userId: string,
    stackId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyStackCreated(
      currentUserId,
      stackName,
      stackId
    );
  }

  static async onStackDeleted(stackName: string, userId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyStackDeleted(currentUserId, stackName);
  }

  static async onToolAddedToStack(
    toolName: string,
    stackName: string,
    stackId: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyToolAddedToStack(
      currentUserId,
      toolName,
      stackName,
      stackId
    );
  }

  static async onToolRemovedFromStack(
    toolName: string,
    stackName: string,
    stackId: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyToolRemovedFromStack(
      currentUserId,
      toolName,
      stackName,
      stackId
    );
  }

  /**
   * Welcome Event
   */
  static async onWelcomeNewUser(userId?: string, userName?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await this.sendNotificationIfEnabled(
      currentUserId,
      "welcome_new_user",
      () => notificationService.notifyWelcomeNewUser(currentUserId, userName)
    );
  }

  /**
   * Reward Claimed Event
   */
  static async onRewardClaimed(
    rewardName: string,
    pointsUsed: number,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await this.sendNotificationIfEnabled(currentUserId, "claimed_reward", () =>
      notificationService.notifyClaimedReward(
        currentUserId,
        rewardName,
        pointsUsed
      )
    );
  }
  /**
   * Request reward
   */

  static async onRewardClaimRequest(points: number, userId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyRewardClaimed(currentUserId, points);
  }
  /**
   * Sharing Events
   */
  // static async onShareInviteSent(
  //   recipientUserId: string,
  //   itemType: string,
  //   shareToken: string,
  //   sharedByUser?: string
  // ) {
  //   await notificationService.notifyShareInvite(
  //     recipientUserId,
  //     itemType,
  //     shareToken,
  //     sharedByUser
  //   );
  // }

  static async onItemShared(
    userId: string,
    sharedBy: string,
    itemType: "tool" | "stack",
    itemId: string,
    shareToken: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;
    await notificationService.notifyItemShared(
      currentUserId,
      sharedBy,
      itemType,
      itemId,
      shareToken
    );
  }

  static async onShareSuccess(
    itemType: string,
    recipientName: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyShareSuccess(
      currentUserId,
      itemType,
      recipientName
    );
  }

  static async onShareAccepted(
    ownerUserId: string,
    itemType: string,
    acceptedByUser: string
  ) {
    await notificationService.notifyShareAccepted(
      ownerUserId,
      itemType,
      acceptedByUser
    );
  }

  static async onShareItemAdded(
    userId: string,
    itemType: "tool" | "stack",
    itemName: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyItemAddedSuccess(
      currentUserId,
      itemType,
      itemName
    );
  }

  /**
   * Subscription Events
   */
  static async onSubscriptionAdded(toolName: string, userId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifySubscriptionAdded(currentUserId, toolName);
  }

  static async onSubscriptionReminderUpdated(
    toolName: string,
    userId?: string,
    timing?: string,
    timeOfDay?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;
    await notificationService.notifyReminderSettingUpdated(
      currentUserId,
      toolName,
      timing,
      timeOfDay
    );
  }

  static async onSubscriptionRemoved(toolName: string, userId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifySubscriptionRemoved(
      currentUserId,
      toolName
    );
  }

  static async onSubscriptionUpdated(toolName: string, userId?: string) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifySubscriptionUpdated(
      currentUserId,
      toolName
    );
  }

  static async onSubscriptionReminder(
    toolName: string,
    amount: number,
    dueDate: string,
    subscriptionId: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifySubscriptionReminder(
      currentUserId,
      toolName,
      amount,
      dueDate,
      subscriptionId
    );
  }

  static async onSubscriptionRenewed(
    toolName: string,
    nextBillDate: string,
    subscriptionId: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifySubscriptionRenewed(
      currentUserId,
      toolName,
      nextBillDate,
      subscriptionId
    );
  }

  /**
   * Alert Events
   */
  static async onToolDeprecated(
    toolName: string,
    toolId: string,
    reason?: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyToolDeprecated(
      currentUserId,
      toolName,
      toolId,
      reason
    );
  }

  static async onEmailDeliveryFailure(
    subject: string,
    reason: string,
    userId?: string
  ) {
    const currentUserId = userId || (await this.getCurrentUserId());
    if (!currentUserId) return;

    await notificationService.notifyEmailDeliveryFailure(
      currentUserId,
      subject,
      reason
    );
  }

  /**
   * Batch notification helpers for multiple users
   */
  static async notifyMultipleUsers(
    userIds: string[],
    notificationFn: (userId: string) => Promise<void>
  ) {
    const promises = userIds.map((userId) => notificationFn(userId));
    await Promise.allSettled(promises);
  }

  /**
   * Utility to check if notifications are enabled for a user
   */
  static async areNotificationsEnabled(
    userId: string,
    notificationType?: string
  ): Promise<boolean> {
    try {
      // Check if user has notifications enabled in their settings
      const { data, error } = await supabase
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        // Default to enabled if no settings found
        return true;
      }

      // Check specific notification type if provided
      if (notificationType && data[notificationType] !== undefined) {
        return data[notificationType];
      }

      // Check general notifications enabled
      return data.notifications_enabled !== false;
    } catch (error) {
      console.error("Error checking notification settings:", error);
      return true; // Default to enabled on error
    }
  }

  /**
   * Smart notification sender that respects user preferences
   */
  static async sendNotificationIfEnabled(
    userId: string,
    notificationType: string,
    notificationFn: () => Promise<void>
  ) {
    const isEnabled = await this.areNotificationsEnabled(
      userId,
      notificationType
    );
    if (isEnabled) {
      await notificationFn();
    }
  }
}

/**
 * Example usage in your business logic:
 *
 * // When adding a tool to library
 * await NotificationHelpers.onToolAdded("Figma", "tool-123");
 *
 * // When creating a stack
 * await NotificationHelpers.onStackCreated("Design Stack", "stack-456");
 *
 * // When sharing an item
 * await NotificationHelpers.onShareInviteSent(
 *   recipientUserId,
 *   "stack",
 *   shareToken,
 *   "John Doe"
 * );
 *
 * // When subscription is due
 * await NotificationHelpers.onSubscriptionReminder(
 *   "Figma",
 *   15.00,
 *   "2025-07-01",
 *   "sub-789"
 * );
 */

export default NotificationHelpers;
