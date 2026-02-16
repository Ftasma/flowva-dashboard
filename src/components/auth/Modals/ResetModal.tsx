export default function ResetSuccessModal() {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-[10px] animate-fadeIn shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-10">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center bg-[rgba(16,185,129,0.1)] rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-[40px] h-[40px] text-[#10B981]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-[24px] font-semibold text-[#6D28D9] mb-2">
          Password Reset Successful
        </h1>
        <p className="text-[#6B7280] text-[14px] leading-[1.5]">
          Your password has been updated successfully.
        </p>

        <div className="text-[#6B7280] mt-4 text-[14px] flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#A78BFA] border-t-[#9013fe] rounded-full animate-spin"></div>
          <span>Redirecting you to login...</span>
        </div>
      </div>
    </div>
  );
}
