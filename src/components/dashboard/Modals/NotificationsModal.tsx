import React, { useState } from "react";
import Modal from "./Modal";
import ToggleOnIcon from "../../../assets/toggle-on.svg";
import ToggleOffIcon from "../../../assets/toggle-off.svg";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState({
    stayInformed: false,
    joinYourTeam: false,
    referralJoins: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggle = (key: keyof typeof notifications) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={notifications[key]}
        onChange={() => handleToggle(key)}
      />
      {notifications[key] ? (
        <img
          src={ToggleOnIcon}
          alt="Toggle On"
          className="w-9 h-9 sm:w-10 sm:h-10"
        />
      ) : (
        <img
          src={ToggleOffIcon}
          alt="Toggle Off"
          className="w-9 h-9 sm:w-10 sm:h-10"
        />
      )}
    </label>
  );

  const modalContent = (
    <div className="space-y-4">
      {[
        {
          key: "stayInformed",
          label: "Turn on to receive updates!",
          description:
            "Get notified about your subscriptions and new tool updates.",
        },
        {
          key: "joinYourTeam",
          label: "Turn on notifications to get timely reminders!",
          description: "Never miss a payment or renewal.",
        },
        {
          key: "referralJoins",
          label: "Turn on to discover new apps!",
          description:
            "Get recommendations based on your interests and subscription history.",
        },
        {
          key: "trackSpending",
          label: "Turn on to track your spending!",
          description:
            "Stay on top of your subscriptions and avoid hidden fees.",
        },
        {
          key: "neverMissOffer",
          label: "Never miss an offer!",
          description:
            "Get alerted about discounts, deals, and price changes on your subscriptions.",
        },
      ].map(({ key, label, description }) => (
        <div key={key}>
          <div className="flex items-center justify-between">
            <span className="text-black font-semibold text-sm sm:text-base">
              {label}
            </span>
            {renderToggle(key as keyof typeof notifications)}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">{description}</p>
        </div>
      ))}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      className="w-full max-w-xs sm:max-w-md md:max-w-md"
    >
      <div>{modalContent}</div>
    </Modal>
  );
};

export default NotificationsModal;
