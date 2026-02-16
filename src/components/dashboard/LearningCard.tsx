import { useState } from "react";
import DeleteModal from "./Modals/DeleteModal";
import SharingModal from "./Modals/SharingModal";
import MoveProjectModal from "./Modals/MoveProjectModal";
import CreateTeamModal from "./Modals/CreateTeamModal";

import moreOptionsIcon from "../../assets/more-options.svg";
import slackIcon from "../../assets/slack.svg";
import eyeIcon from "../../assets/eye.svg";

interface LearningCardProps {
  cardName: string;
  cardTitle: string;
  author: string;
  isTrash?: boolean;
  onMoveToTeam?: (teamName: string) => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onDeleteForever?: () => void;
}

const LearningCard: React.FC<LearningCardProps> = ({
  cardName,
  cardTitle,
  author,
  isTrash = false,
  onMoveToTeam = () => {},
  onDelete = () => {},
  onRestore = () => {},
  onDeleteForever = () => {},
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentModal, setCurrentModal] = useState<"move" | "create" | null>(
    null
  );
  const [hasTeams, setHasTeams] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  const handleMoveToTeam = () => {
    if (!hasTeams) {
      setCurrentModal("create");
    } else {
      setCurrentModal("move");
    }
    setShowDropdown(false);
  };

  const handleTeamCreated = () => {
    setHasTeams(true);
    setCurrentModal("move");
  };

  const handleMove = (teamName: string) => {
    onMoveToTeam(teamName);
    setCurrentModal(null);
  };

  return (
    <div className="relative flex flex-col justify-between p-4 border rounded-lg bg-white w-[262px] h-[155px] border-black group">
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <img src={slackIcon} alt="Icon" className="w-8 h-8" />
            <h3 className="font-semibold text-md text-black">{cardName}</h3>
          </div>
          <h3 className="mt-5 font-semibold text-black text-lg">{cardTitle}</h3>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <button className="rounded-full text-black hidden group-hover:block hover:opacity-80 transition-opacity">
            <img src={moreOptionsIcon} alt="More Options" className="w-8 h-8" />
          </button>

          {showDropdown && (
            <div className="absolute top-8 w-32 bg-black rounded-lg shadow-lg z-10">
              {isTrash ? (
                <>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white"
                    onClick={() => {
                      onRestore();
                      setShowDropdown(false);
                    }}
                  >
                    Restore
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600"
                    onClick={() => {
                      onDeleteForever();
                      setShowDropdown(false);
                    }}
                  >
                    Delete Forever
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white"
                    onClick={() => {
                      setShowShareModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    Share
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white"
                    onClick={handleMoveToTeam}
                  >
                    Move to Team
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-black text-xs flex items-center gap-4">
        {author}
        <img src={eyeIcon} alt="Eye Icon" className="w-4 h-4" />
      </div>

      {!isTrash && (
        <>
          <DeleteModal
            isOpen={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
          <SharingModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
          />
          <MoveProjectModal
            isOpen={currentModal === "move"}
            onCancel={() => setCurrentModal(null)}
            onMove={handleMove}
          />
          <CreateTeamModal
            isOpen={currentModal === "create"}
            onCancel={() => setCurrentModal(null)}
            onCreateTeam={handleTeamCreated}
          />
        </>
      )}
    </div>
  );
};

export default LearningCard;
