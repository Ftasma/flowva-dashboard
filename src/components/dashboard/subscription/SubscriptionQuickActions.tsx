import { AlarmCheck } from "lucide-react";
import Button from "./ui/Button";
import { Button as AndButton } from "antd";

import NotificationBell from "../../notifications/NotificationBell";
import { PlusOutlined } from "@ant-design/icons";

interface SubHeaderQuickActionPropType {
  openModal: (str: "addSubscription" | "manageReminders") => any;
}

export const SubscriptionQuickActions: React.FC<
  SubHeaderQuickActionPropType
> = ({ openModal }) => {
  return (
    <div className="flex gap-3 items-center">
      {/* Add Subscription Button */}
      <AndButton
        icon={<PlusOutlined />}
        type="primary"
        className="rounded-[100px] h-5 w-5 p-4 md:w-auto md:p-2 md:h-9 font-semibold"
        onClick={() => openModal("addSubscription")}
        style={{
          backgroundColor: "#9013FE",
          borderColor: "#9013FE",
        }}
      >
        <span className="hidden md:block">Add Subscription</span>
      </AndButton>

      {/* Desktop: Text button */}
      <Button
        variant="outline"
        icon={AlarmCheck}
        className="text-sm font-medium hidden md:flex"
        onClick={() => openModal("manageReminders")}
      >
        Manage Reminders
      </Button>

      {/* Mobile: Icon-only button */}
      <Button
      variant="outline"
        icon={AlarmCheck}
        className="text-sm md:hidden"
        onClick={() => openModal("manageReminders")}
      />

      {/* Notification Bell */}
      <div className="mt-2">
        <NotificationBell />
      </div>
    </div>
  );
};
