import Skeleton from "react-loading-skeleton";

export default function RewardJourneySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="w-full h-[350px]">
        <Skeleton height={300} className="w-full"/>
      </div>
      <div className="w-full  h-[350px]">
        <Skeleton height={300} className="w-full"/>
      </div>
      <div className="full  h-[350px]">
        <Skeleton height={300} className="w-full"/>
      </div>
    </div>
  );
}
