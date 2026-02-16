import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function RelatedBlogSkeleton() {
  return (
    <div className="space-y-10 w-full">
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="p-[24px] group w-full relative transition-all duration-500 cursor-pointer rounded-[24px] bg-[#FFFFFF1A] flex flex-col lg:flex-row  justify-between items-center gap-10"
          >
            {/* Image Skeleton */}
            <div className="h-[302px] w-full overflow-hidden rounded-[16px] relative">
              <Skeleton width="100%" height="100%" />
            </div>

            {/* Text Skeleton */}
            <div className="max-w-xl w-full flex flex-col gap-[24px]">
              {/* Tags + Date */}
              <div className="flex gap-5 items-center">
                <div className="flex gap-4 items-center">
                  <Skeleton width={60} height={20} />
                  <Skeleton width={60} height={20} />
                </div>
                <Skeleton width={80} height={15} />
              </div>

              {/* Title */}
              <Skeleton width="80%" height={36} />

              {/* Author */}
              <div className="flex items-center gap-3">
                <Skeleton width={24} height={24} circle />
                <Skeleton width={100} height={20} />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Skeleton width="100%" height={20} />
                <Skeleton width="95%" height={20} />
                <Skeleton width="90%" height={20} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
