import Skeleton from "react-loading-skeleton";

export default function BlogDetailsSkeleton() {
  return (
    <div className="w-full p-[14px] md:max-w-[80%] my-10 md:my-24">
       <Skeleton width={"100px"} height={"15px"} />
      <Skeleton width={"100%"} height={"30px"} />
      <Skeleton width={"100%"} height={"30px"} />
      <div className="flex justify-between items-center">
        <div className=" max-w-3xl">
          <Skeleton className="w-[250px] md:w-[400px]" height={20} />
          <Skeleton className="w-[250px] md:w-[400px]" height={20} />
        </div>
        <div className="flex gap-2 items-center">
          <div className="overflow-hidden flex justify-center items-center  text-white text-base font-manrope font-semibold rounded-full h-[24px] w-[24px]">
             <Skeleton circle={true} height={24} width={24} />
          </div>
          <Skeleton width={100} height={"10px"} />
        </div>
      </div>

      <div className="flex justify-between items-start gap-10 mt-16">
        <div className="w-[60%] space-y-3">
          <Skeleton width={"100%"} height={"20px"} />
          <Skeleton width={"100%"} height={"20px"} />
        </div>
      
      </div>
    </div>
  );
}
