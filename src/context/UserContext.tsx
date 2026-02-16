import React, {createContext,useState,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import supabase from "../lib/supabase";

interface UserData {
  id: string;
  mainCategory: string;
  mainGoal: string;
  tools_id: string[];
  tools: string[];
  firstName: string;
}

interface UserContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    id: "",
    mainGoal: "",
    mainCategory: "",
    tools_id: [],
    tools: [],
    firstName: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      if (user) {
        setUserData((prev) => ({
          ...prev,
          id: user.id,
        }));
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export function useFormContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useFormContext must be used within a UserProvider");
  }
  return context;
}
