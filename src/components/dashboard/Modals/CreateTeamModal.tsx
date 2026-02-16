interface CreateTeamModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onCreateTeam: () => void;
}

const CreateTeamModal = ({
  isOpen,
  onCancel,
  onCreateTeam,
}: CreateTeamModalProps) => {
  if (!isOpen) return null;

  const handleCreateTeam = () => {
    onCreateTeam();
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
        <p className="text-md text-left mb-6">
          You don't have any team, create a new team.
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-[#9013FE] text-white rounded-[100px] h-9  hover:bg-purple-600"
            onClick={handleCreateTeam}
          >
            Create New Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
