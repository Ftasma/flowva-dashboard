import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MetricsResponse } from "../../../context/adminContext/mertricsContext";
import { Icons } from "../../../icons";
import TrendChart from "./userTrendChart";
import { formatPrevRange } from "../../../utils/helper";

export default function Metrics({
  metrics,
}: {
  metrics: MetricsResponse | null;
}) {
  return (
    <div className="grid gap-[20px] mb-[20px] grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Users</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.totalUsers}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange.totalUsers || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange?.totalUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.percentChange?.totalUsers}%{" "}
          {formatPrevRange(metrics?.prevRange)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.totalUsers || 0}
            color={
              (metrics?.percentChange?.totalUsers || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Verified Users</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.verifiedUsers}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange?.verifiedUsers || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange?.verifiedUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />{" "}
          {metrics?.percentChange?.verifiedUsers}%{" "}
          {formatPrevRange(metrics?.prevRange)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.verifiedUsers || 0}
            color={
              (metrics?.percentChange?.verifiedUsers || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">
          Unverified Users
        </div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.unverifiedUsers}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange?.unverifiedUsers || 0) >= 0
              ? "text-[#dc3545]"
              : "text-[#28a745]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange?.unverifiedUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.percentChange?.unverifiedUsers}%{" "}
          {formatPrevRange(metrics?.prevRange)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.unverifiedUsers || 0}
            color={
              (metrics?.percentChange?.unverifiedUsers || 0) >= 0
                ? "#f44336"
                : "#4caf50"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Homepage Views</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.homepageViews}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange.homepageViews || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange.homepageViews || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />{" "}
          {metrics?.percentChange.homepageViews}%{" "}
          {formatPrevRange(metrics?.prevRange)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange.homepageViews || 0}
            color={
              (metrics?.percentChange.homepageViews || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Active Users</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.activeUsers}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange.activeUsers || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange.activeUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />{" "}
          {metrics?.percentChange.activeUsers}%{" "}
          {formatPrevRange(metrics?.prevRange)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.activeUsers || 0}
            color={
              (metrics?.percentChange?.activeUsers || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Total Users</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.totals.allUsers}
        </div>
        <div
          className={`flex items-center text-[12px] ${
            (metrics?.totals.percentChange.allUsers || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          } `}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.totals.percentChange.allUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.totals.percentChange.allUsers}% from last month
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.totals.percentChange.allUsers || 0}
            color={
              (metrics?.totals.percentChange.allUsers || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">
          Total Verified Users
        </div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.totals.allVerifiedUsers}
        </div>
        <div
          className={`flex items-center text-[12px] ${
            (metrics?.totals.percentChange.allVerifiedUsers || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          } `}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.totals.percentChange.allVerifiedUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.totals.percentChange.allVerifiedUsers}% from last month
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.totals.percentChange.allVerifiedUsers || 0}
            color={
              (metrics?.totals.percentChange.allVerifiedUsers || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">
          Total Unverified Users
        </div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.totals.allUnverifiedUsers}
        </div>
        <div
          className={`flex items-center text-[12px] ${
            (metrics?.totals.percentChange.allUnverifiedUsers || 0) >= 0
              ? "text-[#dc3545]"
              : "text-[#28a745]"
          } `}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.totals.percentChange.allUnverifiedUsers || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.totals.percentChange.allUnverifiedUsers}% from last month
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.totals.percentChange.allUnverifiedUsers || 0}
            color={
              (metrics?.totals.percentChange.allUnverifiedUsers || 0) >= 0
                ? "#f44336"
                : "#4caf50"
            }
          />
        </div>
      </div>
    </div>
  );
}

