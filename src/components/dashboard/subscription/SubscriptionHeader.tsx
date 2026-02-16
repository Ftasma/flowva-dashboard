import React from "react";
import { SubscriptionQuickActions } from "./SubscriptionQuickActions";

interface SubHeaderType {
  toggleMobileMenu: () => void;
  openModal: (str: "addSubscription" | "manageReminders") => any;
}

export const SubscriptionHeader: React.FC<SubHeaderType> = ({
  toggleMobileMenu,
  openModal,
}) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
      <div className=" bg-gray-50 flex justify-between items-center w-full">
        <div className="flex items-center gap-3 ">
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
          <h1 className="text-xl md:text-2xl font-medium">Subscriptions</h1>
        </div>

        {/* Quick Action Buttons */}
        <SubscriptionQuickActions openModal={openModal} />
      </div>
    </div>
  );
};
