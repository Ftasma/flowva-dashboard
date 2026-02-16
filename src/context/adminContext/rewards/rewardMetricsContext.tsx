import { createContext, useContext, useEffect, useState } from "react";
import { getRewardsMetricsData } from "../../../hooks/admin/rewards/reward-overview";

export type RewardMetricValues = {
  rewardPageViews: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
};

export type RewardPercentChangeValues = {
  rewardPageViews: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
};

export type RewardsMetricsResponse = {
  range: {
    start: string;
    end: string;
  };
  prevRange: {
    start: string;
    end: string;
  } | null;
  metrics: RewardMetricValues;
  percentChange: RewardPercentChangeValues;
};

export type RewardsMetricsContextType = {
  metrics: RewardsMetricsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (startDate?: string, endDate?: string) => void;
};

const RewardsMetricsContext = createContext<
  RewardsMetricsContextType | undefined
>(undefined);

export const RewardsMetricsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [metrics, setMetrics] = useState<RewardsMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const data = await getRewardsMetricsData(startDate, endDate);
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch reward metrics:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <RewardsMetricsContext.Provider
      value={{ metrics, loading, error, refetch: fetchMetrics }}
    >
      {children}
    </RewardsMetricsContext.Provider>
  );
};

export const useRewardsMetrics = () => {
  const context = useContext(RewardsMetricsContext);
  if (!context) {
    throw new Error(
      "useRewardsMetrics must be used within a RewardsMetricsProvider"
    );
  }
  return context;
};
