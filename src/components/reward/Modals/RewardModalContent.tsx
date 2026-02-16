import { useCurrentUser } from "../../../context/CurrentUserContext";
import { useUserProfile } from "../../../context/UseProfileContext";
import { toast } from "react-toastify";
import {
  claimReward,
  sendFlowvaGiftEmail,
  sendFlowvaOptimizationGiftEmail,
  sendTremendousReward,
} from "../../../services/rewardService";
import { useState } from "react";
import { rewardContentMap } from "../rewardContentMap";
import {
  FLOWVA_GIFT_EMAIL_SUBJECT,
  generateBankTransferHtml,
  generateFlowvaGiftEmailHTML,
} from "../../../utils/emailTemplates";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";

export default function RewardModalContent({
  selectedReward,
  setModalOpen,
  refetchRewardData,
  onSuccess,
}: {
  selectedReward: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchRewardData: () => void;
  onSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { currentUser } = useCurrentUser();
  const { userProfileData } = useUserProfile();
  const [loading, setLoading] = useState(false);

  const rewardContent = rewardContentMap[selectedReward];
  const Icon = rewardContent.icon;

  //social share message
  const shareMessage = `🎉 I just claimed a ${selectedReward} reward on Flowva!
  
  Flowva is a platform where you discover top tools, earn exclusive rewards, and grow with a vibrant community.
  
  ✨ Join me on Flowva and start earning too — sign up now and get rewarded: https://flowvahub.com`;

  const encoded = encodeURIComponent(shareMessage);

  const handleClaim = async () => {
    if (
      !currentUser?.email ||
      !userProfileData?.name ||
      !userProfileData?.email
    ) {
      toast.error(
        "Missing user information. Please make sure you're logged in."
      );
      return;
    }

    setLoading(true);
    const { name, email } = userProfileData;
    const isGiftCard = [
      "$5 Amazon Gift Card",
      "$5 Virtual Visa Card",
      // "$2 Virtual Visa Card",
      "$5 Apple Gift Card",
      "$5 Google Play Card",
      "$10 Amazon Gift Card"
    ].includes(selectedReward);

    try {
      // Register the reward claim
      const claimResult = await claimReward({
        rewardTitle: selectedReward,
        rewardPoints: rewardContent.points,
        userEmail: currentUser.email,
        name,
      });

      if (!claimResult.success) {
        toast.error("Failed to claim reward.");
        setLoading(false);
        return;
      }

      //  Send Flowva general email
      const giftHtmlBody = generateFlowvaGiftEmailHTML({
        firstName: name,
        customMessage: "",
        encoded,
        reward: selectedReward
      });

      await sendFlowvaGiftEmail(email, FLOWVA_GIFT_EMAIL_SUBJECT, giftHtmlBody);

      //  Handle reward type-specific logic
      if (isGiftCard) {
        const giftResult = await sendTremendousReward({
          email: currentUser.email,
          name,
          rewardTitle: selectedReward,
        });

        if (giftResult.status !== 200) {
          toast.error("Reward claimed, but sending failed.");
          setLoading(false);
          return;
        }
      } else {
        const bankTransferHtml = generateBankTransferHtml(name);
        await sendFlowvaOptimizationGiftEmail(
          email,
          FLOWVA_GIFT_EMAIL_SUBJECT,
          bankTransferHtml,
          selectedReward
        );
      }

      await NotificationHelpers.onRewardClaimed(
        selectedReward,
        rewardContent.points,
        currentUser.id
      );

      toast.success("Reward sent successfully!");
      refetchRewardData();
      setModalOpen(false);
      onSuccess(true);
    } catch (error) {
      console.error("Error during reward claim:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-lg text-center mb-4">
        {rewardContent.header}
      </h3>

      <div className="tool-select">
        <div className="border border-[#e5e7eb] hover:border-[#9013fe] rounded-lg p-4 text-center cursor-pointer transition-all duration-200">
          <Icon
            className="h-8 w-8 mx-auto"
            color={rewardContent.iconColor || "#9013fe"}
          />
          <p className="mt-2">{selectedReward}</p>
        </div>
      </div>

      <div>
        <div className="border border-[#e5e7eb] rounded-[16px] p-6 my-4 text-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
          <h3 className="font-bold text-xl">{rewardContent.displayTitle}</h3>
          <p className="text-gray-600">{rewardContent.description}</p>
          <div className="mt-4">
            <p>Nice work, {userProfileData?.name}!</p>
            <p>{rewardContent.emailNote}</p>
            <p className="font-medium text-black mt-1">{currentUser?.email}</p>
            <p className="mt-2">{rewardContent.deliveryNote}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleClaim}
        disabled={loading}
        className="w-full mt-4 rounded-lg h-12 bg-[#9013fe] text-white py-2  font-semibold hover:bg-[#7a0bdf] transition-all"
      >
        {loading ? "Confirming..." : "Confirm Claim"}
      </button>
    </div>
  );
}
