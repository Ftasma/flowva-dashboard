import React, { useState } from "react";
import Modal from "./Modal";
import plusIcon from "../../../assets/plus.svg";

interface TeamMember {
  email: string;
  role: "Admin" | "Creator" | "Viewer";
}

interface InviteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteTeamModal: React.FC<InviteTeamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    { email: "", role: "Viewer" },
  ]);

  const handleAddMember = () => {
    setMembers([...members, { email: "", role: "Viewer" }]);
  };

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSendInvite = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Your Team Members"
      className="w-full max-w-xs sm:max-w-sm md:max-w-md"
    >
      <div className="space-y-4">
        <p className="text-gray-600 text-xs">
          Let's get everyone on board and make the most of this Flowva together.
        </p>

        <div>
          <select
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full sm:w-full p-3 text-sm border border-gray-800 rounded-md bg-transparent text-gray-900"
          >
            <option value="">Team Name</option>
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
          </select>
        </div>

        <div className="space-y-2">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row border border-gray-800 rounded-md overflow-hidden"
            >
              <input
                type="email"
                value={member.email}
                onChange={(e) =>
                  handleMemberChange(index, "email", e.target.value)
                }
                placeholder="Add members using their email"
                className="flex-1 p-3 text-sm font-light border-none outline-none"
              />
              <select
                value={member.role}
                onChange={(e) =>
                  handleMemberChange(
                    index,
                    "role",
                    e.target.value as TeamMember["role"]
                  )
                }
                className="w-full sm:w-24 p-1.5 text-sm border-t sm:border-t-0 sm:border-l border-gray-300 outline-none bg-transparent"
              >
                <option value="Admin">Admin</option>
                <option value="Creator">Creator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddMember}
          className="flex items-center text-black font-semibold text-sm"
        >
          <img src={plusIcon} alt="Add Member" className="w-4 h-4 mr-2" />
          Add More
        </button>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleSendInvite}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-[#9013FE] text-white rounded-full hover:bg-purple-700"
          >
            Send Invite
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteTeamModal;
