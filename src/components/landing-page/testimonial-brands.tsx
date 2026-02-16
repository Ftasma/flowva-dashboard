"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonies = [
  {
    text: "Flowva gave us a new channel of discovery. Users were genuinely interested and engagement was higher than on ads.",
    author: "@ProductivityApp",
    bgColor: "#5DCEFF",
    logo: (
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84975 34.1503 0 22 0C9.84971 0 0 9.84975 0 22C0 34.1503 9.84971 44 22 44ZM28.8632 10.2485C29.1973 9.06186 28.0457 8.36015 26.994 9.10944L12.3124 19.5685C11.1718 20.3811 11.3512 22 12.5819 22H16.448V21.9701H23.9828L17.8433 24.1363L15.1368 33.7515C14.8027 34.9382 15.9542 35.6399 17.006 34.8906L31.6876 24.4315C32.8282 23.619 32.6487 22 31.4181 22H25.5553L28.8632 10.2485Z"
          fill="#535862"
        />
      </svg>
    ),
  },
  {
    text: "Seamless and simple our sign-ups grew with no extra work on our end.",
    author: "@Devtoolkit",
    bgColor: "#B7FF28",
    logo: (
      <svg
        width="39"
        height="44"
        viewBox="0 0 39 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M19.9657 1.44802C19.4606 1.34415 18.9398 1.34415 18.4347 1.44802C17.8509 1.56809 17.3291 1.86035 16.9143 2.0927L16.8012 2.15587L2.74173 9.96669C2.70286 9.98829 2.6628 10.0103 2.62176 10.033C2.18263 10.2748 1.63048 10.5789 1.20646 11.0391C0.83987 11.4369 0.562441 11.9084 0.392731 12.422C0.196435 13.0161 0.198732 13.6465 0.200558 14.1478C0.200729 14.1947 0.200896 14.2404 0.200896 14.2849V29.7068C0.200896 29.7513 0.200729 29.797 0.200558 29.8438C0.198732 30.3452 0.196435 30.9755 0.392731 31.5697C0.562443 32.0833 0.839872 32.5548 1.20646 32.9526C1.63048 33.4127 2.18263 33.7168 2.62176 33.9587C2.66281 33.9813 2.70286 34.0034 2.74173 34.025L16.8012 41.8358L16.9143 41.899C17.3291 42.1313 17.8509 42.4236 18.4347 42.5436C18.9398 42.6475 19.4606 42.6475 19.9657 42.5436C20.5495 42.4236 21.0713 42.1313 21.4861 41.899L21.5992 41.8358L35.6587 34.025C35.6758 34.0154 35.6933 34.0058 35.7109 33.9961C35.7331 33.9838 35.7557 33.9713 35.7786 33.9587C36.2178 33.7169 36.7699 33.4127 37.1939 32.9526C37.5605 32.5548 37.838 32.0833 38.0077 31.5697C38.204 30.9755 38.2017 30.3452 38.1998 29.8438C38.1997 29.797 38.1995 29.7513 38.1995 29.7068V14.2849C38.1995 14.2404 38.1997 14.1947 38.1998 14.1478C38.2017 13.6465 38.204 13.0161 38.0077 12.422C37.838 11.9084 37.5605 11.4369 37.1939 11.0391C36.7699 10.5789 36.2178 10.2748 35.7786 10.0329L35.7771 10.0321C35.7366 10.0098 35.697 9.98801 35.6587 9.96669L21.5992 2.15586L21.4861 2.09269C21.0713 1.86035 20.5495 1.56809 19.9657 1.44802ZM18.6466 5.47754C18.9345 5.31759 19.0815 5.23676 19.1911 5.18388L19.2002 5.17953L19.2093 5.18388C19.3189 5.23676 19.4659 5.31758 19.7538 5.47754L32.3873 12.4961L19.2001 19.8223L6.01304 12.4962L18.6466 5.47754ZM4.00076 15.7251L17.3002 23.1137L17.3003 37.7662L4.5871 30.7033C4.2832 30.5345 4.12804 30.4474 4.01919 30.378L4.00999 30.3721L4.00931 30.3612C4.00155 30.2324 4.00076 30.0545 4.00076 29.7068V15.7251Z"
          fill="#535862"
        />
      </svg>
    ),
  },
  {
    text: "Users loved our cashback perk, and Flowva made the process seamless.",
    author: "@Teamtoolkit",
    bgColor: "#5DFFE9",
    logo: (
      <svg
        width="45"
        height="45"
        viewBox="0 0 45 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="22.6001"
          cy="22.25"
          r="20.5"
          stroke="#535862"
          stroke-width="3"
        />
        <path
          d="M37.0956 7.75451C39.107 9.76592 39.7308 13.163 38.6472 17.3771C37.5732 21.5534 34.8709 26.2427 30.7316 30.3819C26.5924 34.5212 21.9031 37.2235 17.7268 38.2975C13.5127 39.3811 10.1156 38.7573 8.10422 36.7459C6.09281 34.7345 5.46896 31.3374 6.55259 27.1233C7.62658 22.947 10.3289 18.2577 14.4682 14.1185C18.6074 9.97922 23.2967 7.27688 27.473 6.20288C31.6871 5.11926 35.0842 5.74311 37.0956 7.75451Z"
          stroke="#535862"
          stroke-width="3"
        />
        <path
          d="M8.10412 7.7545C10.1155 5.7431 13.5126 5.11925 17.7267 6.20287C21.903 7.27687 26.5923 9.97921 30.7315 14.1185C34.8708 18.2577 37.5731 22.947 38.6471 27.1233C39.7308 31.3374 39.1069 34.7345 37.0955 36.7459C35.0841 38.7573 31.687 39.3811 27.4729 38.2975C23.2966 37.2235 18.6073 34.5212 14.4681 30.3819C10.3288 26.2427 7.62649 21.5534 6.55249 17.3771C5.46887 13.163 6.09271 9.76591 8.10412 7.7545Z"
          stroke="#535862"
          stroke-width="3"
        />
      </svg>
    ),
  },
];

