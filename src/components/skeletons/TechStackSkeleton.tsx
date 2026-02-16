import Skeleton from "react-loading-skeleton";

export default function TechStackCardSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="h-[275px] relative overflow-hidden rounded-2xl">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
    </div>
  );
}
