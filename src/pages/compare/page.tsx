import Breadcrumbs from "../../components/compare-tools/BreadCrumbs";
import { useSidebar } from "../../context/SidebarContext";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useCallback, useState } from "react";
import SelectToolModal, {
  Tool,
} from "../../components/compare-tools/Modals/SelectToolModal";
import { fetchReviewsByToolId } from "../../utils/fetchReviewById";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { fetchAIComparison } from "../../services/tools-compare/openai-compare";
import InternalRatingTable from "../../components/compare-tools/Tables/InternalRating";
import SummaryTable from "../../components/compare-tools/Tables/Summary";
import FeaturesTable from "../../components/compare-tools/Tables/Features";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { logUserActivity } from "../../services/user/activityTrack";

export type ToolReviewData = {
  toolId: string;
  tool_name: string;
  reviews: any[];
  cumulativeRatings: any;
};

export type AIComparisonResult = {
  tools: {
    name: string;
    overview: string;
    pricing: string;
    bestFor: string;
    pros: string[];
    cons: string[];
  }[];
  featureMatrix: {
    feature: string;
    [toolName: string]: string; // dynamic keys like Zoom, ChatGPT
  }[];
  verdict: string;
};

export default function CompareTools() {
  const { toggleMobileMenu } = useSidebar();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [toolReviews, setToolReviews] = useState<ToolReviewData[]>([]);
  const [aiComparison, setAIComparison] = useState<AIComparisonResult | null>(
    null
  );
  const [loadingAI, setLoadingAI] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useCurrentUser();

  const fetchAllReviews = useCallback(async () => {
    if (!currentUser?.id || selectedTools.length === 0) return;

    try {
      const results = await Promise.all(
        selectedTools.map(async (tool) => {
          const { reviews, cumulativeRatings, toolTitle } =
            await fetchReviewsByToolId(tool.id);
          return {
            toolId: tool.id,
            tool_name: toolTitle,
            reviews,
            cumulativeRatings,
          };
        })
      );
      setToolReviews(results);
    } catch (err) {
      console.error("Failed to fetch reviews or AI comparison", err);
    }
  }, [selectedTools, currentUser?.id]);

  useEffect(() => {
    const getAIComparison = async () => {
      try {
        setLoadingAI(true); // Start loading
        const toolNames = selectedTools.map((tool) => tool.title);
        const { result } = await fetchAIComparison(toolNames);

        if (result) {
          setAIComparison(result);

          await logUserActivity({
          userId: currentUser?.id as string,
          action: "Generated AI comparison for selected tools",
          metadata: {
            service: "ai comparison",
            comparedTools: toolNames,
          },
        });
        }
      } catch (error) {
        console.error("Failed to fetch AI comparison:", error);
      } finally {
        setLoadingAI(false);
      }
    };

    if (selectedTools.length > 1) {
      getAIComparison();
    } else {
      setAIComparison(null);
    }
  }, [selectedTools]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTools((prev) => {
      const exists = prev.some((t) => t.id === tool.id);
      return exists ? prev : [...prev, tool];
    });
  };

  const handleRemoveTool = (tool_id: string) => {
    setSelectedTools((prev) => {
      const filterdTool = prev.filter((tool) => tool.id !== tool_id);
      return filterdTool;
    });
  };

  const handleDownloadPDF = async () => {
    const isMobile = window.innerWidth <= 768;

    if (!tableRef.current) return;
    const original = tableRef.current;

    // Clone for off-screen rendering
    const clone = original.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.top = "-10000px";
    clone.style.left = "0";
    clone.style.backgroundColor = "#fff";

    // Replace icons with emojis
    clone.querySelectorAll("svg").forEach((svg) => {
      const span = document.createElement("span");
      span.textContent = "ℹ️";
      span.style.fontSize = "14px";
      svg.replaceWith(span);
    });
    clone.querySelectorAll(".fa-user, [data-icon='user']").forEach((el) => {
      const span = document.createElement("span");
      span.textContent = "👤";
      span.style.fontSize = "14px";
      el.replaceWith(span);
    });

    // Append to body for measurement
    document.body.appendChild(clone);

    // Apply screen-specific styles
    if (isMobile) {
      clone.style.width = `${original.scrollWidth}px`;
      clone.style.minHeight = `${original.scrollHeight}px`;
      clone.style.overflow = "visible";
    } else {
      clone.style.width = `${original.scrollWidth}px`;
      clone.style.minHeight = `${original.scrollHeight}px`;
      clone.style.overflowX = "auto";
      clone.style.overflowY = "visible";
      clone.style.maxWidth = "100vw";
      clone.style.boxSizing = "border-box";
      clone.style.padding = "20px";
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: isMobile ? "portrait" : "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("tool-comparison.pdf");

    document.body.removeChild(clone);
  };

  return (
    <div>
      <div className=" w-full relative ">
        <div className="bg-gray-50 sticky top-0 z-20 pb-2 py-2 pt-3 lg:pt-0 lg:py-0">
          <div className="w-full flex justify-between items-center ">
            <div className="flex w-fit gap-3 ">
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                <svg
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={28}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#000000"
                      fillRule="evenodd"
                      d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
              <h1 className="text-xl md:text-[1.5rem] font-medium text-black mr-[24px]">
                Compare Tools
              </h1>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="border-none md:py-[10px] md:px-[20px] h-5 w-5 p-4 md:h-auto md:w-auto font-medium text-white text-sm md:rounded-[8px] rounded-[100px] bg-[#9013FE] flex gap-[8px] justify-center items-center transition-all duration-300 ease-linear hover:bg-[#FF8687] hover:shadow-[0_4px_12px_rgba(144,_19,_254,_0.2)]"
            >
              <FileDownloadOutlinedIcon sx={{ fontSize: "18px" }} />
              <span className="hidden md:block">Export PDF</span>
            </button>
          </div>
          <Breadcrumbs />
        </div>

        <div className="lg:h-[calc(100vh-120px)] pb-6 thin-scrollbar overflow-y-auto ">
          <div className="overflow-x-auto scrollbar-hidden mt-3 gap-2 flex items-center w-full">
            <div className="flex items-center gap-3">
              {selectedTools.map((tool, index) => (
                <div
                  className="group relative w-max rounded-[10px] bg-[#eef2ff] min-w-[100px] md:min-w-[150px] flex justify-center gap-2 p-[10px] md:p-[15px] border border-[#9013FE]"
                  key={index}
                >
                  <img src={tool.toolLogo} className="w-7 h-7" />
                  <p className="whitespace-nowrap ">{tool.title}</p>
                  <button
                    onClick={() => handleRemoveTool(tool.id)}
                    className="absolute right-[4px] top-[2px] md:top-[5px] text-[11px] md:text-[12px] hidden group-hover:block"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}
            </div>
            {selectedTools.length <= 2 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-white whitespace-nowrap gap-2 border-[2px] border-[#d1d5db] border-dashed rounded-[10px] p-[10px] md:p-[15px] flex items-center justify-center min-w-[100px] md:min-w-[150px] text-[#374151] transition-all duration-200 ease-linear hover:text-[#9013FE] hover:border-[#9013FE]"
              >
                <PlusOutlined /> Add Tool
              </button>
            )}
          </div>

          {selectedTools.length < 2 ? (
            selectedTools.length === 0 ? (
              <div className="p-[60px_20px] text-center text-[#374151]">
                <h3 className="mb-[10px] text-xl font-semibold">
                  Select tools to compare
                </h3>
                <p className="max-w-[500px] m-[0_auto]">
                  Choose from your library of tools to see a detailed comparison
                </p>
              </div>
            ) : (
              <div className="p-[60px_20px] text-center text-[#374151]">
                <h3 className="mb-[10px] text-xl font-semibold">
                  Select minimun of two tools
                </h3>
                <p className="max-w-[500px] m-[0_auto]">
                  Choose one more tool to get started
                </p>
              </div>
            )
          ) : loadingAI ? (
            <div className="text-center animate-pulse grid place-items-center  mt-36  text-gray-500">
              <div className="compare-loader">
                <div className="square-1 square"></div>
                <div className="square-2 square"></div>
              </div>
              <p>Generating insights...</p>
            </div>
          ) : (
            <div
              ref={tableRef}
              className="overflow-x-auto mt-5 rounded-[10px] shadow-[0_4px_20px_rgba(0,_0,_0,_0.05)]"
            >
              <div className="min-w-[650px] md:min-w-full w-full">
                {aiComparison && (
                  <InternalRatingTable toolReviews={toolReviews} />
                )}
                {aiComparison && (
                  <div className="max mt-6 text-[#1f2937]">
                    <h2 className="font-semibold mb-2">Comparison Summary</h2>

                    <SummaryTable aiComparison={aiComparison} />

                    {/* Features Matrix Table */}
                    <div className="mt-6">
                      <h2 className=" font-semibold mb-2 text-black">
                        Features Comparison
                      </h2>
                      <FeaturesTable aiComparison={aiComparison} />
                    </div>

                    {/* Final Verdict */}
                    <div className="mt-6">
                      <h3 className="font-bold  mb-2">Final Verdict</h3>
                      <p className="bg-white p-3 text-sm">
                        {aiComparison.verdict}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <SelectToolModal
          modalOpen={open}
          setModalOpen={setOpen}
          onToolSelect={handleToolSelect}
        />
      </div>
    </div>
  );
}
