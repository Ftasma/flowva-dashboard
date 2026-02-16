import Skeleton from "react-loading-skeleton";

export default function SubscriptionDashboardSkeleton() {
  return (
    <div className="lg:h-[calc(100vh-60px)] lg:mt-2 [scrollbar-width:none] [-ms-overflow-style:none] overflow-x-hidden">
      {/* Quick actions skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 mt-8 lg:mt-8">
        <Skeleton height={24} width={0} />
        <div className="flex gap-3">
          <Skeleton height={40} width={150} className="rounded-lg" />
          <Skeleton height={40} width={160} className="rounded-lg" />
        </div>
      </div>

      {/* Summary Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-28">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <Skeleton height={16} width={120} className="mb-2" />
            <Skeleton height={32} width={80} className="mb-2" />
            <Skeleton height={14} width="100%" />
          </div>
        ))}
      </div>

      {/* Active Subscriptions skeleton */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Skeleton height={28} width={200} />
          <div className="flex gap-3">
            <Skeleton height={40} width={80} className="rounded-lg" />
            <Skeleton height={40} width={80} className="rounded-lg" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4">
            <Skeleton height={40} width="100%" className="mb-4" />
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-t border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} className="rounded-lg" />
                  <div>
                    <Skeleton height={16} width={120} className="mb-1" />
                    <Skeleton height={12} width={80} />
                  </div>
                </div>
                <Skeleton height={20} width={70} className="rounded-full" />
                <Skeleton height={16} width={100} />
                <Skeleton height={16} width={80} />
                <Skeleton height={32} width={80} className="rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Renewals skeleton */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton height={28} width={200} />
          <Skeleton height={40} width={100} className="rounded-lg" />
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} className="rounded-lg" />
                  <div>
                    <Skeleton height={16} width={150} className="mb-1" />
                    <Skeleton height={12} width={100} />
                  </div>
                </div>
                <Skeleton height={32} width={120} className="rounded-lg" />
              </div>
              <Skeleton height={14} width="100%" />
            </div>
          ))}
        </div>
      </div>

      {/* Unused Tools skeleton */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton height={28} width={150} />
          <Skeleton height={40} width={100} className="rounded-lg" />
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="border-t border-gray-100 first:border-t-0 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton height={40} width={40} className="rounded-lg" />
                  <div>
                    <Skeleton height={16} width={120} className="mb-1" />
                    <Skeleton height={12} width={80} />
                  </div>
                </div>
                <Skeleton height={32} width={100} className="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
