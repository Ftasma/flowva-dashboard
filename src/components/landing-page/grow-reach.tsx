import Tech_savyusers_img from "../../assets/tech_savy_users.svg";
import Exclusive_offer_img from "../../assets/exclusive_offer.svg";
import Top_tool_spotlight_img from "../../assets/top_tool_spotlight.svg";
import Reviews from "../../assets/reviews_icon.svg";
import Progress from "../../assets/progress_icon.svg";
export default function GrowReach() {
  return (
    <section className="flex justify-center mb-20 overflow-hidden">
      <div className="w-full md:max-w-[80%] px-[14px]">
        <h2 className="text-[56px] md:text-[64px] font-[impact] mb-10 text-center">
          AMPLIFY YOUR BRAND'S SUCCESS
        </h2>

        <div className="grid grid-cols-1  lg:grid-cols-7 gap-[24px]">
          <div className="h-[453px]  text-start flex flex-col items-start justify-between  bg-[#F5EBFF] rounded-[24px] p-[32px] w-full lg:col-span-3">
            <h2 className="text-[32px] font-manrope font-bold">
              Engage an active community of tech savvy users
            </h2>
            <img src={Tech_savyusers_img} alt="tech savy users" />
            <p className="text-[20px] text-[#535862] ">
              Thousands of engaged users explore and use tools on our platform
              everyday
            </p>
          </div>
          <div className="h-[453px]  bg-[#F5EBFF] flex flex-col items-start justify-between rounded-[24px]  lg:col-span-4 p-[32px]">
            <h2 className="text-[32px] font-manrope font-bold">
              Offer Exclusive Value
            </h2>
            <img src={Exclusive_offer_img} alt="tech savy users" />
            <p className="text-[20px] text-[#535862]">
              Stand out with special discounts, cashback, or unique perks for
              our users
            </p>
          </div>
          <div className="h-[453px] bg-[#F5EBFF] flex flex-col items-start justify-between rounded-[24px]  lg:col-span-4 p-[32px]">
            <h2 className="text-[32px] font-manrope font-bold">
              Boost Your Visibility
            </h2>
            <img src={Top_tool_spotlight_img} alt="tech savy users" />
            <p className="text-[20px] text-[#535862]">
               Get featured across our Homepage, Discover section, Rewards Hub,
              Library, Newsletter, and Blog
            </p>
          </div>
          <div className="h-[453px] bg-[#111111] relative text-white flex flex-col items-start overflow-hidden  rounded-[24px] lg:col-span-3 p-[32px]">
            <h2 className="text-[32px] font-manrope font-bold">
              Measure Your Impact
            </h2>
            <p className="text-[20px] mt-5 text-[#FFFFFFCC]">
              Track how many users unlock, engage with, and activate your offer.
            </p>

            <div className="flex items-center mt-auto">
              <div className="flex flex-col  self-end">
                <h3 className="text-[impact] p-0 m-0 -ml-2 -mb-3 text-white text-[56px]">
                  30,000+
                </h3>
                <p className="text-[20px] mt-2 text-[#FFFFFF]">
                  Tools Added to Libraries
                </p>
              </div>
              <div className="flex w-[200px]">
                <img src={Reviews} className="w-full h-full" alt="icon" />
                <img
                  src={Progress}
                  className="w-full h-full -ml-24 -mt-14"
                  alt="icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
