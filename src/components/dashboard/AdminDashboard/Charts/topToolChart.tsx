"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  tools: { name: string; users: number }[];
};

const TopToolsBarChart: React.FC<Props> = ({ tools }) => {
  // Sort by usage
  const sorted = [...tools].sort((a, b) => b.users - a.users);

  // Take top 5 + group others
  const topFive = sorted.slice(0, 5);
  const othersTotal = sorted.slice(5).reduce((sum, d) => sum + d.users, 0);

  const chartData = [
    ...topFive,
    ...(othersTotal > 0 ? [{ name: "Others", users: othersTotal }] : []),
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, users } = payload[0].payload;
      return (
        <div className="bg-white p-2 shadow-md rounded text-sm">
          <p className="font-semibold">{name}</p>
          <p>{`Users: ${users}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="users" fill="#9301fe" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopToolsBarChart;