export default function TestimonialBrand() {
  return (
    <section className="mb-16 px-[14px]">
      <div className="flex justify-center">
        <svg
          width="73"
          height="51"
          viewBox="0 0 73 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32.3275 8.59811C24.8945 7.27805 21.9922 13.7634 21.9922 13.7634C21.9922 13.7634 15.8152 10.2518 10.6035 15.7135C4.29112 22.3286 9.00907 38.5919 30.4172 39.486C47.1481 26.0999 41.3302 10.1969 32.3275 8.59811Z"
            stroke="#141B34"
            stroke-width="5"
            stroke-linecap="round"
          />
          <path
            d="M51.5082 11.8063C51.5278 11.8317 51.5469 11.8567 51.5657 11.8814C51.5938 11.8684 51.6225 11.8553 51.6516 11.8422C52.367 11.5191 53.3873 11.146 54.6095 10.9494C57.0896 10.5504 60.3684 10.8912 63.4954 13.7232C67.3936 17.2538 68.1628 23.5668 65.2679 29.1475C62.3396 34.7924 55.7171 39.7049 44.7588 40.9448L44.2939 40.9974L43.9083 40.7324C34.8198 34.4857 31.2847 27.0364 31.3543 20.6775C31.4231 14.391 35.0702 9.18095 40.1707 7.89782C44.262 6.86855 47.316 8.10946 49.3174 9.6277C50.3036 10.3759 51.0288 11.1849 51.5082 11.8063Z"
            fill="#9013FE"
          />
        </svg>
      </div>
      <h2 className="text-[56px] md:text-[64px] font-[impact]  text-center">
        Success Stories
      </h2>
      <p className="text-[20px] manrope text-center text-[#0000009e] mb-10">
        Tools That Found Their Audience with Flowva
      </p>

      <div className="flex justify-center">
        <div className="w-full md:max-w-[80%] ">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            centerInsufficientSlides={true}
            autoHeight={true}
            className="mySwiper"
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonies.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="p-6 rounded-xl shadow-md  flex flex-col justify-between"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <p className="text-[24px] font-semibold mb-4 font-manrope">
                    {item.text}
                  </p>

                  <div className="flex gap-2 items-center">
                    <div className="h-10 w-10 justify-center items-center flex rounded-full bg-white">
                      {item.logo}
                    </div>
                    <h4 className="font-semibold text-[20px]">{item.author}</h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
