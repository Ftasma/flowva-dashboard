import { BarChart } from "@mui/x-charts/BarChart";
import { useUserDatas } from "../../../../context/adminContext/userDatas";

const xLabels = ["Users"];

export default function UsersBarChart() {
  const { stats } = useUserDatas();
  const verifiedOnboarded = stats?.totals.onboardedUsers || 0;
  const verifiedNotOnboarded = stats?.totals.notOnboardedUsers || 0;
  const unverified = stats?.totals.unverifiedUsers || 0;
  const banned = stats?.totals.bannedUsers || 0;

  return (
    <BarChart
      height={300}
      series={[
        {
          data: [verifiedOnboarded],
          label: "Verified - Onboarded",
          id: "onboardedId",
          stack: "verified",
          color: "#9013FE",
        },
        {
          data: [verifiedNotOnboarded],
          label: "Verified - Not Onboarded",
          id: "notOnboardedId",
          stack: "verified",
        },
        {
          data: [unverified],
          label: "Unverified",
          id: "unverifiedId",
          color: "blue",
        },
        { data: [banned], label: "Banned", id: "bannedId", color: "red" },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[{ width: 50 }]}
    />
  );
}
