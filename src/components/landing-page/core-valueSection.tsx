"use client";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

import Org_tools from "../../assets/org_tools.png";
import Discover_tools from "../../assets/discover_tools.png";
import Get_rewarded from "../../assets/get_rewarded.png";
import { useState } from "react";

const cardGrid = [
  {
    imageFrame: Org_tools,
    header: "Organize your tools",
    desc: "Keep your apps, subscriptions, and tech stack in one simple space.",
    bg: "#C3F9C2",
  },
  {
    imageFrame: Discover_tools,
    header: "Discover what works",
    desc: "Find new tools tailored to your workflow, curated for freelancers and remote workers.",
    bg: "#FFDFE9",
  },

  {
    imageFrame: Get_rewarded,
    header: "Get Rewarded",
    desc: "Earn perks, gift cards and cashback just for staying productive.",
    bg: "#ECD6FF",
  },
];

export default function CoreValue() {
  const [bgColor, setBgColor] = useState(cardGrid[0].bg);
  return (
    <section className="px-[14px]">
      <div
        className="w-full  md:max-w-[80%] p-4 pb-20 pt-14 rounded-[16px] md:rounded-[32px] h-fit max-h-[650px] mx-auto my-24 transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="text-[48px] md:text-[64px] font-[impact] mb-10 text-center">
          EVERYTHING IN ONE PLACE
        </h2>

        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={true}
          modules={[Autoplay, EffectCoverflow, Pagination]}
          className="coreValueSwiper"
          onSlideChange={(swiper) => {
            setBgColor(cardGrid[swiper.realIndex].bg);
          }}
        >
          {cardGrid.map((item, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-col rounded-xl overflow-visible"
            >
              <img
                src={item.imageFrame}
                alt={item.header}
                className="w-fit h-auto object-contain"
              />
              <div className=" mt-2">
                <h3 className="text-lg font-bold mb-2 font-manrope">
                  {item.header}
                </h3>
                <p className="text-sm text-gray-700 font-manrope">
                  {item.desc}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
