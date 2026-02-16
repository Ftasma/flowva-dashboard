import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { Link } from "react-router-dom";

function RewardCardGrid() {
  return (
    <div className="bg-white rounded-[12px] p-[2rem] text-center mb-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
      <div className="w-[80px] h-[80px] rounded-full bg-[rgba(255,_107,_107,_0.1)] text-[#FF6B6B] flex justify-center items-center text-[2rem] m-[0_auto_1.5rem]">
        <FontAwesomeIcon icon={Icons.Gem} />
      </div>
      <h3 className="font-semibold text-[1.2srem] mb-[0.5rem]">
        Earn Your First Reward
      </h3>
      <p className="text-[#718096] mb-[1.5rem] max-w-[400px] ml-auto mr-auto">
        Start earning points by adding tools, writing reviews, and sharing your
        stacks. Redeem points for discounts and perks.
      </p>
      <Link to="/dashboard/earn-rewards" className="inline-flex h-[50px] w-full md:max-w-[350px] items-center justify-center  rounded-[50px] border-none font-bold text-sm md:text-base text-center transition-all duration-300 ease-in-out text-white bg-[#FF6B6B] hover:bg-[#e05a5a] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]">
        <FontAwesomeIcon
          className="mr-[.5rem] md:mr-[0.5rem]"
          icon={Icons.Gem}
        />{" "}
        Explore Rewards
      </Link>
    </div>
  );
}

export default RewardCardGrid;
