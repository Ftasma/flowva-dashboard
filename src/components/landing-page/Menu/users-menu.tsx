import { Collapse } from "antd";
import type { CollapseProps } from "antd";
import { ChevronDown } from "lucide-react";
import Discover from "../../../assets/discover_3d.svg";
import Library from "../../../assets/library_3d.svg";
import About from "../../../assets/about_us_3d.svg";
import Blog from "../../../assets/blog.svg";
import Flowva_coin from "../../../assets/flowva_coin_3d.svg";
import Faq from "../../../assets/faq_3d.svg";
import Contact from "../../../assets/contact_3d.svg";
import Affiliate from "../../../assets/affiliate_3d.svg";
import Influencer from "../../../assets/influencer_3d.svg";
import Refer from "../../../assets/refer_3d.svg";
import { useEffect } from "react";
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

const companyNavs: NavItem[] = [
  { title: "ABOUT US", icon: About },
  { title: "BLOG", icon: Blog, link: "/blog"},
];

const supportNavs: NavItem[] = [
  { title: "FAQ", icon: Faq },
  { title: "CONTACT US", icon: Contact, link: "/contact" },
];

const communityNavs: NavItem[] = [
  { title: "AFFILIATE", icon: Affiliate },
  { title: "INFLUENCER", icon: Influencer },
  { title: "REFER TO EARN", icon: Refer },
];

export default function Usersmenu({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate();

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <span className="text-[32px] font-semibold font-[impact]">HUB</span>
      ),
      children: (
        <div className="w-full grid grid-cols-2 gap-2">
          {hubNavs.map((nav, index) => (
            <div
              onClick={() => nav.link && navigate(nav.link)}
              key={index}
              className={`h-[101px] flex flex-col items-center justify-center 
                  p-[16px] gap-[8px] bg-navBg bg-cover bg-top
                  border border-[rgba(0,0,0,0.04)] rounded-[16px]
                  shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                  ${index === 2 ? "col-span-2" : ""}`}
            >
              <img
                src={nav.icon}
                className="w-[30px] h-[32px]"
                alt={`icon ${index + 1}`}
              />
              <span className="font-[impact] text-[16px] text-black">
                {nav.title}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="text-[32px] font-semibold font-[impact]">COMPANY</span>
      ),
      children: (
        <div className="w-full grid grid-cols-2 gap-2">
          {companyNavs.map((nav, index) => (
            <div
              onClick={() => nav.link && navigate(nav.link)}
              key={index}
              className="w-full h-[101px] flex flex-col items-center justify-center 
                            p-[16px] gap-[8px] bg-navBg bg-cover bg-top
                            border border-[rgba(0,0,0,0.04)] rounded-[16px]
                            shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                          "
            >
              <img
                src={nav.icon}
                className=" w-[30px] h-[32px]"
                alt={`icon ${index + 1}`}
              />
              <span className="font-[impact] text-[16px] text-black">
                {nav.title}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span className="text-[32px] font-semibold font-[impact]">SUPPORT</span>
      ),
      children: (
        <div className="w-full grid grid-cols-2 gap-2">
          {supportNavs.map((nav, index) => (
            <div
              onClick={() => nav.link && navigate(nav.link)}
              key={index}
              className="w-full h-[101px] flex flex-col items-center justify-center 
                            p-[16px] gap-[8px] bg-navBg bg-cover bg-top
                            border border-[rgba(0,0,0,0.04)] rounded-[16px]
                            shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                          "
            >
              <img
                src={nav.icon}
                className=" w-[30px] h-[32px]"
                alt={`icon ${index + 1}`}
              />
              <span className="font-[impact] text-[16px] text-black">
                {nav.title}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span className="text-[32px] font-semibold font-[impact]">
          COMMUNITY
        </span>
      ),
      children: (
        <div className="w-full grid grid-cols-2 gap-2">
          {communityNavs.map((nav, index) => (
            <div
              onClick={() => nav.link && navigate(nav.link)}
              key={index}
              className={`h-[101px] flex flex-col items-center justify-center 
                  p-[16px] gap-[8px] bg-navBg bg-cover bg-top
                  border border-[rgba(0,0,0,0.04)] rounded-[16px]
                  shadow-[inset_0px_9px_6.3px_rgba(255,255,255,0.32)]
                  ${index === 2 ? "col-span-2" : ""}`}
            >
              <img
                src={nav.icon}
                className=" w-[30px] h-[32px]"
                alt={`icon ${index + 1}`}
              />
              <span className="font-[impact] text-[16px] text-black">
                {nav.title}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      // Disable body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scroll
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`md:hidden left-0 z-50 absolute w-full bg-white mt-[120px] px-4 overflow-y-auto ${
        isOpen
          ? "translate-y-0 opacity-100 h-[calc(100vh-128px)] p-4"
          : "-translate-y-10 opacity-0 h-0 p-0"
      }`}
    >
      <aside>
        <Collapse
          accordion
          bordered={false}
          items={items}
          className="custom-accordion"
          expandIcon={({ isActive }) => (
            <ChevronDown
              size={22}
              className={`transition-transform duration-300 ${
                isActive ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
          expandIconPosition="end"
        />
        <div className=" flex mt-5 items-center gap-[12px] flex-col">
          <button
            onClick={() => navigate("/signin")}
            className="w-full h-[57px] text-sm font-bold border-[#9013FE1A] rounded-[100px] border p-[4px]"
          >
            <span className="h-full flex justify-center items-center w-full p-[6px_16px] hover:bg-[#111111] hover:shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset] hover:text-white rounded-[100px] relative shadow-[0px_2px_4px_0px_#0000001A]">
              Login
            </span>
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full h-[57px] text-sm font-bold border-[#9013FE1A] rounded-[100px] border p-[4px]"
          >
            <span className="h-full flex justify-center items-center w-full whitespace-nowrap p-[6px_16px] rounded-[100px] relative bg-[#111111] hover:bg-[#b362fae3] transition-all ease-linear duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
              Sign up
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}
