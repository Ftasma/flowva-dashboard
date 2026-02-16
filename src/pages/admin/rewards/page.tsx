import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useSidebar } from "../../../context/SidebarContext";
import { useRewardsMetrics } from "../../../context/adminContext/rewards/rewardMetricsContext";
import RewardMetrics from "../../../components/dashboard/AdminDashboard/rewardOverviewMetrics";
import { useEffect, useRef, useState } from "react";
import { DatePicker, Dropdown, Space } from "antd";
import dayjs from "dayjs";
import { useUserRewards } from "../../../context/adminContext/rewards/user-reward";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ChevronLeftCircle, ChevronRightCircle, Search } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import UserRewardsModal from "../../../components/dashboard/AdminDashboard/Modals/PointRewardModal";
import UserRewardInfoDrawer from "../../../components/dashboard/AdminDashboard/userRewardInfoDrawer";

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

export default function UserRewards() {
  const { metrics, refetch, loading: metricLoading } = useRewardsMetrics();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>(
    undefined
  );
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [isRewardModalOpen, setRewardModalOpen] = useState(false);

  const {
    rewards,
    page,
    perPage,
    search,
    sortColumn,
    sortOrder,
    setSort,
    loading,
    fetchRewards,
    total,
  } = useUserRewards();

  useEffect(() => {
    fetchRewards(page, perPage);
  }, [fetchRewards]);

  useEffect(() => {
    fetchRewards(1, perPage, searchEmail);
  }, [searchEmail]);

  const { toggleMobileMenu } = useSidebar();

  const [pageInput, setPageInput] = useState(String(page));
  const totalPages = Math.ceil(total / perPage) || 1;

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchRewards(newPage, perPage, search, sortColumn, sortOrder);
      setPageInput(String(newPage));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = Number(pageInput);
      goToPage(newPage);
    }
  };

  useEffect(() => {
    if (metrics?.range && metrics.range.start && metrics.range.end) {
      // Only use ISO strings
      const start =
        metrics.range.start !== "ALL-TIME" ? metrics.range.start : undefined;
      const end = metrics.range.end !== "NOW" ? metrics.range.end : undefined;

      if (start && end) {
        setDateRange([start, end]);
      } else {
        setDateRange(undefined); // fallback for ALL-TIME
      }
    } else {
      setDateRange(undefined);
    }
  }, [metrics]);

  const { RangePicker } = DatePicker;
  const handleFilterChange = (key: string, value: any) => {
    if (key === "dateRange") {
      setDateRange(value);

      if (value && value[0] && value[1]) {
        // Trigger metrics refetch with start and end dates
        refetch(value[0], value[1]);
      } else {
        // Reset metrics if no date range is selected
        refetch();
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === rewards.length) {
      setSelectedUsers([]);
      setUserEmail([]);
    } else {
      setSelectedUsers(rewards.map((user) => user.user_id || ""));
      setUserEmail(rewards.map((user) => user.email || ""));
    }
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSetEmail = (email: string) => {
    setUserEmail((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };
  const handleSort = (column: string, order: "asc" | "desc") => {
    setSort(column, order);
  };

  const openDrawer = (user: any) => {
    setSelectedUser(user);
    setDrawerOpen(true);
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
            <h1 className="text-xl  font-medium  ">Overview</h1>
            <UserControll />
          </div>
        </div>
      </div>
      <div className="lg:h-[calc(100vh-100px)] mt-2 [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto">
        <div className="bg-white rounded-lg shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] p-[20px] mb-[20px] ">
          <div className="flex justify-between items-center mb-[20px] pb-[10px] border border-[#e0e0e0] border-b border-l-0 border-r-0 border-t-0">
            <div className="text-[18px] font-semibold">
              Rewards Metrics Overview
            </div>
            <div className="flex items-center gap-2 justify-center">
              <RangePicker
                style={{ width: 260 }}
                className="custom-datepicker"
                value={
                  dateRange
                    ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
                    : undefined
                }
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    const startUTC = dates[0].startOf("day").toISOString();
                    const endUTC = dates[1].endOf("day").toISOString();
                    handleFilterChange("dateRange", [startUTC, endUTC]);
                  } else {
                    handleFilterChange("dateRange", undefined);
                  }
                }}
              />
              <button
                onClick={() => refetch()}
                className="p-[5px_12px] rounded-[4px] text-sm  transtion-all duration-300 ease-linear bg-transparent border border-[#e0e0e0] text-[#666] hover:bg-[#f8f9fa]"
              >
                <FontAwesomeIcon
                  className={`mr-[5px] ${
                    metricLoading && "animate-spin text-[#9013fe]"
                  }`}
                  icon={Icons.Sync}
                />{" "}
                Refresh
              </button>
              <button className="p-[5px_12px] text-sm rounded-[4px]  transition-all duration-200 bg-transparent text-[#666] border border[#e0e0e0]">
                <FontAwesomeIcon className="mr-1 -mt-1" icon={Icons.Download} />{" "}
                Export
              </button>
            </div>
          </div>
          <RewardMetrics metrics={metrics} />
        </div>
        <div className="mt-3 bg-white rounded-md">
          <div className="flex justify-between items-center p-3">
            <div className="relative">
              <Search
                className="absolute text-gray-400 top-1/2 bottom-1/2 -translate-y-1/2 ml-1"
                size={13}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="search by email"
                defaultValue={searchEmail}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    setSearchEmail(target.value);
                    searchInputRef.current?.blur();
                  }
                }}
                className="border pl-5 px-2 py-[6px] max-w-[300px] text-sm rounded-[6px] w-full"
              />
            </div>
            {selectedUsers.length > 0 && (
              <button
                onClick={() => setRewardModalOpen(true)}
                className="p-[5px_12px] rounded-[4px] font-semibold w-fit flex items-center gap-2 text-sm  transtion-all duration-300 ease-linear hover:bg-purple-500 bg-purple-400 border border-[#e0e0e0] text-white"
              >
                <FontAwesomeIcon icon={Icons.Plus} /> Reward Points
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-[30px]  relative overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                ))}
            </div>
          ) : (
            <table className="w-full overflow-x-auto">
              <thead>
                <tr className="text-xs whitespace-nowrap">
                  <th className="bg-white p-[12px_15px] border-b text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === rewards.length &&
                        rewards.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>

                  <th className="bg-white p-[12px_15px] text-left border-b">
                    User
                  </th>
                  <th className="bg-white p-[12px_15px] text-left border-b">
                    Email <SortDropdown column="email" onSort={handleSort} />
                  </th>
                  <th className="bg-white p-[12px_15px] text-left border-b">
                    Total points{" "}
                    <SortDropdown column="total_points" onSort={handleSort} />
                  </th>
                  <th className="bg-white p-[12px_15px] text-left border-b">
                    Total pionts Redeemed{" "}
                    <SortDropdown
                      column="total_points_redeemed"
                      onSort={handleSort}
                    />
                  </th>
                  <th className="bg-white p-[12px_15px] text-left border-b">
                    Total Claimed Rewards{" "}
                    <SortDropdown
                      column="total_claimed_rewards"
                      onSort={handleSort}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((user, index) => {
                  const isSelected = selectedUsers.includes(user.user_id || "");
                  return (
                    <tr
                      key={index}
                      className={`text-[#666] whitespace-nowrap text-sm cursor-pointer hover:bg-[#f8f9fa] ${
                        isSelected ? "bg-[#f8f9fa]" : ""
                      }`}
                      onClick={() => openDrawer(user)}
                    >
                      <td className="p-[12px_15px] border-b">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.user_id || "")}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => {
                            toggleUserSelection(user.user_id || "");
                            handleSetEmail(user?.email);
                          }}
                          className="cursor-pointer"
                        />
                      </td>

                      <td className="p-[12px_15px] border-b">
                        {user?.name || "—"}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.email || "—"}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.total_points ?? 0}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.total_points_redeemed ?? 0}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.total_claimed_rewards ?? 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <UserRewardInfoDrawer
            selectedUser={selectedUser}
            drawerOpen={drawerOpen}
            closeDrawer={() => setDrawerOpen(false)}
            refetch={() => refetch}
          />
        </div>
        <div className="flex  mb-4 items-center justify-end mt-2 text-sm text-[#666]">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
            className={`hover:text-[#9013fe] text-sm mr-1 transition ${
              page <= 1 || loading ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeftCircle size={20} />
          </button>

          <span className="flex gap-2 items-center">
            Page{" "}
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border text-black border-[#e0e0e0] outline-none w-10 pl-2 rounded-md"
            />{" "}
            of {totalPages}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages || loading}
            className={`hover:text-[#9013fe] text-sm ml-1 transition ${
              page >= totalPages || loading
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRightCircle size={20} />
          </button>
        </div>
      </div>
      {selectedUsers.length > 0 && (
        <UserRewardsModal
          openModal={isRewardModalOpen}
          setModalOpen={setRewardModalOpen}
          emails={userEmail}
          userIds={selectedUsers}
        />
      )}
    </div>
  );
}
