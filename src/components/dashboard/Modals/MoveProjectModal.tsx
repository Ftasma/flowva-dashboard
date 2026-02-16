import React from "react";

interface MoveProjectModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onMove: (teamName: string) => void;
}

const MoveProjectModal = ({
  isOpen,
  onCancel,
  onMove,
}: MoveProjectModalProps) => {
  const [teamName, setTeamName] = React.useState("");

  if (!isOpen) return null;

  const handleMove = () => {
    onMove(teamName);
    setTeamName("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white w-[419px] h-auto p-6 rounded-lg relative">
        <button
          className="absolute top-2 right-4 text-lg font-bold text-gray-600 hover:text-gray-900"
          onClick={onCancel}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold text-left mb-4">Add Team</h2>
        <h3 className="text-md font-medium text-left mb-6">Select a Team</h3>

        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-[#9013FE] text-white rounded-full hover:bg-purple-600"
            onClick={handleMove}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveProjectModal;
