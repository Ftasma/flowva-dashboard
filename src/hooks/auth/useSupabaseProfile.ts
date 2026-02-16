// import { useState, useEffect, useCallback } from "react";
// import supabase, { UserProfile } from "../../lib/supabase";

// /**
//  * Custom hook to fetch and manage user profile data from Supabase
//  */
// const useSupabaseProfile = () => {
//   const [userProfileData, setUserProfileData] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   const fetchUserProfile = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const profileId = localStorage.getItem("profileId");

//     if (!profileId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from("user_profiles")
//         .select("*")
//         .eq("id", profileId)
//         .single();

//       if (error) {
//         console.error("Error fetching user profile:", error);
//         setError(error);
//         return;
//       }

//       if (data) {
//         setUserProfileData(data);
//       }
//     } catch (err) {
//       const fetchError =
//         err instanceof Error ? err : new Error("Failed to fetch user profile");
//       console.error("Failed to fetch user profile:", fetchError);
//       setError(fetchError);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUserProfile();
//   }, [fetchUserProfile]);

//   return { userProfileData, loading, error, refetchUserProfile: fetchUserProfile };
// };

// export default useSupabaseProfile;
