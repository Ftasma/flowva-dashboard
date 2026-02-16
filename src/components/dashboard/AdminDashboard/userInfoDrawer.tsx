import { Drawer } from "antd";
import { Tabs, TabsProps } from "antd";
import ProfileDetails from "./profileDetails";
import ReferralDetails from "./referralDetails";

interface DrawerProps {
  selectedUser: any;
  drawerOpen: boolean;
  closeDrawer: () => void;
  refetch: ()=> void
}
export default function UserInfoDrawer({
  selectedUser,
  drawerOpen,
  closeDrawer,
  refetch,
}: DrawerProps) {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile",
      children: <ProfileDetails refetch={refetch} selectedUser={selectedUser} />,
    },
    {
      key: "2",
      label: "Referral",
      children: <ReferralDetails selectedUser={selectedUser}/>,
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
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={() => {}}
      />
    </Drawer>
  );
}
