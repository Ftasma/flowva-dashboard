import { useState } from "react";
import supabase from "../../lib/supabase";

interface UsePasswordResetReturn {
  loading: boolean;
  message: string | null;
  isSuccess: boolean;
  resetPassword: (email: string) => Promise<void>;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const getRedirectUrl = () => {
    return `${window.location.origin}/reset-password`;
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setMessage(null);
    setIsSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl(),
      });

      if (error) throw error;

      setIsSuccess(true);
      setMessage(
        "We've sent you a password reset link. If your email is registered, it should arrive shortly."
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "An error occurred");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    message,
    isSuccess,
    resetPassword,
  };
};

export default usePasswordReset;
