import { useState } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { useUserProfile } from "../../context/UseProfileContext";
import { Tool } from "../../interfaces/toolsData";
import {
  claimReward,
  sendFlowvaGiftEmail,
  sendToolRewardEmail,
} from "../../services/rewardService";
import {
  FLOWVA_GIFT_EMAIL_SUBJECT,
  generateFlowvaGiftEmailHTML,
  generateToolRewardEmailHTML,
  generateToolRewardEmailText,
  TOOL_REWARD_EMAIL_SUBJECT,
} from "../../utils/emailTemplates";
import { toast } from "react-toastify";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { logUserActivity } from "../../services/user/activityTrack";

export default function ToolDiscountModalContent({
  setModalOpen,
  refetchRewardData,
  onSuccess,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchRewardData: () => void;
  onSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { allTools } = useDefaultTools();
  const { currentUser } = useCurrentUser();
  const { userProfileData } = useUserProfile();
  const [loading, setLoading] = useState(false);

  const featuredTools = [
    "Jotform",
    "Reclaim",
    "Looka",
    "Campaigner",
    "AdCreative",
  ];

  const tools = [
    {
      title: "Jotform",
      header: "50% off annually/valid 2025",
      coupon: "",
      link: "https://www.jotform.com/ai/agents/?partner=flowvahub-WOAEEuoEob",
    },
    {
      title: "Reclaim",
      header: "20% off/3 years",
      coupon: "",
      link: "https://go.reclaim.ai/8dk5zw39uhfg-0titjs",
    },
    {
      title: "Looka",
      header: "10% off first year",
      coupon: "Coupon Code: FLOWVA10",
      link: "https://looka.com/",
    },
    {
      title: "Campaigner",
      header: "10% off monthly/April 30, 2025",
      coupon: "",
      link: "https://pstk.campaigner.com/xzhs4q0wdh6z-ufr3jm",
    },
    {
      title: "AdCreative",
      header: "10% off on all plans forever",
      coupon: "Coupon Code: PST25",
      link: "https://free-trial.adcreative.ai/xfcpik7cvjik",
    },
  ];

  const partneredTools = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

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

    const name = userProfileData.name;
    const email = userProfileData.email;

    //social share message
    const shareMessage = `🎉 I just claimed a "Tool Discounts reward on Flowva!
  
  Flowva is a platform where you discover top tools, earn exclusive rewards, and grow with a vibrant community.
  
  ✨ Join me on Flowva and start earning too — sign up now and get rewarded: https://flowvahub.com`;

    const encoded = encodeURIComponent(shareMessage);

    try {
      const htmlBody = generateToolRewardEmailHTML({ name, tools });
      const textBody = generateToolRewardEmailText({ name, tools });
      const giftHtmlBody = generateFlowvaGiftEmailHTML({
        firstName: name,
        customMessage: "",
        encoded,
        reward: ''
      });

      // 1. Claim Reward
      try {
        await claimReward({
          rewardTitle: "Tool Discounts",
          rewardPoints: 1500,
          userEmail: currentUser.email,
          name: name,
        });
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
      const selectedReward = "Tool Discounts";
      // 3. Send Tool Discount Email
      try {
        await sendToolRewardEmail(
          email,
          TOOL_REWARD_EMAIL_SUBJECT,
          htmlBody,
          textBody,
          selectedReward
        );
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
        1500,
        currentUser.id
      );
      await logUserActivity({
        userId: currentUser.id,
        action: "Claimed a Tool Discounts reward",
        metadata: {
          service: "reward",
          reward: selectedReward,
          points: 1500,
          toolCount: tools?.length || 0,
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
    <div>
      <h3 className="font-semibold text-lg mb-4 text-center">
        Available Tools for Discount
      </h3>

      {
        <div className="grid gap-4 my-4 grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))]">
          {partneredTools.map((tool, index) => (
            <div
              key={index}
              className="border border-[#e5e7eb] p-[.5rem] flex items-center gap-4 rounded-[8px] text-center cursor-pointer transition-all duration-200 ease-linear hover:border-[#9013fe]"
            >
              <div className="flex justify-center">
                <img src={tool.toolLogo} alt="logo" className="h-6 w-6" />
              </div>
              <p>{tool.title}</p>
            </div>
          ))}
        </div>
      }
      <div>
        <div className="border border-[#e5e7eb] rounded-[16px] p-6 my-4 text-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
          <h3 className="font-bold text-xl">Tool Discounts</h3>
          <p className="text-gray-600">Get discounts from our tool partners.</p>
          <div className="mt-4">
            <p>Nice work, {userProfileData?.name}!</p>
            <p>We're sending the Coupon codes and links to:</p>
            <p className="font-medium text-black mt-1">{currentUser?.email}</p>
            <p className="mt-2">You should receive it within 24 hours.</p>
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
