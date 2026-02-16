import { useState, useEffect } from "react";
import supabase, { UserProfile } from "../../lib/supabase";

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileId = localStorage.getItem("profileId");

        if (!profileId) {
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) throw profileError;

        setUserProfile(profile);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user profile")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    const profileSubscription = supabase
      .channel("user_profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
          filter: `id=eq.${localStorage.getItem("profileId")}`,
        },
        (payload) => {
          if (payload.new) {
            setUserProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      profileSubscription.unsubscribe();
    };
  }, []);

  return { userProfile, loading, error };
};

export default useUserProfile;
