interface DeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, onCancel, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white w-[419px] h-auto p-6 rounded-lg relative">
        <button
          className="absolute top-2 right-4 text-lg font-bold text-gray-600 hover:text-gray-900"
          onClick={onCancel}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold text-left mb-4">Confirmation</h2>
        <h3 className="text-md font-medium text-left mb-6">
          Are you sure you want to delete this Walkthrough?
        </h3>

        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-6 bg-gray-300  hover:bg-gray-400 rounded-[100px] h-9 py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 rounded-[100px] font-semibold h-9 py-2 bg-red-600 text-white  hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
