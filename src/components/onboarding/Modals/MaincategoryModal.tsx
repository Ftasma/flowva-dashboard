import { useEffect, useState } from "react";
import StepIndicator from "../StepIndicator";
import { useFormContext } from "../../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import OnboardingCatSkeleton from "../../skeletons/OnboardingCatSkeleton";
import { useDefaultTools } from "../../../context/DefaultToolsContext";
export default function MainCategory({
  handleNextStep,
  handlePrevStep,
  step,
}: {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  step: number;
}) {
  const { userData, setUserData } = useFormContext();

  const [showError, setShowError] = useState<boolean>(false);

  const { categories, isLoading } = useDefaultTools();

  useEffect(() => {
    if (showError) {
      const timeout = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showError]);

  const handleSelectCategory = (categoryTitle: string) => {
    setUserData((prev) => ({
      ...prev,
      mainCategory: categoryTitle,
    }));
  };

  const handleStep = () => {
    if (userData.mainCategory) {
      handleNextStep();
    }
    setShowError(true);
  };

  return (
    <div className="max-w-[500px] w-full bg-white box-border my-[2rem] p-[28px] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative h-fit">
      <StepIndicator currentStep={step} />
      <div className="h-[480px] flex flex-col animate-fadeIn">
        <h2 className="text-[#212529] text-[1.4rem] leading-[1.3rem] mb-[8px] font-bold text-center">
          What's your primary focus?
        </h2>
        <p className="text-[0.95rem] text-[#495057] mb-[1.5rem] text-center">
          Select the one category you're most interested in
        </p>
        <div className="h-full overflow-hidden">
          <div className="overflow-y-scroll category-list h-full p-1">
            {isLoading ? (
              <OnboardingCatSkeleton cards={4} />
            ) : (
              <div className="">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleSelectCategory(category)}
                    className={`hover:bg-[rgba(144,_19,_254,_0.05)]  flex items-center w-full px-[14px] py-[16px] mb-[6px] transition-all ease duration-200  rounded-[12px]  ${
                      userData.mainCategory === category
                        ? "bg-[rgba(144,_19,_254,_0.1)] outline outline-2 outline-[#9013FE]"
                        : "bg-white"
                    }`}
                  >
                    <div className="text-[18px] flex-shrink-0 inline-flex bg-[rgba(144,_19,_254,_0.1)] w-[36px] h-[36px] mr-[14px]  rounded-full items-center justify-center text-[#9013FE]">
                      <FontAwesomeIcon icon={Icons.layerGroup} />
                    </div>
                    <h3 className="text-[#212529] font-medium ">{category}</h3>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row-reverse mt-auto pt-[2rem] w-full gap-[1rem]">
          <button
            onClick={handleStep}
            className="inline-flex w-full justify-center font-semibold items-center hover:bg-[#A29BFE] transition-all hover:shadow-[0_ 8px_25px_rgba(0,_0,_0,_0.12)] duration-[0.25s] hover:translate-y-[-2px] active:translate-y-0 text-white bg-[#9013FE] rounded-[100px] py-[12px] px-[20px] border-none"
          >
            Continue
          </button>
          <button
            onClick={handlePrevStep}
            className="bg-transparent w-full font-medium border-none shadow-none rounded-[12px] hover:text-[#9013FE] hover:underline text-sm"
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
          <span>Please select a category</span>
        </div>
      )}
    </div>
  );
}
