import Skeleton from "react-loading-skeleton";

function FlowboardIntroSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid gap-[1.25rem] grid-cols-[repeat(1,1fr)] md:grid-cols-[repeat(2,1fr)] lg:grid-cols-[repeat(4,1fr)]">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-[170px] md:h-[210px] relative overflow-hidden  rounded-[12px]"
          >
            <Skeleton className="w-full h-full" />
          </div>
        ))}
    </div>
  );
}

export default FlowboardIntroSkeleton;
