import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { useNavigate } from "react-router-dom";

function SubscriptionInActive() {
  const navigate = useNavigate();

  const handleConnect = async () => {
    navigate("/dashboard/subscriptions", {
      state: { tool: null, showModal: true, modal: "addSubscription" },
    });
  };

  return (
    <div>
      <div className="bg-white rounded-[12px] p-[2rem] text-center mb-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
        <div className="w-[80px] h-[80px] rounded-full bg-[#E9D4FF] text-[#9013FE] flex justify-center items-center text-[2rem] m-[0_auto_1.5rem]">
          <FontAwesomeIcon icon={Icons.CreditCard} />
        </div>
        <h3 className="font-semibold text-[1.2srem] mb-[0.5rem]">
          No Subscriptions Added
        </h3>
        <p className="text-[#718096] mb-[1.5rem] max-w-[400px] ml-auto mr-auto">
          Add your tool subscriptions to manage renewals, track spending, and
          discover potential savings.
        </p>
        <button
          onClick={handleConnect}
          className="w-full md:max-w-[350px] h-[50px] rounded-[50px] font-bold text-sm md:text-base  inline-flex items-center justify-center p-[0.70rem_.5rem]  md:p-[0.75rem_1rem]   border-none text-center transition-all duration-300 ease-in-out text-white bg-[#9013FE] hover:bg-[#7c0fe0] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(144,_19,_254,_0.2)]"
        >
          <FontAwesomeIcon
            icon={Icons.Plus}
            className="mr-[.2rem] md:mr-[0.5rem]"
          />{" "}
          Add Subscription
        </button>
      </div>
    </div>
  );
}

export default SubscriptionInActive;
