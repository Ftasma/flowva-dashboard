import { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextType = {
  currency: string;
  loading: boolean;
  setCurrency: (currency: string) => void; 
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<string>("USD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const detected = data.currency || "USD";
        setCurrency(detected);
      })
      .catch((err) => {
        console.error("Failed to fetch currency:", err);
        setCurrency("USD");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, loading, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
