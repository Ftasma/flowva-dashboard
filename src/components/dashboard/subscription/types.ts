// types/subscription.ts
export interface Subscription {
  id: string;
  name: string;
  tier: string;
  status: "active" | "expiring" | "issue";
  nextBilling: string;
  price: number;
  billingCycle: "monthly" | "annual" | "quarterly";
  usage: number;
  currency: string;
  icon: string;
  tool_id: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  is_custom?: boolean;
}

export interface SummaryStats {
  activeSubscriptions: number;
  monthlyCost: number;
  upcomingRenewals: number;
  potentialSavings: number;
  changes: {
    subscriptions: { value: number; positive: boolean };
    cost: { value: number; positive: boolean };
    savings: { value: number; positive: boolean };
  };
}

export interface RenewalCard {
  id: string;
  subscription: ToolSubscription;
  daysToRenewal: number;
  recommendation?: {
    type: "downgrade" | "upgrade" | "cancel";
    title: string;
    description: string;
    potentialSavings: number;
  };
}

export interface UnusedTool {
  id: string;
  name: string;
  tier: string;
  lastUsed: string;
  monthlyCost: number;
  status: "critical" | "warning";
  icon: string;
  color: string;
}

export interface FilterOptions {
  status: string;
  renewal: string;
  usage: string;
  price: string;
}

export interface AddSubscriptionFormData {
  serviceName: string;
  billingCycle: string;
  price: string;
  tool_id: string;
  startDate: string;
  currency: string;
  tier?: string;
  notes?: string;
  isCustom?: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  timing: "1-day" | "3-days" | "1-week" | "custom" | "default";
  customDays?: number;
  timeOfDay?: string;
  email: boolean;
  inApp: boolean;
}

export interface ReminderSettingRow extends ReminderSettings {
  id: string;
  user_id: string;
  subscription_id: string | null;
  custom_days: number;
  created_at: string;
  updated_at: string;
}

export interface RenewalSettings {
  autoRenewal: boolean;
  // paymentMethod: string;
  notificationPreference: "email" | "app" | "both";
  reminderTiming: "1-day" | "3-days" | "1-week" | "2-weeks";
}

export interface DefaultTool {
  id: string;
  title: string;
  description: string | null;
  category: string[] | null;
  icon_url: string | null;
  url: string | null;
  oauth_provider: string | null;
}

// Raw response type from Supabase
export interface RawSubscriptionData {
  id: string;
  user_id: string;
  name: string;
  tier: string;
  currency: string;
  status: "active" | "expiring" | "issue";
  next_billing: string;
  price: number;
  billing_cycle: "monthly" | "annual" | "quarterly" | undefined;
  usage_percentage: number | null;
  icon: string | null;
  color: string;
  notes: string | null;
  tool_id: string | null;
  custom_tool_id: string | null;
  created_at: string;
  updated_at: string;
  default_tools: DefaultTool | null; // Single object, not array
  custom_tools?: DefaultTool | null;
}

// Formatted subscription type for your component
export interface ToolSubscription {
  id: string;
  name: string;
  tier: string;
  status: "active" | "expiring" | "issue";
  nextBilling: string;
  price: number;
  currency: string;
  billingCycle: string;
  usage: number;
  icon: string | null;
  tool_id: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  default_tools?: DefaultTool | null;
  custom_tools?: DefaultTool | null;
  displayName: string;
  displayIcon: string;
  reminder_settings?: ReminderSettings | null;
}
