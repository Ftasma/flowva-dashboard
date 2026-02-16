import Skeleton from "react-loading-skeleton";

export default function BlogCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-[24px] group relative transition-all duration-500 rounded-[16px] p-[16px] border"
          >
            <div className="h-[302px] w-full overflow-hidden rounded-[16px] relative">
              <Skeleton className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-[32px] font-semibold font-manrope">
                <Skeleton className="w-full h-[20px]" />
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="overflow-hidden flex justify-center items-center  text-white text-base font-manrope font-semibold rounded-full h-[24px] w-[24px]">
                    <Skeleton circle={true} height={24} width={24} />
                  </div>
                  <Skeleton width={100} height={"10px"} />
                </div>
                <span className="text-sm font-manrope font-semibold">
                  <Skeleton className="w-full h-[20px]" />
                  <Skeleton className="w-full h-[20px]" />
                </span>
              </div>
              <p className="text-[#767676] font-manrope mt-2">
                <Skeleton className="w-full h-[20px]" />
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
