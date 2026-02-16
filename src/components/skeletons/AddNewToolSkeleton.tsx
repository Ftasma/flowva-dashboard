import Skeleton from "react-loading-skeleton";

export default function AddNewToolSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] gap-[0.75rem]">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-[70px] md:h-[120px] relative overflow-hidden  rounded-[8px] "
          >
            <Skeleton className="w-full h-full" />
          </div>
        ))}
    </div>
  );
}
