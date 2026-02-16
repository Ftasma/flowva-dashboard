import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import supabase from "../lib/supabase";

export interface UserProfile {
  id: string;
  name: string;
  last_name?: string;
  profile_pic?: string;
  interest?: string;
  referral_code: string;
  [key: string]: any;
}

interface ReferralsData {
  totalPoints: number;
  referralCounts: number;
}

interface UserProfileContextProps {
  userProfileData: UserProfile | null;
  loading: boolean;
  rewardData: ReferralsData | null;
  error: Error | null;
  refetchUserProfile: () => Promise<void>;
  refetchRewardData: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(
  undefined
);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userProfileData, setUserProfileData] = useState<UserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [rewardData, setRewardData] = useState<ReferralsData | null>(null);

  const profileId = localStorage.getItem("profileId");

  const fetchUserProfile = useCallback(async () => {
    if (!profileId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) {
        setError(error);
        return;
      }

      setUserProfileData(data);
      setRewardData({
        totalPoints: data.total_points,
        referralCounts: data.referral_count,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch user profile")
      );
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  const refetchRewardData = useCallback(async () => {
    if (!profileId) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("total_points, referral_count")
        .eq("id", profileId)
        .single();

      if (error) {
        console.error("Failed to fetch reward data:", error);
        return;
      }

      setRewardData({
        totalPoints: data.total_points,
        referralCounts: data.referral_count,
      });
    } catch (err) {
      console.error("Error in refetchRewardData:", err);
    }
  }, [profileId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        userProfileData,
        rewardData,
        loading,
        error,
        refetchUserProfile: fetchUserProfile,
        refetchRewardData,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context)
    throw new Error("useUserProfile must be used within UserProfileProvider");
  return context;
};
