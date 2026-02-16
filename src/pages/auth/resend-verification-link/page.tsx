import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase";
import Logo from "../../../components/common/Logo";
import verifiedSvg from "../../../assets/verified.svg";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

export default function ResendVerificationLink() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );

  useEffect(() => {
    const queryEmail = new URLSearchParams(window.location.search).get("email");

    if (!queryEmail) {
      setMessage("Invalid URL.");
      setStatus("error");
      return;
    }

    setEmail(queryEmail);

    const handleResendVerification = async () => {
      try {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: queryEmail,
        });

        if (error) {
          setMessage(error.message || "Failed to send verification email.");
          setStatus("error");
        } else {
          setMessage(
            "Verification email resent successfully. Please check your inbox."
          );
          setStatus("success");
        }
      } catch (err) {
        console.error(err);
        setMessage("An unexpected error occurred.");
        setStatus("error");
      }
    };

    handleResendVerification();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] flex items-center justify-center px-2 py-[20px]">
      <div className="rounded-[16px] border-t-[5px] border-purple-500 bg-white p-[40px] max-w-[500px] w-full shadow-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="text-3xl -mt-4 mb-3 font-semibold text-purple-600 text-center">
          Flowva
        </h2>
        <div className="flex justify-center mb-[20px]">
          {status === "success" ? (
            <img
              src={verifiedSvg}
              alt="Email Verified"
              className="h-fit w-16"
            />
          ) : status === "error" ? (
            <ErrorOutlinedIcon sx={{ fontSize: "70px", color: "#f63a3a" }} />
          ) : (
            <svg
              className="animate-spin h-10 w-10 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
        </div>

        <h1
          className={`text-center text-lg font-medium ${
            status === "success"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-gray-600 animate-pulse"
          }`}
        >
          {status === "loading"
            ? `Sending verification email to ${email || "user"}...`
            : message}
        </h1>
      </div>
    </div>
  );
}
