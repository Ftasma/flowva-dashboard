import { Modal, Select, Input, message as antdMessage } from "antd";
import { useState, useEffect } from "react";
import { sendPointReward } from "../../../../services/admin/rewardServices";
import supabase from "../../../../lib/supabase";

const { Option } = Select;

interface UserRewardsModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  emails: string[];
  userIds: string[];
}

export default function UserRewardsModal({
  openModal,
  setModalOpen,
  emails,
  userIds,
}: UserRewardsModalProps) {
  const [points, setPoints] = useState<number>(50);
  const [rewardType, setRewardType] = useState<string>("Reclaim Signup");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const handleCreditReward = async () => {
    if (!emails || emails.length === 0) {
      setFeedback("❌ Please select at least one user.");
      return;
    }

    if (!points || points <= 0) {
      setFeedback("❌ Please enter a valid number of points.");
      return;
    }

    setLoading(true);
    setFeedback("Sending...");

    try {
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const userId = userIds[i];

        const response = await sendPointReward(email, points, rewardType);

        await supabase.from("user_point_events").insert({
          user_id: userId,
          source: rewardType,
          points: points,
        });

        if (!response.success) {
          setFeedback(`❌ Failed to send to ${email}: ${response.message}`);
          setLoading(false);
          return;
        }
      }

      //  Success message
      antdMessage.success(
        ` ${emails.length} user(s) credited with ${points} points for ${rewardType}.`
      );

      //  Reset form state
      setPoints(50);
      setRewardType("Reclaim Signup");
      setFeedback("");

      //  Optionally close modal after short delay
      setTimeout(() => {
        setModalOpen(false);
      }, 800);
    } catch (error: any) {
      console.error(error);
      setFeedback(`❌ Error: ${error.message || "Something went wrong."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Flowva Rewards"
      open={openModal}
      onCancel={() => setModalOpen(false)}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          Crediting reward to:{" "}
          {emails.length > 0 ? emails.join(", ") : "No users selected"}
        </p>

        {/* Reward Type Selector */}
        <Select
          value={rewardType}
          onChange={(value) => setRewardType(value)}
          className="w-full"
          placeholder="Select reward type"
        >
          <Option value="Reclaim Signup">Reclaim Signup</Option>
          <Option value="PicWish Signup">PicWish Signup</Option>
          <Option value="Referrals">Referrals</Option>
        </Select>

        {/* Points Input */}
        <Input
          type="number"
          required
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          placeholder="Enter points to credit"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreditReward}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-md text-white"
            style={{ backgroundColor: "#9013fe" }}
          >
            {loading ? "Sending..." : "Credit Reward"}
          </button>
        </div>

        {/* Status Message */}
        {feedback && (
          <p className="text-sm mt-2 text-center text-gray-700">{feedback}</p>
        )}
      </div>
    </Modal>
  );
}
