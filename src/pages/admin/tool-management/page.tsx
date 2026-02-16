import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { useSidebar } from "../../../context/SidebarContext";
import { Icons } from "../../../icons";
import { useToolsMetrics } from "../../../context/adminContext/toolMetricsContext";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface SortDropdownProps {
  column: string;
  onSort: (column: string, order: "asc" | "desc") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ column, onSort }) => {
  const items: MenuProps["items"] = [
    { label: "Ascending", key: "asc", onClick: () => onSort(column, "asc") },
    { label: "Descending", key: "desc", onClick: () => onSort(column, "desc") },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <DownOutlined style={{ fontSize: "8px", cursor: "pointer" }} />
        </Space>
      </a>
    </Dropdown>
  );
};

export default function ToolManagement() {
  const { toggleMobileMenu } = useSidebar();
  const {
    toolsMetrics,
    loading,
    fetchTools,
    page,
    perPage,
    refetch,
    hasMore,
    setSort,
    sortColumn,
    sortOrder,
  } = useToolsMetrics();

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [searchName, setSearchName] = useState("");

  // load first page on mount or filter/search change
  useEffect(() => {
    fetchTools(1, perPage, searchName, sortColumn, sortOrder);
  }, [searchName, sortColumn, sortOrder]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore) {
      fetchTools(page + 1, perPage, searchName, sortColumn, sortOrder);
    }
  }, [page, perPage, searchName, sortColumn, sortOrder, hasMore, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSort = (column: string, order: "asc" | "desc") => {
    setSort(column, order);
  };

  return (
    <div className="relative bg-gray-50">
      <div className="sticky top-0 z-20 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0 ">
        <div className=" bg-gray-50 flex justify-between items-center w-full">
          <div className="flex items-center gap-3 ">
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
                  {" "}
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          <div className="flex justify-between w-full border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0 items-center">
            <h1 className="text-xl  font-medium  ">Tool Management</h1>
            <UserControll />
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex justify-between border border-[#e0e0e0] items-center mb-2 p-[6px] mt-2 bg-white rounded-lg shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)]">
        <div className="relative">
          <Search
            className="absolute text-gray-400 top-1/2 bottom-1/2 -translate-y-1/2 ml-1"
            size={13}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="search tools by name"
            defaultValue={searchName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement;
                setSearchName(target.value);
                searchInputRef.current?.blur();
              }
            }}
            className="border pl-5 px-2 py-[6px] max-w-[300px] text-sm rounded-[6px] w-full"
          />
        </div>
        <div className="flex w-fit items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-[5px_12px] rounded-[4px] font-semibold w-fit flex items-center gap-2 text-sm  transtion-all duration-300 ease-linear bg-transparent border border-[#e0e0e0] text-[#666] hover:bg-[#f8f9fa]"
          >
            <FontAwesomeIcon
              className={`mr-[5px] ${loading && "animate-spin text-[#9013fe]"}`}
              icon={Icons.Sync}
            />{" "}
            Refresh
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="lg:h-[calc(100vh-100px)] mt-2 [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto"
      >
        <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] p-[20px] mb-[20px] ">
          <div className="page" id="tools-page">
            <div className="flex justify-between items-center mb-[20px] pb-[10px] border border-[#e0e0e0] border-b border-l-0 border-r-0 border-t-0">
              <div className="text-[18px] font-semibold">Tool Management</div>
              <button className="p-[5px_12px] bg-[#9013fe] hover:bg-[#7a0fd6] rounded-[4px] text-sm  transtion-all duration-300 ease-linear border border-[#e0e0e0] text-[white]">
                <FontAwesomeIcon icon={Icons.Plus} className="mr-1" />
                Add Tool
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
                <div className="text-[14px] mb-[10px] text-[#666]">
                  All Tools
                </div>
                <div className="text-[24px] font-bold mb-[10px]">
                  {toolsMetrics?.allTools}
                </div>
                <div className="metric-change up">
                  <i className="fas fa-arrow-up"></i>{" "}
                  {toolsMetrics?.addedThisMonth} added this month
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
                <div className="text-[14px] mb-[10px] text-[#666]">
                  Featured Tools
                </div>
                <div className="text-[24px] font-bold mb-[10px]">
                  {toolsMetrics?.featuredTools}
                </div>
                <div className="metric-change up">
                  <i className="fas fa-arrow-up"></i>{" "}
                  {toolsMetrics?.featuredAddedThisWeek} added this week
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
                <div className="text-[14px] mb-[10px] text-[#666]">
                  Most Added
                </div>
                <div className="text-[24px] font-bold mb-[10px]">
                  {toolsMetrics?.mostAdded?.title}
                </div>
                <div className="metric-change">
                  {toolsMetrics?.mostAdded?.users} users
                </div>
              </div>
              <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
                <div className="text-[14px] mb-[10px] text-[#666]">
                  Most Reviewed
                </div>
                <div className="text-[24px] font-bold mb-[10px]">
                  {toolsMetrics?.mostReviewed?.title}
                </div>
                <div className="metric-change">
                  {toolsMetrics?.mostReviewed?.reviews} reviews
                </div>
              </div>
            </div>
            <div className="overflow-x-auto mt-6">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px]  text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Tool Name{" "}
                      <SortDropdown column="title" onSort={handleSort} />
                    </th>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px]  text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Category{" "}
                      <SortDropdown column="category" onSort={handleSort} />
                    </th>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px]  text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Users{" "}
                      <SortDropdown column="users_count" onSort={handleSort} />
                    </th>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Reviews
                    </th>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Rating
                    </th>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Status
                    </th>
                    <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {toolsMetrics?.toolsList.map((tool, index) => (
                    <tr key={index}>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        {tool.name}
                      </td>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        {tool.category?.join(", ")}
                      </td>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        {tool.users}
                      </td>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        {tool.reviews}
                      </td>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        {tool.rating}
                      </td>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        <span className="status active">Active</span>
                      </td>
                      <td className="p-[12px_15px] text-sm border-b border-[#e0e0e0]">
                        <button className="btn btn-outline p-[5px_10px]">
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {loading && (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        )}
        {!hasMore && !loading && (
          <div className="py-4 text-center text-gray-400 text-sm">
            No more tools
          </div>
        )}
      </div>
    </div>
  );
}
