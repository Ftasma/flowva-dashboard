import Skeleton from "react-loading-skeleton";

export default function ReviewSkeleton({ cards }: { cards: number }) {
  return (
    <div className="flex flex-col gap-[16px]">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="-[20px] rounded-xl">
            <div className="flex justify-between mb-[12px] items-center">
              <div className="flex gap-[12px] items-center">
                <div className="w-10 h-10 rounded-full">
                  <Skeleton circle className="w-full h-full" />
                </div>
                <div>
                  <span className=" block">
                    <Skeleton width={100} />
                  </span>
                  <span className="block">
                    <Skeleton width={100} />
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-[16px]">
              <Skeleton height={20} className="w-full" />
              <Skeleton height={20} className="w-full" />
              <Skeleton height={20} className="w-full" />
            </div>
            <div className="flex justify-between">
              <div className="flex gap-[6px]">
                <span className="p-[4px_8px] rounded-[4px] ">
                  <Skeleton width={200} />
                </span>
                <span className="p-[4px_8px] rounded-[4px]">
                  <Skeleton width={200} />
                </span>
              </div>
              <div className="flex gap-[12px]">
                <div className="flex items-center justify-center gap-[6px] ">
                  <Skeleton width={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
