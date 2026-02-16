import React from "react";
import { CircleCheckBig, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tool } from "../../../../interfaces/toolsData";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
}

const permissions = [
  "Get renewal reminders before billing dates",
  "Monitor usage to avoid paying for unused seats",
  "Identify potential savings opportunities",
  "Centralized view of all your subscriptions",
];

const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  tool,
}) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleConnect = async () => {
    setIsLoading(true);

    navigate("/dashboard/subscriptions", {
      state: { tool, showModal: true, modal: "addSubscription" },
    });
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex justify-center items-center z-100 animate-fadeIn"
      onClick={(e) => {
        // Close when clicking outside the modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-[16px] w-[420px] max-w-[90%] p-8 text-center shadow-xl relative overflow-hidden border border-purple-500 border-opacity-20 animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-gray-500 transition-all duration-300 w-9 h-9 flex items-center justify-center rounded-full hover:text-[#9013FE] hover:bg-gray-100"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-white flex items-center justify-center shadow-sm border border-gray-200">
            <img
              src={tool.toolLogo}
              alt={tool.title}
              className="w-[30px] h-[30px] object-contain"
            />
          </div>
          <div className="text-xl font-bold text-gray-800">{tool.title}</div>
        </div>

        <h3 className="text-lg font-semibold text-[#9013FE] mb-4 text-center">
          Track Slack in Your Subscriptions?
        </h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center">
          We'll help you monitor and optimize this subscription
        </p>

        <div className="text-left mb-8 bg-gray-50 rounded-[16px] p-5 border border-dashed border-gray-200">
          {permissions.map((permission, index) => (
            <div key={index} className="flex items-start gap-3 mb-3 last:mb-0">
              <CircleCheckBig
                size={16}
                className="flex-shrink-0 text-[#10b981] mt-0.5"
              />
              <div className="text-sm text-gray-700">{permission}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="py-3 px-8 rounded-full font-semibold cursor-pointer border border-[#9013FE] text-[#9013FE] bg-transparent text-sm transition-all duration-300 inline-block mr-3 hover:bg-[#eef2ff]"
            onClick={onClose}
          >
            Not Now
          </button>
          <button
            className="py-3 px-8 rounded-full font-semibold cursor-pointer border-none text-sm transition-all duration-300 inline-block bg-[#9013FE] text-white shadow-md shadow-purple-200 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
