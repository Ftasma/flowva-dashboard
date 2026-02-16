import React from "react";

import inviteIcon from "../../../assets/invite.svg";
import downloadIcon from "../../../assets/download.svg";
import pdfIcon from "../../../assets/pdf.svg";
import pptxIcon from "../../../assets/pptx.svg";
import mp4Icon from "../../../assets/mp4.svg";
import copyIcon from "../../../assets/copy-link.svg";
import emailIcon from "../../../assets/share-email.svg";
import xIcon from "../../../assets/x.svg";
import linkedinIcon from "../../../assets/linkedin.svg";
import facebookIcon from "../../../assets/facebook.svg";

interface SharingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharingModal: React.FC<SharingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const documentTypes = [
    { type: "PDF", icon: pdfIcon },
    { type: "PPTX", icon: pptxIcon },
    { type: "MP4", icon: mp4Icon },
  ];

  const shareOptions = [
    { label: "Copy Link", icon: copyIcon },
    { label: "Email", icon: emailIcon },
    { label: "Facebook", icon: facebookIcon },
    { label: "X (Twitter)", icon: xIcon },
    { label: "LinkedIn", icon: linkedinIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[440px] h-[393px] rounded-lg p-8 shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Share with Others</h2>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 p-2 rounded-full">
              <img src={inviteIcon} alt="Invite" className="w-5 h-5" />
            </span>
            <span className="text-sm">Invite Others</span>
          </div>
          <button className="flex items-center space-x-2 border border-[#9013FE] px-4 py-2 rounded-md hover:bg-[#9013FE] hover:text-white transition">
            <img src={downloadIcon} alt="Download" className="w-5 h-5" />
            <span className="text-sm">Download</span>
          </button>
        </div>

        <div className="flex space-x-6 mb-4">
          {documentTypes.map(({ type, icon }) => (
            <div
              key={type}
              className="flex flex-col items-center justify-center border border-[#00000029] w-[112px] h-[55px] rounded-md"
            >
              <div className="flex items-center gap-2">
                <img src={icon} alt={type} className="w-10 h-10" />
                <span className="text-md font-semibold">{type}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Share</h3>
        <div className="flex items-center mb-4">
          <div className="flex-grow">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-[276px] border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9013FE]"
            />
          </div>
          <div>
            <button className="w-[82px] bg-[#9013FE] text-white px-4 py-2 rounded-full hover:bg-[#7303BF]">
              Send
            </button>
          </div>
        </div>

        <div className="flex items-center justify-around mb-2">
          {shareOptions.map(({ icon }, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
            >
              <img src={icon} alt="share option" className="w-10 h-10" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-around text-md text-gray-600">
          {shareOptions.map(({ label }) => (
            <span key={label} className="cursor-pointer hover:text-gray-900">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharingModal;
