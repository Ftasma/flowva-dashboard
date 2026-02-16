import { useState } from "react";
import supabase from "../../../../lib/supabase";
import googleIcon from "../../../../assets/google.svg";

export default function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const getRedirectUrl = () => {
    const from = "/admin";
    // Store redirect info before Supabase redirects to Google
    localStorage.setItem("authFrom", from);
    return `${window.location.origin}/auth/callback`;
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setMessage("Invalid email and/or password");
        } else {
          setMessage(error.message);
        }

        setTimeout(() => {
          setMessage("");
        }, 3000);
        return;
      }

      // const { user } = data;

      // Role check removed as per requirement: any authenticated user can sign in.


      if (data.session) {
        const from = "/admin";
        window.location.href = `/auth/callback?from=${encodeURIComponent(
          from
        )}`;
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setMessage(null);

    localStorage.setItem("authFrom", "/admin");

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
              Flowva Admin
            </h1>

            <p className="text-sm text-[#6B7280] text-center w-full ">
              Sign in to access the admin dashboard
            </p>
          </div>
          {message && (
            <div className="bg-red-500/10 text-[#EF4444] border border-red-500/20 p-3 rounded-[6px] mb-5 text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
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
              onSubmit={handleEmailPasswordSignIn}
              className="w-full  text-[#111827]"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className=" peer w-full border text-base py-[10px] px-[14px]  border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
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
              <div className="relative">
                <div className="relative group w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="peer w-full border py-[10px] text-base px-[14px] border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[55px] gap-2 flex mt-4 justify-center text-base items-center p-[11px] text-center bg-[#9013FE] text-white  font-medium border-none transition-colors ease-linear duration-[.2s] rounded-[100px] hover:bg-[#6D28D9]"
              >
                {loading && <div className="form-loader"></div>} Sign in
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
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="border py-3 px-[14px] text-sm w-full gap-2 text-[#111827] border-[#EDE9FE] rounded-md hover:bg-[#F5F3FF] transition-colors flex items-center justify-center relative"
            >
              <img
                src={googleIcon}
                alt="Google"
                className="w-5 sm:w-6 h-5 sm:h-6"
              />
              <span>Sign in with Google</span>
            </button>

            <p className="text-sm mt-2 text-[#6B7280] text-center w-full ">
              ⚠️This form is prohibited for unauthorized users
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
