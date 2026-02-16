import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { ReminderSettings, ToolSubscription } from "../types";
import { useSubscriptionContext } from "../../../../context/SubscriptionContext";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: ToolSubscription;
  onSave: (settings: ReminderSettings) => void;
}

interface ManageAllRemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ReminderSettings & { applyToAll: boolean }) => void;
}

interface ReminderOption {
  value: "1-day" | "3-days" | "1-week" | "custom" | "default";
  label: string;
  description: string;
}

const reminderOptions: ReminderOption[] = [
  {
    value: "default",
    label: "1 week before renewal (default)",
    description: "Apply to all current and future subscriptions",
  },
  {
    value: "1-day",
    label: "1 day before renewal",
    description: "You'll be notified 1 day before each renewal",
  },
  {
    value: "3-days",
    label: "3 days before renewal",
    description: "You'll be notified 3 days before each renewal",
  },
  {
    value: "1-week",
    label: "1 week before renewal",
    description: "You'll be notified 1 week before each renewal",
  },
];

const timeOptions = [
  { label: "Morning (9:00 AM)", value: "09:00:00" },
  { label: "Afternoon (1:00 PM)", value: "13:00:00" },
  { label: "Evening (6:00 PM)", value: "18:00:00" },
  { label: "Night (9:00 PM)", value: "21:00:00" },
];

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSave,
}) => {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: true,
    timing: "1-day",
    email: true,
    inApp: true,
  });

  const [customDays, setCustomDays] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState(timeOptions[0].value);

  const handleSave = () => {
    const finalSettings = {
      ...settings,
      customDays: settings.timing === "custom" ? customDays : undefined,
      timeOfDay: settings.timing === "custom" ? timeOfDay : undefined,
    };

    onSave(finalSettings);
  };

  const handleSelectOption = (option: ReminderOption["value"]) => {
    setSettings((prev) => ({ ...prev, timing: option }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Set Reminder for ${subscription ? subscription.name : ""}`}
      size="md"
    >
      <div className="p-6">
        {/* Option Cards */}
        <div className="space-y-3 mb-6">
          {reminderOptions
            .filter((item) => item.value !== "default")
            .map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  settings.timing === option.value
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                  {settings.timing === option.value && (
                    <CheckCircle size={20} className="text-purple-600" />
                  )}
                </div>
              </div>
            ))}

          {/* Custom Option */}
          <div
            onClick={() => handleSelectOption("custom")}
            className={`border rounded-lg cursor-pointer transition-all overflow-hidden ${
              settings.timing === "custom"
                ? "border-purple-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex justify-between p-4">
              <div>
                <div className="font-semibold text-gray-900">Custom</div>
                <div className="text-sm text-gray-600">
                  Set your own reminder schedule
                </div>
              </div>
              {settings.timing === "custom" && (
                <CheckCircle size={20} className="text-purple-600" />
              )}
            </div>

            {settings.timing === "custom" && (
              <div className="bg-purple-50 p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-2">
                    Days Before Renewal
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={customDays}
                    onChange={(e) =>
                      setCustomDays(parseInt(e.target.value) || 1)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter number of days"
                  />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold mb-2">Time of Day</div>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button className="text-4xl" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!settings.email && !settings.inApp}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const ManageAllRemindersModal: React.FC<
  ManageAllRemindersModalProps
> = ({ isOpen, onClose, onSave }) => {
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const { globalReminderSettings, fetchGlobalReminderSettings } =
    useSubscriptionContext();

  const [applyToAll, _] = useState(true);
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: true,
    timing: "default",
    email: true,
    inApp: true,
  });
  const [customDays] = useState(1);
  const [timeOfDay] = useState(timeOptions[0].value);

  const handleSave = () => {
    const finalSettings = {
      ...settings,
      enabled: globalEnabled,
      customDays: settings.timing === "custom" ? customDays : undefined,
      timeOfDay: settings.timing === "custom" ? timeOfDay : undefined,
      applyToAll,
    };

    onSave(finalSettings);
  };

  const handleSelectOption = (option: ReminderOption["value"]) => {
    setSettings((prev) => ({ ...prev, timing: option }));
  };

  useEffect(() => {
    if (globalReminderSettings) {
      setSettings({
        enabled: globalReminderSettings.enabled,
        timing: globalReminderSettings.timing,
        email: globalReminderSettings.email,
        inApp: globalReminderSettings.inApp,
        customDays: globalReminderSettings.customDays,
        timeOfDay: globalReminderSettings.timeOfDay,
      });
      setGlobalEnabled(globalReminderSettings.enabled);
    }
  }, [globalReminderSettings]);

  useEffect(() => {
    if (isOpen) {
      fetchGlobalReminderSettings();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage All Reminders"
      size="md"
    >
      <div className="p-6">
        {/* Global Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={globalEnabled}
              onChange={(e) => setGlobalEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-semibold">Enable all reminders</span>
          </label>
        </div>

        {/* Reminder Options */}
        <div className="space-y-3 mb-6">
          {reminderOptions.slice(0, 3).map((option) => {
            const isSelected =
              settings.timing === option.value ||
              (option.value === "default" && settings.timing === "1-week");
            return (
              <div
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle size={20} className="text-purple-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notification Methods */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Notification Methods
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, email: e.target.checked }))
                }
                className="rounded"
              />
              <span className="text-sm">Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.inApp}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, inApp: e.target.checked }))
                }
                className="rounded"
              />
              <span className="text-sm">In-app notifications</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button className="text-4xl" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReminderModal;
