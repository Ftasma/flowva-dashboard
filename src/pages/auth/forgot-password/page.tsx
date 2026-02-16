import { useState } from "react";
import usePasswordReset from "../../../hooks/auth/usePasswordReset";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const {
    resetPassword,
    loading: resetLoading,
    message: resetMessage,
  } = usePasswordReset();

  const handleForgotpassword = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <div className="min-h-[100dvh] flex justify-center py-[20px] px-3 items-center bg-gradient-to-br from-[#9013fe] to-[#6D28D9]">
      <div className="flex justify-center w-full max-w-[420px] ">
        <div className="w-full shadow-[0_4px_6px_rgba(0,0,0,0.1)] py-[30px] px-[20px] lg:p-[40px] bg-white rounded-[10px] animate-fadeIn h-fit">
          <div className=" mb-[30px]">
            <h1 className="text-2xl text-[#6D28D9] font-semibold  mb-[8px] text-center w-full  ">
              Reset Password
            </h1>

            <p className="text-sm text-[#6B7280] text-center w-full ">
              Enter your email to receive a reset link
            </p>
          </div>
          {resetMessage && (
            <div className="bg-green-50 text-green-800 py-3 px-4 rounded-[6px] mb-5 text-center text-sm">
              <span>{resetMessage}</span>
            </div>
          )}

          <div className="w-full">
            <form
              className="w-full text-[#111827]"
              onSubmit={handleForgotpassword}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-[#111827]"
              >
                Email
              </label>
              <div className="relative mb-5">
                <div className="relative group w-full">
                  <input
                    type="email"
                    value={email}
                    id="email"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    placeholder="your@email.com"
                    className=" peer w-full border text-base py-[10px] px-[14px]  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
                    required
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                </div>
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full justify-center gap-2 flex items-center p-[11px] text-base h-[55px] text-center bg-[#9013FE] text-white font-medium border-none transition-colors ease-linear duration-[.2s] rounded-[100px] hover:bg-[#6D28D9]"
              >
                {resetLoading && <div className="form-loader"></div>}
                Send Reset Link
              </button>
            </form>

            <div className="text-center mt-5 text-sm">
              <p className="text-[#6B7280]">
                Remember your password?{" "}
                <a
                  href="/signin"
                  className="text-[#9013fe]  no-underline font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
