import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase";

type AuthContextType = {
  loading: boolean;
  authenticated: boolean;
  hasProfile: boolean | null;
  profileId: string | null;
  setHasProfile: (val: boolean) => void;
  userRole: string | null;
  isAuthor: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );
  const [hasProfile, setHasProfile] = useState<boolean | null>(() => {
    const cached = localStorage.getItem("hasProfile");
    return cached === "true" ? true : cached === "false" ? false : null;
  });
  const [profileId, setProfileId] = useState<string | null>(() =>
    localStorage.getItem("profileId")
  );

  const checkSessionAndProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setAuthenticated(false);
      setHasProfile(null);
      setProfileId(null);
      localStorage.removeItem("authenticated");
      localStorage.removeItem("hasProfile");
      localStorage.removeItem("profileId");
      setLoading(false);
      return;
    }

    setAuthenticated(true);
    localStorage.setItem("authenticated", "true");

    const role = session.user.app_metadata?.role ?? null;
    setUserRole(role);

    const userId = session.user.id;
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id, role, is_author")
      .eq("user_id", userId);

    if (!profiles?.length) {
      setHasProfile(false);
      localStorage.setItem("hasProfile", "false");
    } else {
      const id = profiles[0].id;
      setHasProfile(true);
      setProfileId(id);
      setIsAuthor(profiles[0].is_author || false);
      localStorage.setItem("hasProfile", "true");
      localStorage.setItem("profileId", id);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setAuthenticated(false);
          setHasProfile(null);
          setProfileId(null);
          localStorage.removeItem("authenticated");
          localStorage.removeItem("hasProfile");
          localStorage.removeItem("profileId");
          setLoading(false);
        } else {
          checkSessionAndProfile();
        }
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated,
        hasProfile,
        profileId,
        setHasProfile,
        userRole,
        isAuthor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
