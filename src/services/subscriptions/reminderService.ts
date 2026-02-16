import { ReminderSettings } from "../../components/dashboard/subscription/types";
import supabase from "../../lib/supabase";
import { toast } from "react-toastify";

// Save reminder settings for a specific subscription
export const saveReminderSettings = async (
  userId: string,
  subscriptionId: string,
  settings: ReminderSettings
): Promise<boolean> => {
  try {
    // First check if settings already exist
    const { data: existingSettings } = await supabase
      .from("reminder_settings")
      .select("id")
      .eq("user_id", userId)
      .eq("subscription_id", subscriptionId)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from("reminder_settings")
        .update({
          enabled: settings.enabled,
          timing: settings.timing,
          custom_days: settings.customDays,
          time_of_day: settings.timeOfDay,
          email_enabled: settings.email,
          app_enabled: settings.inApp,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id);

      if (error) throw error;
    } else {
      // Insert new settings
      const { error } = await supabase.from("reminder_settings").insert({
        user_id: userId,
        subscription_id: subscriptionId,
        enabled: settings.enabled,
        timing: settings.timing,
        custom_days: settings.customDays,
        time_of_day: settings.timeOfDay,
        email_enabled: settings.email,
        app_enabled: settings.inApp,
      });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("Error saving reminder settings:", error);
    return false;
  }
};

// Save global reminder settings
export const saveGlobalReminderSettings = async (
  userId: string,
  settings: ReminderSettings & { applyToAll: boolean }
): Promise<boolean> => {
  try {
    // Start a transaction - first update global settings
    const { error: globalError } = await supabase.rpc(
      "set_global_reminder_settings",
      {
        p_user_id: userId,
        p_enabled: settings.enabled,
        p_timing: settings.timing,
        p_custom_days: settings.customDays,
        p_time_of_day: settings.timeOfDay,
        p_email_enabled: settings.email,
        p_app_enabled: settings.inApp,
      }
    );

    if (globalError) throw globalError;

    // If apply to all is true, update all existing subscription reminders
    if (settings.applyToAll) {
      const { error: updateError } = await supabase
        .from("reminder_settings")
        .update({
          enabled: settings.enabled,
          timing: settings.timing,
          custom_days: settings.customDays,
          time_of_day: settings.timeOfDay,
          email_enabled: settings.email,
          app_enabled: settings.inApp,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error saving global reminder settings:", error);
    return false;
  }
};

// Get reminder settings for a specific subscription
export const getReminderSettings = async (
  userId: string,
  subscriptionId: string
): Promise<ReminderSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("reminder_settings")
      .select("*")
      .eq("user_id", userId)
      .eq("subscription_id", subscriptionId)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      enabled: data.enabled,
      timing: data.timing,
      customDays: data.custom_days,
      timeOfDay: data.time_of_day,
      email: data.email_enabled,
      inApp: data.app_enabled,
    };
  } catch (error) {
    console.error("Error getting reminder settings:", error);
    return null;
  }
};

// Get active reminders that need to be sent
export const getActiveReminders = async (userId: string): Promise<any[]> => {
  try {
    const today = new Date();

    // Query tools_subscriptions and reminder settings to find upcoming renewals
    const { data, error } = await supabase.rpc(
      "get_upcoming_renewal_reminders",
      {
        p_user_id: userId,
        p_current_date: today.toISOString(),
      }
    );

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error getting active reminders:", error);
    return [];
  }
};

// Send reminder notifications
export const sendReminderNotifications = async (
  userId: string
): Promise<void> => {
  try {
    const reminders = await getActiveReminders(userId);

    for (const reminder of reminders) {
      // Send email notification if enabled
      if (reminder.email_enabled) {
        // console.log(`Sending email reminder for ${reminder.subscription_name}`);
        // In a real app, this would call an email service
      }

      // Send in-app notification if enabled
      if (reminder.app_enabled) {
        // console.log(
        //   `Sending in-app reminder for ${reminder.subscription_name}`
        // );
        // In a real app, this would insert into notifications table

        // For this demo, we'll just show a toast
        toast.info(
          `Reminder: ${reminder.subscription_name} renews in ${reminder.days_until_renewal} days`,
          {
            autoClose: 10000,
          }
        );
      }

      // Mark reminder as sent
      await supabase.from("reminder_history").insert({
        user_id: userId,
        subscription_id: reminder.subscription_id,
        reminder_type: reminder.timing,
        sent_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error sending reminder notifications:", error);
  }
};

export default {
  saveReminderSettings,
  saveGlobalReminderSettings,
  getReminderSettings,
  getActiveReminders,
  sendReminderNotifications,
};
