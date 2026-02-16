import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import RecommendedToolsSkeleton from "../../../components/skeletons/RecommendedToolsSkeleton.tsx";
import { Tool } from "../../../interfaces/toolsData";
import { Link } from "react-router-dom";
import CustomToolIcon from "../../../assets/custom_tool.png";
function RecentToolsCardGrid({
  tools,
  loading,
}: {
  tools: Tool[];
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-[12px] p-[1.5rem] mb-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold flex items-center text-lg">
          <FontAwesomeIcon
            className=" mr-[0.75rem] text-[#9013FE]"
            icon={Icons.Star}
          />
          Recent Tools
        </h2>
        <Link
          to="/dashboard/library"
          className="text-[#9013FE] no-underline text-sm font-medium transtion-all duration-300 ease-in-out hover:underline"
        >
          View All
        </Link>
      </div>
      {loading ? (
        <RecommendedToolsSkeleton cards={6} />
      ) : (<>
        <div className="grid md:hidden grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-3">
          {tools?.slice(0, 3).map((tool, index) => (
            <Link
              to={tool.url}
              target="_blanck"
              key={index}
              className=" group  flex items-center p-3 rounded-lg bg-[#F7FAFC] transition-all duration-300 ease-in-out border border-[#E2E8F0] hover:bg-[rgba(144,_19,_254,_0.1)] relative  hover:border-[#E9D4FF] hover:translate-y-[-2px] "
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3  bg-[rgba(255,_107,_107,_0.1)]">
                <img
                  src={tool.toolLogo ?? CustomToolIcon}
                  className="w-full h-full"
                />
              </div>
              <div className="text-[0.9rem] font-semibold">{tool.title}</div>
              <button className="absolute right-[0.75rem] top-[50%] group-hover:translate-y-[-50%] bg-[rgba(144,_19,_254,_0.1)] border-none w-[24px] h-[24px] rounded-[6px] flex items-center justify-center cursor-pointer opacity-0 transition-all duration ease-in-out text-[#9013FE] group-hover:opacity-100">
                <FontAwesomeIcon icon={Icons.ExternalLink} />
              </button>
              <div className="bg-black  text-white px-2 p-[1px] group-hover:opacity-100 absolute right-0 left-0 m-auto w-fit -bottom-[15px] text-xs rounded-[4px] opacity-0 pointer-events-none">
                Open Tool
              </div>
            </Link>
          ))}
        </div>
        <div className=" hidden lg:grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-3">
          {tools?.slice(0, 6).map((tool, index) => (
            <Link
              to={tool.url}
              target="_blanck"
              key={index}
              className=" group  flex items-center p-3 rounded-lg bg-[#F7FAFC] transition-all duration-300 ease-in-out border border-[#E2E8F0] hover:bg-[rgba(144,_19,_254,_0.1)] relative  hover:border-[#E9D4FF] hover:translate-y-[-2px] "
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3  bg-[rgba(255,_107,_107,_0.1)]">
                <img
                  src={tool.toolLogo ?? CustomToolIcon}
                  className="w-full h-full"
                />
              </div>
              <div className="text-[0.9rem] font-semibold">{tool.title}</div>
              <button className="absolute right-[0.75rem] top-[50%] group-hover:translate-y-[-50%] bg-[rgba(144,_19,_254,_0.1)] border-none w-[24px] h-[24px] rounded-[6px] flex items-center justify-center cursor-pointer opacity-0 transition-all duration ease-in-out text-[#9013FE] group-hover:opacity-100">
                <FontAwesomeIcon icon={Icons.ExternalLink} />
              </button>
              <div className="bg-black  text-white px-2 p-[1px] group-hover:opacity-100 absolute right-0 left-0 m-auto w-fit -bottom-[15px] text-xs rounded-[4px] opacity-0 pointer-events-none">
                Open Tool
              </div>
            </Link>
          ))}
        </div>
      </>)}
    </div>
  );
}

export default RecentToolsCardGrid;
