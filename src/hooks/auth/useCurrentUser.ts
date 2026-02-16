// import { useState, useEffect } from "react";
// import supabase from "../../lib/supabase";

// export interface CurrentUser {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl: string;
//   isCurrentUser: boolean;
// }

// const useCurrentUser = () => {
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         setLoading(true);

//         const {
//           data: { user },
//           error: authError,
//         } = await supabase.auth.getUser();

//         if (authError) {
//           throw authError;
//         }

//         if (!user) {
//           setCurrentUser(null);
//           return;
//         }

//         const userData: CurrentUser = {
//           id: user.id,
//           name: user.user_metadata?.name || "Unknown",
//           email: user.email || "Unknown",
//           avatarUrl: user.user_metadata?.avatar_url || "",
//           isCurrentUser: true,
//         };
//         setCurrentUser(userData);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err : new Error("An unknown error occurred")
//         );
//         console.error("Error fetching current user:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, []);

//   return { currentUser, loading, error };
// };

// export default useCurrentUser;
