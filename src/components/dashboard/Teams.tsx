import React, { useEffect, useState } from "react";
import InviteTeamModal from "./Modals/InviteTeamModal";

import searchIcon from "../../assets/search.svg";
import moreOptionsIcon from "../../assets/more-options.svg";
import { useCurrentUser } from "../../context/CurrentUserContext";

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  isCurrentUser: boolean;
}

interface Team {
  id: string;
  name: string;
  members: Member[];
}

const Teams: React.FC = () => {
  const { currentUser, loading } = useCurrentUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");

  useEffect(() => {
    const setupMembers = async () => {
      if (!currentUser) return;

      const userAsMember: Member = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatarUrl: currentUser.avatarUrl,
        role: "admin",
        isCurrentUser: true,
      };

      setMembers([userAsMember]);

      // Initialize with empty teams array
      setTeams([]);
    };

    if (!loading) {
      setupMembers();
    }
  }, [currentUser, loading]);

  const handleRoleChange = (id: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, role: newRole } : member
      )
    );
  };

  const createTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = {
        id: (teams.length + 1).toString(),
        name: newTeamName,
        members: [members.find((m) => m.isCurrentUser)!],
      };

      setTeams([...teams, newTeam]);
      setNewTeamName("");
      setShowTeamForm(false);
    }
  };

  const addTeam = () => {
    setIsInviteModalOpen(true);
    setShowDropdown(null);
  };

  const TeamCard = ({ team }: { team: Team; index: number }) => {
    return (
      <div className="relative flex flex-col justify-center items-center p-4 border rounded-lg bg-white w-2/3 sm:w-[262px] h-[155px] border-black group">
        <h3 className="font-semibold text-lg md:text-xl text-black text-center">
          Team {team.name}
        </h3>

        <div
          className="absolute top-4 right-4"
          onMouseEnter={() => setShowDropdown(team.id)}
          onMouseLeave={() => setShowDropdown(null)}
        >
          <button className="rounded-full text-black block opacity-80 md:hidden md:group-hover:block hover:opacity-80 transition-opacity">
            <img
              src={moreOptionsIcon}
              alt="More Options"
              className="w-6 h-6 md:w-8 md:h-8"
            />
          </button>

          {showDropdown === team.id && (
            <div className="absolute top-8 right-0 md:left-0 w-32 bg-black rounded-lg shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-white"
                onClick={() => {
                  addTeam();
                }}
              >
                Add Team
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600"
                onClick={() => {
                  setTeams(teams.filter((t) => t.id !== team.id));
                  setShowDropdown(null);
                }}
              >
                Delete Team
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-2 md:mt-10 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pl-11">
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">
              {!teams.length || showTeamForm
                ? "Create a new team"
                : "Team Directory"}
            </h2>
          </div>
        </div>

        {!showTeamForm && !teams.length && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh]">
            <button
              className="px-4 py-2 md:px-6 md:py-3 bg-[#9013FE] text-white rounded-full hover:bg-purple-600 text-lg md:text-lg font-medium"
              onClick={() => setShowTeamForm(true)}
            >
              Create a new team
            </button>
          </div>
        )}

        {!showTeamForm && teams.length > 0 && (
          <div className="mt-4 md:mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {teams.map((team, index) => (
                <div key={team.id}>
                  <p className="text-sm md:text-base text-black mb-2">
                    Team {index + 1} - {team.name}
                  </p>
                  <div className="mt-8 md:mt-24">
                    <TeamCard team={team} index={index} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTeamForm && (
          <>
            <div className="mt-6 md:mt-8">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Team Name
              </h3>
              <input
                type="text"
                placeholder="Choose a name for your team"
                className="w-full sm:w-2/3 md:w-1/3 px-4 py-3 border border-gray-400 rounded-md focus:outline-none bg-transparent"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>

            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">
                Members
              </h3>
              <div className="w-full sm:w-2/3 md:w-1/3 flex items-center border border-gray-400 rounded-md px-4 py-3">
                <img
                  src={searchIcon}
                  alt="Search Icon"
                  className="w-4 h-4 md:w-5 md:h-5 mr-2"
                />
                <input
                  type="text"
                  placeholder="Add members using their email"
                  className="flex-grow focus:outline-none bg-transparent text-sm md:text-base"
                />
              </div>
            </div>

            <div className="mt-6 md:mt-10 w-full md:w-2/3 lg:w-1/2">
              <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
                Team Members
              </h3>
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-row items-center justify-between p-3 md:p-4 rounded-md mb-2"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        member.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          member.name
                        )}&background=random`
                      }
                      alt="Profile"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 md:mr-4"
                    />
                    <div>
                      <p className="font-semibold flex items-center flex-wrap">
                        {member.name}
                        {member.isCurrentUser && (
                          <span className="ml-2 px-1 py-0 bg-gray-200 text-gray-600 text-xs md:text-sm rounded">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value)
                      }
                      className="border-none px-2 py-1 outline-none bg-transparent text-sm md:text-base"
                    >
                      <option value="admin">Admin</option>
                      <option value="creator">Creator</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
              ))}
              <div className="flex flex-row mt-6 md:mt-8 gap-3">
                <button
                  className="px-4 py-2 md:px-6 md:py-3 text-white rounded-full bg-[#9013FE] hover:bg-purple-600 self-start sm:mr-4"
                  onClick={createTeam}
                >
                  Create Team
                </button>
                <button
                  className="px-4 py-2 md:px-6 md:py-3 text-gray-600 rounded-full bg-gray-200 hover:bg-gray-300 self-start"
                  onClick={() => setShowTeamForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <InviteTeamModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </>
  );
};

export default Teams;
