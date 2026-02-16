import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthRedirect from "../../hooks/auth/useAuthRedirect";
import { handleSharedItemClaim } from "../../services/rewardService";
import FlowvaLoader from "../common/loading";
import supabase from "../../lib/supabase";
import { logUserActivity } from "../../services/user/activityTrack";
import { fetchUserLoginLocation } from "../../utils/helper";
import { moveToNotOnboardedList } from "../../services/moosend-services";

const AuthCallback: React.FC = () => {
  const { redirectPath, isLoading } = useAuthRedirect();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    const handleRedirection = async () => {
      if (!isLoading && redirectPath && !navigated) {
        try {
          // check for banned account
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) return;

          if (user && !user.app_metadata?.role) {
            await supabase.auth.updateUser({
              data: { role: "user" },
            });
          }

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

          await handleSharedItemClaim();

          const locationData = await fetchUserLoginLocation();

          await logUserActivity({
            userId: user?.id,
            action: "login",
            metadata: {
              service: "auth",
              device: navigator.userAgent,
              time: new Date().toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          });

          //update last login location
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              country: locationData?.country,
              city: locationData?.city,
              flag: locationData?.flag,
            })
            .eq("user_id", user?.id);

          if (updateError) {
            console.error("Update failed:", updateError.message);
            return;
          }
         

          // Handle simple redirects
          if (
            ["dashboard", "onboarding", "unauthorized"].includes(redirectPath)
          ) {
            if (redirectPath === "onboarding") {
              await moveToNotOnboardedList(user?.email as string);
            }
            navigate(`/${redirectPath}`);
          }
          // Handle admin or blog-related redirects (authors or admins)
          else if (
            redirectPath.startsWith("admin/") ||
            redirectPath.startsWith("dashboard/")
          ) {
            navigate(`/${redirectPath}`);
          }
          // Fallback for any other path formats
          else {
            navigate(`/${redirectPath}`);
          }
          setNavigated(true);
        } catch (err) {
          console.error("Navigation error:", err);
          setError(
            `Failed to navigate: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }
    };

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleRedirection();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [redirectPath, isLoading, navigate, navigated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <FlowvaLoader />
          <p className="text-lg mt-2 text-center">
            Checking your account status...
          </p>
        </div>
      </div>
    );
  }

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

  // Always render something instead of null
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <FlowvaLoader />
        <p className="text-lg mt-2 text-center">Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
