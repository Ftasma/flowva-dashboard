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
  countryCodes: string[];
  countryNames: string[]; 
  userCounts: number[];
};

const TopCountriesBarChart: React.FC<Props> = ({
  countryCodes,
  countryNames,
  userCounts,
}) => {
  // Combine into array of objects
  const data = countryCodes.map((code, i) => ({
    code,
    name: countryNames[i],
    users: userCounts[i],
  }));

  // Sort by users descending
  const sorted = [...data].sort((a, b) => b.users - a.users);

  // Top 5 + Others
  const topFive = sorted.slice(0, 5);
  const othersTotal = sorted.slice(5).reduce((sum, d) => sum + d.users, 0);

  const chartData = [
    ...topFive,
    ...(othersTotal > 0
      ? [{ code: "Others", name: "Other Countries", users: othersTotal }]
      : []),
  ];

  //  Custom Tooltip to show country name instead of code
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
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="code" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} /> 
          <Bar dataKey="users" fill="#9013fe" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCountriesBarChart;
