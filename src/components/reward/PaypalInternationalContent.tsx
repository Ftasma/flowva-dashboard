import { useState } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useUserProfile } from "../../context/UseProfileContext";

import {
  claimReward,
  sendFlowvaGiftEmail,
  sendTremendousReward,
} from "../../services/rewardService";
import {
  FLOWVA_GIFT_EMAIL_SUBJECT,
  generateFlowvaGiftEmailHTML,
} from "../../utils/emailTemplates";
import { toast } from "react-toastify";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { logUserActivity } from "../../services/user/activityTrack";
import { rewardContentMap } from "./rewardContentMap";

export default function PaypalInternationalModalContent({
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
  const [paypalEmail, setPaypalEmail] = useState("");

  const rewardContent = rewardContentMap[selectedReward];
  const Icon = rewardContent.icon;

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

    if (!paypalEmail) {
      toast.info("Please enter your PayPal email.");
      return;
    }

    setLoading(true);

    const name = userProfileData.name;
    const email = userProfileData.email;

    //social share message
    const shareMessage = `🎉 I just claimed a ${selectedReward} reward on Flowva!
  
  Flowva is a platform where you discover top tools, earn exclusive rewards, and grow with a vibrant community.
  
  ✨ Join me on Flowva and start earning too — sign up now and get rewarded: https://flowvahub.com`;

    const encoded = encodeURIComponent(shareMessage);

    try {
      const giftHtmlBody = generateFlowvaGiftEmailHTML({
        firstName: name,
        customMessage: "",
        encoded,
        reward: selectedReward
      });

      // 1. Claim Reward
      try {
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
      } catch (claimError) {
        console.error("Reward claim failed:", claimError);
        toast.error("Failed to claim reward. Please try again.");
        return;
      }

      // 2. Send Flowva Gift Email
      try {
        await sendFlowvaGiftEmail(
          email,
          FLOWVA_GIFT_EMAIL_SUBJECT,
          giftHtmlBody
        );
      } catch (giftError) {
        console.error("Failed to send Flowva gift email:", giftError);
        toast.error("Reward claimed, but we couldn't send the gift email.");
        return;
      }

      try {
        await sendTremendousReward({
          email: paypalEmail,
          name,
          rewardTitle: selectedReward,
        });
      } catch (toolEmailError) {
        console.error("Failed to send tool discount email:", toolEmailError);
        toast.error("Reward claimed, but we couldn't send the tool discounts.");
        return;
      }
      setModalOpen(false);
      refetchRewardData();
      onSuccess(true);

      await NotificationHelpers.onRewardClaimed(
        selectedReward,
        5000,
        currentUser.id
      );
      await logUserActivity({
        userId: currentUser.id,
        action: `Claimed ${selectedReward}`,
        metadata: {
          service: "reward",
          reward: selectedReward,
          points: rewardContent.points,
        },
      });

      toast.success("🎉 Reward claimed and emails sent!");
    } catch (error) {
      console.error("Unexpected error during reward claim:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // prevent page refresh
        handleClaim();
      }}
    >
      <h3 className="font-semibold text-lg mb-4 text-center">Paypal</h3>
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
            <div className="relative group w-full mb-5">
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="Enter your PayPal account email"
                className="peer w-full border text-base py-[10px] px-[14px] border-[#EDE9FE] rounded-md outline-none focus:border-[#9013fe]"
                required
              />
              <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
            </div>
            <p className="mt-2">{rewardContent.deliveryNote}</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 rounded-lg h-12 bg-[#9013fe] text-white py-2 font-semibold hover:bg-[#7a0bdf] transition-all"
      >
        {loading ? "Confirming..." : "Confirm Claim"}
      </button>
    </form>
  );
}
