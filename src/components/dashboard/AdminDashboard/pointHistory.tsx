import { useState, useEffect } from "react";
import { userPointHistory } from "../../../services/admin/rewardServices";

export default function PointHistory({
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
    if (!selectedUser?.user_id) return; // no user selected

    const fetchUserHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userPointHistory(selectedUser.user_id);
        if (res.success) {
          setHistory(res.data?.history || []);
          setTotalPoints(res.data?.total_points || 0); // store total points
        } else {
          setError(res.message || "Failed to fetch history");
        }
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [selectedUser?.user_id]);

  return (
    <div>
      {selectedUser ? (
        <div>
          {/* Points History Section */}
          <div className="mt-6 max-h-[800px] overflow-y-auto h-full">

            {loading && <p>Loading history...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && history.length === 0 && (
              <p>No points history found.</p>
            )}

            {!loading && history.length > 0 && (
              <>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Source</th>
                      <th className="border px-2 py-1">Points</th>
                      <th className="border px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((event) => (
                      <tr key={event.id}>
                        <td className="border px-2 py-1">{event.source}</td>
                        <td className="border px-2 py-1">{event.points}</td>
                        <td className="border px-2 py-1">
                          {new Date(event.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total points below the table */}
                <p className="mt-2 font-semibold">
                  Total Points: {totalPoints}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>No user selected</p>
      )}
    </div>
  );
}
