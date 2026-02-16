export default function Welcome({
  handleNextStep,
}: {
  handleNextStep: () => void;
}) {
  return (
    <div className="max-w-[560px] w-full bg-white box-border m-x-auto p-[1.5rem] lg:p-[2.5rem] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative h-fit my-[2rem] j">
      <div className="min-h-[480px] flex flex-col animate-fadeIn">
        <div className=" flex-1 flex justify-center flex-col text-center">
          <h1 className="text-[#212529] text-[2rem] font-bold text-center">
            Welcome to Flowva
          </h1>
          <p className="text-[0.95rem] text-[#495057] text-center">
            Let's get you set up in 30 seconds. First, tell us your main goal so
            we can personalize your experience.
          </p>
        </div>
        <div className="flex mt-auto pt-[2rem] w-full gap-[1rem]">
          <button
            onClick={handleNextStep}
            className="inline-flex flex-1 justify-center font-semibold items-center hover:bg-[#A29BFE] ease-in-ou transition-all hover:shadow-[0_ 8px_25px_rgba(0, 0, 0, 0.12)] duration-[0.25s] hover:translate-y-[-2px] active:translate-y-0 justify-center w-full text-white bg-[#9013FE] rounded-[100px] py-[0.875rem] px-[1.5rem] border-none "
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
