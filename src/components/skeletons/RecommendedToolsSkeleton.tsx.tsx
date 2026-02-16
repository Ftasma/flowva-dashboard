import Skeleton from "react-loading-skeleton";

export default function RecommendedToolsSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-3">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className=" h-[60px] rounded-lg overflow-hidden "
          >
            <Skeleton className="w-full h-full" />
          </div>
        ))}
    </div>
  );
}
