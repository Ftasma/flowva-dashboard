import React from "react";
import {
  Search,
  MoreVertical,
  Edit,
  Bell,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Dropdown, MenuProps } from "antd";
import ServiceIcon from "./ServiceIcon";
import StatusBadge from "./StatusBadge";
import UsageBar from "./UsageBar";
import CustomLogo from "../../../assets/custom_tool.png";
import { ToolSubscription } from "./types";

interface SubscriptionTableProps {
  subscriptions: ToolSubscription[];
  onAction: (action: string, subscription: ToolSubscription) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

interface ActionDropdownProps {
  subscription: ToolSubscription;
  onAction: (action: string, subscription: ToolSubscription) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  subscription,
  onAction,
}) => {
  const actions = [
    { key: "edit", label: "Edit", icon: <Edit size={14} /> },
    { key: "reminder", label: "Set Reminder", icon: <Bell size={14} /> },
    { key: "renewal", label: "Renewal Settings", icon: <RotateCcw size={14} /> },
    { key: "remove", label: "Remove", icon: <Trash2 size={14} />, danger: true },
  ];

  const items: MenuProps["items"] = actions.map((action) => ({
    key: action.key,
    label: (
      <div className="flex items-center gap-2">
        {action.icon}
        <span className={action.danger ? "text-red-600" : ""}>{action.label}</span>
      </div>
    ),
    onClick: () => onAction(action.key, subscription),
  }));

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
        <MoreVertical size={16} />
      </button>
    </Dropdown>
  );
};

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  onAction,
  searchTerm,
  onSearchChange,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.tier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      NGN: "₦",
      INR: "₹",
      AUD: "A$",
      CAD: "C$",
      ZAR: "R",
      BRL: "R$",
      CNY: "¥",
    };
    return symbols[currency] || "";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400"
          />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-32 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px] divide-y divide-gray-200">
          {filteredSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between gap-6 px-6 py-4 hover:bg-purple-50 transition-colors"
            >
              {/* Service Name + Icon */}
              <div className="flex items-start sm:items-center gap-3 min-w-[160px]">
                <ServiceIcon
                  name={subscription.displayName}
                  icon={subscription.displayIcon || CustomLogo}
                  color={subscription.color}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {subscription.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {subscription.tier}
                  </div>
                  {subscription.default_tools?.category?.length ? (
                    <span className="mt-1 truncate max-w-[138px] sm:max-w-full p-[4px_8px] rounded-[4px] text-[0.75rem] bg-[#f3f4f6]">
                      {subscription.default_tools.category[0]}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Status */}
              <div className="min-w-[100px]">
                <StatusBadge status={subscription.status} />
              </div>

              {/* Billing */}
              <div className="min-w-[150px]">
                <div className="font-medium text-gray-900">
                  {formatDate(subscription.nextBilling)}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {subscription.billingCycle}
                </div>
              </div>

              {/* Price */}
              <div className="min-w-[100px]">
                <div className="font-semibold text-gray-900">
                  {getCurrencySymbol(subscription.currency)}
                  {subscription.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  per{" "}
                  {subscription.billingCycle === "monthly"
                    ? "month"
                    : subscription.billingCycle === "annual"
                    ? "year"
                    : "quarter"}
                </div>
              </div>

              {/* Usage */}
              <div className="min-w-[120px]">
                <UsageBar usage={subscription.usage} />
              </div>

              {/* Actions */}
              <div className="min-w-[60px] relative z-10">
                <ActionDropdown
                  subscription={subscription}
                  onAction={onAction}
                />
              </div>
            </div>
          ))}

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? "No subscriptions match your search."
                  : "No subscriptions found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
