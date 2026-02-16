import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserProfile } from "../../context/UseProfileContext";
import supabase from "../../lib/supabase";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { addUserToContestList } from "../../services/moosend-services";
import { useCurrentUser } from "../../context/CurrentUserContext";

const WinModal = () => {
  const { loading, currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const [step, setStep] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [otherInput, setOtherInput] = useState("");
  const { userProfileData, loading: userProfileLoading } = useUserProfile();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfUserExists = async () => {
      if (
        !loading &&
        !userProfileLoading &&
        currentUser?.id &&
        pathname === "/dashboard"
      ) {
        try {
          const { data, error } = await supabase
            .from("laptop_contest")
            .select("id")
            .eq("user_id", currentUser.id)
            .maybeSingle();

          if (!error && !data) {
            const timeout = setTimeout(() => {
              setOpen(true);
            }, 2000);

            return () => clearTimeout(timeout);
          }
        } catch (err) {
          console.error("Error checking user entry:", err);
        }
      }
    };

    checkIfUserExists();
  }, [loading, userProfileLoading, currentUser?.id, pathname]);

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

  const handleNext = async () => {
    if (step === 1) {
      if (selectedSource === "Other" && !otherInput.trim()) {
        setError("Please specify your source.");
        return;
      }

      if (!selectedSource) {
        setError("This field is required!");
        return;
      }

      const finalSource =
        selectedSource === "Other" ? otherInput.trim() : selectedSource;
      setSubmitting(true);
      const { error: insertError } = await supabase
        .from("laptop_contest")
        .insert([
          {
            name: userProfileData?.name,
            source: finalSource,
            email: currentUser?.email,
            user_id: currentUser?.id,
          },
        ]);
      await addUserToContestList({
        email: currentUser?.email,
        firstName: userProfileData?.name,
      });
      setSubmitting(false);

      if (insertError) {
        console.error("Contest insertion failed:", insertError.message);
        setError("");
        return;
      } else {
        setError("");
        setStep((prev) => prev + 1);
        setShowConfetti(true);
      }
      return;
    }
    if (step === 2) {
      setOpen(false);
      setStep(0);
      setSelectedSource("");
      setShowConfetti(false);
      navigate("/dashboard/discover");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <>
      {showConfetti && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Confetti width={width} height={height} />
        </div>
      )}
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setStep(0);
          setSelectedSource("");
          setShowConfetti(false);
        }}
        footer={null}
        centered
      >
        <div className="max-w-[500px]">
          {step === 0 && (
            <>
              <div className="mb-[20px] relative">
                <h2 className="text-[clamp(20px,_5vw,_24px)] font-[800] mb-[10px] text-[#9013FE] text-center">
                  Win a MacBook
                </h2>
                <p className="text-[clamp(13px,_3vw,_15px)] text-center leading-[1.5] max-w-[90%] m-[0_auto]">
                  Enter our exclusive giveaway for your chance to win a premium
                  laptop!
                </p>
              </div>

              <img
                src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"
                alt="MacBook Air"
                loading="eager"
                className="w-full mb-5 max-w-[220px] h-auto max-h-[140px] object-contain m-[0_auto_15px] drop-shadow-lg transition-all duration-300 ease-in-out hover:transform hover:scale-[1.05] hover:rotate-[-5deg]"
              />
            </>
          )}
          {step === 1 && (
            <>
              <div className="mb-[20px] relative">
                <h2 className="text-[clamp(20px,_5vw,_24px)] font-[800] mb-[10px] text-[#9013FE] text-center">
                  One More Step!
                </h2>
                <p className="text-[clamp(13px,_3vw,_15px)] text-center leading-[1.5] max-w-[90%] m-[0_auto]">
                  Where did you hear about this giveaway?
                </p>
              </div>
              <div className="text-center w-full text-sm text-red-600 ">
                {error}
              </div>
              <div className="flex flex-col gap-[10px] my-[20px]">
                {["Facebook", "Instagram", "Twitter", "TikTok", "Other"].map(
                  (option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl cursor-pointer border transition-all duration-200 
                        ${
                          selectedSource === option
                            ? "bg-[rgba(144,_19,_254,_0.1)] border border-[#9013FE]"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                    >
                      <input
                        type="radio"
                        name="source"
                        value={option}
                        checked={selectedSource === option}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="mr-[10px]"
                      />
                      {option}
                    </label>
                  )
                )}
                {selectedSource === "Other" && (
                  <input
                    type="text"
                    placeholder="Please Specify..."
                    name="Other"
                    className="px-4 py-3 rounded-2xl border"
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                  />
                )}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-[20px] relative">
                <h2 className="text-[clamp(20px,_5vw,_24px)] font-[800] mb-[10px] text-[#9013FE] text-center">
                  You're In!
                </h2>
                <p className="text-[clamp(13px,_3vw,_15px)] text-center leading-[1.5] max-w-[90%] m-[0_auto]">
                  Good luck — and thanks for joining the challenge
                </p>
              </div>

              <div className="text-[60px] text-[#9013FE] my-[15px] text-center">
                🎉
              </div>

              <p className="mb-[20px] text-[#4b5563] text-center">
                Confirmation details will be coming to your inbox shortly. Now
                take the next step: Add your favorite tools, build your tech
                stack, and add your subscriptions.
              </p>
            </>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="p-[12px_24px] rounded-[50px] font-bold cursor-pointer border-none  text-[clamp(14px,_3vw,_15px)] transition-all duration-300 ease-linear inline-block relative overflow-hidden w-full max-w-[200px] bg-[#9013FE] text-white z-10 hover:bg-[#7a10d8] hover:transform hover:translate-y-[-3px]"
            >
              {step === 0 && "Enter Now"}
              {step === 1 && (submitting ? "Submitting..." : "Submit")}
              {step === 2 && "Start Exploring"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WinModal;
