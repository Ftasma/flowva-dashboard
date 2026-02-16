import { useFormContext } from "../../../context/UserContext";
import StepIndicator from "../StepIndicator";

export default function Demo({
  handleNextStep,
  handlePrevStep,
  step,
}: {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  step: number;
}) {
  const { userData } = useFormContext();
  return (
    <div className="max-w-[560px] w-full bg-white box-border my-[2rem] p-[1.5rem] lg:p-[2.5rem] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative h-fit">
      <div className="min-h-[480px] flex flex-col animate-fadeIn">
        <StepIndicator currentStep={step} />
        <h2 className="text-[#212529] text-[1.5rem] leading-[1.3rem] mb-[1rem] font-bold text-start">
          Your Personalized Demo
        </h2>
        <p className="text-[0.95rem] text-[#495057] mb-[1.5rem] text-start">
          Based on your selections, here's how Flowva can help you:
        </p>
        <div className="mt-[1.5rem] p-[1.5rem] border-[2px] border-dashed border-[#E9ECEF] bg-[#ffffff]">
          <h3 className="text-[1.1rem] mb-[1rem] font-bold text-[#495057] text-start">
            Your Dashboard Preview
          </h3>
          {userData.mainGoal === "Track my tool subscriptions" && (
            <div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                📊 <strong>Subscription Tracker</strong> - See all your tool
                subscriptions in one place
              </div>

              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🔔 <strong>Renewal Alerts</strong> - Never miss a payment date
              </div>
              {userData.tools.length > 0 && (
                <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                  🛠️ <strong>Your Tools:</strong>{" "}
                  {userData.tools.length > 3
                    ? userData.tools.slice(0, 3).join(", ") + "..."
                    : userData.tools.join(", ")}
                </div>
              )}
            </div>
          )}

          {userData.mainGoal === "Organize my work tools" && (
            <div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🧰 <strong>Tool Organizer</strong> - All your work apps in one
                dashboard
              </div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🔗 <strong>Quick Access</strong> - Launch{" "}
                {userData.mainCategory || "your"} tools instantly
              </div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                📊 <strong>Usage Stats</strong> - See which tools you use most
              </div>
              {userData.tools.length > 0 && (
                <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                  🛠️ <strong>Your Tools:</strong>{" "}
                  {userData.tools.length > 3
                    ? userData.tools.slice(0, 3).join(", ") + "..."
                    : userData.tools.join(", ")}
                </div>
              )}
            </div>
          )}

          {userData.mainGoal === "Discover new tools" && (
            <div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🔍 <strong>Tool Recommendations</strong> - Based on{" "}
                {userData.mainCategory || "your"} needs
              </div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                ⭐ <strong>Alternatives</strong> - Compare to tools you already
                use
              </div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                💲 <strong>Deals</strong> - Exclusive discounts for Flowva users
              </div>
              {userData.tools.length > 0 && (
                <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                  🛠️ <strong>Your Tools:</strong>{" "}
                  {userData.tools.length > 3
                    ? userData.tools.slice(0, 3).join(", ") + "..."
                    : userData.tools.join(", ")}
                </div>
              )}
            </div>
          )}

          {userData.mainGoal === "Earn Rewards" && (
            <div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🏆 <strong>Rewards Program</strong> - Earn points for trying new
                tools
              </div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🔄 <strong>Activity Tracker</strong> - See your progress toward
                rewards
              </div>
              <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                🎁 <strong>Redeem Points</strong> - For gift cards, discounts,
                and more
              </div>
              {userData.tools.length > 0 && (
                <div className="p-3 my-[0.5rem] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[0.9rem] flex items-start gap-3">
                  🛠️ <strong>Your Tools:</strong>{" "}
                  {userData.tools.length > 3
                    ? userData.tools.slice(0, 3).join(", ") + "..."
                    : userData.tools.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row-reverse mt-auto pt-[2rem] w-full gap-[1rem]">
          <button
            onClick={handleNextStep}
            className="inline-flex  justify-center font-semibold items-center hover:bg-[#A29BFE] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] duration-[0.25s] hover:translate-y-[-2px] active:translate-y-0 w-full text-white bg-[#9013FE] rounded-[100px] py-[12px] px-[20px] border-none"
          >
            Looks Great!
          </button>
          <button
            onClick={handlePrevStep}
            className="bg-transparent w-full font-medium border-none shadow-none rounded-[16px] hover:text-[#9013FE] hover:underline text-sm"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
