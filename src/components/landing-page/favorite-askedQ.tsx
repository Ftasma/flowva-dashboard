
import type { CSSProperties } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

const faqs = [
  {
    key: "1",
    question: "What is Flowvahub?",
    answer:
      "Flowvahub is your productivity sidekick — helping you discover new tools, manage subscriptions, and earn rewards for staying productive.",
  },
  {
    key: "2",
    question: "Is my data secure with Flowva?",
    answer: "Absolutely. Your data is private and never sold. You decide what to share, and it’s only used to improve your experience.",
  },
  {
    key: "3",
    question: "How does team collaboration work?",
    answer:
      "Teams can share recommendations, optimize workflows together, view analytics, and manage shared subscriptions from a single dashboard. (Note: Rewards are not included for Teams.)",
  },
  {
    key: "4",
    question: "How do Smart Tool Recommendations work?",
    answer:
      "The more you use our platform, the better it understands your workflow — giving you smarter, more relevant tool suggestions over time.",
  },
  {
    key: "5",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes. You can cancel your Pro or Team plan anytime. You’ll keep access until the end of your billing cycle, and you can always downgrade to our Free plan.",
  },
  {
    key: "6",
    question: "Can I manage all my subscriptions in one place?",
    answer:
      "Yes! Flowva tracks all your subscriptions in one place — sending renewal alerts, monitoring spending, and helping you save money.",
  },
  {
    key: "7",
    question: "Do you offer mobile apps?",
    answer: "Yes 😃 Our iOS and Android apps are launching soon, so you can manage subscriptions, get recommendations, earn rewards, and stay connected anywhere.",
  },
  {
    key: "8",
    question: "What if I need help getting started?",
    answer:
      "We provide onboarding guides, tutorials, and email support. Pro users get priority support, while Teams and Organizations receive dedicated onboarding and training.",
  },
  {
    key: "9",
    question: "Can I connect with other tech professionals on Flowva?",
    answer:
      "Yes! Flowva has an active community of tech enthusiasts, freelancers, and remote professionals. You can connect with others, discuss tools, get feedback, and collaborate with like-minded users, all while discovering new ways to optimize your workflow.",
  },{
    key:"10",
    question: 'What rewards can I earn with Flowva?',
    answer: "All users earn basic rewards by using Flowva, with extra perks for Premium. Rewards come from completing simple tasks — trying recommended tools or sharing feedback — and can be redeemed for gift cards, cash, or community perks.”"
  }
];

export default function FavoriteAskedQ() {
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
                  children: <p className="text-black text-[16px] md:text-[20px]">{faq.answer}</p>,
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
