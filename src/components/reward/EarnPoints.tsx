import RewardJourney from "./RewardJourney";
import EarnMore from "./MorePoints";
import Refer from "./Refer";
export default function EarnPoints() {
  return (
    <div>
      <div>
        <h2 className=" text-lg md:text-2xl my-3 text-black border border-l-[4px] border-t-0 border-b-0 border-r-0 border-[#9301fe] pl-[0.75rem] font-semibold">
          Your Rewards Journey
        </h2>
        <RewardJourney />
        <div className="space-y-6">
          <h2 className="text-lg md:text-2xl my-3 text-black border border-l-[4px] border-t-0 border-b-0 border-r-0 border-[#9301fe] pl-[0.75rem] font-semibold">
            Earn More Points
          </h2>
          <EarnMore />
        </div>
        <div className="space-y-6 ">
          <h2 className="text-lg md:text-2xl my-3 text-black border border-l-[4px] border-t-0 border-b-0 border-r-0 border-[#9301fe] pl-[0.75rem] font-semibold">
            Refer & Earn
          </h2>
          <Refer />
        </div>
      </div>
    </div>
  );
}
