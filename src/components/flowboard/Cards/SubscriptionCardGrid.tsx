import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { ToolSubscription } from "../../../components/dashboard/subscription/types";
import { Link } from "react-router-dom";
import CustomLogo from '../../../assets/custom_tool.png'
function SubscriptionCardGrid({
  subscription,
}: {
  subscription: ToolSubscription[];
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };


  const getDaysRemaining = (nextBillingDate: string) => {
  const now = new Date();
  const nextBilling = new Date(nextBillingDate);
  const diffTime = nextBilling.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
 const plan : any = {
  monthly: 'month',
  quarterly: 'quarter',
  annual: 'annual'
 }

  return (
    <div className="bg-white rounded-[12px] p-[1.5rem] mb-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold flex items-center text-lg">
          <FontAwesomeIcon
            className=" mr-[0.75rem] text-[#9013FE]"
            icon={Icons.CreditCard}
          />
          Your Subscriptions
        </h2>
        <Link
          to="/dashboard/subscriptions"
          className="text-[#9013FE] no-underline text-sm font-medium transtion-all duration-300 ease-in-out hover:underline"
        >
          View All
        </Link>
      </div>
      {subscription.slice(0,3).map((sub, index) => (
        <div
          key={index}
          className="flex items-center p-[0.75rem] cursor-pointer hover:bg-[#F7FAFC]  hover:translate-y-[-2px] border-[#E2E8F0] border-b  transtion-all duration-300 ease-in-out"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-3 text-lg bg-[rgba(255,_107,_107,_0.1)] text-[#FF6B6B]">
           <img src={sub.displayIcon || CustomLogo} alt="icon"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold mb-1 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {sub.name + " " + sub.tier}
            </div>
            <div className="text-[#718096] text-[0.8rem]">
              ${sub.price}/{plan[sub.billingCycle]} · Next billing on {formatDate(sub.nextBilling)}
            </div>
          </div>
          <div className="text-right text-[#718096] text-[0.8rem] ml-[0.5rem] whitespace-nowrap">
            Renews in {getDaysRemaining(sub.nextBilling)} days
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscriptionCardGrid;
