import type { CSSProperties } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

const faqs = [
  {
    key: "1",
    question: "What is Flowva and who are your users?",
    answer:
      "Flowva is a curated platform for tech-savvy freelancers, remote workers, and professionals. Our users actively manage their tool libraries, try new software, and engage meaningfully with brand features. Your subscription gives you direct access to this verified, engaged audience.",
  },
  {
    key: "2",
    question: "How does the subscription work?",
    answer:
      "Brands pay a monthly subscription based on the tier they select. Your subscription includes the ability to run features, provide perks and discounts to users, and track engagement — all without additional fees.",
  },
  {
    key: "3",
    question: "Can I run multiple features at once?",
    answer:
      "Yes! The number of features you can run depends on your subscription tier. Launch allows 1–2 features per month, Accelerate allows 3–5, and Dominate provides unlimited features.",
  },
  {
    key: "4",
    question: "How are users rewarded?",
    answer:
      "Brands handle all perks, discounts, and rewards directly. Users earn these rewards by engaging with your features, such as trying a tool or providing feedback, ensuring meaningful participation.",
  },
  {
    key: "5",
    question: "Can I target specific types of users?",
    answer:
      "Yes. You can target users by role, and skill set to maximize engagement and relevance.",
  },
  {
    key: "6",
    question: "What is optional premium support?",
    answer:
      "Premium support allows Flowva’s team to manage and optimize your features for high impact. This includes advanced analytics, feature strategy, and priority placement within the platform.",
  },
  {
    key: "7",
    question: "What happens when Early-Bird pricing ends?",
    answer:
      "Your rate is locked in forever. New customers will pay standard rates once we reach 50,000 users.",
  },
  {
    key: "8",
    question: "Can I switch plans anytime?",
    answer:
      "Yes! Upgrade or downgrade anytime through your dashboard. Changes take effect immediately.",
  },
  {
    key: "9",
    question: "Can I try before I buy?",
    answer:
      "We offer flexible month-to-month billing so you can cancel anytime if it’s not working for you.",
  },
  {
    key: "10",
    question: "What counts as a “featured campaign”?",
    answer:
      "Each campaign features your tool across designated placements for 30 days. You control messaging, perks, and targeting through your dashboard.",
  },
];

export default function FavoriteAskedQBrand() {
  const panelStyle: CSSProperties = {
    marginBottom: 8,
    background: "#F9F9F9",
    borderRadius: 12,
    border: "none",
    padding: "4px 8px",
  };

  return (
    <section className="flex justify-center my-20 px-[14px]">
      <div className="w-full md:max-w-[80%]">
        <h2 className="text-[56px] md:text-[64px] font-[impact] mb-10 text-center">
          NEED ANSWERS?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center font-manrope">
          {faqs.map((faq) => (
            <Collapse
              key={faq.key}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              items={[
                {
                  key: faq.key,
                  label: (
                    <span className="font-semibold text-[20px] md:text-[24px]">
                      {faq.question}
                    </span>
                  ),
                  children: (
                    <p className="text-black text-[16px] md:text-[20px]">
                      {faq.answer}
                    </p>
                  ),
                  style: panelStyle,
                },
              ]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
