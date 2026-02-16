import { useState } from "react";
import ResetSuccessModal from "../../../components/auth/Modals/ResetModal";
import supabase from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

interface Reset {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [formData, setFormData] = useState<Reset>({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [successful, setSuccess] = useState<boolean>(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    setValidationError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setValidationError(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setValidationError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex justify-center py-[20px] px-3 items-center bg-gradient-to-br from-[#9013fe] to-[#6D28D9]">
      <div className="flex justify-center w-full max-w-[420px] ">
        {successful ? (
          <ResetSuccessModal />
        ) : (
          <div className="w-full shadow-[0_4px_6px_rgba(0,0,0,0.1)] py-[30px] px-[20px] lg:p-[40px] bg-white rounded-[10px] animate-fadeIn h-fit">
            <div className=" mb-[30px]">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#F5F3FF] rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-[#9013fe] w-[32px] h-[32px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl text-[#6D28D9] font-semibold  mb-[8px] text-center w-full  ">
                Reset Your Password
              </h1>

              <p className="text-sm text-[#6B7280] text-center w-full ">
                Enter a new password for your account
              </p>
            </div>
            {validationError && (
              <div className="bg-red-500/10 text-[#EF4444] border border-red-500/20 p-3 rounded-[6px] mb-5 text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{validationError}</span>
              </div>
            )}

            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full  text-[#111827]">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-[#111827]"
                >
                  Password
                </label>
                <div className="relative mb-5">
                  <div className="relative group w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      name="password"
                      onChange={handleChange}
                      placeholder="••••••••"
                      className=" peer w-full border text-base py-[10px] px-[14px]  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
                      required
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 border-none text-[#A78BFA] h-fit font-medium text-xs top-0 bottom-0 m-auto"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium mb-2 text-[#111827]"
                >
                  Confirm Password
                </label>
                <div className="relative mb-5">
                  <div className="relative group w-full">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="peer w-full border py-[10px] text-base px-[14px] border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 border-none text-[#A78BFA] h-fit font-medium text-xs top-0 bottom-0 m-auto"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-[11px] gap-2 text-base h-[55px] flex justify-center items-center text-center bg-[#9013FE] text-white font-medium border-none transition-colors ease-linear duration-[.2s] rounded-[100px] hover:bg-[#6D28D9]"
                >
                  {loading && <div className="form-loader"></div>}
                  Reset Password
                </button>
              </form>

              <div className="text-center mt-5 text-sm">
                <p className="text-[#6B7280]">
                  Remember your password?{" "}
                  <a
                    href="/signup"
                    className="text-[#9013fe]  no-underline font-medium hover:underline"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
