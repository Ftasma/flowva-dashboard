import { useState } from "react";
import "./banner.css";
import { IconButton } from "../reward/Refer";
import { Icons } from "../../icons";
import { useUserProfile } from "../../context/UseProfileContext";
import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const { userProfileData } = useUserProfile();
  const referralCode = userProfileData?.referral_code || "";

  const host = typeof window !== "undefined" ? window.location.hostname : "";
  let domain = "https://app.flowvahub.com";
  if (host === "flowvahub.com") domain = "https://flowvahub.com";
  if (host === "app.flowvahub.com") domain = "https://app.flowvahub.com";

  const referralUrl = `${domain}/signup/?ref=${referralCode}`;

  const shareMessage = `Flowva – Discover, manage and organize your digital tools.

Join me on Flowva — a platform to discover top tools, earn exclusive rewards, and grow with a vibrant community.

✨ Sign up now and start earning: ${referralUrl}`;

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

  const copyToClipboard = async () => {
    const input = document.createElement("input");
    input.setAttribute("value", shareMessage);
    document.body.appendChild(input);
    input.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(input);

    if (copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dropdownContent = (
    <div style={{ padding: "0.5rem", width: "230px" }}>
      <div className="flex justify-center gap-3 mb-2">
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
      <div className="flex justify-center">
        <button
          className=" text-sm bg-gray-100 px-2 w-fit py-1 shadow-md rounded hover:bg-gray-200 transition"
          onClick={copyToClipboard}
        >
          {copied ? "Copied!" : "Copy Invite Message"}
        </button>
      </div>
    </div>
  );

  return (
    <div className=" w-full ">
      <div className="banner banner-1 h-fit">
        <div className="left-content">
          <div className="icon-section">
            <img
              src="https://i.ibb.co/6qjpLVG/referral-icon.png"
              alt="Referral Bonus"
              className="banner-image"
            ></img>
          </div>
          <div className="text-section">
            <div className="banner-title">
              <strong>Refer and win 10,000 points!</strong>
            </div>
            <div className="banner-subtitle">
              Invite 3 friends by Nov 20 and earn a chance to be one of 5
              winners of <span className="highlight">10,000 points</span>.
              Friends must complete onboarding to qualify.
            </div>
          </div>
        </div>

        <div className="grid place-items-center relative z-[10]">
          <Dropdown
            overlay={dropdownContent}
            placement="bottomCenter"
            trigger={["hover"]}
            overlayStyle={{
              minWidth: "min-content",
              padding: "0.6rem ",
            }}
          >
            <button className="cta-button flex justify-center items-center gap-1">
              Invite Now <ChevronDown />
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
