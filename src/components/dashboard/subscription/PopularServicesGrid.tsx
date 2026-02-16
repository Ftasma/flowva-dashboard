// src/components/subscription/PopularServicesGrid.tsx
import React from "react";
import { Card, Typography } from "antd";
import { Tool } from "../../../interfaces/toolsData";
import { useNavigate } from "react-router-dom";
import { useDefaultTools } from "../../../context/DefaultToolsContext";

const { Text } = Typography;

interface PopularServicesGridProps {}

const PopularServicesGrid: React.FC<PopularServicesGridProps> = ({}) => {
  const navigate = useNavigate();

  const { allTools: tools } = useDefaultTools();
  const handleServiceClick = (tool: Tool) => {
    navigate("/dashboard/subscriptions", {
      state: { tool, showModal: true, modal: "addSubscription" },
    });
  };

  return (
    <Card className="shadow-sm rounded-xl border-0">
      <div className="">
        <p className="text-xl font-bold text-gray-800 my-6 text-center">
          Popular Tools to Get Started
        </p>

        <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))]">
          {tools.slice(0, 9).map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-[#9013FE] hover:-translate-y-1 hover:shadow-md group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 transition-transform duration-200 group-hover:scale-110"
                // style={{ backgroundColor: service.bgColor }}
              >
                <img
                  src={service.toolLogo}
                  alt={service.title}
                  className="w-8 h-8 rounded shrink-0"
                />
              </div>
              <Text className="font-semibold text-gray-800 text-center text-sm leading-tight">
                {service.title}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PopularServicesGrid;
