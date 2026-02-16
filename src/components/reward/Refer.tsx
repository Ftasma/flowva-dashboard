import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { Check, Copy, Users } from "lucide-react";
import { useUserProfile } from "../../context/UseProfileContext";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

export default function Refer() {
  const { userProfileData, rewardData, loading } = useUserProfile();
  const [copied, setCopied] = useState(false);

  const host = typeof window !== "undefined" ? window.location.hostname : "";
  let domain = "https://app.flowvahub.com";
  if (host === "flowvahub.com") domain = "https://flowvahub.com";
  if (host === "app.flowvahub.com") domain = "https://app.flowvahub.com";

  const referralCode = userProfileData?.referral_code || "";
  const referralUrl = `${domain}/signup/?ref=${referralCode}`;

  const shareMessage = `🚀 Join me on Flowva!
Flowva is where I discover top tools, earn rewards, and grow with community power.

Use my referral link to sign up and get rewarded too:
${referralUrl}`;

  const handleCopy = () => {
    const input = document.createElement("input");
    input.setAttribute("value", referralUrl);
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(input);

    if (copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Copy failed. Please copy the link manually.");
    }
  };

  const openSocial = (platform: string) => {
    const encoded = encodeURIComponent(shareMessage);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${encoded}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?summary=${encoded}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encoded}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div className="shadow-[0_5px_15px_rgba(0,_0,_0,_0.05)]  rounded-[16px] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] border border-[#f3f4f6] overflow-hidden transition-shadow duration-200">
      <div className="p-[1rem] relative border border-b-[#f3f4f6] bg-[#eef2ff] border-t-0 border-r-0 border-l-0">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-[#9013fe]" />
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Share Your Link
            </h3>
            <p className="text-gray-500 text-sm">
              Invite friends and earn 25 points when they join!
            </p>
          </div>
        </div>
      </div>
      <div className="p-[1rem]">
        <div className="space-y-6">
          <div className="flex justify-between mb-[1rem]">
            <div className="text-center p-[0.5rem] flex-1">
              <div className="text-[1.5rem] font-semibold text-[#9013fe]">
                {loading ? (
                  <Skeleton height={30} width={80} />
                ) : (
                  rewardData?.referralCounts
                )}
              </div>
              <div className="gtext-gray-600">Referrals</div>
            </div>
            <div className="text-center p-[0.5rem] flex-1">
              {rewardData && (
                <div className="text-[1.5rem] font-semibold text-[#9013fe]">
                  {25 * rewardData?.referralCounts}
                </div>
              )}
              {loading && <Skeleton height={30} width={80} />}
              <div className="gtext-gray-600">Points Earned</div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm mb-2 text-gray-700">
              Your personal referral link:
            </p>
            <div className="relative">
              <input
                type="text"
                value={referralUrl}
                readOnly
                className="flex-1  border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full pr-10"
              />
              <button
                onClick={handleCopy}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer z-10"
              >
                {copied ? (
                  <Check className="text-green-600" strokeWidth={2.5} />
                ) : (
                  <Copy className="text-[#9013fe]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-[1rem] mt-[1rem]">
            <IconButton
              platform="facebook"
              color="#1877F2"
              icon={Icons.Facebook}
              onClick={openSocial}
            />
            <IconButton
              platform="x"
              color="black"
              icon={Icons.X}
              onClick={openSocial}
            />
            <IconButton
              platform="linkedin"
              color="#0077B5"
              icon={Icons.Linkedin}
              onClick={openSocial}
            />
            <IconButton
              platform="whatsapp"
              color="#25D366"
              icon={Icons.Whatsapp}
              onClick={openSocial}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function IconButton({
  platform,
  icon,
  color,
  gradient,
  onClick,
}: {
  platform: string;
  icon: any;
  color?: string;
  gradient?: boolean;
  onClick: (platform: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(platform)}
      className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[18px] transition-transform duration-200 hover:translate-y-[-3px]"
      style={{
        background: gradient
          ? "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)"
          : color,
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
