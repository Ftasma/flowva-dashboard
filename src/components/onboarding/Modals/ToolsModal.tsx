import { useEffect, useState } from "react";
import StepIndicator from "../StepIndicator";
import { useFormContext } from "../../../context/UserContext";
import OnboardingToolsSkeleton from "../../skeletons/OnboardingTools";
import { useDefaultTools } from "../../../context/DefaultToolsContext";

export default function Tools({
  handleNextStep,
  handlePrevStep,
  step,
}: {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  step: number;
}) {
  const { userData, setUserData } = useFormContext();
  const [showError, setShowError] = useState<boolean>(false);
  const { allTools, isLoading } = useDefaultTools();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showError) {
      const timeout = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showError]);

  const filteredTools = allTools.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTool = (toolId: string, toolTitle: string) => {
    const isAlreadySelected = userData.tools_id.includes(toolId);

    if (isAlreadySelected) {
      setUserData((prev) => ({
        ...prev,
        tools: prev.tools.filter((title) => title !== toolTitle),
        tools_id: prev.tools_id.filter((id) => id !== toolId),
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        tools: [...prev.tools, toolTitle],
        tools_id: [...prev.tools_id, toolId],
      }));
    }
  };

  const handleStep = () => {
    if (userData.tools.length > 0) {
      handleNextStep();
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="max-w-[560px] w-full bg-white box-border my-[2rem] p-[1.5rem] lg:p-[2.5rem] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative h-fit">
      <div className="h-[550px]  flex flex-col animate-fadeIn">
        <StepIndicator currentStep={step} />
        <h2 className="text-[#212529] text-[1.5rem] leading-[1.3rem] mb-[1rem] font-bold text-start">
          Which tools do you currently use?
        </h2>
        <p className="text-[0.95rem] text-[#495057] text-start">
          Select the tools you use regularly (we'll help track or find
          alternatives)
        </p>

        <div className="flex gap-[0.5rem] items-center my-2">
          <div className="relative group w-full ">
            <input
              type="text"
              name="tools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for tools..."
              className=" peer w-full h-full border py-[0.7rem] px-[1rem] text-base  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md   outline-none focus:border-[#9013fe]"
              required
            />
            <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
          </div>
          <button className="rounded-[8px] px-[1.5rem] py-[0.75rem] bg-[#9013FE] text-white transition-all border-none duration-200  hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto rounded-[12px] category-list h-full p-1 border-b">
          {isLoading ? (
            <OnboardingToolsSkeleton cards={8} />
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-[1.5rem]">
              {filteredTools.length === 0 ? (
                <p>No match found</p>
              ) : (
                filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    className={`py-[0.75rem] px-[0.5rem] flex flex-col items-center text-[0.85rem] text-center transition-all  duration-200 ease-in-out rounded-[16px] border-[2px] ${
                      userData.tools_id.includes(tool.id)
                        ? "border-[#9013FE] bg-[rgba(157,_78,_221,_0.05)]"
                        : "border-[#E9ECEF] hover:border-[#C77DFF] hover:translate-y-[-2px]"
                    }`}
                    onClick={() => toggleTool(tool.id, tool.title)}
                  >
                    <div className="w-[24px] h-[24px] mb-[0.5rem] text-[1.25rem]">
                      {tool.toolLogo ? (
                        <img
                          src={tool.toolLogo}
                          alt={tool.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        "🛠️"
                      )}
                    </div>
                    {tool.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex flex-row-reverse mt-auto pt-[2rem] w-full gap-[1rem]">
          <button
            onClick={handleStep}
            className="inline-flexb w-full justify-center font-semibold items-center hover:bg-[#A29BFE] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] duration-[0.25s] hover:translate-y-[-2px] active:translate-y-0 text-white bg-[#9013FE] rounded-[100px] py-[12px] px-[20px] border-none"
          >
            Continue
          </button>
          <button
            onClick={handlePrevStep}
            className="bg-transparent w-full font-medium border-none shadow-none rounded-[16px] hover:text-[#9013FE] hover:underline text-sm"
          >
            Back
          </button>
        </div>
      </div>
      {showError && (
        <div className="w-fit fixed top-5 left-1/2 transform -translate-x-1/2 bg-[#FFEBEE] text-[#C62828] px-6 py-3 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000] font-medium opacity-100 transition-opacity duration-300 ease-in-out flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Please select one or more tools</span>
        </div>
      )}
    </div>
  );
}
