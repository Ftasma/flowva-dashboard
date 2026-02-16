import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../../icons";
import BroadcastModal from "../Modals/BroadcastMail";
import { useState } from "react";

export default function BroadcastEmail() {
  const [openModal, setModalOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="p-[5px_12px] text-white font-semibold rounded-[4px] w-fit flex items-center gap-1 text-[11px] transtion-all duration-300 ease-linear  border border-[#e0e0e0]  hover:bg-purple-500 bg-purple-400 "
      >
        <FontAwesomeIcon icon={Icons.BullHorn} className="mr-1" /> Broadcast
        Email
      </button>
      <BroadcastModal openModal={openModal} setModalOpen={setModalOpen} />
    </div>
  );
}
