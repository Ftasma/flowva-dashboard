import React, { useState } from "react";
import supabase from "../../../lib/supabase";
import googleIcon from "../../../assets/google.svg";
import { addToAwaitingVerificationList } from "../../../services/moosend-services";
// import { isInAppBrowser } from "../../../utils/isInAppBrowser";
import GoogleAuthWebviewBlockerModal from "../../../components/dashboard/Modals/GoogleAuthWebviewBlockerModal";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const [blocked, setBlocked] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [inAppModalVisible, setInAppModalVisible] = useState(false);

  // useEffect(() => {
  //   if (isInAppBrowser()) {
  //     setBlocked(true);
  //   }
  // }, []);

  // const [fingerprint, setFingerprint] = useState<string | null>(null);

  // useEffect(() => {
  //   const loadFp = async () => {
  //     const fp = await FingerprintJS.load();
  //     const result = await fp.get();
  //     setFingerprint(result.visitorId);
  //   };
  //   loadFp();
  // }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRedirectUrl = () => {
    return `${window.location.origin}/auth/callback`;
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (formData.password.trim().length < 8) {
      setMessage("Passwords must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Check if email is banned
    // const { data: bannedData, error: bannedError } = await supabase
    //   .from("banned_emails")
    //   .select("email")
    //   .eq("email", formData.email.trim().toLowerCase());

    // if (bannedError) {
    //   console.error("Error checking banned emails:", bannedError);
    //   setMessage("Something went wrong. Please try again later.");
    //   setLoading(false);
    //   return;
    // }

    // if (bannedData && bannedData.length > 0) {
    //   setMessage("This email has been banned. Contact support for help.");
    //   setLoading(false);
    //   return;
    // }

    // const { data: existing } = await supabase
    //   .from("user_profiles")
    //   .select("id")
    //   .eq("fingerprint", fingerprint);

    // if (existing && existing?.length > 0) {
    //   alert("Signup from this device is not allowed.");
    //   return;
    // }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: "user",
            referral_code: localStorage.getItem("referral_code"),
            shared_token: localStorage.getItem("sharedToken"),
            shared_flow: localStorage.getItem("sharedFlow"),
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else if (data?.user?.identities?.length === 0) {
        setMessage("This email is already registered. ");
      } else {
        localStorage.removeItem("referral_code");
        localStorage.removeItem("sharedToken");
        localStorage.removeItem("sharedFlow");

        await addToAwaitingVerificationList(formData.email);
        setFormData({ email: "", password: "", confirmPassword: "" });
        setMessage("Verification email sent. Please check your inbox.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
        },
      });

      if (error) throw error;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-[100dvh] flex justify-center py-[20px] px-3 items-center bg-gradient-to-br from-[#9013fe] to-[#6D28D9]">
      <div className="flex justify-center w-full max-w-[420px] ">
        <div className="w-full shadow-[0_4px_6px_rgba(0,0,0,0.1)] py-[30px] px-[20px] lg:p-[40px] bg-white rounded-[10px] animate-fadeIn h-fit">
          <div className=" mb-[30px]">
            <h1 className="text-2xl text-[#6D28D9] font-semibold  mb-[8px] text-center w-full  ">
              Create Your Account
            </h1>

            <p className="text-sm text-[#6B7280] text-center w-full ">
              Sign up to manage your tools
            </p>
          </div>
          {message && (
            <div
              className={` ${
                message.includes("sent")
                  ? "text-[#166534] bg-[#f0fdf4] border-green-500/20 "
                  : "bg-red-500/10 text-[#EF4444] border-red-500/20 "
              }  border p-3 rounded-[6px] mb-5 text-[12px] flex items-center gap-2`}
            >
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
              <span>{message}</span>
            </div>
          )}
          <div className="w-full">
            <form
              onSubmit={handleEmailPasswordSignUp}
              className="w-full text-[#111827]"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-[#111827]"
              >
                Email
              </label>
              <div className="relative group w-full mb-5">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className=" peer w-full border text-base py-[11px] px-3.5  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
                  required
                />
                <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
              </div>

              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-[#111827]"
              >
                Password
              </label>
              <div className="relative mb-5">
                <div className="relative group w-full ">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className=" peer w-full border py-[11px] px-[14px] text-base  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
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
              <div className="relative">
                <div className="relative group w-full mb-5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className=" peer w-full border py-[11px] px-[14px] text-base  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
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
                className="w-full text-base h-[55px]  flex justify-center gap-2 items-center p-[11px] text-center bg-[#9013FE] text-white  font-medium border-none transition-colors ease-linear duration-[.2s] rounded-[100px] hover:bg-[#6D28D9]"
              >
                {loading && <div className="form-loader"></div>}
                Sign up Account
              </button>
            </form>

            <div className="relative flex items-center w-full my-[20px]">
              <div className="flex-grow h-px bg-[#EDE9FE]"></div>
              <span className=" text-[13px] text-[#A78BFA] font-medium bg-white px-3">
                or
              </span>
              <div className="flex-grow h-px bg-[#EDE9FE]"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="border py-[11px] px-[14px] text-sm w-full gap-2 text-[#111827] border-[#EDE9FE] rounded-md hover:bg-[#F5F3FF] transition-colors flex items-center justify-center relative"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5 " />
              <span>Sign in with Google</span>
            </button>

            <div className="text-center mt-5 text-sm">
              <p className="text-[#6B7280]">
                Already have an account{" "}
                <a
                  href="/signin"
                  className="text-[#9013fe]  no-underline font-medium hover:underline"
                >
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <GoogleAuthWebviewBlockerModal
        inAppModalVisible={inAppModalVisible}
        setInAppModalVisible={setInAppModalVisible}
      />
    </div>
  );
};

export default SignUp;
