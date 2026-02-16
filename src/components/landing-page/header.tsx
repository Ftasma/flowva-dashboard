import FlowvaLogo from "../../assets/flowva_icon.png";
import { DownOutlined } from "@ant-design/icons";
import Discover from "../../assets/discover_3d.svg";
import Library from "../../assets/library_3d.svg";
import About from "../../assets/about_us_3d.svg";
import Blog from "../../assets/blog.svg";
import Flowva_coin from "../../assets/flowva_coin_3d.svg";
import Faq from "../../assets/faq_3d.svg";
import Contact from "../../assets/contact_3d.svg";
import Affiliate from "../../assets/affiliate_3d.svg";
import Influencer from "../../assets/influencer_3d.svg";
import Refer from "../../assets/refer_3d.svg";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

type NavItem = {
  title: string;
  icon: string;
  link?: string;
};

const hubNavs: NavItem[] = [
  { title: "DISCOVER", icon: Discover },
  { title: "LIBRARY", icon: Library },
  { title: "REWARD", icon: Flowva_coin },
];

const companyNavs = [
  { title: "ABOUT US", icon: About },
  { title: "BLOG", icon: Blog, link: "/blog" },
];

const supportNavs = [
  { title: "FAQ", icon: Faq },
  { title: "CONTACT US", icon: Contact, link: "/contact" },
];

const communityNavs = [
  { title: "AFFILIATE", icon: Affiliate },
  { title: "INFLUENCER", icon: Influencer },
  { title: "REFER TO EARN", icon: Refer },
];

