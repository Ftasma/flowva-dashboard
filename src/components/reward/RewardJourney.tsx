import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import StreakTracker from "./StreakTracker";
import { Calendar } from "lucide-react";
import { useUserProfile } from "../../context/UseProfileContext";
import { useState } from "react";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { Tool } from "../../context/CollectionToolsContext";
import RewardJourneySkeleton from "../skeletons/RewardJourneySkeleton";
import { Player } from "@lottiefiles/react-lottie-player";
import coinAnimation from "./coinAnimation.json";
// import LuckySpinModal from "./Modals/LuckySpinModal";
// import { useStreak } from "../../context/StreakContext";
import TtsSignupClaim from "./Modals/TthSignupClaim";

export default function RewardJourney() {
  const { rewardData, loading } = useUserProfile();
  const { allTools } = useDefaultTools();
  // const { spin, setSpin } = useStreak();
  const [ttsModal, setTtsModal] = useState<boolean>(false);

  const featuredTools = ["Reclaim"];
  const tts = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

  const handleVisit = async () => {
    window.open(tts[0].url, "_blank");
  };
  if (loading) return <RewardJourneySkeleton />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="shadow-[0_5px_15px_rgba(0,_0,_0,_0.05)] transition-all rounded-[16px] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] border border-[#f3f4f6] overflow-hidden duration-200">
        <div className="p-[1rem] relative border border-b-[#f3f4f6] bg-[#eef2ff] border-t-0 border-r-0 border-l-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <FontAwesomeIcon
              icon={Icons.Award}
              className="h-5 w-5 text-[#9013fe]"
            />
            Points Balance
          </h3>
        </div>
        <div className="p-[1rem]">
          <div className="flex justify-between items-center">
            <div className="font-extrabold text-[36px] text-[#9013fe] m-[10px_0]">
              {rewardData?.totalPoints}
            </div>
            <Player
              autoplay
              keepLastFrame
              src={coinAnimation}
              style={{ height: "100px", width: "100px" }}
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">
                Progress to <span className="font-medium">$5 Gift Card</span>
              </span>
              <span className="font-medium">
                {rewardData?.totalPoints}/5000
              </span>
            </div>
            <div className="h-[8px]  bg-[#e5e7eb] rounded-[9999px] overflow-hidden">
              <div
                className="h-full bg-gradient-to-br from-[#9013fe] to-[#FF9FF5] rounded-full transition-[width] duration-500 ease-in-out"
                style={{
                  width: `${((rewardData?.totalPoints ?? 0) * 100) / 5000}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {(() => {
                const totalPoints = rewardData?.totalPoints ?? 0;
                const goal = 5000;
                const percent = (totalPoints / goal) * 100;

                if (totalPoints >= goal) {
                  return "🎉 You've unlocked the $5 Gift Card! Great job!";
                } else if (percent >= 75) {
                  return "🔥 You're so close! Just a little more to go!";
                } else if (percent >= 50) {
                  return "👏 Halfway there — keep it going!";
                } else if (percent >= 25) {
                  return "💪 You're making progress — stay on it!";
                } else {
                  return "🚀 Just getting started — keep earning points!";
                }
              })()}
            </p>
          </div>
        </div>
      </div>

      <div className="shadow-[0_5px_15px_rgba(0,_0,_0,_0.05)] rounded-[16px] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] border border-[#f3f4f6] overflow-hidden transition-shadow duration-200">
        <div className="p-[1rem] relative border border-b-[#f3f4f6] bg-[#eef2ff] border-t-0 border-r-0 border-l-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <FontAwesomeIcon
              icon={Icons.Calender}
              className=" text-[#70D6FF] h-5 w-5 "
            />
            Daily Streak
          </h3>
        </div>
        <StreakTracker />
      </div>

      <div className="hover:translate-y-[-3px] hover:shadow-[0_8px_20px_rgba(0,_0,_0,_0.1)] bg-white rounded-[16px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] overflow-hidden border border-[#f3f4f6] transition-all duration-300 ease-in-out">
        <div className="p-4 bg-[linear-gradient(135deg,_#9013FE_0%,_#70D6FF_100%)] text-white relative overflow-hidden">
          <span className="tabsolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
          <div className="flex items-center justify-between">
            <h3 className="text-[1.25rem] font-bold relative z-[2]">
              Top Tool Spotlight
            </h3>{" "}
            <div className="overflow-hidden relative rounded-full size-10 md:size-16">
              <img src={tts[0]?.toolLogo} />
            </div>
          </div>
          <p className="text-lg">
            <strong> Reclaim</strong>
          </p>
        </div>
        <div className="p-[1rem]">
          <div className="flex justify-start mb-[1rem]">
            <div className="w-[24px] h-[24px] animate-pulse bg-[#eef2ff] rounded-[6px] flex items-center justify-center mr-[1rem] flex-shrink-0 text-[#9013fe]">
              <Calendar />
            </div>
            <div className="flex-1">
              <h4 className="mb-[0.25rem] font-semibold">
                Automate and Optimize Your Schedule
              </h4>
              <p className="text-[0.875rem] text-gray-600">
                Reclaim.ai is an AI-powered calendar assistant that
                automatically schedules your tasks, meetings, and breaks to
                boost productivity. Free to try — earn Flowva Points when you
                sign up!
              </p>
            </div>
          </div>
        </div>
        <div className="px-[1rem] py-[5px] flex justify-between items-center border border-t-[#f3f4f6] border-b-0 border-r-0 border-l-0">
          <button
            onClick={handleVisit}
            className="bg-[#9013fe] hover:bg-[#8628da] text-white py-2 px-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-0"
          >
            <FontAwesomeIcon icon={Icons.UserPlus} /> Sign up
          </button>
          <button
            onClick={() => setTtsModal(true)}
            className="bg-[linear-gradient(45deg,#9013FE,#FF8687)] text-white  py-2 px-4 rounded-full font-semibold text-sm"
          >
            <FontAwesomeIcon icon={Icons.Gift} /> Claim 50 pts
          </button>
        </div>
      </div>
      {/* <LuckySpinModal openModal={spin} setModalOpen={setSpin} /> */}
      <TtsSignupClaim
        toolName={tts[0]?.title}
        points="25"
        openModal={ttsModal}
        setModalOpen={setTtsModal}
      />
    </div>
  );
}
