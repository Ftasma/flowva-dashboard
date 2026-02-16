import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import supabase from "../lib/supabase";
import { toast } from "react-toastify";
import {
  Subscription,
  ToolSubscription,
  RawSubscriptionData,
  ReminderSettingRow,
  ReminderSettings,
} from "../components/dashboard/subscription/types";

interface SubscriptionContextProps {
  subscriptions: ToolSubscription[];
  setSubscriptions: React.Dispatch<React.SetStateAction<ToolSubscription[]>>;
  loading: boolean;
  error: string | null;
  setUserId: (id: string | null) => void;
  fetchSubscriptions: () => void;
  addSubscription: (
    subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">
  ) => Promise<ToolSubscription | null>;
  updateSubscription: (
    id: string,
    updates: Partial<ToolSubscription>
  ) => Promise<any>;
  deleteSubscription: (id: string) => Promise<boolean>;
  getSummaryStats: () => ReturnType<typeof getSummaryStatsImpl>;
  getRenewals: () => {
    id: string;
    subscription: ToolSubscription;
    daysToRenewal: number;
    recommendation:
      | {
          type: "downgrade";
          title: string;
          description: string;
          potentialSavings: number;
        }
      | undefined;
  }[];
  saveReminderSettings: (
    settings: ReminderSettings,
    subscriptionId?: string | null
  ) => Promise<void>;
  updateAllReminderSettings: (
    settings: ReminderSettings & { applyToAll: boolean }
  ) => Promise<void>;
  globalReminderSettings: ReminderSettings | null;
  fetchGlobalReminderSettings: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextProps | undefined>(
  undefined
);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider"
    );
  }
  return context;
};

