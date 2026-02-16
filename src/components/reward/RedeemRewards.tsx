import { Tabs, TabsProps } from "antd";
import RewardCard from "./Cards/RewardCard";
import { useEffect, useState } from "react";
import { useUserProfile } from "../../context/UseProfileContext";
import GiftClaimModal from "./Modals/ClaimModal";
import ClaimedRewardSuccessModal from "./Modals/ClaimedRewardSuccessModal";
import { fetchUserLoginLocation } from "../../utils/helper";

type RewardStatus = "unlocked" | "locked" | "comingSoon";

interface Reward {
  id: number;
  title: string;
  description: string;
  emoji: string;
  points: number | string;
  status: RewardStatus;
}

const rewards: Reward[] = [
  // {
  //   id: 1,
  //   title: "Tool Discounts",
  //   description: "Get discounts from our tool partners.",
  //   emoji: "🎨",
  //   points: 1500,
  //   status: "locked",
  // },

  // {
  //   id: 2,
  //   title: "$2 Virtual Visa Card",
  //   description:
  //     "Use your $2 prepaid card to shop anywhere Visa is accepted online.",
  //   emoji: "🎁",
  //   points: 2000,
  //   status: "locked",
  // },

  {
    id: 8,
    title: "$5 Bank Transfer",
    description: "The $5 equivalent will be transferred to your bank account.",
    emoji: "💸",
    points: 5000,
    status: "locked",
  },
  {
    id: 7,
    title: "$5 PayPal International",
    description:
      "Receive a $5 PayPal balance transfer directly to your PayPal account email.",
    emoji: "💸",
    points: 5000,
    status: "locked",
  },

  {
    id: 3,
    title: "$5 Virtual Visa Card",
    description:
      "Use your $5 prepaid card to shop anywhere Visa is accepted online.",
    emoji: "🎁",
    points: 5000,
    status: "locked",
  },
  {
    id: 4,
    title: "$5 Apple Gift Card",
    description:
      "Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.",
    emoji: "🎁",
    points: 5000,
    status: "locked",
  },
  {
    id: 5,
    title: "$5 Google Play Card",
    description:
      "Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.",
    emoji: "🎁",
    points: 5000,
    status: "locked",
  },
  {
    id: 6,
    title: "$5 Amazon Gift Card",
    description:
      "Get a $5 digital gift card to spend on your favorite tools or platforms.",
    emoji: "🎁",
    points: 5000,
    status: "locked",
  },

  {
    id: 9,
    title: "$10 Amazon Gift Card",
    description:
      "Get a $10 digital gift card to spend on your favorite tools or platforms.",
    emoji: "🎁",
    points: 10000,
    status: "locked",
  },
  {
    id: 10,
    title: "Free Udemy Course",
    description: "Coming Soon!",
    emoji: "📚",
    points: 0,
    status: "comingSoon",
  },
  // {
  //   id: 11,
  //   title: "Mystery Drop",
  //   description: "Coming Soon!",
  //   emoji: "🌟",
  //   points: 0,
  //   status: "comingSoon",
  // },
];

const assignRewardStatus = (
  reward: Reward,
  userTotalPoints: number
): Reward => {
  if (reward.status === "comingSoon") return reward;

  const status: RewardStatus =
    Number(reward.points) <= userTotalPoints ? "unlocked" : "locked";

  return { ...reward, status };
};

const filterRewards = (
  status: string,
  userTotalPoints: number,
  location: string
) => {
  let dynamicRewards: Reward[] = rewards
    .filter((reward) => {
      // Only show Bank Transfer if location is AF
      if (reward.id === 8 && location !== "AF") {
        return false;
      }
      return true;
    })
    .map((reward) => assignRewardStatus(reward, userTotalPoints));

  if (status === "all") return dynamicRewards;

  return dynamicRewards.filter((reward) => reward.status === status);
};

export default function RedeemRewards() {
  const [activeKey, setActiveKey] = useState("1");
  const { rewardData } = useUserProfile();
  const userTotalPoints = rewardData?.totalPoints ?? 0;

  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [location, setLocation] = useState<string>("");

  const handleRewardClick = (rewardTitle: string) => {
    setGiftModalOpen(true);
    setSelectedReward(rewardTitle);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const userLocation = await fetchUserLoginLocation();
      if (userLocation) setLocation(userLocation?.continent_code);
    };

    fetchLocation();
  }, []);

  const tabData: { key: string; label: string; status: string }[] = [
    { key: "1", label: "All Rewards", status: "all" },
    { key: "2", label: "Unlocked", status: "unlocked" },
    { key: "3", label: "Locked", status: "locked" },
    { key: "4", label: "Coming Soon", status: "comingSoon" },
  ];

  const items: TabsProps["items"] = tabData.map(({ key, label, status }) => {
    const isActive = key === activeKey;
    const filteredRewards = filterRewards(status, userTotalPoints, location);

    return {
      key,
      label: (
        <div className="flex items-center gap-1">
          {label}
          <span
            className={`ml-2 text-xs rounded-full h-5 px-2 inline-flex justify-center items-center ${
              isActive
                ? "bg-[#9031fe]/10 text-[#9031fe] font-semibold"
                : "bg-[#E2E8F0] text-[#CBD5E0]"
            }`}
          >
            {filteredRewards.length}
          </span>
        </div>
      ),
      children: (
        <div className="grid gap-[1.5rem] grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] mt-6">
          {filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              {...reward}
              userTotalPoints={userTotalPoints}
              onClick={handleRewardClick}
            />
          ))}
        </div>
      ),
    };
  });

  return (
    <div>
      <div>
        <h2 className="text-lg md:text-2xl my-3 text-black border border-l-[4px] border-t-0 border-b-0 border-r-0 border-[#9301fe] pl-[0.75rem] font-semibold">
          Redeem Your Points
        </h2>
        <Tabs
          defaultActiveKey="1"
          className=" "
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          items={items}
        />
      </div>
      <GiftClaimModal
        selectedReward={selectedReward}
        modalOpen={giftModalOpen}
        setModalOpen={setGiftModalOpen}
        onSuccess={() => setShowSuccessModal(true)}
      />
      <ClaimedRewardSuccessModal
        modalOpen={showSuccessModal}
        setModalOpen={setShowSuccessModal}
        selectedReward={selectedReward}
      />
    </div>
  );
}
