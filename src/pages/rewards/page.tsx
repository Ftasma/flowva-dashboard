import { useEffect, useState } from "react";
import NotificationBell from "../../components/notifications/NotificationBell";
import EarnPoints from "../../components/reward/EarnPoints";
import RedeemRewards from "../../components/reward/RedeemRewards";
import { useSidebar } from "../../context/SidebarContext";
import { Tabs, TabsProps } from "antd";
import supabase from "../../lib/supabase";
import { logUserActivity } from "../../services/user/activityTrack";

function Rewards() {
  const { toggleMobileMenu } = useSidebar();
  const [error, setError] = useState<string | null>(null);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Earn Points",
      children: <EarnPoints />,
    },
    {
      key: "2",
      label: "Redeem Rewards",
      children: <RedeemRewards />,
    },
  ];

  useEffect(() => {
    const checkStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (user?.email) {
        //check for banned
        const { data: banned, error: banError } = await supabase
          .from("banned_emails")
          .select("email")
          .eq("email", user.email.toLowerCase())
          .maybeSingle();

        if (banError) {
          throw new Error("Failed to verify ban status.");
        }

        if (banned) {
          await supabase.auth.signOut();
          setError("Your account has been banned. Contact support.");
          return;
        }
      }
    };
    checkStatus();
    // Then every 10 minutes (600,000 ms)
    const intervalId = setInterval(checkStatus, 10 * 60 * 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const trackFlowboardVisit = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await logUserActivity({
        userId: user.id,
        action: "Visited RewardPage",
        metadata: { service: "rewardpage", time: new Date().toISOString() },
      });
    };

    trackFlowboardVisit();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">{error}</h1>
        <p className="text-base mb-1">Please try again or contact support.</p>
        <p className="text-sm text-gray-500">
          Reach out to{" "}
          <a
            href="mailto:support@flowvahub.com"
            className="text-blue-600 hover:underline"
          >
            support@flowvahub.com
          </a>{" "}
          or via WhatsApp at{" "}
          <a
            href="https://wa.me/15872872064"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            +1 (587) 287-2064
          </a>
          .
        </p>
      </div>
    );
  }
  return (
    <div className="relative bg-gray-50 ">
      <div className="sticky top-0 z-10 bg-gray-50 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <div className=" bg-gray-50 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
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
            <h1 className="text-xl md:text-[1.5rem] font-medium ">
              Rewards Hub
            </h1>
          </div>
          <div className="mt-2">
            <NotificationBell />
          </div>
        </div>
      </div>
      <div>
        <p className="text-gray-600">
          Earn points, unlock rewards, and celebrate your progress!
        </p>
        <div className="lg:h-[calc(100vh-110px)] [scrollbar-width:none] [-ms-overflow-style:none] overflow-x-hidden">
          <Tabs
            style={{ marginTop: "20px" }}
            defaultActiveKey="1"
            items={items}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default Rewards;
