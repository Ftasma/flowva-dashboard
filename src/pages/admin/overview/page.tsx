import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { useSidebar } from "../../../context/SidebarContext";
import { Icons } from "../../../icons";
import { useMetrics } from "../../../context/adminContext/mertricsContext";
import { useUserActivities } from "../../../context/adminContext/userActivitiesContext";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";
import Metrics from "../../../components/dashboard/AdminDashboard/overviewMetrics";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function Overview() {
  const { toggleMobileMenu } = useSidebar();
  const { metrics, refetch, loading: metricLoading } = useMetrics();
  const { activities, page, limit, total, loading, fetchActivities } =
    useUserActivities();

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchActivities(page, limit);
  }, [page, limit]);

  const [pageInput, setPageInput] = useState<string>(String(page || 1));
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  useEffect(() => {
    if (metrics?.range) {
      setDateRange([metrics.range.start, metrics.range.end]);
    } else {
      setDateRange([null, null]);
    }
  }, [metrics]);

  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { RangePicker } = DatePicker;

  const handlePageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let newPage = parseInt(pageInput, 10);

      if (isNaN(newPage) || newPage < 1) newPage = 1;
      if (newPage > totalPages) newPage = totalPages;

      fetchActivities(newPage, limit);
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

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

  const getDropdownItems = (activity: any): MenuProps["items"] => {
    const baseItems: MenuProps["items"] = [
      {
        label: <span>User: {activity?.user_profiles?.name}</span>,
        key: "user",
      },
      {
        label: <span>Email: {activity?.user_profiles?.email}</span>,
        key: "email",
      },
      { type: "divider" },
      {
        label: <span>Action: {activity?.action}</span>,
        key: "action",
      },
      { type: "divider" },
    ];

    // Dynamically add metadata fields
    const metadataItems: MenuProps["items"] = activity?.metadata
      ? Object.entries(activity.metadata).map(([key, value]) => ({
          label: (
            <span>
              {key}: {String(value)}
            </span>
          ),
          key: `meta-${key}`,
        }))
      : [];

    return [...baseItems, ...metadataItems];
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
              Key Metrics Overview
            </div>
            <div className="flex items-center gap-2 justify-center">
              <RangePicker
                style={{ width: 260 }}
                className="custom-datepicker"
                value={
                  dateRange[0] && dateRange[1]
                    ? [dayjs(dateRange[0]), dayjs(dateRange[1])]
                    : undefined
                }
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    // Use local start/end of day
                    const start = dates[0].startOf("day").toDate();
                    const end = dates[1].endOf("day").toDate();

                    // Convert to UTC ISO strings for backend
                    const startUTC = new Date(
                      Date.UTC(
                        start.getFullYear(),
                        start.getMonth(),
                        start.getDate(),
                        start.getHours(),
                        start.getMinutes(),
                        start.getSeconds(),
                        start.getMilliseconds()
                      )
                    ).toISOString();

                    const endUTC = new Date(
                      Date.UTC(
                        end.getFullYear(),
                        end.getMonth(),
                        end.getDate(),
                        end.getHours(),
                        end.getMinutes(),
                        end.getSeconds(),
                        end.getMilliseconds()
                      )
                    ).toISOString();

                    handleFilterChange("dateRange", [startUTC, endUTC]);
                  } else {
                    // Gracefully handle clearing
                    handleFilterChange("dateRange", [null, null]);
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
          <Metrics metrics={metrics} />

          <div className="flex justify-between items-center mb-[20px] pb-[10px] border border-[#e0e0e0] border-b border-l-0 border-r-0 border-t-0">
            <div className="text-[18px] font-semibold">
              Recent User Activities
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => fetchActivities()}
                className="p-[5px_12px] rounded-[4px] text-sm  transtion-all duration-300 ease-linear bg-transparent border border-[#e0e0e0] text-[#666] hover:bg-[#f8f9fa]"
              >
                <FontAwesomeIcon
                  className={`mr-[5px] ${
                    loading && "animate-spin text-[#9013fe]"
                  }`}
                  icon={Icons.Sync}
                />{" "}
                Refresh
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                    User
                  </th>
                  <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                    Email
                  </th>
                  <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                    Activity
                  </th>

                  <th className="bg-[#f8f9fa] text-[#666] font-semibold p-[12px_15px] text-left border border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => {
                  const menuItems = getDropdownItems(activity);
                  const isOpen =
                    dropdownVisible && selectedActivity === activity;

                  return (
                    <tr
                      key={index}
                      className="text-[#666] hover:bg-[#f8f9fa] cursor-pointer"
                      onClick={() => {
                        setSelectedActivity(activity);
                        setDropdownVisible(true);
                      }}
                    >
                      <td className="p-[12px_15px] border-b border-[#e0e0e0]">
                        {activity?.user_profiles?.name}
                      </td>
                      <td className="p-[12px_15px] border-b border-[#e0e0e0]">
                        {activity?.user_profiles?.email}
                      </td>
                      <td className="p-[12px_15px] border-b border-[#e0e0e0]">
                        {activity.action}
                      </td>
                      <td className="p-[12px_15px] border-b border-[#e0e0e0] relative">
                        <Dropdown
                          menu={{ items: menuItems }}
                          placement="bottomRight"
                          getPopupContainer={(trigger) =>
                            trigger.parentElement as HTMLElement
                          }
                          open={isOpen}
                          onOpenChange={(open) => {
                            setDropdownVisible(open);
                            if (open) setSelectedActivity(activity);
                          }}
                          overlayClassName="custom-dropdown"
                        >
                          <span className="block w-full h-full"></span>
                        </Dropdown>
                        {formatDistanceToNow(new Date(activity.created_at))} ago
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-end mt-4 text-sm text-[#666]">
              <button
                onClick={() => {
                  const newPage = page - 1;
                  fetchActivities(newPage, limit);
                  setPageInput(String(newPage));
                }}
                disabled={page <= 1}
                className="hover:text-[#9013fe] text-sm mr-1"
              >
                <ChevronLeftCircleIcon />
              </button>
              <span className="flex gap-2 items-center">
                Page{" "}
                <input
                  value={pageInput}
                  onChange={handlePageChange}
                  onKeyDown={handlePageSubmit}
                  className="border text-black border-[#e0e0e0] outline-none w-10 pl-2 rounded-md"
                />
                of {totalPages}
              </span>
              <button
                onClick={() => {
                  const newPage = page + 1;
                  fetchActivities(newPage, limit);
                  setPageInput(String(newPage));
                }}
                disabled={page >= totalPages}
                className="hover:text-[#9013fe] text-sm ml-1"
              >
                <ChevronRightCircleIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
