import { Drawer } from "antd";
import { Tabs, TabsProps } from "antd";
import PointHistory from "./pointHistory";
import RewardHistory from "./claimedRewardHistory";

interface DrawerProps {
  selectedUser: any;
  drawerOpen: boolean;
  closeDrawer: () => void;
  refetch: () => void;
}
export default function UserRewardInfoDrawer({
  selectedUser,
  drawerOpen,
  closeDrawer,
  refetch,
}: DrawerProps) {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Point History",
      children: <PointHistory refetch={refetch} selectedUser={selectedUser} />,
    },
    {
      key: "2",
      label: "Rewards History",
      children: <RewardHistory refetch={refetch} selectedUser={selectedUser} />,
    },
  ];
  return (
    <Drawer
      title={selectedUser?.name || "User Details"}
      placement="right"
      onClose={closeDrawer}
      open={drawerOpen}
      width={400}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={() => {}} />
    </Drawer>
  );
}
