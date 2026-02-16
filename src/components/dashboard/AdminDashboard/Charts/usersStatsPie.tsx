import { styled } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { useUserDatas } from "../../../../context/adminContext/userDatas";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 15,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function UsersStatsPie() {

  
  const { stats } = useUserDatas();
  return (
<PieChart
  series={[
    {
      data: [
        { id: 0, value: Number(stats?.totals.verifiedUsers), label: "verified users", color: "#9013fe" },
        { id: 2, value: Number(stats?.totals.unverifiedUsers), label: "unverified users", color: "rgba(144,19,254,0.1)" },
        { id: 3, value: Number(stats?.totals.bannedUsers), label: "banned users", color: "red" },
      ],
      innerRadius: 50,
      outerRadius: 100,
    },
  ]}
  width={300}
  height={300}
>
  <PieCenterLabel>Total: {stats?.totals.totalUsers}</PieCenterLabel>
</PieChart>

  );
}
