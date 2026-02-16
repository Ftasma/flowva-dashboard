import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { useState } from "react";
import { Link } from "react-router-dom";

function NavCard() {
  const [seeLess, setSeeless] = useState<boolean>(false);
  return (
    <div>
      <div className="flex justify-end mb-[1rem]">
        <button
          onClick={() => {
            setSeeless(!seeLess);
          }}
          className="bg-none toggle-button border-none outline-none text-[#9013FE] text-[1rem] flex items-center"
        >
          {seeLess ? (
            <FontAwesomeIcon icon={Icons.EyeClose} />
          ) : (
            <FontAwesomeIcon icon={Icons.EyeOpen} />
          )}
        </button>
      </div>
      {!seeLess && (
        <div className="grid gap-[1.25rem] mb-[2rem] grid-cols-[repeat(1,1fr)] md:grid-cols-[repeat(2,1fr)] xl:grid-cols-[repeat(4,1fr)]">
          <Link
            to="/dashboard/discover"
            className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
          >
            <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[#E9D4FF] text-[#9013FE]">
              <FontAwesomeIcon icon={Icons.Compass} />
            </div>
            <h3 className=" font-semibold mb-[0.5rem] text-[0.95rem]">
              Discover New Tools
            </h3>
            <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
              Find the best tools for your workflow
            </p>
            <a className="text-[#9013FE] flex items-center text-[0.8rem]">
              Browse tools
              <FontAwesomeIcon
                className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
                icon={Icons.ArrowRight}
              />
            </a>
          </Link>

          <Link
            to="/dashboard/library"
            className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
          >
            <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[rgba(19,_216,_254,_0.1)] text-[#13D8FE]">
              <FontAwesomeIcon icon={Icons.boxOpen} />
            </div>
            <h3 className=" font-semibold mb-[0.5rem] text-[0.95rem] ">
              Manage Your Library
            </h3>
            <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
              Manage all your tools in one place
            </p>
            <a className="text-[#9013FE] flex items-center text-[0.8rem]">
              View library
              <FontAwesomeIcon
                className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
                icon={Icons.ArrowRight}
              />
            </a>
          </Link>

          <Link
            to="/dashboard/tech-stack"
            className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
          >
            <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[rgba(255,_107,_107,_0.1)] text-[#FF6B6B] ">
              <FontAwesomeIcon icon={Icons.layerGroup} />
            </div>
            <h3 className=" font-semibold mb-[0.5rem] text-[0.95rem] ">
              Build Your Tech Stack
            </h3>
            <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
              Organize your tools for specific projects
            </p>
            <a className="text-[#9013FE] flex items-center text-[0.8rem]">
              Build stacks
              <FontAwesomeIcon
                className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
                icon={Icons.ArrowRight}
              />
            </a>
          </Link>

          <Link
            to="/dashboard/subscriptions"
            className="bg-white text-start rounded-[12px] p-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-y-[-5px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[#E9D4FF] border-[1px] border-[#E2E8F0] transition-all duration-300 ease-in-out"
          >
            <div className="w-[40px] h-[40px]  rounded-full flex justify-center items-center mb-[1rem] text-[1rem] bg-[rgba(72,_187,_120,_0.1)] text-[#48BB78]">
              <FontAwesomeIcon icon={Icons.CreditCard} />
            </div>
            <h3 className=" font-semibold mb-[0.5rem] text-[0.95rem]">
              Track Your Subscriptions
            </h3>
            <p className="text-[#718096] text-[0.8rem] mb-[1rem]">
              Track renewals and spending
            </p>
            <a className="text-[#9013FE] flex items-center text-[0.8rem]">
              Manage subscriptions
              <FontAwesomeIcon
                className="ml-[0.5rem] hover:translate-x-[3px] transition-all duration-300 ease-in-out"
                icon={Icons.ArrowRight}
              />
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavCard;
