import { useEffect, useState } from "react";
import { toggleAuthorStatus } from "../../../services/admin/userService";
import { toast } from "react-toastify";

export default function ProfileDetails({
  selectedUser,
  refetch,
}: {
  selectedUser: any;
  refetch: () => void;
}) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsAuthor(selectedUser?.is_author);
  }, [selectedUser]);

  const handleAUthorToggle = async () => {
    const newStatus = !isAuthor;
    setIsAuthor(newStatus);

    try {
      setLoading(true);
      const res = await toggleAuthorStatus(selectedUser.id, newStatus);
      setLoading(false);
      if (!res.success) {
        toast.error(res.message);
        setIsAuthor(!newStatus);
      } else {
        toast.success(res.message || "Status updated");
        await refetch();
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Failed to update author status");
      setIsAuthor(!newStatus);
    }
  };

  return (
    <div>
      {selectedUser ? (
        <div>
          {/* Avatar Section */}
          <div className="relative w-fit mx-auto">
            <div className="overflow-hidden shadow-lg text-white text-5xl flex justify-center items-center bg-[#9013fe] rounded-full h-32 w-32">
              {selectedUser?.profile_pic ||
              selectedUser?.raw_user_meta_data?.avatar_url ? (
                <img
                  src={
                    selectedUser?.profile_pic ??
                    selectedUser?.raw_user_meta_data?.avatar_url.replace(
                      /=s\d+-c/,
                      "=s400-c"
                    )
                  }
                  alt="avatar"
                  className="object-cover object-center w-full h-full"
                />
              ) : (
                selectedUser?.email.charAt(0).toUpperCase()
              )}
            </div>

            {/* Admin Badge */}
            {selectedUser?.raw_app_meta_data?.role === "admin" && (
              <span className="absolute bottom-0 -right-3 bg-[linear-gradient(45deg,#9013FE,#FF8687)] text-white py-1 px-3 rounded-full font-semibold text-xs">
                Admin
              </span>
            )}
          </div>

          {/* User Details Section */}
          <div className="space-y-2 mt-6 text-sm">
            <p>
              <strong>Name:</strong> {selectedUser?.name ?? "nil"}
            </p>
            <p>
              <strong>User ID:</strong> {selectedUser.id ?? "nil"}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Referred By:</strong>{" "}
              {selectedUser.referrer_email ?? "nil"}
            </p>
            <p>
              <strong>Total Points:</strong> {selectedUser.total_points}
            </p>
            <p>
              <strong>Referral Count:</strong> {selectedUser.referral_count}
            </p>
            <p>
              <strong>Current Streak:</strong> {selectedUser.current_streak}{" "}
              {selectedUser.current_streak > 1
                ? "days"
                : selectedUser.current_streak > 0
                ? "day"
                : ""}
            </p>
            <p>
              <strong>Created At:</strong> {selectedUser.created_at}
            </p>
            <p>
              <strong>Last Sign In:</strong>{" "}
              {selectedUser.last_sign_in_at || "awaiting verification"}
            </p>

            {/* Country Info */}
            <p className="flex items-center space-x-2">
              <strong>Country:</strong>
              {selectedUser?.flag && (
                <img
                  src={selectedUser.flag}
                  alt="flag"
                  className="w-6 h-4 object-cover"
                />
              )}
              <span>{selectedUser?.country || "—"}</span>
            </p>

            <p>
              <strong>City:</strong> {selectedUser?.city || "—"}
            </p>

            {/* Author Toggle */}
            <div className="mt-3">
              <label
                htmlFor="author"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span className="font-semibold">Author:</span>
                <input
                  checked={isAuthor}
                  onChange={handleAUthorToggle}
                  disabled={loading}
                  type="checkbox"
                  name="author"
                  className="accent-[#9013fe] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <p>No user selected</p>
      )}
    </div>
  );
}
