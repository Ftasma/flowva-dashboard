import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addToLibrary } from "../../services/my-library/libraryService";
import AddNewToolSkeleton from "../skeletons/AddNewToolSkeleton";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { logUserActivity } from "../../services/user/activityTrack";

interface Home {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTools: () => void;
  hideTab: boolean;
}

interface Tool {
  id: string;
  libraryId?: any;
  title: string;
  description: string;
  toolLogo?: string;
  isAITool?: boolean;
  isAitool?: boolean;
  isAiTool?: boolean;
  usersIcon?: string;
  url: string;
  category: string[];
  bgColor?: string;
  textColor?: string;
  isCustom?: boolean;
}

export default function Homepage({
  setModalOpen,
  refreshTools,
  hideTab,
}: Home) {
  const navigate = useNavigate();
  const { allTools, isLoading } = useDefaultTools();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolId, setToolId] = useState<string[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [toolAdded, setToolAdded] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  const popularTools = ["Figma", "Notion", "Slack", "Asana", "ChatGPT", "Zoom"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleToolSelection = (toolTitle: string, tool: Tool) => {
    const id = tool.id;
    if (!id) return;

    if (hideTab) {
      // Single select mode when hideTab is true
      if (selectedTool?.id === id) {
        setSelectedTool(null);
      } else {
        setSelectedTool(tool);
      }
    } else {
      // Multi-select mode (original behavior)
      setSelectedTools((prev) =>
        prev.includes(toolTitle)
          ? prev.filter((title) => title !== toolTitle)
          : [...prev, toolTitle]
      );

      setToolId((prev) =>
        prev.includes(id)
          ? prev.filter((toolId) => toolId !== id)
          : [...prev, id]
      );
    }
  };

  const filteredTools = allTools
    .filter((tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 8);

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    setIsLoading(true);
    for (const id of toolId) {
      const { status, error, duplicate } = await addToLibrary(
        currentUser.id,
        id
      );

      setIsLoading(false);

      if (status === 409 && duplicate) {
        toast.info("This tool is already in your library.");
      } else if (
        status === 403 &&
        error?.toLowerCase().includes("tool limit")
      ) {
        toast.warning(
          "You've reached your tool limit. Upgrade to Pro to save more tools."
        );
      } else if (status !== 200) {
        toast.error(`Something went wrong: ${error || "Unknown error"}`);
      } else {
        await logUserActivity({
          userId: currentUser.id,
          action: "Added a tool to library",
          metadata: {
            service: "library",
            toolId: toolId,
            toolName: hideTab ? selectedTool?.title : selectedTools.join(", "),
          },
        });
        await NotificationHelpers.onToolAdded(
          selectedTools.join(","),
          currentUser?.id
        );
        setToolAdded(true);
      }
    }
  };

  const handleConnect = async () => {
    if (!selectedTool) return;
    navigate("/dashboard/subscriptions", {
      state: {
        tool: selectedTool,
        showModal: true,
        modal: "addSubscription",
        isCustom: false,
      },
    });
    setModalOpen(false);
  };

  const handleAddMoreTools = async () => {
    setToolAdded(false);
    setSelectedTools([]);
    setToolId([]);
    setSearchQuery("");
    await refreshTools();
  };

  return (
    <>
      {toolAdded ? (
        <div className="py-[1.5rem] md:py-[2rem]">
          <h3 className="text-center text-[1.1rem] font-bold md:text-[1.25rem] mb-[0.5rem] text-[#020617]">
            {selectedTools.length}{" "}
            {selectedTools.length > 1 ? "Tools Added!" : "Tool Added!"}
          </h3>
          <p className="text-center text-[#6c757d]  mb-[1rem] text-[0.9rem] md:text-[1rem] md:mb-[1.5rem]">
            {" "}
            your tool has been added to your library
          </p>
          <div className=" w-full justify-center flex gap-4 mt-4">
            <button
              type="button"
              onClick={handleAddMoreTools}
              className="rounded-[100px] p-[0.70rem_.5rem]  md:p-[0.75rem_1rem] text-xs font-semibold md:text-[0.95rem] transition-all duration-200 bg-white text-[#020617] border-2 border-[#e9ecef] "
            >
              Add More Tools
            </button>

            <button
              type="button"
              onClick={async () => {
                setToolAdded(false);
                setSelectedTools([]);
                setToolId([]);
                setModalOpen(false);
                setSearchQuery("");
                await refreshTools();
              }}
              className="rounded-[100px] p-[0.70rem_.5rem]  md:p-[0.75rem_1rem] text-xs  flex justify-center items-center min-w-[120px] font-medium border-none md:text-[0.95rem] transition-all duration-200 bg-[#9013FE] hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px] text-white"
            >
              View My Tools
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-[0.5rem] items-center my-2">
            <div className="relative group w-full ">
              <input
                type="text"
                name="tools"
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search for tools..."
                className=" peer w-full h-full border py-[0.6rem] px-[1rem] text-base  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md   outline-none focus:border-[#9013fe]"
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
          <div className="mb-[1.5rem] ">
            <h3 className="text-[#6c757d] mb-[0.75rem] text-[1rem] font-semibold uppercase space-x-[0.5px]">
              {searchQuery ? "Search Results" : "Popular Tools"}
            </h3>
            {isLoading ? (
              <AddNewToolSkeleton cards={6} />
            ) : (
              <>
                {searchQuery && filteredTools.length === 0 ? (
                  <p className="text-[#6c757d] italic">
                    No results found for "{searchQuery}"
                  </p>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] gap-[0.75rem]">
                    {(searchQuery
                      ? filteredTools
                      : allTools.filter((tool) =>
                          popularTools.includes(tool.title)
                        )
                    ).map((tool, i) => {
                      const isChecked = hideTab
                        ? selectedTool?.id === tool.id
                        : selectedTools.includes(tool.title);

                      return (
                        <label
                          key={i}
                          onChange={() => toggleToolSelection(tool.title, tool)}
                          className={`${
                            isChecked
                              ? "bg-[rgba(144,19,254,0.05)] border-[#9013FE]"
                              : "border-[#6c757d]"
                          } border-[1px] relative group border-[#6c757d] cursor-pointer rounded-[8px] p-[.5rem] md:p-[1rem] text-center transition-all duration-200 hover:shadow-[0_4px_12px_rgba(144,_19,_254,_0.1)] hover:transform hover:translate-y-[-2px] hover:border-[#9013FE]`}
                        >
                          <input
                            type={hideTab ? "radio" : "checkbox"}
                            name={hideTab ? "tool-selection" : undefined}
                            className={`size-4 border-0 group-hover:appearance-auto appearance-none absolute top-2 left-2 ${
                              isChecked ? "appearance-auto" : "appearance-none"
                            }`}
                          />
                          <div className="flex justify-center">
                            <img
                              src={tool.toolLogo}
                              className="w-auto h-[35px] md:h-[40px]  bg-[#e9ecef]"
                            />
                          </div>
                          <p className="font-medium text-[0.85rem] whitespace-nowrap overflow-hidden text-ellipsis">
                            {tool.title}
                          </p>
                        </label>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <hr className="my-5" />
          <div className="flex justify-between">
            {((hideTab && selectedTool) ||
              (!hideTab && selectedTools.length > 0)) && (
              <p className="text-[0.85rem] text-[#6c757d]">
                {hideTab
                  ? `${selectedTool?.title} selected`
                  : `${selectedTools.length} selected`}
              </p>
            )}
            <div className="ml-auto w-fit flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedTools([]);
                  setSelectedTool(null);
                  setToolId([]);
                  setSearchQuery("");
                }}
                className="rounded-[100px] p-[0.75rem_1rem] text-xs font-semibold  md:text-[0.95rem] transition-all duration-200 bg-white text-[#020617] border-2 border-[#e9ecef] "
              >
                Cancel
              </button>
              {!hideTab && selectedTools.length > 0 && (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="rounded-[100px] p-[0.70rem_.5rem]  md:p-[0.75rem_1rem] text-xs font-semibold flex justify-center items-center gap-2 min-w-[120px] whitespace-nowrap border-none md:text-[0.95rem] transition-all duration-200 bg-[#9013FE] hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px] text-white"
                >
                  {loading && <div className="form-loader"></div>}
                  Add Selected
                </button>
              )}
              {hideTab && selectedTool && (
                <button
                  type="button"
                  onClick={handleConnect}
                  className="rounded-[100px] p-[0.70rem_.5rem]  md:p-[0.75rem_1rem] text-xs font-semibold flex justify-center items-center gap-2 min-w-[120px] whitespace-nowrap border-none md:text-[0.95rem] transition-all duration-200 bg-[#9013FE] hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px] text-white"
                >
                  Track
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
