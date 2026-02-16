import { useFormContext } from "../../../context/UserContext";
import StepIndicator from "../StepIndicator";

export default function Goal({
  handleNextStep,
  step,setStep
}: {
  handleNextStep: () => void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>
}) {
  const { userData, setUserData } = useFormContext();

  const goals = [
    {
      title: "Track my tool subscriptions",
      description: "See all my subscriptions in one place and reduce costs",
    },
    {
      title: "Organize my work tools",
      description: "Manage all my work apps from a single dashboard",
    },
    {
      title: "Discover new tools",
      description: "Get recommendations based on my needs",
    },
    {
      title: "Earn Rewards",
      description: "Earn rewards for trying new tools and staying productive",
    },
  ];

  const handleSelectGoal = (goal: string) => {
    setUserData((prev) => ({
      ...prev,
      mainGoal: goal,
    }));
    handleNextStep();
  };

  return (
    <div className="max-w-[560px] w-full bg-white box-border my-[2rem] p-[1.5rem] lg:p-[2.5rem] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative h-fit">
      <div className="min-h-[480px] flex flex-col animate-fadeIn">
        <div className="flex-1 flex justify-center flex-col text-center">
          <StepIndicator currentStep={step} />
          <h2 className="text-[#212529] text-[1.5rem] leading-[1.3rem] mb-[1rem] font-bold text-start">
            What's your main goal?
          </h2>
          <p className="text-[0.95rem] text-[#495057] mb-[1.5rem] text-start">
            Select one to see a personalized demo workspace
          </p>
          <div className="grid grid-cols-1 gap-3 mb-[1.5rem]">
            {goals.map(({ title, description }) => {
              const isSelected = userData.mainGoal === title;

              return (
                <button
                  key={title}
                  onClick={() => handleSelectGoal(title)}
                  className={`transition-all flex flex-col p-5 border-[2px] rounded-[16px] duration-[0.25s] ease-in-out cursor-pointer
                    ${
                      isSelected
                        ? "border-[#9013FE] bg-[rgba(157,_78,_221,_0.05)]"
                        : "border-[#E9ECEF] hover:border-[#9013FE] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:translate-y-[-2px]"
                    }
                  `}
                >
                  <h3 className="text-[1.1rem] mb-[1rem] font-bold text-[#495057] text-start">
                    {title}
                  </h3>
                  <p className="text-[0.95rem] text-[#495057] text-start">
                    {description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-[1rem]">
            <button
              className="no-underline text-[0.85rem] text-[#495057] transition-all duration-[0.25s] ease-in-out hover:underline hover:text-[#9013FE]"
              onClick={()=>setStep(5)}
            >
              Skip setup and go straight to my dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
