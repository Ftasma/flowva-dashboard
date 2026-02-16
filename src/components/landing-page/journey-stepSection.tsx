"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SigninScreenshot from "../../assets/signin-complete.png";
import OrganizeTrack from "../../assets/organize-track.png";
import Flowva_coin from "../../assets/flowva_coin.svg";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";

export default function StepperGridSwiper() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const progressBar = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<any>(null);

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const onAutoplayTimeLeft = (_: any, __: number, progress: number) => {
    if (progressBar.current) {
      progressBar.current.style.width = `${(1 - progress) * 120}%`;
    }
  };

  const togglePlay = () => {
    if (!swiperRef.current) return;
    if (isPlaying) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className=" my-24 px-[14px]">
      <h2 className="text-[56px] md:text-[64px] leading-[120%]  font-[impact] mb-10 text-center">
        SIMPLE, REWARDING, CALM
      </h2>

      <Swiper
        className="w-full lg:w-[80%] xl:max-w-[80%] h-[552px] !hidden lg:!block journey-step"
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        onSlideChange={(swiper) => {
          setActiveStep(swiper.realIndex % 3);
        }}
      >
        <SwiperSlide>
          <div className="grid grid-cols-12 w-full h-full gap-4">
            <div
              className="col-span-8 relative overflow-hidden bg-[#ECD6FF] border-[#0000001F] border rounded-xl p-6 "
              onClick={() => goToSlide(0)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  1
                </h2>
                <div>
                  <h3 className="text-[20px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Sign up & Connect
                  </h3>
                  <p className="text-[20px] text-black font-manrope font-semibold">
                    Set up your workspace in minutes
                  </p>
                </div>
              </div>
              <img
                className="absolute right-5 -top-10 rounded-[32px] w-[300px]"
                src={SigninScreenshot}
              />
            </div>

            <div
              className="col-span-2 flex items-center justify-center bg-[#F5EBFF] border-[#0000001F] border rounded-xl p-6 cursor-pointer"
              onClick={() => goToSlide(1)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  2
                </h2>
                <div>
                  <h3 className="text-[20px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Organize & Track
                  </h3>
                </div>
              </div>
            </div>

            <div
              className="col-span-2 flex items-center justify-center text-white bg-[#F5EBFF] border-[#0000001F] border  rounded-xl p-6 cursor-pointer"
              onClick={() => goToSlide(2)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  3
                </h2>
                <div>
                  <h3 className=" text-[20px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Earn & Enjoy
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="grid grid-cols-12 w-full h-full gap-4">
            <div
              className="col-span-2 relative overflow-hidden  text-white bg-[#F5EBFF] border-[#0000001F] border rounded-xl p-6 cursor-pointer"
              onClick={() => goToSlide(0)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  1
                </h2>
                <div>
                  <h3 className=" text-[24px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Sign up & Connect
                  </h3>
                </div>
              </div>
            </div>
            <div
              className="col-span-8  relative overflow-hidden  text-white bg-[#ECD6FF] border-[#0000001F] border  rounded-xl p-6"
              onClick={() => goToSlide(1)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  2
                </h2>
                <div>
                  <h3 className="text-[24px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Organize & Track
                  </h3>
                  <p className="text-[20px] text-black font-manrope  font-semibold">
                    Add your tools, subscriptions, and tasks.
                  </p>
                </div>
              </div>
              <img
                src={OrganizeTrack}
                alt="Organize Track"
                className="absolute right-5 -top-14 rounded-[32px] w-[300px] drop-shadow-track"
              />
            </div>
            <div
              className="col-span-2 flex items-center justify-center text-white bg-[#F5EBFF] border-[#0000001F] border  rounded-xl p-6 cursor-pointer"
              onClick={() => goToSlide(2)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  3
                </h2>
                <div>
                  <h3 className="text-[24px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Earn & Enjoy
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="grid grid-cols-12 w-full h-full gap-4">
            <div
              className=" col-span-2 relative overflow-hidden  text-white bg-[#F5EBFF] border-[#0000001F] border rounded-xl p-6 cursor-pointer"
              onClick={() => goToSlide(0)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  1
                </h2>
                <div>
                  <h3 className="text-[24px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Sign up & Connect
                  </h3>
                </div>
              </div>
            </div>
            <div
              className="col-span-2 flex items-center justify-center text-white bg-[#F5EBFF] border-[#0000001F] border rounded-xl p-6"
              onClick={() => goToSlide(1)}
            >
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  2
                </h2>
                <div>
                  <h3 className="text-[24px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Organize & Track
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-span-8  relative overflow-hidden text-white bg-[#ECD6FF] border-[#0000001F] border  rounded-xl p-6 cursor-pointer">
              <div className="flex flex-col justify-between h-full">
                <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
                  3
                </h2>
                <div>
                  <h3 className="text-[24px] xl:text-[36px] text-black  font-manrope font-bold xl:font-semibold">
                    Earn & Enjoy
                  </h3>
                  <p className="text-[20px] text-black font-manrope  font-semibold">
                    Check in daily, try new tools, and watch your points grow.
                  </p>
                </div>
              </div>
              <div
                className="absolute right-5 top-2 rounded-[32px] w-[300px]"
                onClick={() => goToSlide(2)}
              >
                <div className="flex  items-center gap-1">
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                </div>
                <div className="flex  items-center gap-1 -ml-20">
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                </div>
                <div className="flex  items-center gap-1">
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                  <img src={Flowva_coin} alt="flowva_coin" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="hidden lg:flex justify-center items-center mt-6 gap-4 w-full max-w-md mx-auto">
        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          className="h-[53px] w-[52px] bg-[#F1F1F1] text-black rounded-full md:flex items-center justify-center"
        >
          {isPlaying ? (
            <FontAwesomeIcon icon={Icons.Pause} />
          ) : (
            <FontAwesomeIcon icon={Icons.Play} />
          )}
        </button>

        {/* Progress bar */}
        <div className="h-[52px] w-[104px] bg-[#F1F1F1] flex justify-center items-center rounded-[100px] px-4">
          <div className="flex items-center gap-3 w-full">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                onClick={() => goToSlide(step)}
                className={`h-2 rounded-full overflow-hidden transition-all duration-300`}
                style={{
                  flex: step === activeStep ? 1 : "0 0 8px",
                  background: step === activeStep ? "#e5e7eb" : "#5F5F5F",
                }}
              >
                {step === activeStep && (
                  <div
                    ref={step === activeStep ? progressBar : null}
                    className="h-full bg-black transition-all duration-200"
                    style={{ width: "0%" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center  lg:hidden w-full gap-4">
        <div className=" relative overflow-hidden  text-white bg-[#ECD6FF] border-[#0000001F] border rounded-xl p-6 h-[407px] pb-10">
          <div className="flex flex-col justify-between h-full">
            <h2 className="font-[impact] text-black text-[120px]  xl:text-[180px]">
              1
            </h2>
            <div>
              <h3 className="text-[36px] text-black  font-manrope font-semibold">
                Sign up & Connect
              </h3>
              <p className="text-[20px] text-black font-manrope font-semibold">
                Set up your workspace in minutes
              </p>
            </div>
          </div>
        </div>
        <div className=" relative overflow-hidden  text-white bg-[#ECD6FF] border-[#0000001F] border rounded-xl p-6 h-[407px] pb-10">
          <div className="flex flex-col justify-between h-full">
            <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
              2
            </h2>
            <div>
              <h3 className="text-[36px] text-black  font-manrope font-semibold">
                Organize & Track
              </h3>
              <p className="text-[20px] text-black font-manrope font-semibold">
                Add your tools, subscriptions, and stacks.
              </p>
            </div>
          </div>
        </div>

        <div className=" relative overflow-hidden h-[407px] pb-10 text-white bg-[#ECD6FF] border-[#0000001F] border rounded-xl p-6">
          <div className="flex flex-col justify-between h-full">
            <h2 className="font-[impact] text-black text-[120px] xl:text-[180px]">
              3
            </h2>
            <div>
              <h3 className="text-[36px] text-black  font-manrope font-semibold">
                Earn & Enjoy
              </h3>
              <p className="text-[20px] text-black font-manrope font-semibold">
                Check in, try new tools, and watch as your coins grow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
