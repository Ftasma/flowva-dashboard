import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import supabase from "../../lib/supabase";
import { useLocation, useSearchParams } from "react-router-dom";

const useAuthRedirect = () => {
  const { userData } = useContext(UserContext)!;
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  const storedFrom = localStorage.getItem("authFrom");
  const originPath =
    searchParams.get("from") || storedFrom || location.pathname;

  // First, check Supabase session directly in case UserContext is delayed
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error retrieving session:", error);
          return;
        }

        setSessionChecked(true);

        // If we have a session but no userData yet, we'll use the session data
        if (data.session && (!userData || !userData.id)) {
          // Continue with profile check using session data
          proceedWithAuthFlow();
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  // Function to handle the auth flow with a confirmed user ID
  const proceedWithAuthFlow = async () => {
    setIsLoading(true);
    try {
      const { exists, role, isAuthor } = await checkUserRole();

      let path = "dashboard";

      if (!exists) {
        path = "onboarding";
      } else {
        const isAdminRoute = originPath.startsWith("/admin");

        if (isAdminRoute) {
          if (role === "admin") {
            // ✅ Redirect base /admin to /admin/dashboard
            if (originPath === "/admin" || originPath === "/admin/") {
              path = "admin/dashboard";
            } else {
              path = originPath.replace(/^\//, ""); // keep full admin path
            }
          }
          // ✅ Authors → only admin/blog routes
          else if (isAuthor && originPath.startsWith("/admin/blog")) {
            path = originPath.replace(/^\//, ""); // e.g. admin/blog/create
          }
          // ❌ Everyone else → unauthorized
          else {
            path = "unauthorized";
          }
        } else {
          // ✅ Normal users → dashboard
          path = "dashboard";
        }
      }

      setRedirectPath(path);
    } catch (err) {
      console.error("Role check failed:", err);
      setRedirectPath("dashboard");
    } finally {
      localStorage.removeItem("authFrom");

      setIsLoading(false);
    }
  };

  // Original userData check, backup if the session check doesn't work
  useEffect(() => {
    const performCheck = async () => {
      // Check if user needs to complete onboarding
      if (userData && userData.id) {
        // Avoid duplicate checks if we already processed based on session
        if (redirectPath !== null) {
          return;
        }

        // If we get here, we have userData but haven't set redirectPath yet
        proceedWithAuthFlow();
      } else {
        // Only set loading to false if session check is also complete
        if (sessionChecked) {
          setIsLoading(false);
        }
      }
    };

    performCheck();
  }, [userData, sessionChecked]);

  const checkUserRole = async (): Promise<{
    exists: boolean;
    role: string | null;
    isAuthor: boolean;
  }> => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error retrieving session:", error);
        return { exists: false, role: null, isAuthor: false };
      }

      const role = data.session?.user?.app_metadata?.role ?? null;

      // ✅ Fetch is_author from user_profiles
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("is_author, name, user_id")
        .eq("user_id", data?.session?.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      const isAuthor = profile?.is_author ?? false;
       const exists = !!(profile && profile.user_id && profile.name);

      return { exists, role, isAuthor };
    } catch (err) {
      console.error("Unexpected error checking role:", err);
      return { exists: false, role: null, isAuthor: false };
    }
  };

  return { redirectPath, isLoading };
};

export default useAuthRedirect;
