"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Button = {
  textColor: string;
  bgColor: string;
  hoverbgColor: string;
};
type Plan = {
  title: string;
  price: string;
  tag?: string;
  bg: string;
  textColor: string;
  subTextTeams?: string;
  header: string;
  button?: Button;
  buttonText: string;
  features: string[];
  border: string;
  yearlySaves?: string;
};

const plans: Plan[] = [
  {
    title: "Launch",
    price: "$50/Month",
    buttonText: "Start Your 3-Day Free Trial",
    header: "Perfect for brands testing Flowva or running focused campaigns.",
    textColor: "black",
    bg: "#F9F9F9",
    border: "#00000029",
    button: {
      textColor: "white",
      bgColor: "black",
      hoverbgColor: "#b362fae3",
    },
    features: [
      "Self-serve campaign dashboard – manage everything yourself",
      "Run 1-2 featured campaigns per month",
      "Featured placement in Discovery and Newsletter",
      "Basic analytics & performance reporting",
      "Offer perks and discounts directly to users",
    ],
    yearlySaves: "Save 20% - $480/year",
  },
  {
    title: "Accelerate",
    price: "$250/Month",
    textColor: "white",
    tag: "Most Popular",
    buttonText: "Get Started Now",
    bg: "#6B16CA",
    border: "#FFFFFF29",
    button: {
      textColor: "black",
      bgColor: "white",
      hoverbgColor: "#111111",
    },
    header:
      "For brands ready to scale visibility and drive meaningful engagement",
    features: [
      "Self-serve campaign dashboard – manage everything yourself",
      "Run 3-5 featured campaigns per month",
      " Featured placement in Discovery, Rewards, and Newsletter",
      "Priority visibility in listings and recommendations",
      "Advanced analytics with deeper user insights",
      "Offer perks, discounts, and rewards on the highly-engaged Rewards page for maximum visibility",
    ],
    yearlySaves: "Save 20% - $2,400/year",
  },
  {
    title: "Dominate",
    price: "$450/Month",
    subTextTeams: "Minimum 3 users",
    textColor: "black",
    buttonText: "Get Started Now",
    bg: "#F9F9F9",
    header:
      "For brands seeking premium positioning and consistent exposure across Flowva.",
    border: "#00000029",
    button: {
      textColor: "white",
      bgColor: "black",
      hoverbgColor: "#b362fae3",
    },
    features: [
      "Self-serve campaign dashboard – manage everything yourself",
      "Unlimited features per month",
      "Premium placement across Homepage, Discovery, Rewards, Blog, and Newsletter",
      "Premium analytics with trend tracking and performance reports",
      "Early access to new users and emerging tools",
      "Optional managed campaigns by the Flowva team",
      "Offer perks, discounts, and rewards on the highly-engaged Rewards page for maximum visibility and participation",
    ],
    yearlySaves: "Save 20% - $4,320/year",
  },
];

export default function Plans() {
  const navigate = useNavigate();
  return (
    <section className="px-[14px] select-none ">
      <h2 className="text-[56px] md:text-[64px] font-[impact] mb-10 text-center">
        GROWTH PLANS
      </h2>

      <div className="w-full md:max-w-6xl mx-auto  md:px-6 grid md:grid-cols-3 gap-8 font-manrope">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="w-full md:max-w-[410px] relative h-auto rounded-[24px] shadow-lg p-6 flex flex-col justify-between border"
            style={{
              backgroundColor: plan.bg,
              color: plan.textColor,
              borderColor: plan.border,
            }}
          >
            <div>
              {plan.tag && (
                <div className="absolute p-[8px_16px] rounded-bl-[24px] text-[#9013FE] rounded-tr-[24px] bg-white top-[2px] right-[2px]">
                  {plan.tag}
                </div>
              )}
              {/* Title + Subtext */}
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-bold">{plan.title}</h3>
                {plan.title === "Team" && (
                  <span className="text-xs opacity-70">
                    {plan.subTextTeams}
                  </span>
                )}
              </div>
              {/* Price */}
              <div className="flex items-center gap-2">
                <p className="text-[36px] font-[impact] font-bold">
                  {plan.price}
                </p>
              </div>
              <p className="text-sm font-semibold">{plan.yearlySaves} </p>
              {/* Button */}
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="mt-10 w-full relative h-[74px] text-sm font-bold rounded-[100px] border p-[6px]"
                style={{ borderColor: plan.border }}
              >
                <motion.div
                  className="h-full w-full whitespace-nowrap flex items-center justify-center rounded-[100px] relative transition-all ease-linear duration-200 shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]"
                  style={{
                    backgroundColor: plan.button?.bgColor,
                    color: plan.button?.textColor,
                  }}
                  whileHover={{
                    backgroundColor: plan.button?.hoverbgColor,
                    color: "white",
                  }}
                  whileTap={{
                    scale: 0.97,
                    backgroundColor: plan.button?.hoverbgColor,
                    color: "white",
                  }}
                >
                  {plan.buttonText}
                </motion.div>
              </motion.button>

              <hr style={{ borderColor: plan.border }} className="my-8" />

              <h4 className="font-bold italic">{plan.header}</h4>
              <ul className="space-y-2 text-sm mt-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      width="17"
                      height="14"
                      viewBox="0 0 17 14"
                      className="shrink-0"
                      fill={"none"}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.83358 8.24967L13.7502 0.333008L16.6669 3.24967L5.88261 13.6663L0.000244141 8.12716L2.50024 5.33301L5.83358 8.24967Z"
                        fill={plan.textColor}
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
