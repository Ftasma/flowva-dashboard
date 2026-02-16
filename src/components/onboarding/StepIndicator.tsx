export default function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="flex justify-center gap-[0.5rem] mb-[1.5rem]">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className={`${
            currentStep === index + 1
              ? "w-6 rounded-[4px] bg-[#9013FE]"
              : "size-[8px] rounded-full bg-[#E9ECEF]"
          } transition-all duration-300`}
        ></div>
      ))}
    </div>
  );
}
