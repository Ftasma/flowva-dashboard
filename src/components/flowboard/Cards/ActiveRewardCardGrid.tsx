import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useDefaultTools } from "../../../context/DefaultToolsContext";
import { useUserProfile } from "../../../context/UseProfileContext";
import { Tool } from "../../../interfaces/toolsData";
import { Link } from "react-router-dom";

export default function ActiveRewardCardGrid() {
  const { allTools } = useDefaultTools();

  const { rewardData } = useUserProfile();
  const featuredTools = ["Crankwheel", "Campaigner"];
  const partneredTools = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

  const reviewFeaturedTools = ["Reclaim", "Campaigner"];
  const reviewPartneredTools = reviewFeaturedTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);
  return (
    <div className="bg-white rounded-[12px] p-6 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0] relative overflow-hidden">
      <div className="flex items-center justify-between mb-[1.5rem]">
        <h2 className="font-semibold flex items-center text-[1.1rem]">
          <FontAwesomeIcon
            className="mr-[0.75rem] text-[#9013fe]"
            icon={Icons.Gem}
          />
          Your Rewards
        </h2>
        <div className="flex items-center bg-[#F7FAFC] text-[#2D3748] p-[0.5rem_1rem] rounded-[8px] text-xs md:text-base font-bold border border-[#E2E8F0]">
          <FontAwesomeIcon
            className=" text-[#FF6B6B] mr-[0.5rem]"
            icon={Icons.Gem}
          />
          {rewardData?.totalPoints} Points
        </div>
      </div>

      <p className="text-[#718096] mb-[1.5rem] text-[0.95rem]">
        Try or review new tools to earn points
      </p>

      <div className="mb-[2rem]">
        <div className="flex justify-between items-center mb-[1rem]">
          <h3 className="font-semibold text-[1.1rem]  flex items-center">
            <FontAwesomeIcon
              className="mr-[0.75rem] text-[#9013fe]"
              icon={Icons.PlusCircle}
            />
            Try New Tools
          </h3>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-[1rem]">
          {partneredTools.map((tool, index) => (
            <Link
              to="/dashboard/earn-rewards"
              key={index}
              className="bg-[#F7FAFC] group rounded-[8px] p-[1rem] border border-[#E2E8F0] relative cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:translate-y-[-3px] hover:border-[#9013fe] transition-all duration-300 ease-in-out"
            >
              <img src={tool.toolLogo} alt="logo" className="w-7 h-7 " />
              <h4 className="font-semibold text-sm md:text-base  mb-[0.25rem]">
                {tool.title}
              </h4>

              <div
                key={index}
                className="text-[0.8rem] text-[#718096] mb-[0.5rem]"
              >
                {tool.category[0]}
              </div>

              <div className="flex  items-center text-[0.85rem] text-[#FF6B6B]">
                <FontAwesomeIcon className="mr-[0.5rem]" icon={Icons.Gem} />
                +10 points
              </div>
              <div className="absolute right-4 top-4 group-hover:opacity-100 bg-[#9013fe] text-white border-none px-2 py-1 rounded text-xs font-medium cursor-pointer opacity-0 transition-all duration-300 ease-in-out">
                Try Now
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-[2rem]">
        <div className="flex justify-between items-center mb-[1rem]">
          <h3 className="font-semibold text-[1.1rem]  flex items-center">
            <FontAwesomeIcon
              className="mr-[0.75rem] text-[#9013fe]"
              icon={Icons.Star}
            />
            Review Tools
          </h3>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-[1rem]">
          {reviewPartneredTools.map((tool, index) => (
            <Link
              to="/dashboard/earn-rewards"
              key={index}
              className="bg-[#F7FAFC] group rounded-[8px] p-[1rem] border border-[#E2E8F0] relative cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:translate-y-[-3px] hover:border-[#9013fe] transition-all duration-300 ease-in-out"
            >
              <img src={tool.toolLogo} alt="logo" className="w-7 h-7 " />
              <h4 className="font-semibold text-sm md:text-base  mb-[0.25rem]">
                {tool.title}
              </h4>
              <div className="text-[0.8rem] text-[#718096] mb-[0.5rem]">
                {tool.category[0]}
              </div>
              <div className="flex  items-center text-[0.85rem] text-[#FF6B6B]">
                <FontAwesomeIcon className="mr-[0.5rem]" icon={Icons.Gem} />
                +15 points
              </div>
              <div className="absolute right-4 top-4 group-hover:opacity-100 bg-[#9013fe] text-white border-none px-2 py-1 rounded text-xs font-medium cursor-pointer opacity-0 transition-all duration-300 ease-in-out">
                Review Now
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          to="/dashboard/earn-rewards"
          className="block w-full md:max-w-[350px] h-[50px] rounded-[50px] text-center py-3 bg-[#9013fe] text-white border-none  font-semibold cursor-pointer transition-all duration-300 ease-in-out mt-6 hover:bg-[#7c0fe0] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)] hover:translate-y-[-2px]"
        >
          See more rewards
        </Link>
      </div>
    </div>
  );
}
