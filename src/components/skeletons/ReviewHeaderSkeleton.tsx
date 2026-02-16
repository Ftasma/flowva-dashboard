import Skeleton from "react-loading-skeleton";

function ReviewHeaderSkeleton() {
  return (
    <div className="flex items-center gap-8">
      <div className="h-14 w-12">
        <Skeleton className="h-full" />
      </div>
      <div>
        <Skeleton width={100} height={20} />
        <Skeleton width={200} height={20} className="mt-3" />
      </div>
    </div>
  );
}

export default ReviewHeaderSkeleton;
