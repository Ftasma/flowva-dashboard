import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import TrendChart from "./userTrendChart";
import { formatPrevRange } from "../../../utils/helper";
import { RewardsMetricsResponse } from "../../../context/adminContext/rewards/rewardMetricsContext";

export default function RewardMetrics({
  metrics,
}: {
  metrics: RewardsMetricsResponse | null;
}) {
  return (
    <div className="grid gap-[20px] mb-[20px] grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">
          Reward Page Views
        </div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.rewardPageViews.toLocaleString()}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange.rewardPageViews || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange?.rewardPageViews || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.percentChange?.rewardPageViews}%{" "}
          {formatPrevRange(metrics?.prevRange ?? undefined)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.rewardPageViews || 0}
            color={
              (metrics?.percentChange?.rewardPageViews || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Point Issued</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.totalPointsIssued.toLocaleString()}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange?.totalPointsIssued || 0) >= 0
              ? "text-[#28a745]"
              : "text-[#dc3545]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange?.totalPointsIssued || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />{" "}
          {metrics?.percentChange?.totalPointsIssued}%{" "}
          {formatPrevRange(metrics?.prevRange ?? undefined)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.totalPointsIssued || 0}
            color={
              (metrics?.percentChange?.totalPointsIssued || 0) >= 0
                ? "#4caf50"
                : "#f44336"
            }
          />
        </div>
      </div>
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
        <div className="text-[14px] mb-[10px] text-[#666]">Point Redeemed</div>
        <div className="text-[24px] font-bold mb-[10px]">
          {metrics?.metrics.totalPointsRedeemed.toLocaleString()}
        </div>
        <div
          className={`flex items-center text-[12px]  ${
            (metrics?.percentChange?.totalPointsRedeemed || 0) >= 0
              ? "text-[#dc3545]"
              : "text-[#28a745]"
          }`}
        >
          <FontAwesomeIcon
            className="mr-1 -mt-1"
            icon={
              (metrics?.percentChange?.totalPointsRedeemed || 0) >= 0
                ? Icons.ArrowUp
                : Icons.ArrowDown
            }
          />
          {metrics?.percentChange?.totalPointsRedeemed}%{" "}
          {formatPrevRange(metrics?.prevRange ?? undefined)}
        </div>
        <div className="h-[40px] mt-[10px]">
          <TrendChart
            percentage={metrics?.percentChange?.totalPointsRedeemed || 0}
            color={
              (metrics?.percentChange?.totalPointsRedeemed || 0) >= 0
                ? "#f44336"
                : "#4caf50"
            }
          />
        </div>
      </div>
      {/* <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)] relative  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#9013fe]">
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
      </div> */}
    </div>
  );
}
