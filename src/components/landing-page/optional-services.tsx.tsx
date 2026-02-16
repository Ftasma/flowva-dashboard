import Access_3d from "../../assets/access_3d.svg";
import Premium_3d from "../../assets/premium_3d.svg";
import Service_3d from "../../assets/service_3d.svg";
import Growth_3d from "../../assets/growth_3d.svg";
import Verified_3d from "../../assets/verified_3d.svg";
import Analytic_3d from "../../assets/analytic.svg";

type ValuePreposition = {
  header?: string;
  subheader?: string;
  description?: string;
  title?: string;
  bgColor?: string;
  textColor?: string;
  image?: string;
  padding?: string;
};
export const valuePropositions: ValuePreposition[] = [
  {
    subheader: "VALUE PROPOSITION",
    header: " TRUSTED BY LEADING PRODUCTS WITH ORGANIC MARKETING SUCCESS",
    textColor: "black",
  },
  {
    title: "Verified engagement",
    description:
      "Reach active tech-savvy professionals who manage their tool libraries and actually try new tools, all included with your subscription.",
    bgColor: "bg-[#D966FF]",
    textColor: "white",
    image: Verified_3d,
    padding: "16px",
  },
  {
    title: "Reward-Driven Growth",
    description:
      "Incentivize users automatically with Flowva’s built-in rewards system — no extra fees, fully handled by the platform.",
    bgColor: "bg-[#FF66AB]",
    textColor: "white",
    image: Growth_3d,
    padding: "16px",
  },
  {
    title: "Full Self-Serve Freedom",
    description:
      "Launch and manage campaigns anytime with an intuitive dashboard. Target your campaigns, schedule actions, and track engagement with complete control.",
    bgColor: "bg-[#FF752C]",
    textColor: "white",
    image: Service_3d,
    padding: "16px",
  },
  {
    title: "Optional Premium Support",
    description:
      "For top-tier brands or high-impact campaigns, our team can manage your campaigns, optimize engagement, and provide advanced analytics.",
    bgColor: "bg-[#2C95FF]",
    textColor: "white",
    image: Premium_3d,
    padding: "16px",
  },
  {
    title: "Exclusive Access",
    description:
      "Your subscription unlocks Flowva’s curated audience. Our users are verified, engaged, and relevant. Limited campaign slots maintain visibility and exclusivity.",
    bgColor: "bg-[#FC2367]",
    textColor: "white",
    image: Access_3d,
    padding: "16px",
  },
  {
    title: "Actionable Analytics",
    description:
      "Track real results; tool trials, user interactions, engagement trends not just impressions. Make data-driven decisions for every campaign.",
    bgColor: "bg-[#5BBB6A]",
    textColor: "white",
    image: Analytic_3d,
    padding: "16px",
  },
];

export default function OptionalServices() {
  return (
    <section className="flex justify-center my-20 px-[14px]">
      <div className="w-full  md:max-w-[80%]">
         <h2 className="text-[56px] md:text-[64px] font-[impact] mb-10 text-center">
          WHY SUBSCRIBE TO FLOWVA?
        </h2>
        <div className="flex justify-center">
         
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
            {valuePropositions.map((item, index) => {
              const spanClass =
                index === 0
                  ? "xl:col-span-2 lg:col-span-2 md:col-span-2 xl:block hidden col-span-1 "
                  : "xl:col-span-1 lg:col-span-1 md:col-span-2 col-span-1";
              return (
                <div
                  key={index}
                  className={`${spanClass} ${item.bgColor} p-[${item.padding}] min-h-fit xl:min-h-[301px] rounded-[16px]`}
                >
                  <p className=" font-manrope font-bold text-center xl:text-start">{item.subheader}</p>
                  <h2 className="text-[56px] font-[impact] text-center xl:text-start">{item.header}</h2>
                  {item.image && (
                    <img src={item.image} alt={` image ${item?.title}`} />
                  )}
                  <h2
                    className={`text-[24px] mt-5 font-manrope font-bold text-[${item.textColor}] `}
                  >
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[#FFFFFF] font-manrope">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full justify-center mt-16">
          <div className="grid justify-center md:justify-start grid-col-1 md:grid-cols-3 gap-10 w-full">
            <div className="w-full">
              <h2 className="font-[impact] text-[56px]">1200+</h2>
              <hr className="my-4" />
              <p className="font-manrope font-bold text-sm">
                ACTIVE USER/MONTH
              </p>
            </div>
            <div className="w-full">
              <h2 className="font-[impact] text-[56px]">35M+</h2>
              <hr className="my-4" />
              <p className="font-manrope font-bold text-sm">IMPRESSIONS</p>
            </div>
            <div className="w-full">
              <h2 className="font-[impact] text-[56px]">4200+</h2>
              <hr className="my-4" />
              <p className="font-manrope font-bold text-sm">PERSONALIZED ADS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
