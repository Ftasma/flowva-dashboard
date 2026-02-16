import { useEffect, useState } from "react";
import Welcome from "../../components/onboarding/Modals/WelcomeModal.tsx"
import Goal from "../../components/onboarding/Modals/GoalModal.tsx";
import MainCategory from "../../components/onboarding/Modals/MaincategoryModal.tsx";
import Tools from "../../components/onboarding/Modals/ToolsModal.tsx";
import Demo from "../../components/onboarding/Modals/DemoModal.tsx";
import Name from "../../components/onboarding/Modals/NameModal.tsx";
import { UserProvider } from "../../context/UserContext.tsx";

export default function Onboarding() {
  const [step, setStep] = useState<number>(0);

  const handleNextStep = () => {
    setStep((prevCount) => prevCount + 1);
  };
  const handlePrevStep = () => {
    setStep((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const steps = [
    <Welcome handleNextStep={handleNextStep} />,
    <Goal handleNextStep={handleNextStep} step={step} setStep={setStep} />,
    <MainCategory
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
      step={step}
    />,
    <Tools
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
      step={step}
    />,
    <Demo
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
      step={step}
    />,
    <Name handlePrevStep={handlePrevStep} step={step} setStep={setStep} />,
  ];
  return (
    <UserProvider>
      <div className="min-h-[100dvh] flex justify-center lg:items-center  px-2 relative">
        {steps[step]}
      </div>
    </UserProvider>
  );
}
