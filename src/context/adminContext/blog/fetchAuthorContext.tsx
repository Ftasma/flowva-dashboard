
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuthorsData } from "../../../hooks/admin/blog/useAuthors";


export interface Author {
  user_id: string;
  name: string;
  email: string;
}

interface AuthorsContextType {
  authors: Author[];
  loading: boolean;
  error: string | null;
  refreshAuthors: () => Promise<void>;
}

const AuthorsContext = createContext<AuthorsContextType | undefined>(undefined);

export const AuthorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuthorsData();
      setAuthors(data.authors || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch authors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <AuthorsContext.Provider
      value={{
        authors,
        loading,
        error,
        refreshAuthors: fetchAuthors,
      }}
    >
      {children}
    </AuthorsContext.Provider>
  );
};


export const useAuthors = (): AuthorsContextType => {
  const context = useContext(AuthorsContext);
  if (!context) {
    throw new Error("useAuthors must be used within an AuthorsProvider");
  }
  return context;
};