export default function Header({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [hubOpen, setHubOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (hubOpen || companyOpen || supportOpen || communityOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [hubOpen, companyOpen, supportOpen, communityOpen]);

  return (
    <header className="left-1/2 right-1/2 -translate-x-1/2 md:border bg-white relative top-[10px] md:top-[20px] md:w-full font-manrope  md:max-w-[80%] md:border-[#0000000D] rounded-[100px] h-[56px] py-[8px] px-[14px] ">
      <nav className="flex items-center w-full">
        <div className="hidden md:flex items-center w-full">
          <div className="w-full font-semibold text-sm flex justify-between items-center">
            <div className="flex items-center">
              {/* Logo */}
              <div
                onClick={() => navigate("/")}
                className="flex gap-1.5 items-center"
              >
                <img src={FlowvaLogo} className="w-8 -mt-1" alt="logo" />
              </div>

              <div className="border-[1px] h-[28px] mx-5 border-[#0000000D] w-0"></div>

              {/* Nav links */}
              <ul className="flex items-center gap-6 relative">
                {/* Hub */}
                <li
                  className="cursor-pointer relative"
                  onMouseEnter={() => setHubOpen(true)}
                  onMouseLeave={() => setHubOpen(false)}
                >
                  <span
                    className={`flex items-center gap-1 ${
                      hubOpen
                        ? "text-[#9013fe]"
                        : "hover:text-[#9013fe] text-[#A5A5A5]"
                    }`}
                  >
                    Hub
                    <DownOutlined
                      style={{ fontSize: "12px", color: "#A5A5A5" }}
                    />
                  </span>
                  {hubOpen && (
                    <div
                      className="absolute top-[5px] left-0 w-full min-w-16 h-[80px]"
                      onMouseEnter={() => setHubOpen(true)}
                      onMouseLeave={() => setHubOpen(false)}
                    />
                  )}

                  {/* Custom Dropdown rendered in portal */}
                  {createPortal(
                    <div
                      className={`fixed left-1/2 -translate-x-1/2 top-[130px]  
                      flex justify-center w-screen z-[9999] h-[calc(100vh-50px)] bg-[#0000008f]
                      transition-all duration-300 ease-in-out
                      ${
                        hubOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }
                    `}
                      onMouseEnter={() => setHubOpen(true)}
                      onMouseLeave={() => setHubOpen(false)}
                    >
                      <div
                        className="flex items-center w-full !h-fit pt-2 justify-center
                        rounded-b-[32px] shadow-md bg-white  pb-9
                        transition-all duration-300 ease-in-out"
                      >
                        <div className="w-full max-w-[80%] flex items-center gap-4">
                          {hubNavs.map((nav, index) => (
                            <div
                              key={index}
                              className="w-[273px] h-[345px] flex flex-col items-center justify-center 
                            p-[16px] gap-[40px] bg-navBg bg-cover bg-top
                            border border-[rgba(0,0,0,0.04)] rounded-[16px]
                            shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                          "
                            >
                              <img src={nav.icon} alt={`icon ${index + 1}`} />
                              <a className="font-[impact] text-[32px] text-black">
                                {nav.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </li>

                <li
                  className="cursor-pointer relative"
                  onMouseEnter={() => setCompanyOpen(true)}
                  onMouseLeave={() => setCompanyOpen(false)}
                >
                  <span
                    className={`flex items-center gap-1 ${
                      companyOpen
                        ? "text-[#9013fe]"
                        : "hover:text-[#9013fe] text-[#A5A5A5]"
                    }`}
                  >
                    Company
                    <DownOutlined
                      style={{ fontSize: "12px", color: "#A5A5A5" }}
                    />
                  </span>
                  {companyOpen && (
                    <div
                      className="absolute top-[5px] left-0 w-full min-w-16 h-[80px]"
                      onMouseEnter={() => setCompanyOpen(true)}
                      onMouseLeave={() => setCompanyOpen(false)}
                    />
                  )}

                  {/* Custom Dropdown rendered in portal */}
                  {createPortal(
                    <div
                      className={`fixed left-1/2 -translate-x-1/2 top-[130px]  
                      flex justify-center w-screen z-[9999] h-[calc(100vh-50px)] bg-[#0000008f]
                      transition-all duration-300 ease-in-out
                      ${
                        companyOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }
                    `}
                      onMouseEnter={() => setCompanyOpen(true)}
                      onMouseLeave={() => setCompanyOpen(false)}
                    >
                      <div
                        className="flex items-center w-full !h-fit pt-2 justify-center
                        rounded-b-[32px] shadow-md bg-white  pb-9
                        transition-all duration-300 ease-in-out"
                      >
                        <div className="w-full max-w-[80%] flex items-center gap-4">
                          {companyNavs.map((nav, index) => (
                            <div
                              onClick={() => nav.link && navigate(nav.link)}
                              key={index}
                              className="w-[273px] hover:border-purple-400 cursor-pointer h-[345px] flex flex-col items-center justify-center 
                            p-[16px] gap-[40px] bg-navBg bg-cover bg-top
                            border border-[rgba(0,0,0,0.04)] rounded-[16px]
                            shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                          "
                            >
                              <img src={nav.icon} alt={`icon ${index + 1}`} />
                              <a className="font-[impact] text-[32px] text-black">
                                {nav.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </li>

                <li
                  className="cursor-pointer relative"
                  onMouseEnter={() => setSupportOpen(true)}
                  onMouseLeave={() => setSupportOpen(false)}
                >
                  <span
                    className={`flex items-center gap-1 ${
                      supportOpen
                        ? "text-[#9013fe]"
                        : "hover:text-[#9013fe] text-[#A5A5A5]"
                    }`}
                  >
                    Support
                    <DownOutlined
                      style={{ fontSize: "12px", color: "#A5A5A5" }}
                    />
                  </span>
                  {supportOpen && (
                    <div
                      className="absolute top-[5px] left-0 w-full min-w-16 h-[80px]"
                      onMouseEnter={() => setSupportOpen(true)}
                      onMouseLeave={() => setSupportOpen(false)}
                    />
                  )}

                  {/* Custom Dropdown rendered in portal */}
                  {createPortal(
                    <div
                      className={`fixed left-1/2 -translate-x-1/2 top-[130px]  
                      flex justify-center w-screen z-[9999] h-[calc(100vh-50px)] bg-[#0000008f]
                      transition-all duration-300 ease-in-out
                      ${
                        supportOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }
                    `}
                      onMouseEnter={() => setSupportOpen(true)}
                      onMouseLeave={() => setSupportOpen(false)}
                    >
                      <div
                        className="flex items-center w-full !h-fit pt-2 justify-center
                        rounded-b-[32px] shadow-md bg-white  pb-9
                        transition-all duration-300 ease-in-out"
                      >
                        <div className="w-full max-w-[80%] flex items-center gap-4">
                          {supportNavs.map((nav, index) => (
                            <div
                              onClick={() => nav.link && navigate(nav.link)}
                              key={index}
                              className="w-[273px] hover:border-purple-400 cursor-pointer h-[345px] flex flex-col items-center justify-center 
                            p-[16px] gap-[40px] bg-navBg bg-cover bg-top
                            border border-[rgba(0,0,0,0.04)] rounded-[16px]
                            shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                          "
                            >
                              <img src={nav.icon} alt={`icon ${index + 1}`} />
                              <a className="font-[impact] text-[32px] text-black">
                                {nav.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </li>

                <li
                  className="cursor-pointer relative"
                  onMouseEnter={() => setCommunityOpen(true)}
                  onMouseLeave={() => setCommunityOpen(false)}
                >
                  <span
                    className={`flex items-center gap-1 ${
                      communityOpen
                        ? "text-[#9013fe]"
                        : "hover:text-[#9013fe] text-[#A5A5A5]"
                    }`}
                  >
                    Community
                    <DownOutlined
                      style={{ fontSize: "12px", color: "#A5A5A5" }}
                    />
                  </span>
                  {communityOpen && (
                    <div
                      className="absolute top-[5px] left-0 w-full min-w-16 h-[80px]"
                      onMouseEnter={() => setCommunityOpen(true)}
                      onMouseLeave={() => setCommunityOpen(false)}
                    />
                  )}

                  {/* Custom Dropdown rendered in portal */}
                  {createPortal(
                    <div
                      className={`fixed left-1/2 -translate-x-1/2 top-[130px]  
                      flex justify-center w-screen z-[9999] h-[calc(100vh-50px)] bg-[#0000008f]
                      transition-all duration-300 ease-in-out
                      ${
                        communityOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      }
                    `}
                      onMouseEnter={() => setCommunityOpen(true)}
                      onMouseLeave={() => setCommunityOpen(false)}
                    >
                      <div
                        className="flex items-center w-full !h-fit pt-2 justify-center
                        rounded-b-[32px] shadow-md bg-white  pb-9
                        transition-all duration-300 ease-in-out"
                      >
                        <div className="w-full max-w-[80%] flex items-center gap-4">
                          {communityNavs.map((nav, index) => (
                            <div
                              key={index}
                              className="w-[273px] h-[345px] flex flex-col items-center justify-center 
                            p-[16px] gap-[40px] bg-navBg bg-cover bg-top
                            border border-[rgba(0,0,0,0.04)] rounded-[16px]
                            shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                          "
                            >
                              <img src={nav.icon} alt={`icon ${index + 1}`} />
                              <a className="font-[impact] text-[32px] text-black">
                                {nav.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-[1px] h-[28px] mx-5 border-[#0000000D] w-0"></div>

          {/* Buttons */}
          <div className="w-[195px] font-manrope flex items-center gap-8 h-[40px]">
            <button
              onClick={() => navigate("/signin")}
              className="w-[84px] h-[40px] text-sm font-bold border-[#9013FE1A] rounded-[100px] border p-[4px]"
            >
              <div className="h-full w-full flex justify-center items-center px-[16px] transition-all ease-linear duration-200 rounded-[100px] bg-white hover:bg-[#111111] hover:shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset] hover:text-white relative shadow-[0px_2px_4px_0px_#0000001A]">
                Login
              </div>
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-[84px] font-manrope h-[40px] text-sm font-bold border-[#9013FE1A] rounded-[100px] border p-[4px]"
            >
              <div className="h-full flex items-center justify-center  w-full whitespace-nowrap px-[16px] rounded-[100px] relative bg-[#111111] hover:bg-[#b362fae3] transition-all ease-linear duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
                Sign up
              </div>
            </button>
          </div>
        </div>
        {/* mobile view */}
        <div className=" md:!hidden flex justify-between items-center w-full ">
          <div onClick={() => navigate("/")}>
            <img src={FlowvaLogo} className="w-12 h-12 -mt-[3px]" alt="logo" />
          </div>

          {isOpen ? (
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 5L5 19M5 5L19 19"
                  stroke="#141B34"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          ) : (
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Menu / Menu_Alt_01">
                    <path
                      id="Vector"
                      d="M12 17H19M5 12H19M5 7H19"
                      stroke="#141B34"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </g>
              </svg>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
