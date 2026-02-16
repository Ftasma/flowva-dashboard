import { useState, useEffect } from "react";
import { userClaimedRewards } from "../../../services/admin/rewardServices";


export default function ClaimedRewards({
  selectedUser,
}: {
  selectedUser: any;
  refetch: () => void;
}) {
  const [history, setHistory] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUser?.user_id) return;

    const fetchClaimedRewards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userClaimedRewards(selectedUser.user_id);
        if (res.success) {
          setHistory(res.data?.history || []);
          setTotalPoints(res.data?.total_points_claimed || 0);
        } else {
          setError(res.message || "Failed to fetch claimed rewards");
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchClaimedRewards();
  }, [selectedUser?.user_id]);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Claimed Rewards</h3>

      {loading && <p>Loading claimed rewards...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && history.length === 0 && <p>No claimed rewards found.</p>}

      {!loading && history.length > 0 && (
        <>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Reward Title</th>
                  <th className="border px-2 py-1">Points</th>
                  <th className="border px-2 py-1">Claimed At</th>
                </tr>
              </thead>
              <tbody>
                {history.map((reward) => (
                  <tr key={reward.id}>
                    <td className="border px-2 py-1">{reward.reward_title}</td>
                    <td className="border px-2 py-1">{reward.points}</td>
                    <td className="border px-2 py-1">
                      {new Date(reward.claimed_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-2 font-semibold">Total Points Claimed: {totalPoints}</p>
        </>
      )}
    </div>
  );
}
