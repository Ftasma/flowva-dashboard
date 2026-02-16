import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../../../lib/supabase";
import Logo from "../../../components/common/Logo";
import verifiedSvg from "../../../assets/verified.svg";
import AccessTimeFilledOutlinedIcon from "@mui/icons-material/AccessTimeFilledOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { moveToNotOnboardedList } from "../../../services/moosend-services";
import FlowvaLoader from "../../../components/common/loading";

const AuthConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(5);
  const [sending, setSending] = useState<boolean>(false);
  const [reqMessage, setReqMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!message.includes("Successfully")) return;

    if (count <= 0) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [message, count]);

  useEffect(() => {
    const handleVerify = async () => {
      const token = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!token || !type) {
        setMessage("Invalid confirmation link");

        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: "email",
          token_hash: token,
        });

        setLoading(false);
        if (error) {
          if (error.message.includes("expired")) {
            setMessage("Verification Link Expired");
          } else {
            setMessage("Error verifying your account.");
          }
        } else {
          setIsVerified(true);
          setMessage("Account Verified Successfully !");
          const userEmail = searchParams.get("email") as string;
          await moveToNotOnboardedList(userEmail);

          setTimeout(() => navigate("/signin"), 5000);
        }
      } catch (error) {
        setMessage("Error confirming your account. Please try signing in.");
      }
    };
    handleVerify();
  }, [searchParams]);

  const handleActionButton = async () => {
    if (message.includes("Successfully")) {
      navigate("/signin");
    } else {
      try {
        setSending(true);
        const queryEmail = searchParams.get("email");
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: queryEmail as string,
        });

        setSending(false);

        if (error) {
          setReqMessage("Request Failed!");
        } else {
          setReqMessage(" Link sent to your email!");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-[100dvh] flex  items-center justify-center px-2 py-[20px]">
      {loading ? (
        <div className="flex flex-col">
          <FlowvaLoader />
          <p className="text-center animate-pulse">Verifying your email...</p>
        </div>
      ) : (
        <div
          className={`rounded-[16px] border-t-[5px]   bg-white p-[40px] max-w-[500px] w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]  ${
            message.includes("Successfully")
              ? "border-[#10b981]"
              : "border-[#f63a3a]"
          }`}
        >
          <div className="flex justify-center">
            <Logo />
          </div>
          <h2 className="text-3xl -mt-4 mb-3 font-semibold text-purple-600  text-center">
            Flowva
          </h2>
          <div className="flex justify-center">
            {isVerified ? (
              <img
                src={verifiedSvg}
                alt="Email Verified"
                className="h-fit w-16 mb-[20px]"
              />
            ) : message.includes("Invalid confirmation link") ? (
              <ErrorOutlinedIcon sx={{ fontSize: "70px", color: "#f63a3a" }} />
            ) : (
              <AccessTimeFilledOutlinedIcon
                sx={{ fontSize: "70px", color: "#f63a3a" }}
              />
            )}
          </div>
          <h1 className="text-2xl text-[#1f2937] font-bold mb-[15px] text-center">
            {message}
          </h1>
          <p className="text-center text-[#4b5563] mb-[25px]">
            {message.includes("Successfully")
              ? "Your Flowva account has been successfully verified. You can now login."
              : message.includes("Invalid confirmation link")
              ? "The confirmation link is invalid or missing required information. Please check your email or request a new link'"
              : " The verification link you used has expired or Invalid. Please request a new verification link if your account is yet to be verified."}
          </p>
          <div className="flex justify-center">
            {!message.includes("Invalid confirmation link") && (
              <button
                onClick={handleActionButton}
                className="rounded-[50px] py-[12px] px-[24px] hover:transform hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(144,_19,_254,_0.3)]  hover:bg-[#7a0bd8]  transition-all duration-300 text-center shadow-[0_4px_15px_rgba(144,_19,_254,_0.2)] bg-[#9013FE] text-white"
              >
                {message.includes("Successfully") ? (
                  "Continue to Login"
                ) : (
                  <>
                    <div className="flex items-center">
                      {sending ? (
                        <>
                          <div className="form-loader mr-2"></div>
                          <span className=" animate-pulse">Sending...</span>
                        </>
                      ) : (
                        <>
                          <NearMeOutlinedIcon
                            sx={{ fontSize: "18px", marginTop: "-3px" }}
                          />
                          <span>Resend Verification Link</span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </button>
            )}
          </div>
          <p
            className={`text-sm mt-2 text-center ${
              reqMessage.includes("Failed") ? "text-red-500" : "text-purple-600"
            }`}
          >
            {reqMessage}
          </p>
          {message.includes("Successfully") && (
            <div className="text-sm text-[#6b7280] text-center mt-5">
              Redirecting in {count} seconds...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthConfirmationPage;
