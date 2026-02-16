import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Wheel } from "react-custom-roulette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import supabase from "../../../lib/supabase";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import PointSuccessModal from "./SuccessModal";
import { useUserProfile } from "../../../context/UseProfileContext";
import { useStreak } from "../../../context/StreakContext";
import { logUserActivity } from "../../../services/user/activityTrack";

interface ModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Data now includes a numeric value field
const data = [
  {
    option: "0 Points",
    value: 0,
    style: { backgroundColor: "#64748b", textColor: "white" },
  },
  {
    option: "50 Points",
    value: 50,
    style: { backgroundColor: "#3b82f6", textColor: "white" },
  },
  {
    option: "100 Points",
    value: 100,
    style: { backgroundColor: "#10b981", textColor: "white" },
  },
  {
    option: "200 Points",
    value: 200,
    style: { backgroundColor: "#f59e0b", textColor: "white" },
  },
  {
    option: "500 Points",
    value: 500,
    style: { backgroundColor: "#ec4899", textColor: "white" },
  },
  {
    option: "1000 Points",
    value: 1000,
    style: { backgroundColor: "#9013fe", textColor: "white" },
  },
  {
    option: "5000 Points",
    value: 5000,
    style: { backgroundColor: "#06b6d4", textColor: "white" },
  },
];

const getRewardMessage = (points: number) => {
  if (points === 0) return "Oh no! Better luck next time. 😢";
  if (points <= 100) return "Nice try! A little goes a long way. 💪";
  if (points <= 200) return "Great spin! You're stacking up points! 🎯";
  if (points <= 1000) return "Awesome! That’s a serious reward! 💎";
  // if (points <= 2000) return "Incredible! You're on fire! 🔥";
  return "JACKPOT!!! You're unstoppable! 🤑";
};

export default function LuckySpinModal({
  openModal,
  setModalOpen,
}: ModalProps) {
  const { currentUser } = useCurrentUser();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState<number>(0);
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [result, setResult] = useState<{
    option: string;
    value: number;
  } | null>(null);

  const { streak } = useStreak();

  const { refetchRewardData } = useUserProfile();

  const handleSpin = () => {
    if (mustSpin || result) return;

    // Get all allowed indexes (exclude 5000 Points)
    const allowedIndexes = data
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.value !== 5000) // ✅ Exclude 5000 Points
      .map((item) => item.index);

    // Pick a random index from the allowed ones
    const nextIndex =
      allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)];

    setPrizeIndex(nextIndex);
    setMustSpin(true);
  };

  const handleStop = () => {
    setMustSpin(false);
    setResult(data[prizeIndex]);
  };

  const handleClaim = async () => {
    if (!currentUser || !result || claimed || loading) return;

    const { value } = result;
    if (value <= 0) {
      setResult(null);
      setModalOpen(false);
      return;
    }

    setLoading(true);

    try {
      // Log to point events
      await supabase.from("user_point_events").insert({
        user_id: currentUser.id,
        source: "streak_spin",
        points: value,
      });

      // Update profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("total_points")
        .eq("user_id", currentUser.id)
        .single();

      const currentPoints = profileData?.total_points ?? 0;

      await supabase
        .from("user_profiles")
        .update({ total_points: currentPoints + value })
        .eq("user_id", currentUser.id);

      await refetchRewardData();
      await logUserActivity({
        userId: currentUser?.id as string,
        action: "Claimed Consistency wheel points",
        metadata: {
          service: "reward",
          streak_ount: streak + `${streak > 1 ? " days" : " day"}`,
          reward_points: value,
        },
      });
      setClaimed(true);
      setShowModal(true);
      setShowConfetti(true);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      setMustSpin(false);
      setPrizeIndex(0);
      setResult(null);
      setClaimed(false);
      setShowModal(false);
    }
  }, [openModal]);

  return (
    <>
      <Modal
        open={openModal}
        footer={null}
        centered
        onCancel={() => setModalOpen(false)}
      >
        <h2 className="text-2xl text-center font-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Consistency Wheel!
        </h2>
        <p className="text-center font-semibold text-gray-700">
          🎉 You've hit a{" "}
          <span className="text-purple-600 font-bold">{streak}-day streak</span>
          ! Your consistency deserves a reward.
        </p>
        <p className="text-center text-gray-600">
          Spin the <strong>Consistency Wheel</strong> and win exciting points!
        </p>

        <div
          style={{
            transform: "scale(0.7)",
            transformOrigin: "center",
            marginTop: "-50px",
          }}
        >
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeIndex}
            data={data}
            onStopSpinning={handleStop}
            outerBorderColor="#fff"
            outerBorderWidth={8}
            radiusLineColor="#9013fe"
            radiusLineWidth={2}
            textDistance={70}
          />
        </div>

        <div className="flex justify-center">
          <button
            className={`-mt-[45px] px-6 py-3 font-bold text-white rounded-full transition-shadow ${
              !mustSpin && !result
                ? "bg-[#9013fe] shadow-lg hover:shadow-2xl"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleSpin}
            disabled={mustSpin || !!result}
          >
            {mustSpin ? "Spinning..." : "Spin the Wheel"}
          </button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-white border border-dashed border-purple-300 rounded-lg text-center">
            <h3 className=" textn-center font-bold">
              🎉 {getRewardMessage(result.value)}
            </h3>
            <div className="flex justify-center">
              <button
                className="mt-3 flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
                onClick={handleClaim}
                disabled={loading}
              >
                {loading ? (
                  "Claiming..."
                ) : (
                  <>
                    <FontAwesomeIcon icon={Icons.Gift} className="mr-2" />
                    Claim Reward
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <PointSuccessModal
        modalOpen={showModal}
        show={showConfetti}
        onClose={() => setShowModal(false)}
        points={result?.value ?? 0}
        title="🎉 Reward Claimed!"
        message="You've won points from the lucky wheel!"
        emoji="🎁"
      />
    </>
  );
}
