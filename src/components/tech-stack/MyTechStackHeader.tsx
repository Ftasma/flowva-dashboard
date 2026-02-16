import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import NotificationBell from "../notifications/NotificationBell";

interface MyTechStackHeaderProps {
  toggleMobileMenu: () => void;
  openCreate: () => void;
}

export function MyTechStackHeader({
  toggleMobileMenu,
  openCreate,
}: MyTechStackHeaderProps) {
  return (
    <div className=" bg-gray-50 flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={toggleMobileMenu}>
          <svg
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width={28}
          >
            <path
              fill="#000000"
              fillRule="evenodd"
              d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
            ></path>
          </svg>
        </button>

        <h1 className="text-xl md:text-2xl font-medium">Tech Stacks</h1>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          icon={<PlusOutlined />}
          type="primary"
          className="rounded-[100px] h-5 w-5 p-4 md:w-auto md:p-2 md:h-9 font-semibold"
          onClick={openCreate}
          style={{
            backgroundColor: "#9013FE",
            borderColor: "#9013FE",
          }}
        >
          <span className="hidden md:block">New Tech Stack</span>
        </Button>
        <div className="mt-2">
          <NotificationBell />
        </div>
      </div>
    </div>
  );
}
