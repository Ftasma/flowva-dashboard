import Skeleton from "react-loading-skeleton";

export default function CategorySkeleton() {
  return (
    <div className="lg:flex md:gap-16 items-center">
      <Skeleton height={40} width={220} />
      <div className="flex items-center mt-3 lg:mt-0 gap-4">
        <div className=" rounded-3xl overflow-hidden relative h-[44px] lg:w-40 w-36">
          <Skeleton height="100%" width="100%" borderRadius="1.5rem" />
        </div>
        <div className=" rounded-3xl overflow-hidden relative h-[44px] w-28 ">
          <Skeleton height="100%" width="100%" borderRadius="1.5rem" />
        </div>
        <div className=" rounded-3xl overflow-hidden relative h-[44px] w-28 ">
          <Skeleton height="100%" width="100%" borderRadius="1.5rem" />
        </div>
      </div>
    </div>
  );
}
