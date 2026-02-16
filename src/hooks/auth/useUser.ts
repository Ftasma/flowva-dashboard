import { useState, useEffect } from "react";
import supabase from "../../lib/supabase";

const useUser = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.name || "";
          const firstName = fullName.split(/(?=[A-Z])/)[0];
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userName, loading };
};

export default useUser;
