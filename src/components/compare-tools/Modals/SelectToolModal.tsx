import React, { useState } from "react";
import { Modal } from "antd";
import AddNewToolSkeleton from "../../skeletons/AddNewToolSkeleton";
import { useTrendingTools } from "../../../hooks/my-library/useTrendingTools";
import { useDefaultTools } from "../../../context/DefaultToolsContext";



type AddNewToolsModalProps = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onToolSelect: (tool: Tool) => void;
};

export interface Tool {
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

const SelectToolModal: React.FC<AddNewToolsModalProps> = ({
  modalOpen,
  setModalOpen,
  onToolSelect,
}) => {
  const { allTools, isLoading } = useDefaultTools();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTools = allTools
    .filter((tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 8);
  const { trendingTools } = useTrendingTools();

  const popularTools = trendingTools.map((tools, _) => tools.title).slice(0, 8);;

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool);
    onToolSelect(tool);
    setModalOpen(false);
    setSelectedTool(null);
  };

  return (
    <Modal
      title={
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Select a Tool to Compare
        </h2>
      }
      width="100%"
      style={{ top: 20, maxWidth: 600, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      footer={null}
      onOk={() => setModalOpen(false)}
      onCancel={async () => {
        setModalOpen(false);
      }}
    >
      <hr />

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
            <AddNewToolSkeleton cards={8} />
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
                    const isChecked = selectedTool?.id === tool.id;

                    return (
                      <label
                        key={i}
                        onClick={() => selectTool(tool)}
                        className={`${
                          isChecked
                            ? "bg-[rgba(144,19,254,0.05)] border-[#9013FE]"
                            : "border-[#6c757d]"
                        } border-[1px] relative group border-[#6c757d] cursor-pointer rounded-[8px] p-[.5rem] md:p-[1rem] text-center transition-all duration-200 hover:shadow-[0_4px_12px_rgba(144,_19,_254,_0.1)] hover:transform hover:translate-y-[-2px] hover:border-[#9013FE]`}
                      >
                        <input
                          type="checkbox"
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
          <div className="ml-auto w-fit flex gap-4 mt-4">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setSelectedTool(null);
                setSearchQuery("");
              }}
              className="rounded-[100px] p-[0.75rem_1rem] text-xs font-semibold  md:text-[0.95rem] transition-all duration-200 bg-white text-[#020617] border-2 border-[#e9ecef] "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SelectToolModal;
