import Skeleton from "react-loading-skeleton";

function OnboardingCatSkeleton({ cards }: { cards: number }) {
  return (
    <div className="space-y-6 mt-3 p-4">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="rounded-full h-9 w-9 relative overflow-hidden">
              <Skeleton circle className="w-full h-full" />
            </div>
            <div className="w-40 h-7 mt-4">
              <Skeleton className="w-full" />
            </div>
          </div>
        ))}
    </div>
  );
}

export default OnboardingCatSkeleton;