const getSummaryStatsImpl = (
  subscriptions: ToolSubscription[],
  reminderSettings: ReminderSettingRow[]
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
  const lastDayPreviousMonth = new Date(currentYear, currentMonth, 0);

  const safeDate = (dateString?: string): Date =>
    dateString ? new Date(dateString) : new Date(0);

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "active"
  );

  const calculateTotalCost = (subs: ToolSubscription[]): number =>
    subs.reduce((total, sub) => total + sub.price, 0);

  const totalCost = calculateTotalCost(activeSubscriptions);

  const previousMonthSubscriptions = subscriptions.filter((sub) => {
    const createdAt = safeDate(sub.createdAt);
    const updatedAt = safeDate(sub.updatedAt);
    const wasCreatedBeforeEndOfLastMonth = createdAt <= lastDayPreviousMonth;
    const wasActiveLastMonth =
      sub.status === "active" ||
      ((["expiring", "issue"] as Array<ToolSubscription["status"]>).includes(
        sub.status
      ) &&
        updatedAt > lastDayPreviousMonth);
    return wasCreatedBeforeEndOfLastMonth && wasActiveLastMonth;
  });

  const previousMonthlyCost = calculateTotalCost(previousMonthSubscriptions);
  const costChange = totalCost - previousMonthlyCost;

  // ✅ Build a map of subscription_id -> reminderSetting
  const reminderMap = new Map<string | null, ReminderSettingRow>();
  reminderSettings.forEach((r) => {
    reminderMap.set(r.subscription_id ?? null, r);
  });

  const upcomingRenewals = subscriptions.filter((sub) => {
    if (sub.status !== "active") return false;

    const nextBillingDate = new Date(sub.nextBilling);
    const daysToRenewal = Math.ceil(
      (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Always include due today
    if (daysToRenewal === 0) return true;

    const reminder = reminderMap.get(sub.id) || reminderMap.get(null); // default

    if (!reminder || !reminder.enabled) return false;

    // Determine reminder window
    let reminderDays = 1;
    if (reminder.timing === "1-day") reminderDays = 1;
    else if (reminder.timing === "3-days") reminderDays = 3;
    else if (reminder.timing === "1-week") reminderDays = 7;
    else if (reminder.timing === "custom" && reminder.custom_days)
      reminderDays = reminder.custom_days;

    return daysToRenewal <= reminderDays;
  }).length;

  const lowUsageSubscriptions = activeSubscriptions.filter(
    (sub) => sub.usage < 30
  );

  const potentialSavings = lowUsageSubscriptions.reduce((total, sub) => {
    if (sub.usage < 10) return total + calculateTotalCost([sub]);
    else if (sub.usage < 20) return total + calculateTotalCost([sub]) * 0.5;
    else return total + calculateTotalCost([sub]) * 0.25;
  }, 0);

  const previousLowUsageSubscriptions = previousMonthSubscriptions.filter(
    (sub) => sub.usage < 30
  );
  const previousPotentialSavings = previousLowUsageSubscriptions.reduce(
    (total, sub) => {
      if (sub.usage < 10) return total + calculateTotalCost([sub]);
      else if (sub.usage < 20) return total + calculateTotalCost([sub]) * 0.5;
      else return total + calculateTotalCost([sub]) * 0.25;
    },
    0
  );

  const savingsChange = potentialSavings - previousPotentialSavings;

  return {
    activeSubscriptions: activeSubscriptions.length,
    totalCost,
    upcomingRenewals,
    potentialSavings,
    changes: {
      subscriptions: {
        value: subscriptions.filter((sub) => {
          const createdAt = safeDate(sub.createdAt);
          return createdAt >= firstDayCurrentMonth && createdAt <= now;
        }).length,
        positive: true,
      },
      cost: {
        value: Math.abs(costChange).toFixed(2),
        positive: costChange <= 0,
      },
      savings: {
        value: Math.abs(savingsChange).toFixed(2),
        positive: savingsChange > 0,
      },
    },
  };
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<ToolSubscription[]>([]);
  const [reminderSettings, setReminderSettings] = useState<
    ReminderSettingRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [globalReminderSettings, setGlobalReminderSettings] =
    useState<ReminderSettings | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const { data, error } = (await supabase
        .from("tools_subscriptions")
        .select(
          `
    id, user_id, name, tier, status, next_billing, price, billing_cycle, currency,
    usage_percentage, icon, color, notes, tool_id, created_at, updated_at,
    default_tools ( id, title, description, category, icon_url, url, oauth_provider ),
    custom_tools:custom_tool_id (
      id, title, description, category, url, user_id
    )
  `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })) as {
        data: RawSubscriptionData[] | null;
        error: any;
      };

      if (error) throw error;
      if (!data) {
        setSubscriptions([]);
        return;
      }

      const formattedData: ToolSubscription[] = data.map((item) => {
        const isCustom = !!item.custom_tools;
        const toolData = isCustom ? item.custom_tools : item.default_tools;

        return {
          id: item.id,
          name: item.name,
          tier: item.tier,
          status: item.status,
          currency: item.currency,
          nextBilling: item.next_billing,
          price: item.price,
          billingCycle: item.billing_cycle as string,
          usage: item.usage_percentage ?? 0,
          icon: item.icon,
          tool_id: item.tool_id || item.custom_tool_id, // Use either ID
          color: item.color,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          default_tools: item.default_tools || undefined,
          custom_tools: item.custom_tools || undefined,
          displayName: toolData?.title ?? "",
          displayIcon: toolData?.icon_url ?? toolData?.icon_url ?? "",
        };
      });

      setSubscriptions(formattedData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch subscriptions");
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchGlobalReminderSettings = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("global_reminder_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // handle no record case

      if (data) {
        setGlobalReminderSettings({
          email: data.email,
          enabled: data.enabled,
          timeOfDay: data.time_of_day,
          timing: data.timing,
          customDays: data.custom_days,
          inApp: data.in_app,
        });
      } else {
        setGlobalReminderSettings(null);
      }
    } catch (error) {
      console.error("Failed to fetch global reminder settings", error);
      toast.error("Failed to fetch global reminder settings.");
    }
  }, [userId]);

  const fetchReminderSettings = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("reminder_settings")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      if (data) setReminderSettings(data);
    } catch (err) {
      toast.error("Failed to fetch reminder settings");
    }
  }, [userId]);

  const saveReminderSettings = async (
    settings: ReminderSettings,
    subscriptionId: string | null = null
  ) => {
    if (!userId) return;

    const existing = reminderSettings.find(
      (r) => r.subscription_id === subscriptionId
    );

    try {
      const payload: any = {
        user_id: userId,
        subscription_id: subscriptionId,
        ...settings,
        updated_at: new Date().toISOString(),
      };

      const formattedPayload: any = {
        user_id: userId,
        subscription_id: subscriptionId,
        email: settings.email,
        enabled: settings.enabled,
        time_of_day: settings.timeOfDay,
        timing: settings.timing,
        custom_days: settings.customDays,
        in_app: settings.inApp,
        updated_at: new Date().toISOString(),
      };

      if (settings.timing !== "custom") {
        payload.customDays = null;
        payload.timeOfDay = null;
      }

      if (existing) {
        const { error } = await supabase
          .from("reminder_settings")
          .update(formattedPayload)
          .eq("id", existing.id);

        if (error) throw error;
        toast.success("Reminder settings updated");
      } else {
        const { error } = await supabase
          .from("reminder_settings")
          .insert([
            { ...formattedPayload, created_at: new Date().toISOString() },
          ]);

        if (error) throw error;
      }

      // Refresh the settings
      fetchReminderSettings();
    } catch (err) {
      toast.error("Failed to save reminder settings");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchReminderSettings();
    fetchGlobalReminderSettings();
  }, [fetchSubscriptions, fetchReminderSettings, fetchGlobalReminderSettings]);

  const addSubscription: SubscriptionContextProps["addSubscription"] = async (
    subscription
  ) => {
    if (!userId) return null;

    try {
      // Prepare the insert data dynamically
      const insertData: any = {
        name: subscription.name,
        tier: subscription.tier,
        status: subscription.status,
        currency: subscription.currency,
        next_billing: subscription.nextBilling,
        price: subscription.price,
        billing_cycle: subscription.billingCycle,
        usage_percentage: subscription.usage,
        icon: subscription.icon,
        color: subscription.color,
        user_id: userId,
      };

      // Dynamically set tool_id or custom_tool_id based on the tool type
      if (subscription.is_custom) {
        insertData.custom_tool_id = subscription.tool_id;
        insertData.tool_id = null; // Ensure tool_id is null for custom tools
      } else {
        insertData.tool_id = subscription.tool_id;
        insertData.custom_tool_id = null; // Ensure custom_tool_id is null for default tools
      }

      const { data, error } = await supabase
        .from("tools_subscriptions")
        .insert(insertData)
        .select(
          `
          *,
          default_tools:tool_id(*),
          custom_tools:custom_tool_id(*)
        `
        )
        .single();

      if (error) throw error;

      // Get tool data from either default_tools or custom_tools
      const toolData = data.default_tools || data.custom_tools;
      const displayName = toolData?.title || toolData?.name;
      const displayIcon = toolData?.icon_url || toolData?.icon;

      const newSubscription: ToolSubscription = {
        id: data.id,
        name: data.name,
        tier: data.tier,
        status: data.status,
        currency: data.currency,
        nextBilling: data.next_billing,
        price: data.price,
        billingCycle: data.billing_cycle,
        usage: data.usage_percentage,
        icon: data.icon,
        tool_id: data.tool_id || data.custom_tool_id, // Use whichever is not null
        color: data.color,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        default_tools: data.default_tools,
        custom_tools: data.custom_tools, // Add custom_tools to the response
        displayName,
        displayIcon,
        // is_custom: subscription.is_custom,
      };

      setSubscriptions((prev) => [newSubscription, ...prev]);
      return newSubscription;
    } catch (err) {
      toast.error("Failed to add subscription");
      return null;
    }
  };

  const updateAllReminderSettings = async (
    settings: ReminderSettings & { applyToAll: boolean }
  ) => {
    try {
      if (!userId) return;

      const allSubscriptionIds = subscriptions.map((sub) => sub.id);

      const payloads = allSubscriptionIds.map((subscriptionId) => ({
        user_id: userId,
        subscription_id: subscriptionId,
        email: settings.email ?? false,
        enabled: settings.enabled ?? true,
        in_app: settings.inApp ?? true,
        time_of_day: settings.timeOfDay ?? null,
        timing: settings.timing === "default" ? "1-week" : settings.timing,
        custom_days: settings.customDays ?? null,
        updated_at: new Date().toISOString(),
      }));

      await Promise.all(
        payloads.map((payload) =>
          supabase
            .from("reminder_settings")
            .update({
              email: payload.email,
              enabled: payload.enabled,
              time_of_day: payload.time_of_day,
              timing: payload.timing,
              custom_days: payload.custom_days,
              in_app: payload.in_app,
              updated_at: payload.updated_at,
            })
            .match({
              user_id: payload.user_id,
              subscription_id: payload.subscription_id,
            })
        )
      );

      //  Also update global_reminder_settings
      await supabase.from("global_reminder_settings").upsert(
        {
          user_id: userId,
          email: settings.email ?? false,
          enabled: settings.enabled ?? true,
          in_app: settings.inApp ?? true,
          time_of_day: settings.timeOfDay ?? null,
          timing: settings.timing === "default" ? "1-week" : settings.timing,
          custom_days: settings.customDays ?? null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id", // ensure single row per user
        }
      );

      await fetchReminderSettings(); // Refresh state from DB
      toast.success("Reminder settings updated for all subscriptions.");
    } catch (error) {
      console.error("Failed to update reminder settings", error);
      toast.error("Failed to update reminder settings.");
    }
  };

  const updateSubscription: SubscriptionContextProps["updateSubscription"] =
    async (id, updates) => {
      try {
        const { data, error } = await supabase
          .from("tools_subscriptions")
          .update({
            name: updates.name,
            tier: updates.tier,
            status: updates.status,
            currency: updates.currency,
            next_billing: updates.nextBilling,
            price: updates.price,
            billing_cycle: updates.billingCycle,
            usage_percentage: updates.usage,
            icon: updates.icon,
            tool_id: updates.tool_id,
            color: updates.color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === id
              ? { ...sub, ...updates, updatedAt: data.updated_at }
              : sub
          )
        );

        return data;
      } catch (err) {
        toast.error("Failed to update subscription");
        return null;
      }
    };

  const deleteSubscription: SubscriptionContextProps["deleteSubscription"] =
    async (id) => {
      try {
        const { error } = await supabase
          .from("tools_subscriptions")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
        toast.success("Subscription removed successfully");
        return true;
      } catch (err) {
        toast.error("Failed to delete subscription");
        return false;
      }
    };

  const getRenewals = () => {
    return subscriptions
      .filter((sub) => {
        const daysToRenewal = Math.ceil(
          (new Date(sub.nextBilling).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return daysToRenewal <= 30;
      })
      .map((sub) => {
        const daysToRenewal = Math.ceil(
          (new Date(sub.nextBilling).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        let recommendation;
        if (sub.usage < 30) {
          recommendation = {
            type: "downgrade" as const,
            title: "Smart Recommendation",
            description: `Downgrade to a lower plan since you're only using ${sub.usage}% of features.`,
            potentialSavings: sub.price * 0.3, // 30% savings
          };
        }

        return {
          id: sub.id,
          subscription: sub,
          daysToRenewal,
          recommendation,
        };
      })
      .sort((a, b) => a.daysToRenewal - b.daysToRenewal);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        loading,
        error,
        setUserId,
        setSubscriptions,
        saveReminderSettings,
        fetchSubscriptions,
        addSubscription,
        updateSubscription,
        updateAllReminderSettings,
        deleteSubscription,
        getSummaryStats: () =>
          getSummaryStatsImpl(subscriptions, reminderSettings),
        getRenewals,
        globalReminderSettings,
        fetchGlobalReminderSettings,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
