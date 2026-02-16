// src/components/subscription/EmptyStateDashboard.tsx
import React from "react";
import { Card, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import PopularServicesGrid from "./PopularServicesGrid";
import { Mail, Plus } from "lucide-react";
import Button from "./ui/Button";

const { Title, Text } = Typography;

interface EmptyStateDashboardProps {
  onAddSubscription: () => void;
  onImportViaEmail: () => void;
}

const EmptyStateDashboard: React.FC<EmptyStateDashboardProps> = ({
  onAddSubscription,
  // onImportViaEmail,
}) => {
  return (
    <div className="mx-auto p-2">
      {/* Empty State */}
      <Card className="text-center mb-8 shadow-sm rounded-xl border-0">
        <div className="py-12 px-8">
          <div className="text-6xl text-[#9013FE] mb-6">
            <InboxOutlined />
          </div>
          <Title
            level={5}
            className="text-xl md:text-2xl font-bold text-gray-800 mb-4"
          >
            No subscriptions yet
          </Title>
          <Text className="text-gray-500 text-sm md:text-lg max-w-md mx-auto block mb-8 leading-relaxed">
            You haven't added any subscriptions yet. Track your recurring
            payments and manage all your subscriptions in one place.
          </Text>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button icon={Plus} onClick={onAddSubscription}>
              Add Subscription
            </Button>

            <Button
              variant="outline"
              icon={Mail}
              //   onClick={onImportViaEmail}
              onClick={() => {}}
            >
              Import via Email
            </Button>
          </div>
        </div>
      </Card>

      {/* Popular Services Grid */}
      <PopularServicesGrid />
    </div>
  );
};

export default EmptyStateDashboard;
