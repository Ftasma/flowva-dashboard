import { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import { createShare } from "../../../services/shareService";
import EmailShareModal from "./EmailShareModal";
import { Collection } from "../../../context/CollectionsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { Tool } from "../../../interfaces/toolsData";

interface Props {
  open: boolean;
  onClose: () => void;
  itemType: "tool" | "collection";
  itemId: string;
  data?: Collection;
  tool?: Tool | null;
  userId: string;
}

export default function ShareModal({
  open,
  onClose,
  data,
  tool,
  itemType,
  itemId,
  userId,
}: Props) {
  const [token, setToken] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateShareMessage = () => {
    return `🚀 I just created something awesome on Flowva!\n\nCheck it out – it could be a helpful ${itemType} for you.\n\n👉 Explore here: ${shortUrl}`;
  };

  const hasCreatedShare = useRef(false);

  useEffect(() => {
    if (!open || hasCreatedShare.current) return;

    hasCreatedShare.current = true;
    setLoading(true);

    createShare(userId, itemId, itemType, "link")
      .then((res) => {
        setToken(res.token);
        setShortUrl(res.shortShareUrl);
      })
      .catch((e) => message.error(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      // Reset flag when modal closes so it can run next open
      hasCreatedShare.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const openSocial = (via: string) => {
    if (!token) return;

    const messageText = generateShareMessage();
    const enc = encodeURIComponent(messageText);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shortUrl
      )}&quote=${enc}`,
      twitter: `https://twitter.com/intent/tweet?text=${enc}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shortUrl
      )}&summary=${enc}`,
      whatsapp: `https://api.whatsapp.com/send?text=${enc}`,
    };
    window.open(urls[via], "_self");
  };

  const handleCopy = () => {
    if (!token) return;

    const input = document.createElement("input");
    input.setAttribute("value", generateShareMessage());
    document.body.appendChild(input);
    input.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(input);

    if (copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Modal
        title={
          <h1 className="text-[#9301fe] text-xl">
            {data ? "Share Your Stack" : "Share Tool"}
          </h1>
        }
        open={open}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        onCancel={onClose}
        footer={null}
        confirmLoading={loading}
      >
        <div className="w-full bg-[#eef2ff] p-[20px] rounded-lg border-dashed border border-[#9301fe] ">
          <div className="flex items-center gap-2 mb-[15px]">
            {tool && (
              <img
                className=" w-8 h-8 rounded-md"
                src={tool.toolLogo}
                alt="logo"
              />
            )}
            <h2 className="text-[#9031fe] text-[18px] font-bold ">
              {data ? data.name : tool?.title}
            </h2>
          </div>
          <p>{data ? data.description : tool?.description}</p>
          <div className="bg-white w-fit mt-[15px]  p-[8px_12px] rounded-md flex items-center border border-[#e5e7eb] shadow-[0_4px_6px_-1px_rgba(0,_0,_0,_0.1),_0_2px_4px_-1px_rgba(0,_0,_0,_0.06)]">
            {data ? (
              <>
                <p className="h-[24px] w-[24px] bg-[#eef2ff] rounded-[md] flex items-center justify-center mr-[8px]  text-xs text-[#9301fe]">
                  <FontAwesomeIcon icon={Icons.Info} />
                </p>
                <p>
                  <span>
                    {data?.count}{" "}
                    {data?.count
                      ? data?.count > 1
                        ? "tools are"
                        : "tool is"
                      : null}
                  </span>{" "}
                  in this stack
                </p>
              </>
            ) : (
              tool?.category.map((categories, index) => (
                <span className="text-xs" key={index}>
                  {categories}{" "}
                  {index < tool.category.length - 1 && (
                    <span className="mx-1">|</span>
                  )}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="mt-[20px] gap-[15px] flex justify-center">
          <button
            onClick={() => openSocial("twitter")}
            className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] hover:translate-y-[-3px] bg-black rounded-full flex items-center justify-center text-white text-[20px] cursor-pointer transition-transform duration-200 shadow-[0_4px_6px_-1px_rgba(0,_0,_0,_0.1),_0_2px_4px_-1px_rgba(0,_0,_0,_0.06)]"
          >
            <FontAwesomeIcon icon={Icons.X} />
          </button>
          <button
            onClick={() => openSocial("facebook")}
            className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] hover:translate-y-[-3px] rounded-full bg-[#4267B2] flex items-center justify-center text-white text-[20px] cursor-pointer transition-transform duration-200 shadow-[0_4px_6px_-1px_rgba(0,_0,_0,_0.1),_0_2px_4px_-1px_rgba(0,_0,_0,_0.06)]"
          >
            <FontAwesomeIcon icon={Icons.Facebook} />
          </button>
          <button
            onClick={() => openSocial("linkedin")}
            className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] hover:translate-y-[-3px] bg-[#0077B5] rounded-full flex items-center justify-center text-white text-[20px] cursor-pointer transition-transform duration-200 shadow-[0_4px_6px_-1px_rgba(0,_0,_0,_0.1),_0_2px_4px_-1px_rgba(0,_0,_0,_0.06)]"
          >
            <FontAwesomeIcon icon={Icons.Linkedin} />
          </button>
          <button
            onClick={() => openSocial("whatsapp")}
            className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] hover:translate-y-[-3px] bg-[#31cf31] rounded-full flex items-center justify-center text-white text-[20px] cursor-pointer transition-transform duration-200 shadow-[0_4px_6px_-1px_rgba(0,_0,_0,_0.1),_0_2px_4px_-1px_rgba(0,_0,_0,_0.06)]"
          >
            <FontAwesomeIcon icon={Icons.Whatsapp} />
          </button>
          <button
            onClick={() => setEmailOpen(true)}
            className="w-[30px] h-[30px] md:w-[35px] md:h-[35px] hover:translate-y-[-3px] bg-[#D44638] rounded-full flex items-center justify-center text-white text-[20px] cursor-pointer transition-transform duration-200 shadow-[0_4px_6px_-1px_rgba(0,_0,_0,_0.1),_0_2px_4px_-1px_rgba(0,_0,_0,_0.06)]"
          >
            <FontAwesomeIcon icon={Icons.Message} />
          </button>
        </div>

        <div className="flex gap-[0.5rem] items-center my-2">
          <div className="relative group w-full ">
            <input
              type="text"
              name="tools"
              disabled
              value={generateShareMessage()}
              placeholder="Search for tools..."
              className=" peer w-full h-full border py-[0.5rem] px-[1rem] text-base  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md   outline-none focus:border-[#9013fe]"
              required
            />
            <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
          </div>
          <button
            onClick={handleCopy}
            className="rounded-[8px] px-[1.5rem] py-[0.5rem] bg-[#9013FE] text-white transition-all border-none duration-200  hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Modal>

      <EmailShareModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        shareUrl={shortUrl}
        itemType={itemType}
      />
    </>
  );
}
