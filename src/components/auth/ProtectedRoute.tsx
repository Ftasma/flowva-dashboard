import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContextProvider";
import FlowvaLoader from "../common/loading";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, authenticated, hasProfile } = useAuth();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (user?.email) {
        //check for banned
        const { data: banned, error: banError } = await supabase
          .from("banned_emails")
          .select("email")
          .eq("email", user.email.toLowerCase())
          .maybeSingle();

        if (banError) {
          throw new Error("Failed to verify ban status.");
        }

        if (banned) {
          await supabase.auth.signOut();
          setError("Your account has been banned. Contact support.");
          return;
        }
      }
    };
    checkStatus();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">{error}</h1>
        <p className="text-base mb-1">Please try again or contact support.</p>
        <p className="text-sm text-gray-500">
          Reach out to{" "}
          <a
            href="mailto:support@flowvahub.com"
            className="text-blue-600 hover:underline"
          >
            support@flowvahub.com
          </a>{" "}
          or via WhatsApp at{" "}
          <a
            href="https://wa.me/15872872064"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            +1 (587) 287-2064
          </a>
          .
        </p>
      </div>
    );
  }

  // Wait for auth check to complete
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100svh]">
        <FlowvaLoader />
      </div>
    );
  }

  // If not authenticated, redirect to sign in
  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated but profile not set, redirect to onboarding
  if (hasProfile === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If user tries to access onboarding while already onboarded, redirect to dashboard
  if (hasProfile === true && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }
  // Optional: block admin from accessing user routes
  // if (location.pathname.startsWith("/dashboard") && userRoles.includes("admin")) {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
