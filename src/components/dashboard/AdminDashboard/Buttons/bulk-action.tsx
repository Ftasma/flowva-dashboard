import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Icons } from "../../../../icons";

type User = {
  id: string;
  is_banned: boolean;
};

type BulkActionsProps = {
  selectedUsers: string[];
  users: User[];
  setBanModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUnbanModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function BulkActions({
  selectedUsers,
  users,
  setBanModal,
  setUnbanModal,
  setMessageModal,
}: BulkActionsProps) {
  const { showBan, showUnban } = useMemo(() => {
    if (selectedUsers.length === 0) return { showBan: false, showUnban: false };

    const selectedUserObjects = users.filter((u) =>
      selectedUsers.includes(u.id)
    );

    const hasBanned = selectedUserObjects.some((u) => u.is_banned);
    const hasUnbanned = selectedUserObjects.some((u) => !u.is_banned);

    return {
      showBan: hasUnbanned,
      showUnban: hasBanned,
    };
  }, [selectedUsers, users]);

  return (
    <div className="flex gap-2">
      {/* Ban */}
      {showBan && (
        <button
          onClick={() => setBanModal(true)}
          className="p-[5px_12px] text-white bg-red-500 font-semibold rounded-[4px] w-fit flex items-center gap-1 text-[11px] transition-all duration-300 ease-linear border border-[#e0e0e0] hover:bg-red-600"
        >
          <FontAwesomeIcon icon={Icons.Ban} className="mr-1" /> Ban Selected
        </button>
      )}

      {/* Unban */}
      {showUnban && (
        <button
          onClick={() => setUnbanModal(true)}
          className="p-[5px_12px] text-white font-semibold rounded-[4px] w-fit flex items-center gap-1 text-[11px] transition-all duration-300 ease-linear border border-[#e0e0e0] hover:bg-green-600 bg-green-500"
        >
          <FontAwesomeIcon icon={Icons.Unban} className="mr-1" /> Unban Selected
        </button>
      )}

      {/* Send Message / Send to Group */}
      {selectedUsers.length > 0 && (
        <button
          onClick={() => setMessageModal(true)}
          className="p-[5px_12px] text-white font-semibold rounded-[4px] w-fit flex items-center gap-1 text-[11px] transition-all duration-300 ease-linear border border-[#e0e0e0] hover:bg-blue-600 bg-blue-500"
        >
          <FontAwesomeIcon icon={Icons.Message} className="mr-1" />
          {selectedUsers.length === 1 ? "Send Message" : "Send to Group"}
        </button>
      )}
    </div>
  );
}

export default BulkActions;
