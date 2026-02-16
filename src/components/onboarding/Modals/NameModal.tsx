import StepIndicator from "../StepIndicator";
import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import WelcomeModal from "./CompleteModal";
import { useFormContext } from "../../../context/UserContext";
import { addToLibrary } from "../../../services/my-library/libraryService";
import { useAuth } from "../../../context/AuthContextProvider";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { handleReferralInsertOnly } from "../../../services/rewardService";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { fetchUserLoginLocation, UserLocation } from "../../../utils/helper";
import { moveToVerifiedAndOnboarded } from "../../../services/moosend-services";

export default function Name({
  handlePrevStep,
  step,
  setStep,
}: {
  handlePrevStep: () => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { userData, setUserData } = useFormContext();
  const navigate = useNavigate();
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setHasProfile } = useAuth();
  const [locationData, setLocationData] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (showError) {
      const timeout = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showError]);

  useEffect(() => {
    const fetchLocation = async () => {
      const data = await fetchUserLoginLocation();

      setLocationData(data);
    };

    fetchLocation();
  }, []);

  const handleName = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (userData.firstName.trim().length < 1) {
      setShowError(true);
      return;
    }
    setShowError(false);

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    //insert finger print
    await supabase.from("fingerprints").insert([
      {
        fingerprint,
        email: user?.email,
        user_id: user?.id,
      },
    ]);

    setLoading(true);
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", userData.id)
      .maybeSingle();

    if (existing) {
      localStorage.setItem("profileId", existing.id);
      navigate("/dashboard");
      setLoading(false);
      return;
    }

    // Create new profile
    const newId = crypto.randomUUID();

    const { data, error: insertError } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: newId,
          name: userData.firstName,
          interest: userData.mainCategory || null,
          user_id: userData.id,
          goal: userData.mainGoal || null,
          tools: userData.tools || [],
          email: user?.email,
          country: locationData?.country || null,
          city: locationData?.city || null,
          flag: locationData?.flag || null,
          country_code: locationData?.country_code || null,
          country_code_iso3: locationData?.country_code_iso3 || null,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      console.error("Profile creation failed:", insertError.message);
      setShowError(true);
      setLoading(false);
      return;
    }
    setShowSuccessModal(true);
    if (data) {
      await NotificationHelpers.onWelcomeNewUser(
        userData.id,
        userData.firstName
      );

      await handleReferralInsertOnly();
      // Move to verified users list (if not already done)
      try {
        await moveToVerifiedAndOnboarded();
      } catch (error) {
        console.error("Error updating Brevo list:", error);
      }

      if (userData.tools_id?.length) {
        await Promise.all(
          userData.tools_id.map((toolId) => addToLibrary(userData.id, toolId))
        );

        localStorage.setItem("hasProfile", "true");
        localStorage.setItem("profileId", data.id);
        setHasProfile(true);
      }
    }
  };

  const handlePrev = () => {
    if (!userData.mainGoal) {
      setStep(1);
    } else {
      handlePrevStep();
    }
  };

  return (
    <>
      {showSuccessModal ? (
        <WelcomeModal />
      ) : (
        <div className="max-w-[560px] w-full bg-white box-border my-[2rem] p-[1.5rem] lg:p-[2.5rem] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative h-fit">
          <div className="min-h-[480px] flex flex-col animate-fadeIn">
            <StepIndicator currentStep={step} />
            <h2 className="text-[#212529] text-[1.5rem] leading-[1.3rem] mb-[1rem] font-bold text-start">
              What should we call you?
            </h2>
            <p className="text-[0.95rem] text-[#495057] mb-[1.5rem] text-start">
              Enter your first name so we can personalize your experience
            </p>
            <div className="relative group mb-[1.5rem]">
              <input
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className=" peer w-full py-[0.85rem] px-[1rem] border-[2px] rounded-[16px] text-base transition-all ease-linear duration-[.2s] outline-none focus:border-[#9013fe] "
                placeholder="Your first name"
                required
              />
              <div className="pointer-events-none absolute inset-0 rounded-[16px] peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
            </div>
            <div className="flex flex-row-reverse mt-auto pt-[2rem] w-full gap-[1rem]">
              <button
                onClick={handleName}
                className="inline-flex flex-1 justify-center font-semibold items-center hover:bg-[#A29BFE] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] duration-[0.25s] hover:translate-y-[-2px] active:translate-y-0 w-full text-white bg-[#9013FE] rounded-[100px] py-[0.875rem] px-[1.5rem] border-none"
              >
                {loading
                  ? "loading..."
                  : userData.mainGoal && userData.mainCategory && userData.tools
                  ? "Finish Setup"
                  : "Skip Setup"}
              </button>
              <button
                onClick={handlePrev}
                className="bg-transparent font-medium border-none shadow-none rounded-[16px] hover:text-[#9013FE] hover:underline text-sm"
              >
                Back
              </button>
            </div>
          </div>
          {showError && (
            <div className="w-fit fixed top-5 left-1/2 transform -translate-x-1/2 bg-[#FFEBEE] text-[#C62828] px-6 py-3 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000] font-medium opacity-100 transition-opacity duration-300 ease-in-out flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Please enter your name</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
