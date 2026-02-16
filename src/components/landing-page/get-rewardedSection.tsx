import Flowva_coin from "../../assets/flowva_coin.svg";
export default function GetRewarded() {
  return (
    <section className="flex justify-center mb-20 px-[14px]">
      <div className="bg-[#F7FF5D] relative overflow-hidden min-h-[394px] md:min-h-[550px] py-16 border border-[#00000014]  w-full rounded-[16px] md:rounded-[32px] md:max-w-[80%]">
        <div className="relative z-10 px-[45px]">
          <h2 className="text-[40px] md:text-[64px] leading-[120%]  font-[impact] mb-10 text-center">
            STAY PRODUCTIVE. <br /> GET REWARDED.
          </h2>
          <p className="md:text-[28px] leading-[30px] md:leading-[35px] font-semibold text-center font-manrope">
            Turn your tools, subscriptions, and daily habits into <br className="hidden md:block"/> rewards
            all in one calm space
          </p>
          <button className="mt-10 left-1/2 font-manrope right-1/2 -translate-x-1/2 relative w-[232px]  text-sm font-bold border-[#9013FE1A] rounded-[100px] border p-[6px]">
            <div className=" w-full text-sm whitespace-nowrap p-[24px] rounded-[100px] relative bg-[#111111] hover:bg-[#b362fae3] transition-all ease-linear duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
              Unlock Rewards Now
            </div>
          </button>
        </div>
        <div className="absolute -left-16 top-[60%]   md:-left-10 md:top-1/2 md:-translate-y-1/2">
          <img src={Flowva_coin} alt="flowva_coin" />
          <img src={Flowva_coin} className="ml-28" alt="flowva_coin" />
          <img src={Flowva_coin} className="ml-24" alt="flowva_coin" />
          <img src={Flowva_coin} alt="flowva_coin" />
        </div>
        <div className="absolute -right-24 -top-[68%] rotate-180 transition md:-right-10 md:top-1/2 md:-translate-y-1/2">
          <img src={Flowva_coin} alt="flowva_coin" />
          <img src={Flowva_coin} className="ml-28" alt="flowva_coin" />
          <img src={Flowva_coin} className="ml-24" alt="flowva_coin" />
          <img src={Flowva_coin} alt="flowva_coin" />
        </div>
      </div>
    </section>
  );
}
