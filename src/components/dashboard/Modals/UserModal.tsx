import React, { useState } from "react";
import supabase from "../../../lib/supabase";
import { ModalType } from "./index";
import InviteTeamModal from "./InviteTeamModal";
import FeedbackModal from "./FeedbackModal";
import PremiumModal from "./PremiumModal";
import { useNavigate } from "react-router-dom";
import { logUserActivity } from "../../../services/user/activityTrack";
import { useCurrentUser } from "../../../context/CurrentUserContext";

interface UserModalProps {
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ onClose }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  // const showPremiumModal = () => {
  //   setIsPremiumModalVisible(true);
  // };
  const handleClosePremiumModal = () => {
    setIsPremiumModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await logUserActivity({
        userId: currentUser?.id as string,
        action: "User logged out",
        metadata: {
          service: "auth",
          time: new Date().toISOString(),
        },
      });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("authenticated");
      localStorage.removeItem("hasProfile");
      localStorage.removeItem("profileId");

      onClose();

      navigate("/signin", { replace: true });
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="absolute bottom-16 left-6 w-56 bg-white border-[#9013FE] border text-black rounded-lg shadow-lg">
        <ul className="px-4 py-2">
          <li
            className="px-4 py-2 cursor-pointer hover:bg-[rgba(144,_19,_254,_0.1)] rounded-[8px]"
            onClick={() => setIsModalVisible(true)}
          >
            Feedback
          </li>
          {/* <li
            className="px-4 py-2 cursor-pointer hover:bg-[rgba(144,_19,_254,_0.1)] rounded-[8px]"
            onClick={() => {
              setActiveModal("pro");
              showPremiumModal();
            }}
          >
            Try Pro for 14 days
          </li> */}
          <button className="my-custom-brevo-chat-button border-none w-full text-start px-4 py-2 cursor-pointer hover:bg-[rgba(144,_19,_254,_0.1)] rounded-[8px]">
            Support
          </button>
          <li
            className="px-4 py-2 cursor-pointer hover:bg-[rgba(255,_107,_107,_0.1)] hover:text-[#FF6B6B] rounded-[8px]"
            onClick={handleLogout}
          >
            Log Out
          </li>
        </ul>
      </div>
      <InviteTeamModal isOpen={activeModal === "invite"} onClose={closeModal} />
      <FeedbackModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      {/* Pro plan modal */}
      <PremiumModal
        isVisible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
      />
    </>
  );
};

export default UserModal;
