import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Button from "../ui/Button";
import { ToolSubscription } from "../types";
import { fetchUserCurrency } from "../../../../utils/helper";
import { Modal } from "antd";
import NotificationHelpers from "../../../../utils/notifications/notificationHelpers";
import { useCurrentUser } from "../../../../context/CurrentUserContext";

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: ToolSubscription;
  onSubmit: (id: string, updatedData: Partial<ToolSubscription>) => void;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    tier: "",
    billingCycle: "",
    currency: "USD",
    price: "",
    nextBilling: "",
    status: "",
  });

  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [_, setIsDirty] = useState(false);

  // Initialize form data when subscription changes
  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        tier: subscription.tier || "",
        billingCycle: subscription.billingCycle,
        currency: subscription.currency,
        price: subscription.price.toString(),
        nextBilling: formatDateForInput(subscription.nextBilling),
        status: subscription.status,
      });
      setIsDirty(false);
    }
  }, [subscription]);

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  //Detect user's currency
  useEffect(() => {
    const detectCurrency = async () => {
      setLoadingCurrency(true);
      const currency = await fetchUserCurrency();
      setLoadingCurrency(false);
      setFormData((prev) => ({ ...prev, currency }));
    };

    if (isOpen) {
      detectCurrency();
    }
  }, [isOpen]);

  // Format date for display (DD/MM/YYYY)
  // const formatDateForDisplay = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Service name is required";
    if (!formData.billingCycle)
      newErrors.billingCycle = "Billing cycle is required";

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.nextBilling)
      newErrors.nextBilling = "Next billing date is required";
    if (!formData.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!subscription) return;
    if (!validateForm()) return;

    const updates: Partial<ToolSubscription> = {
      name: formData.name,
      tier: formData.tier,
      currency: formData.currency,
      billingCycle: formData.billingCycle as "monthly" | "annual" | "quarterly",
      price: parseFloat(formData.price),
      nextBilling: formData.nextBilling,
      status: formData.status as "active" | "expiring" | "issue",
    };

    onSubmit(subscription.id, updates);
    await NotificationHelpers.onSubscriptionUpdated( formData.name,userId as string);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setIsDirty(true);
  };

  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    NGN: "₦",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    AUD: "A$",
    CAD: "C$",
    ZAR: "R",
    BRL: "R$",
    CNY: "¥",
  };
  const symbol = symbolMap[formData.currency];

  if (!subscription) return null;

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      centered
      title={
        <h1 className="md:text-lg font-semibold">{`Edit ${subscription.name} Subscription`}</h1>
      }
    >
      <div className="p-6 space-y-6 ">
        {/* Service Name */}
        <div>
          <label
            htmlFor="serviceName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Service Name
          </label>
          <input
            id="serviceName"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Billing Cycle */}
        <div>
          <label
            htmlFor="billingCycle"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Billing Cycle
          </label>
          <select
            id="billingCycle"
            value={formData.billingCycle}
            onChange={(e) => handleInputChange("billingCycle", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
              errors.billingCycle ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select...</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          {errors.billingCycle && (
            <p className="text-red-500 text-xs mt-1">{errors.billingCycle}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Price
          </label>
          <div className="flex items-center">
            <div className="text-gray-500 mr-2">
              {loadingCurrency ? <div className="form-loader"></div> : symbol}
            </div>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              min="0.01"
              step="0.01"
              className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        {/* Next Billing Date */}
        <div>
          <label
            htmlFor="nextBilling"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Next Billing Date
          </label>
          <div className="relative">
            <input
              id="nextBilling"
              type="date"
              value={formData.nextBilling}
              onChange={(e) => handleInputChange("nextBilling", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                errors.nextBilling ? "border-red-500" : "border-gray-300"
              }`}
            />
            <Calendar
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
          {errors.nextBilling && (
            <p className="text-red-500 text-xs mt-1">{errors.nextBilling}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select...</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="issue">Issue</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button className="text-4xl" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Settings</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditSubscriptionModal;
