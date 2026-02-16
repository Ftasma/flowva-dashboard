"use client";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { useEngagement } from "../../../context/adminContext/engagement";
import { useSidebar } from "../../../context/SidebarContext";
import TopToolsBarChart from "../../../components/dashboard/AdminDashboard/Charts/topToolChart";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Engagement() {
  const { toggleMobileMenu } = useSidebar();
  const { data, loading, error } = useEngagement();

  // Build chart data for daily counts
  const labels = data ? Object.keys(data.dailyCounts) : [];
  const values = data ? Object.values(data.dailyCounts) : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Daily Users",
        data: values,
        borderColor: "#9301fe",
        backgroundColor: "rgba(147,1,254,0.2)",
        fill: "origin",
        pointBackgroundColor: "#9301fe",
        pointBorderColor: "#9301fe",
        pointStyle: "rectRot",
        pointRadius: 14,
        pointHoverRadius: 16,
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#9301fe",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `Users: ${context.formattedValue}`,
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        align: "center" as const,
        anchor: "center" as const,
        offset: 20,
        font: {
          weight: "bold",
          size: 10,
        },
        formatter: (value: number) => value,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 50 },
      },
    },
  };

  return (
    <div className="relative bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <div className="w-full">
          <div className="bg-gray-50 flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                <svg viewBox="0 0 20 20" fill="none" width={28}>
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex justify-between w-full border-b border-[#e0e0e0] items-center">
              <h1 className="text-xl font-medium">User Insights</h1>
              <UserControll />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:h-[calc(100vh-100px)] overflow-y-auto">
        <div className="bg-white rounded-lg border border-[#e0e0e0] shadow p-[20px] mb-[20px]">
          <div className="flex items-stretch gap-5">
            {/* Daily Check-ins */}
            <div className="flex-1 shadow-md px-3 py-6 rounded-lg border border-[#e0e0e0]">
              <h2 className="font-semibold mb-4">Daily Check-ins</h2>
              <div className="flex h-[300px] justify-center items-center">
                {loading && <p>Loading chart...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && data && <Line data={chartData} options={options} />}
              </div>
            </div>

            {/* Tools Tried */}
            <div className="flex-1 shadow-md px-3 py-6 rounded-lg border border-[#e0e0e0]">
              <h2 className="font-semibold">Tools Tried</h2>
            </div>
          </div>

          {/* Top 5 Tools */}
          <div className="gap-5 mt-5">
            <div className="shadow-md px-3 py-6 rounded-lg border border-[#e0e0e0]">
              <h2 className="font-semibold mb-4">Top 5 Tools</h2>
              <div className="flex h-[300px] justify-center items-center w-full">
                {loading && <p>Loading chart...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && data?.topTools && data.topTools.length > 0 ? (
                  <TopToolsBarChart tools={data.topTools} />
                ) : (
                  !loading && <p className="text-gray-500">No tool data</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
