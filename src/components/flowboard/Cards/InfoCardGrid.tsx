import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { Link } from "react-router-dom";
import { useUserProfile } from "../../../context/UseProfileContext";
interface InfoData {
  library_tools: number;
  subscriptions: number;
  collections: number;
}

function InfoCard({ library_tools, subscriptions, collections }: InfoData) {
  const {rewardData} = useUserProfile()
  return (
    <div>
      <div className="grid gap-[1.25rem] mb-[2rem] grid-cols-[repeat(1,1fr)] md:grid-cols-[repeat(2,1fr)] lg:grid-cols-[repeat(4,1fr)]">
        <Link
          to="/dashboard/library"
          className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
        >
          <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[#E9D4FF] text-[#9013FE]">
            <FontAwesomeIcon icon={Icons.Box} />
          </div>
          <h3 className="font-semibold mb-[0.5rem] text-[0.95rem] flex justify-between items-center">
            My Tools
            <span className="text-[1.5rem] text-[#9013FE]">
              {library_tools}
            </span>
          </h3>
          <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
            All tools in your personal library
          </p>
          <a className="text-[#9013FE] flex items-center text-[0.8rem]">
            View tools
            <FontAwesomeIcon
              className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
              icon={Icons.ArrowRight}
            />
          </a>
        </Link>

        <Link
          to="/dashboard/tech-stack"
          className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
        >
          <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1.25rem] text-[1rem] bg-[rgba(255,_107,_107,_0.1)] text-[#FF6B6B]">
            <FontAwesomeIcon icon={Icons.layerGroup} />
          </div>
          <h3 className="font-semibold mb-[0.5rem] text-[0.95rem] flex justify-between items-center">
            My Tech Stack
            <span className="text-[1.5rem] text-[#9013FE]">{collections}</span>
          </h3>
          <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
            Your curated tool collections
          </p>
          <a className="text-[#9013FE] flex items-center text-[0.8rem]">
            View stacks
            <FontAwesomeIcon
              className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
              icon={Icons.ArrowRight}
            />
          </a>
        </Link>

        <Link
          to="/dashboard/subscriptions"
          className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
        >
          <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[rgba(72,_187,_120,_0.1)] text-[#48BB78]">
            <FontAwesomeIcon icon={Icons.CreditCard} />
          </div>
          <h3 className="font-semibold mb-[0.5rem] text-[0.95rem] flex justify-between items-center">
            Subscriptions
            <span className="text-[1.5rem] text-[#9013FE]">
              {subscriptions}
            </span>
          </h3>
          <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
            Your tool subscriptions
          </p>
          <a className="text-[#9013FE] flex items-center text-[0.8rem]">
            View subscriptions
            <FontAwesomeIcon
              className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
              icon={Icons.ArrowRight}
            />
          </a>
        </Link>

        <Link
        to="/dashboard/earn-rewards"
          className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
        >
          <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[#E9D4FF] text-[#9013FE]">
            <FontAwesomeIcon icon={Icons.Gem} />
          </div>
          <h3 className="font-semibold mb-[0.5rem] text-[0.95rem] flex justify-between items-center">
            Rewards
            <span className="text-[1.5rem] text-[#9013FE]">{rewardData?.totalPoints}</span>
          </h3>
          <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
            Your available reward points
          </p>
          <a className="text-[#9013FE] flex items-center text-[0.8rem]">
            View rewards
            <FontAwesomeIcon
              className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
              icon={Icons.ArrowRight}
            />
          </a>
        </Link>
      </div>
    </div>
  );
}

export default InfoCard;
