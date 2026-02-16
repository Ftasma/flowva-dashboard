import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReadMoreButton({ blogId }: { blogId?: string }) {
  const [flipped, setFlipped] = useState(false);
  const controls = useAnimation();
  const navigate = useNavigate();
  const handleHoverStart = async () => {
    await controls.start({
      x: 120,
      rotate: 360,
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    setFlipped(true);
  };

  const handleHoverEnd = async () => {
    await controls.start({
      x: 0,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    setFlipped(false);
  };

  return (
    <motion.button
      className="relative flex items-center justify-center w-[210px]  h-[62px] overflow-hidden rounded-[100px] border  bg-transparent font-manrope font-semibold text-black transition-colors duration-500 hover:bg-[#b362fae3] hover:text-white"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={() => navigate(`/blog/${blogId}`)}
    >
      {/* Rolling SVG ball */}
      <motion.div
        animate={controls}
        className="absolute mt-1 left-[10px] w-[60px] h-[50px] flex items-center justify-center"
      >
        <motion.svg
          width="60"
          height="50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_ddddi_3702_10934)">
            <rect x="10" y="2" width="40" height="40" rx="20" fill="#111111" />
            <path
              d="M28 18L32 22L28 26"
              stroke="white"
              strokeWidth="1.5"
              strokeMiterlimit="16"
            />
          </g>
          <defs>
            <filter
              id="filter0_ddddi_3702_10934"
              x="0"
              y="0"
              width="60"
              height="78"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_3702_10934"
              />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="3" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_3702_10934"
                result="effect2_dropShadow_3702_10934"
              />
              <feOffset dy="14" />
              <feGaussianBlur stdDeviation="4.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_3702_10934"
                result="effect3_dropShadow_3702_10934"
              />
              <feOffset dy="26" />
              <feGaussianBlur stdDeviation="5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
              />
              <feBlend
                mode="normal"
                in2="effect3_dropShadow_3702_10934"
                result="effect4_dropShadow_3702_10934"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect4_dropShadow_3702_10934"
                result="shape"
              />
            </filter>
          </defs>
        </motion.svg>
      </motion.div>

      {/* Text that switches sides */}
      <motion.span
        key={flipped ? "right" : "left"}
        initial={{ x: flipped ? 30 : -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: flipped ? -30 : 30, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`absolute ${
          flipped ? "right-[80px]" : "left-[80px]"
        } font-semibold`}
      >
        READ STORY
      </motion.span>
    </motion.button>
  );
}
