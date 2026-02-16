import TopCountriesBarChart from "../../../components/dashboard/AdminDashboard/Charts/topCountryBarChart";
import CountryUsersChart from "../../../components/dashboard/AdminDashboard/Charts/userDistributionByCountry";
import UsersBarChart from "../../../components/dashboard/AdminDashboard/Charts/usersDistributionByStackedBar";
import UsersStatsPie from "../../../components/dashboard/AdminDashboard/Charts/usersStatsPie";
import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { useUserDatas } from "../../../context/adminContext/userDatas";
import { useSidebar } from "../../../context/SidebarContext";

export default function UserInsights() {
  const { toggleMobileMenu } = useSidebar();
  const { stats } = useUserDatas();

  const countryCodes =
    stats?.breakdown?.usersByCountry.map((c: any) => c.iso3) || [];
  const userCounts =
    stats?.breakdown?.usersByCountry.map((c: any) => c.count) || [];
  const countryNames =
    stats?.breakdown?.usersByCountry.map((c: any) => c.country) || [];

  return (
    <div className="relative bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-50  pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
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
      <div className="lg:h-[calc(100vh-100px)] [scrollbar-width:none] [-ms-overflow-style:none]  overflow-y-auto">
        <div className="bg-white rounded-lg border border-[#e0e0e0] shadow p-[20px] mb-[20px]">
          <div className="flex items-stretch gap-5">
            <div className="flex-1 shadow-md px-3 py-6 rounded-lg border border-[#e0e0e0]">
              <h2 className="font-semibold mb-4">User Overview</h2>
              <div className="flex h-full justify-center items-center">
                <UsersStatsPie />
              </div>
            </div>
            <div className="flex-1  shadow-md px-3 py-6 rounded-lg border border-[#e0e0e0]">
              <h2 className="font-semibold"> Top 5 Countries</h2>
              <TopCountriesBarChart
                countryCodes={countryCodes}
                countryNames={countryNames}
                userCounts={userCounts}
              />
            </div>
          </div>
          <div className="flex items-stretch gap-5">
            <div className="mt-5 shadow-md px-3 pt-6 relative rounded-lg border border-[#e0e0e0] w-fit">
              <h2 className="font-semibold top-5 left-3 z-10 absolute w-fit">
                Geography
              </h2>
              <CountryUsersChart
                countryNames={countryNames}
                countryCodes={countryCodes}
                userCounts={userCounts}
              />
            </div>
            <div className="mt-5 shadow-md px-3 pt-6 relative rounded-lg border border-[#e0e0e0] w-fit">
              <h2 className="font-semibold top-5 left-3 z-10 absolute w-fit">
                User Breakdown
              </h2>
              <div className="flex justify-center h-full">
                <UsersBarChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
