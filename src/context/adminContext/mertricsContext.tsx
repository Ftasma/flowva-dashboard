import { createContext, useContext, useEffect, useState } from "react";
import { getMetricsData } from "../../hooks/admin/overview";

export type MetricValues = { 
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  homepageViews: number;
};

export type PercentChangeValues = {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  activeUsers: number;
  homepageViews: number;
};

export type TotalValues = {
  allUsers: number;
  allVerifiedUsers: number;
  allUnverifiedUsers: number;
  percentChange: {
    allUsers: number;
    allVerifiedUsers: number;
    allUnverifiedUsers: number;
  };
};

export type MetricsResponse = {
  range: {
    start: string;
    end: string;
  };
  prevRange: {
    start: string;
    end: string;
  };
  metrics: MetricValues;
  percentChange: PercentChangeValues;
  totals: TotalValues;
};

export type MetricsContextType = {
  metrics: MetricsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (startDate?: string, endDate?: string) => void;
};

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const MetricsProvider = ({ children }: { children: React.ReactNode }) => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const data = await getMetricsData(startDate, endDate);
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch metrics:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <MetricsContext.Provider value={{ metrics, loading, error, refetch: fetchMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
};
