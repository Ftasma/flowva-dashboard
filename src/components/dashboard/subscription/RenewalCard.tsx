// components/RenewalCard.tsx
import React from "react";
import { Clock, Lightbulb, CircleAlert } from "lucide-react";
import { RenewalCard as RenewalCardType, ToolSubscription } from "./types";
import ServiceIcon from "./ServiceIcon";
import Button from "./ui/Button";
import { getNextBillingDate } from "../../../utils/helper";
import { useSubscriptionContext } from "../../../context/SubscriptionContext";
import { toast } from "react-toastify";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { useCurrentUser } from "../../../context/CurrentUserContext";

interface RenewalCardProps {
  renewal: RenewalCardType;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setSubDataProp?: React.Dispatch<
    React.SetStateAction<null | ToolSubscription>
  >;
  showRenewalActions: boolean;
  onAction: (action: string, renewal: RenewalCardType) => void;
}

export const RenewalCard: React.FC<RenewalCardProps> = ({
  renewal,
  showRenewalActions,
  onAction,
  setModalOpen,
  setSubDataProp,
}) => {
  const { subscription, daysToRenewal, recommendation } = renewal;
  const { updateSubscription } = useSubscriptionContext();
  const { currentUser } = useCurrentUser();
  const getRenewalStatus = (days: number) => {
    if (days <= 2)
      return {
        color: "text-red-600",
        icon: CircleAlert,
        label: "urgent",
      };
    if (days <= 7)
      return { color: "text-yellow-600", icon: Clock, label: "warning" };
    return { color: "text-gray-600", icon: Clock, label: "normal" };
  };

  const status = getRenewalStatus(daysToRenewal);
  const StatusIcon = status.icon;

  const formatDaysToRenewal = (days: number) => {
    if (days === 0) return "Renews today";
    if (days === 1) return "Renews tomorrow";
    if (days < 0)
      return `Overdue by ${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""}`;
    return `Renews in ${days} day${days > 1 ? "s" : ""}`;
  };

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

  const handleMarkAsPaid = (subData: ToolSubscription) => {
    const formData = {
      ...subData,
      nextBilling: getNextBillingDate(
        subData.nextBilling,
        subData.billingCycle
      ),
    };
    updateSubscription(subData.id, formData)
      .then(() => {
        if (setModalOpen) setModalOpen(true);
        if (setSubDataProp) setSubDataProp(subData);

        NotificationHelpers.onSubscriptionRenewed(
          subData.name,
          formData.nextBilling,
          subData.id,
          currentUser?.id
        );
      })
      .catch((error) => {
        toast.error("Failed to update subscription");
        console.error("Update error:", error);
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ServiceIcon
            name={subscription.name}
            icon={subscription.displayIcon}
            color={subscription.color}
            size="md"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {subscription.name}
            </div>

            <div className="text-sm text-gray-600">{subscription.tier}</div>
            {subscription.default_tools?.category?.length ? (
              <span className=" mt-1 truncate max-w-[138px] sm:max-w-full p-[4px_8px] rounded-[4px] text-[0.75rem] bg-[#f3f4f6] ">
                {subscription.default_tools.category[0]}
              </span>
            ) : null}
          </div>
        </div>
        <div
          className={`flex items-center gap-2 font-semibold ${status.color}`}
        >
          <StatusIcon size={16} />
          {formatDaysToRenewal(daysToRenewal)}
          <button
            onClick={() => handleMarkAsPaid(subscription)}
            className="bg-[#f0fff4] transition-all duration-200 ease-linear hover:bg-[#38a169] hover:text-white border border-[#38a169] font-semibold p-[0.25rem_0.75rem] rounded-md text-[#38a169] text-[0.75rem]"
          >
            Mark as paid
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-xs uppercase text-gray-500  tracking-wider mb-1">
            Current Price
          </div>
          <div className="text-lg font-semibold text-gray-900 opacity-80">
            {getCurrencySymbol(subscription.currency)}
            {subscription.price.toFixed(2)}/
            {subscription.billingCycle === "monthly" ? "month" : "year"}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-gray-500 tracking-wider mb-1">
            Usage
          </div>
          <div className="text-lg font-semibold text-gray-900 opacity-80">
            {subscription.usage >= 70
              ? "High"
              : subscription.usage >= 30
              ? "Medium"
              : "Low"}{" "}
            ({subscription.usage}%)
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="mx-6 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-purple-600" size={16} />
              <div className="font-semibold text-purple-900">
                {recommendation.title}
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              {recommendation.description}
            </div>
            <div className="text-sm font-semibold text-green-600">
              Potential savings: {getCurrencySymbol(subscription.currency)}
              {recommendation.potentialSavings}/month
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {showRenewalActions && (
        <div className="px-6 pb-6 border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onAction("cancel", renewal)}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenewalCard;
