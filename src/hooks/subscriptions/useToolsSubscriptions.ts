import { useState, useEffect } from "react";
import supabase from "../../lib/supabase";
import { toast } from "react-toastify";
import {
  Subscription,
  UnusedTool,
  ToolSubscription,
  RawSubscriptionData,
} from "../../components/dashboard/subscription/types";

// Custom hook for subscription management
export const useSubscriptions = (userId?: string) => {
  const [subscriptions, setSubscriptions] = useState<ToolSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Updated query to include both default_tools and custom_tools
      const { data, error } = (await supabase
        .from("tools_subscriptions")
        .select(
          `
          id,
          user_id,
          name,
          tier,
          status,
          next_billing,
          price,
          billing_cycle,
          usage_percentage,
          icon,
          color,
          notes,
          tool_id,
          custom_tool_id,
          created_at,
          updated_at,
          default_tools:tool_id (
            id,
            title,
            description,
            category,
            icon_url,
            url,
            oauth_provider
          ),
          custom_tools:custom_tool_id (
            id,
            title,
            description,
            category,
            url,
            user_id
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

      const formattedData: ToolSubscription[] = data.map(
        (item: RawSubscriptionData) => {
          // Get tool data from either default_tools or custom_tools
          const defaultToolData = item.default_tools;
          const customToolData = item.custom_tools;
          const toolData = defaultToolData || customToolData;

          // Get display information
          const displayName = toolData?.title as string;
          const displayIcon = defaultToolData?.icon_url as string;

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
            tool_id: item.tool_id || item.custom_tool_id, // Use whichever is not null
            color: item.color,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            default_tools: defaultToolData,
            custom_tools: customToolData, // Include custom tools data
            displayName,
            displayIcon,
            // is_custom: isCustomTool, // Flag to identify custom tools
          };
        }
      );

      setSubscriptions(formattedData);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Add subscription
  const addSubscription = async (
    subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!userId) return null;

    try {
      // Prepare the insert data dynamically
      const insertData: any = {
        name: subscription.name,
        tier: subscription.tier,
        status: subscription.status,
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
      toast.success("Subscription added successfully");
      return newSubscription;
    } catch (err) {
      console.error("Error adding subscription:", err);
      toast.error("Failed to add subscription");
      return null;
    }
  };

  // Update subscription
  const updateSubscription = async (
    id: string,
    updates: Partial<ToolSubscription>
  ) => {
    try {
      const { data, error } = await supabase
        .from("tools_subscriptions")
        .update({
          name: updates.name,
          tier: updates.tier,
          status: updates.status,
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
      console.error("Error updating subscription:", err);
      toast.error("Failed to update subscription");
      return null;
    }
  };

  // Delete subscription
  const deleteSubscription = async (id: string) => {
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
      console.error("Error deleting subscription:", err);
      toast.error("Failed to cancel subscription");
      return false;
    }
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    // Current date info for calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
    const lastDayPreviousMonth = new Date(currentYear, currentMonth, 0);

    // Helper function to safely create Date object
    const safeDate = (dateString?: string): Date => {
      return dateString ? new Date(dateString) : new Date(0);
    };

    // Active subscriptions
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active"
    );
    const activeCount = activeSubscriptions.length;

    // Subscriptions added this month
    const addedThisMonth = subscriptions.filter((sub) => {
      const createdAt = safeDate(sub.createdAt);
      return createdAt >= firstDayCurrentMonth && createdAt <= now;
    }).length;

    // Calculate monthly cost (normalized to monthly)
    const calculateMonthlyCost = (subs: ToolSubscription[]): number => {
      return subs.reduce((total, sub) => {
        if (sub.billingCycle === "monthly") return total + sub.price;
        if (sub.billingCycle === "annual") return total + sub.price / 12;
        if (sub.billingCycle === "quarterly") return total + sub.price / 3;
        return total;
      }, 0);
    };

    // Current monthly cost
    const monthlyCost = calculateMonthlyCost(activeSubscriptions);

    // Previous month's subscriptions
    const previousMonthSubscriptions = subscriptions.filter((sub) => {
      const createdAt = safeDate(sub.createdAt);
      const updatedAt = safeDate(sub.updatedAt);

      // Was created before end of last month
      const wasCreatedBeforeEndOfLastMonth = createdAt <= lastDayPreviousMonth;

      // Status check - was active or changed status after last month
      const wasActiveLastMonth =
        sub.status === "active" ||
        ((["expiring", "issue"] as Array<ToolSubscription["status"]>).includes(
          sub.status
        ) &&
          updatedAt > lastDayPreviousMonth);

      return wasCreatedBeforeEndOfLastMonth && wasActiveLastMonth;
    });

    // Previous month's cost
    const previousMonthlyCost = calculateMonthlyCost(
      previousMonthSubscriptions
    );

    // Calculate cost change
    const costChange = monthlyCost - previousMonthlyCost;

    // Upcoming renewals in next 30 days
    const upcomingRenewals = subscriptions.filter((sub) => {
      if (sub.status !== "active") return false;

      const daysToRenewal = Math.ceil(
        (new Date(sub.nextBilling).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return daysToRenewal <= 30 && daysToRenewal >= 0;
    }).length;

    // Potential savings calculation
    // Low usage subscriptions (< 30% usage)
    const lowUsageSubscriptions = activeSubscriptions.filter(
      (sub) => sub.usage < 30
    );

    // Calculate potential savings based on usage patterns and subscription tiers
    const potentialSavings = lowUsageSubscriptions.reduce((total, sub) => {
      // For low usage subscriptions, calculate potential savings
      if (sub.usage < 10) {
        // Very low usage - consider cancellation - 100% saving
        return total + calculateMonthlyCost([sub]);
      } else if (sub.usage < 20) {
        // Low usage - consider downgrade or plan reduction - 50% saving
        return total + calculateMonthlyCost([sub]) * 0.5;
      } else {
        // Moderate low usage - minor plan adjustment - 25% saving
        return total + calculateMonthlyCost([sub]) * 0.25;
      }
    }, 0);

    // Previous month's potential savings
    const previousLowUsageSubscriptions = previousMonthSubscriptions.filter(
      (sub) => sub.usage < 30
    );
    const previousPotentialSavings = previousLowUsageSubscriptions.reduce(
      (total, sub) => {
        if (sub.usage < 10) {
          return total + calculateMonthlyCost([sub]);
        } else if (sub.usage < 20) {
          return total + calculateMonthlyCost([sub]) * 0.5;
        } else {
          return total + calculateMonthlyCost([sub]) * 0.25;
        }
      },
      0
    );

    // Calculate savings change
    const savingsChange = potentialSavings - previousPotentialSavings;

    return {
      activeSubscriptions: activeCount,
      monthlyCost,
      upcomingRenewals,
      potentialSavings,
      changes: {
        subscriptions: {
          value: addedThisMonth,
          positive: addedThisMonth > 0,
        },
        cost: {
          value: Math.abs(costChange).toFixed(2),
          positive: costChange <= 0, // Lower cost is positive
        },
        savings: {
          value: Math.abs(savingsChange).toFixed(2),
          positive: savingsChange > 0, // More potential savings is positive
        },
      },
    };
  };

  // Get renewals
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

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    refetchSubscriptions: fetchSubscriptions,
    getSummaryStats,
    getRenewals,
  };
};

// Custom hook for unused tools management
export const useUnusedTools = (userId?: string) => {
  const [unusedTools, setUnusedTools] = useState<UnusedTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch unused tools
  const fetchUnusedTools = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("unused_tools")
        .select("*")
        .eq("user_id", userId)
        .order("last_used", { ascending: true });

      if (error) throw error;

      const formattedData: UnusedTool[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        tier: item.tier,
        lastUsed: item.last_used,
        monthlyCost: item.monthly_cost,
        status: item.status,
        icon: item.icon,
        color: item.color,
      }));

      setUnusedTools(formattedData);
    } catch (err) {
      console.error("Error fetching unused tools:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // toast.error("Failed to fetch unused tools");
    } finally {
      setLoading(false);
    }
  };

  // Delete unused tool
  const deleteUnusedTool = async (id: string) => {
    try {
      const { error } = await supabase
        .from("unused_tools")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setUnusedTools((prev) => prev.filter((tool) => tool.id !== id));
      toast.success("Tool removed successfully");
      return true;
    } catch (err) {
      console.error("Error deleting unused tool:", err);
      toast.error("Failed to remove tool");
      return false;
    }
  };

  useEffect(() => {
    fetchUnusedTools();
  }, [userId]);

  return {
    unusedTools,
    loading,
    error,
    deleteUnusedTool,
    refetchUnusedTools: fetchUnusedTools,
  };
};

export { supabase };
