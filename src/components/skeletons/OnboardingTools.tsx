import Skeleton from "react-loading-skeleton";

export default function OnboardingToolsSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid  grid-cols-3 gap-3 mb-[1.5rem] mt-5 w-full">
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className=" min-h-[80px] rounded-[16px] overflow-hidden "
          >
            <Skeleton className="w-full h-full rounded-[16px]" />
          </div>
        ))}
    </div>
  );
}
