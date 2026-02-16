import { Share2, Star } from "lucide-react";
import { useState } from "react";
import TryNewToolsModal from "./Modals/TryNewToolsModal";
import LeaveReviewModal from "./Modals/LeaveReviewModal";
import ShareStackModal from "./Modals/ShareStackModal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Icons } from "../../icons";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { Tool } from "../../context/CollectionToolsContext";
import TtsSignupClaim from "./Modals/TthSignupClaim";

export default function EarnMore() {
  const [modalOpen, setModalOpen] = useState<
    null | "try" | "review" | "share" | "tow"
  >(null);
  const [ttsModal, setTtsModal] = useState<boolean>(false);
  const { allTools } = useDefaultTools();

  const featuredTools = ["Perplexity"];
  const tool = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

  // const handleVisit = async () => {
  //   window.open(tool[0].url, "_blank");
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* <div className="transition-all hover:border-[#9013fe] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] ease-linear duration-200 border border-[#e5e7eb] rounded-xl overflow-hidden">
        <div className="p-[1rem] border border-b-[#f3f4f6] border-t-0 border-r-0 border-l-0 bg-white flex items-center gap-[0.75rem]">
          <div className="overflow-hidden relative rounded-full w-[40px] h-[40px] ">
            <img src={tool[0]?.toolLogo} />
          </div>
          <div>
            <h3 className="font-semibold">Perplexity AI</h3>
            <p className="text-xs text-gray-500">
              Earn up to +1000 points when you signup
            </p>
          </div>
        </div>
        <div className="p-[1rem]">
          <div className="flex items-center justify-between">
            <button
              onClick={handleVisit}
              className="bg-[#eef2ff] hover:text-white hover:bg-[#9013fe] text-[#9013fe] py-2 px-4 rounded-full font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 border-0"
            >
              <FontAwesomeIcon icon={Icons.UserPlus} />
              Signup
            </button>
            <button
              onClick={() => setTtsModal(true)}
              className="bg-[linear-gradient(45deg,#9013FE,#FF8687)] text-white  py-2 px-4 rounded-full font-semibold text-sm"
            >
              <FontAwesomeIcon icon={Icons.Gift} /> Claim 1000 pts
            </button>
          </div>
        </div>
      </div> */}

      <div className="transition-all hover:border-[#9013fe] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] ease-linear duration-200 border border-[#e5e7eb] rounded-xl overflow-hidden">
        <div className="p-[1rem] border border-b-[#f3f4f6] border-t-0 border-r-0 border-l-0 bg-white flex items-center gap-[0.75rem]">
          <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[rgba(228,144,230,0.1)] text-[#9013fe]">
            <Star />
          </div>
          <div>
            <h3 className="font-semibold">Refer and win 10,000 points!</h3>
          </div>
        </div>
        <div className="p-[1rem]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">
                Invite 3 friends by Nov 20 and earn a chance to be one of 5
                winners of <span className="text-[#9013fe]">10,000 points</span>
                . Friends must complete onboarding to qualify.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="transition-all hover:border-[#9013fe] hover:translate-y-[-5px] hover:shadow-[0_10px_25px_rgba(0,_0,_0,_0.1)] ease-linear duration-200 border border-[#e5e7eb] rounded-xl overflow-hidden">
        <div className="p-[1rem] border border-b-[#f3f4f6] border-t-0 border-r-0 border-l-0 bg-white flex items-center gap-[0.75rem]">
          <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[rgba(144,_19,_254,_0.1)] text-[#9013fe]">
            <Share2 />
          </div>
          <div>
            <h3 className="font-semibold">Share Your Stack</h3>
            <p className="text-xs text-gray-500">Earn +25 pts</p>
          </div>
        </div>
        <div className="p-[1rem]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Share your tool stack</p>
            </div>
            <button
              onClick={() => setModalOpen("share")}
              className="bg-[#eef2ff] hover:text-white hover:bg-[#9013fe] text-[#9013fe] py-2 px-4 rounded-full font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 border-0"
            >
              <Share2 /> Share
            </button>
          </div>
        </div>
      </div>
      {modalOpen === "try" && (
        <TryNewToolsModal
          modalOpen={modalOpen === "try"}
          setModalOpen={setModalOpen}
        />
      )}
      {modalOpen === "review" && (
        <LeaveReviewModal
          modalOpen={modalOpen === "review"}
          setModalOpen={setModalOpen}
        />
      )}
      {modalOpen === "share" && (
        <ShareStackModal
          modalOpen={modalOpen === "share"}
          setModalOpen={setModalOpen}
        />
      )}
      <TtsSignupClaim
        toolName={tool[0]?.title}
        points="1000"
        openModal={ttsModal}
        setModalOpen={setTtsModal}
      />
    </div>
  );
}
