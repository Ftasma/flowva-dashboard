import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

interface TrendChartProps {
  color: string;
  percentage: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ color, percentage }) => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          percentage * 0.4,
          percentage * 0.55,
          percentage * 0.35,
          percentage * 0.65,
          percentage * 0.5,
          percentage * 0.7,
          percentage * 0.6,
        ],
        borderColor: color,
        borderWidth: 2,
        tension: 0.5,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(1)}%`,
        },
      },
      datalabels: {
        display: false, // hides labels on this chart
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return <Line data={data} options={options} />;
};

export default TrendChart;
