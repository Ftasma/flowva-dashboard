import Skeleton from "react-loading-skeleton";

export default function PinnedBlogSkeleton() {
  return (
   <div className="my-10 md:my-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="h-[350px] md:h-[449px] w-full overflow-hidden rounded-[16px] relative">
        <Skeleton width={"100%"} height={"100%"} />
      </div>
      <div className="max-w-xl w-full space-y-3 flex flex-col gap-[24px]">
        <Skeleton width={"100px"} height={"15px"} />{" "}
        <Skeleton width={"100%"} height={"40px"} />
        <Skeleton width={"100%"} height={"20px"} />
        <Skeleton width={"100%"} height={"20px"} />
        <Skeleton width={"100%"} height={"20px"} />
      </div>
    </div>
  );
}
