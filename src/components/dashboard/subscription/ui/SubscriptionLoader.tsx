import React from "react";
import Skeleton from "react-loading-skeleton";
import SubscriptionDashboardSkeleton from "../../../skeletons/SubscriptionDashboardSkeleton";

export const SubscriptionLoader: React.FC = ({}) => {
  return (
    <div className="overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] bg-gray-50 pt-1 pb-2">
      <div className="fixed lg:static top-0 left-0 right-0 z-20 -mt-[2px] bg-gray-50 flex py-2 pt-3 lg:pt-0 lg:py-0 px-4 lg:px-0 overflow-hidden">
        <div className="sticky top-0 left-0 right-0 z-20 bg-gray-50 gap-3 flex items-center overflow-hidden">
          <button className="lg:hidden">
            <Skeleton height={28} width={28} />
          </button>
          <Skeleton height={32} width={200} />
        </div>
      </div>
      <div className="px-4 lg:px-0">
        <SubscriptionDashboardSkeleton />
      </div>
    </div>
  );
};
