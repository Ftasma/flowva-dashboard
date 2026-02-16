import { Modal, Switch } from "antd";
import "./notifications.css";

interface NotificationSettingsModalProps {
  onClose: () => void;
}

interface ToggleOption {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
}

export default function NotificationSettingsModal({
  onClose,
}: NotificationSettingsModalProps) {
  const toggleOptions: ToggleOption[] = [
    {
      id: "updates",
      title: "Turn on to receive updates!",
      description:
        "Get notified about your subscriptions and new tool updates.",
      defaultChecked: true,
    },
    {
      id: "reminders",
      title: "Turn on notifications to get timely reminders!",
      description: "Never miss a payment or renewal.",
      defaultChecked: true,
    },
    {
      id: "discoveries",
      title: "Turn on to discover new apps!",
      description:
        "Get recommendations based on your interests and subscription history.",
      defaultChecked: false,
    },
    {
      id: "spending",
      title: "Turn on to track your spending!",
      description: "Stay on top of your subscriptions and avoid hidden fees.",
      defaultChecked: false,
    },
    {
      id: "offers",
      title: "Never miss an offer!",
      description:
        "Get alerted about discounts, deals, and price changes on your subscriptions.",
      defaultChecked: false,
    },
    {
      id: "desktop",
      title: "Desktop notifications",
      description: "Show notifications on your desktop",
      defaultChecked: false,
      disabled: true,
      comingSoon: true,
    },
  ];

  return (
    <Modal
      title="Notification Settings"
      centered={true}
      styles={{
        footer: {
          display: "flex",
          justifyContent: "center",
        },
      }}
      open={true}
      onCancel={onClose}
      footer={[
        <button key="cancel" className="btn btn-secondary  mr-5" onClick={onClose}>
          Cancel
        </button>,
        <button key="save" className="btn btn-primary " onClick={onClose}>
          Save Settings
        </button>,
      ]}
    >
      <div className="settings-container">
        {toggleOptions.map((option) => (
          <div className="toggle-container" key={option.id}>
            <div className="toggle-content">
              <div className="toggle-title">{option.title}</div>
              <div className="toggle-description">{option.description}</div>
              {option.comingSoon && (
                <div className="coming-soon">Coming soon</div>
              )}
            </div>
            <Switch
              defaultChecked={option.defaultChecked}
              disabled={option.disabled}
              className="notification-switch"
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
