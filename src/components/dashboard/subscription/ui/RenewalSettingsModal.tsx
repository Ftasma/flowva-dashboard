// components/modals/RenewalSettingsModal.tsx - Renewal Settings Modal
import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { RenewalSettings, ToolSubscription } from "../types";

interface RenewalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: ToolSubscription;
  onSave: (settings: RenewalSettings) => void;
}

export const RenewalSettingsModal: React.FC<RenewalSettingsModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSave,
}) => {
  const [settings, setSettings] = useState<RenewalSettings>({
    autoRenewal: true,
    notificationPreference: "both",
    reminderTiming: "3-days",
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const notificationOptions = [
    { value: "email", label: "Email only" },
    { value: "app", label: "In-app notification only" },
    { value: "both", label: "Email and in-app notification" },
  ];

  const reminderOptions = [
    { value: "1-day", label: "1 day before renewal" },
    { value: "3-days", label: "3 days before renewal" },
    { value: "1-week", label: "1 week before renewal" },
    { value: "2-weeks", label: "2 weeks before renewal" },
  ];

  const handleSave = () => {
    onSave(settings);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
      onClose();
    }, 1500);
  };

  const handleInputChange = (field: keyof RenewalSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Renewal Settings${
        subscription ? ` for ${subscription.name}` : ""
      }`}
      size="md"
    >
      <div className="p-6">
        {showSuccessMessage ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Settings Saved!
            </h3>
            <p className="text-gray-600">
              Your renewal settings have been updated successfully.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Auto-Renewal Toggle */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.autoRenewal}
                  onChange={(e) =>
                    handleInputChange("autoRenewal", e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm font-semibold">
                  Enable auto-renewal
                </span>
              </label>
            </div>

            {/* Notification Preference */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Notification Preference
              </label>
              <select
                value={settings.notificationPreference}
                onChange={(e) =>
                  handleInputChange("notificationPreference", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                {notificationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reminder Timing */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Reminder Before Renewal
              </label>
              <select
                value={settings.reminderTiming}
                onChange={(e) =>
                  handleInputChange("reminderTiming", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                {reminderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button className="text-4xl" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RenewalSettingsModal;
