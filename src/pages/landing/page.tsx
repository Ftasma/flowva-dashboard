"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../../components/landing-page/header";
import Users_Icon from "../../assets/users_icon.svg";
import Brand_Icons from "../../assets/brands.svg";
import InfoBanner from "../../components/landing-page/info-banner";
import ImageScroller from "../../components/landing-page/image-scroller";
import Stats from "../../components/landing-page/stats-section";
import CoreValue from "../../components/landing-page/core-valueSection";
import Footer from "../../components/landing-page/footer";
import Plans from "../../components/landing-page/plans";
import Testimonies from "../../components/landing-page/testimonies";
import GetRewarded from "../../components/landing-page/get-rewardedSection";
import MobileApp from "../../components/landing-page/mobile-app";
import FavoriteAskedQ from "../../components/landing-page/favorite-askedQ";
import JourneySteps from "../../components/landing-page/journey-stepSection";
import Usersmenu from "../../components/landing-page/Menu/users-menu";
import ImageScrollerBrands from "../../components/landing-page/image-scrollBrands";
import CompanyLogos from "../../components/landing-page/company-logos";
import GrowReach from "../../components/landing-page/grow-reach";
import OptionalServices from "../../components/landing-page/optional-services.tsx";
import HowItWorks from "../../components/landing-page/how-it-works.tsx";
import TestimonialBrand from "../../components/landing-page/testimonial-brands.tsx";
import FeatureTool from "../../components/landing-page/feature-tool.tsx";
import { useNavigate } from "react-router-dom";
import BrevoCustomButton from "../../components/landing-page/Buttons/TawkChatWidget.tsx";
import FavoriteAskedQBrand from "../../components/landing-page/favorite-askedQBrand.tsx";
import SEO from "../../components/SEO.tsx";

export default function Landing() {
  const [activeTab, setActiveTab] = useState<"users" | "brands">("users");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <SEO
        title="Flowva – Discover, Manage & Share Top Tools"
        description="Flowva is your smart space to manage digital tools, stay organized, and get rewarded for productivity."
        url="https://flowvahub.com/"
        image="https://flowvahub.com/og-image.png"
      />

      <Usersmenu isOpen={menuOpen} />
      <InfoBanner />
      <div className="px-2">
        <Header setIsOpen={setMenuOpen} isOpen={menuOpen} />
      </div>
      <main>
        {/* Toggle Tabs */}
        <div className="left-1/2 right-1/2 top-[25px] md:top-[70px] bg-[#F9F9F9] border border-[#0000000D] -translate-x-1/2 relative w-full max-w-[265px] h-[64px] flex items-center gap-[8px] rounded-[100px] p-[8px]">
          <div
            className={`absolute top-[8px] h-[48px] w-[calc(50%-8px)] rounded-[100px] transition-transform duration-300 ease-in-out shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset] bg-[#111111] ${
              activeTab === "brands"
                ? "translate-x-[calc(100%+0px)]"
                : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setActiveTab("users")}
            className="relative z-10 flex items-center justify-center w-[50%] h-[48px] text-sm font-bold rounded-[100px] font-manrope"
          >
            <img src={Users_Icon} className="w-6 mr-2" alt="users" />
            <span
              className={`transition-colors duration-300 ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-[#ECD6FF] to-[#FF8687] bg-clip-text text-transparent"
                  : "text-black"
              }`}
            >
              For users
            </span>
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className="relative z-10 flex items-center justify-center w-[50%] h-[48px] text-sm font-bold rounded-[100px] font-manrope"
          >
            <img src={Brand_Icons} className="w-6 mr-2" alt="brands" />
            <span
              className={`transition-colors duration-300 ${
                activeTab === "brands"
                  ? "bg-gradient-to-r from-[#ECD6FF] to-[#FF8687] bg-clip-text text-transparent"
                  : "text-black"
              }`}
            >
              For brands
            </span>
          </button>
        </div>

        {/* Animated Section Swap */}
        <AnimatePresence mode="wait">
          {activeTab === "users" ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-[40px] md:text-[72px] mt-[55px] md:mt-[130px] text-center font-[Impact] leading-[120%]">
                YOUR{" "}
                <span className="inline-flex px-5 rounded-[100px] text-white bg-[linear-gradient(90deg,_#9013FE_0%,_#FF8687_100%)]">
                  SMART
                </span>{" "}
                SPACE <br className=" md:hidden" /> TO MANAGE YOUR <br />{" "}
                DIGITAL LIFE AND BE REWARDED
              </h1>

              <button
                onClick={() => navigate("/signup")}
                className="mt-8 md:mt-10 relative left-1/2 -translate-x-1/2 w-[232px] rounded-[100px] border border-[#9013FE1A] p-[6px] font-bold text-sm font-manrope"
              >
                <div className=" w-full text-sm whitespace-nowrap p-[24px] rounded-[100px] relative bg-[#111111] hover:bg-[#b362fae3] transition-all ease-linear duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
                  Start Earning Today
                </div>
              </button>

              <ImageScroller />

              <p className="px-[14px] text-[20px] md:text-[36px] mt-[70px] mb-20 md:my-28 text-center font-semibold font-manrope leading-[32px] md:leading-[40px]">
                Turn productivity into rewards with a calm, smart{" "}
                <br className="hidden md:block" /> space that organizes your
                tools, and keeps you in control.
              </p>

              <Stats />
              <CoreValue />
              <MobileApp />
              <JourneySteps />
              <Testimonies />
              <FavoriteAskedQ />
              <GetRewarded />
            </motion.div>
          ) : (
            <motion.div
              key="brands"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-[40px] md:text-[72px] mt-[55px] md:mt-[130px] text-center font-[Impact] leading-[120%]">
                CONNECT WITH{" "}
                <span className="inline-flex px-5 rounded-[100px] text-white bg-[linear-gradient(90deg,_#9013FE_0%,_#FF8687_100%)]">
                  TECH
                </span>{" "}
                <br className="hidden md:block" />
                PROFESSIONALS WHO ACTUALLY ENGAGE
              </h1>
              <button
                onClick={() =>
                  window.open(
                    "https://form.jotform.com/252613117394253",
                    "_blank"
                  )
                }
                className="mt-8 md:mt-10 relative left-1/2 -translate-x-1/2 w-[232px] rounded-[100px] border border-[#9013FE1A] p-[6px] font-bold text-sm font-manrope"
              >
                <div className=" w-full text-sm whitespace-nowrap p-[24px] rounded-[100px] relative bg-[#111111] hover:bg-[#b362fae3] transition-all ease-linear duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
                  Start Your 3-Day Free Trial
                </div>
              </button>
              <ImageScrollerBrands />
              <CompanyLogos />
              <GrowReach />
              <OptionalServices />
              <Plans />
              <HowItWorks />
              <TestimonialBrand />
              <FavoriteAskedQBrand />
              <FeatureTool />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <BrevoCustomButton />
    </div>
  );
}
