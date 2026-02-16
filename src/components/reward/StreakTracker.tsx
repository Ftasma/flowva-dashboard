import { Zap } from "lucide-react";
import { useStreak } from "../../context/StreakContext";
import { useState } from "react";
import { useUserProfile } from "../../context/UseProfileContext";
import PointSuccessModal from "./Modals/SuccessModal";
import { logUserActivity } from "../../services/user/activityTrack";
import { useCurrentUser } from "../../context/CurrentUserContext";

const days = ["M", "T", "W", "T", "F", "S", "S"];

const StreakTracker = () => {
  const { streak, isClaimed, claimToday, refetchStreak } = useStreak();
  const { refetchRewardData } = useUserProfile();
  const { currentUser } = useCurrentUser();

  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7;

  //UTC
  // const todayUTC = new Date(
  //   Date.now() + new Date().getTimezoneOffset() * 60000
  // );
  // const todayIndex = (todayUTC.getUTCDay() + 6) % 7;

  const displayStreak = Math.min(streak, 7);
  const fillEndIndex = isClaimed ? todayIndex : (todayIndex - 1 + 7) % 7;
  const startIndex = (fillEndIndex - displayStreak + 1 + 7) % 7;

  const handleClaim = async () => {
    setClaiming(true);
    await claimToday();
    await refetchStreak();
    setShowModal(true);
    setShowConfetti(true);
    await refetchRewardData();
    await logUserActivity({
      userId: currentUser?.id as string,
      action: "Claimed daily streak points",
      metadata: {
        service: "daily rewards",
        streak_count: streak + `${streak > 1 ? " days" : " day"}`,
        reward_points: streak > 6 ? 10 : 5,
      },
    });
    setClaiming(false);
  };

  return (
    <div className="p-4">
      <div className="font-extrabold text-[36px] text-[#9013fe] mb-2">
        {streak} day{streak > 1 && "s"}
      </div>

      <div className="flex mt-4 space-x-2 justify-center">
        {days.map((label, i) => {
          const isFilled =
            displayStreak === 0
              ? false
              : startIndex <= fillEndIndex
              ? i >= startIndex && i <= fillEndIndex
              : i >= startIndex || i <= fillEndIndex;
          const isCurrentDay = i === todayIndex;

          const baseClass =
            isFilled && !isClaimed
              ? "bg-[#70D6FF] border-4 border-cyan-200 text-white"
              : isFilled && isClaimed
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-200 text-gray-500";

          const currentDayRing = isCurrentDay
            ? "ring-2 ring-[#9013fe] ring-offset-2"
            : "";

          return (
            <div
              key={i}
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${baseClass} ${currentDayRing}`}
            >
              {label}
            </div>
          );
        })}
      </div>
      <p className="text-[0.875rem] text-gray-600 text-center mt-3">
        Check in daily to to earn +5 points
      </p>

      <button
        disabled={isClaimed || claiming}
        onClick={handleClaim}
        className={`mt-3 w-full py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
          isClaimed
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#9013fe] text-white hover:shadow-[0_4px_12px_rgba(144,_19,_254,_0.2)] hover:translate-y-[-2px]"
        }`}
      >
        <Zap className="h-5 w-5" />
        {claiming
          ? "Claiming..."
          : isClaimed
          ? "Claimed Today"
          : "Claim Today's Points"}
      </button>

      <PointSuccessModal
        modalOpen={showModal}
        show={showConfetti}
        onClose={() => setShowModal(false)}
        points={streak > 6 ? 10 : 5}
        title=" Level Up! 🎉"
        message="You've claimed your daily points!
          Come back tomorrow for more!"
        emoji="💎"
      />
    </div>
  );
};

export default StreakTracker;
