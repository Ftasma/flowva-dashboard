"use client";
import { useState } from "react";

import Brevo_card from "../../assets/brevo_banner.svg";
// import Keeper_card from "../../assets/keeper_banner.svg";
import Jotform_card from "../../assets/jotform_banner.svg";
import Monday_banner from "../../assets/monday_banner.svg";
import Reclaim_card from "../../assets/reclaim_banner.svg";

export default function ImageScrollerBrands() {
  const brands = [
    {
      src: Brevo_card,
      name: "Brevo",
      link: "https://get.brevo.com/9vml1qjuxigb",
      backText: "Email & Marketing Automation",
      bg: "#F9FFF6",
      textColor: "black",
      buttonbg: "#00000025",
    },
    // {
    //   src: Keeper_card,
    //   name: "Keeper",
    //   link: "https://keepersecurity.partnerlinks.io/bdj2jco6dsy8",
    //   backText: "Password Management",
    //   bg: "#000000",
    //   textColor: "white",
    //   buttonbg: "#ffffff4e",
    // },
    {
      src: Jotform_card,
      name: "Jotform",
      link: "https://www.jotform.com/ai/agents/?partner=flowvahub-WOAEEuoEob",
      backText: "Form Builder Platform",
      bg: "#F5D7C5",
      textColor: "black",
      buttonbg: "#00000025",
    },
    {
      src: Monday_banner,
      name: "Monday",
      link: "https://try.monday.com/b7pem672ddxh",
      backText: "Project Management",
      bg: "#B8B8FA",
      textColor: "white",
      buttonbg: "#00000025",
    },
    {
      src: Reclaim_card,
      name: "Reclaim",
      link: "https://go.reclaim.ai/ur9i6g5eznps",
      backText: "Smart Scheduling",
      bg: "#FFFFFF",
      textColor: "black",
      buttonbg: "#00000025",
    },
  ];

  const [flippedBrand, setFlippedBrand] = useState<string | null>(null);

  const toggleFlip = (brandName: string) => {
    setFlippedBrand((prev) => (prev === brandName ? null : brandName));
  };

  return (
    <div className="overflow-hidden mt-12 md:mt-16 relative w-full group">
      <div className={`flex w-max py-3 animate-scrollLeft group-hover:pause`}>
        {[...brands, ...brands].map((brand, i) => {
          const isFlipped = flippedBrand === brand.name;

          return (
            <div key={`${brand.name}-${i}`} className="mx-4">
              <div
                className="flip-card w-[168px] h-[148px] md:w-[421px] md:h-[369px] rounded-[16px] md:rounded-[32px]"
                onClick={() => toggleFlip(brand.name)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFlip(brand.name);
                  }
                }}
                role="button"
                aria-pressed={isFlipped}
              >
                <div className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}>
                  {/* Front */}
                  <div className="flip-card-front w-full h-full border !rounded-[16px] md:!rounded-[32px] overflow-hidden border-[#e0e0e0]">
                    <img
                      src={brand.src}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>

                  {/* Back */}
                  <div
                    style={{ backgroundColor: brand.bg, color: brand.textColor }}
                    className="flip-card-back w-full h-full flex flex-col border border-[#e0e0e0] !rounded-[16px] md:!rounded-[32px] items-center justify-center text-center p-4"
                  >
                    <a
                      href={brand.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: brand.buttonbg }}
                      className="text-sm md:text-lg flex gap-3 items-center font-bold mb-2 p-[10px_16px] rounded-[24px]"
                    >
                      <span>{brand.name}</span>
                      <svg
                        width="11"
                        height="10"
                        viewBox="0 0 11 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.83684 1L9.5 1.00016M9.5 1.00016L9.49998 5.64132M9.5 1.00016L1.5 9"
                          stroke={brand.textColor}
                          strokeWidth="1.5"
                        />
                      </svg>
                    </a>
                    <p className="text-xs md:text-sm mb-3 font-manrope">{brand.backText}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
