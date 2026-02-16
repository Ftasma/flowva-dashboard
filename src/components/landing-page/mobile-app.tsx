import Playstore_logo from "../../assets/playstore.svg";
import Appstore_logo from "../../assets/appstore.svg";
import Barcode from "../../assets/barcode.png";
import HIW from "../../assets/how_it_works.png";

export default function MobileApp() {
  return (
    <section className="flex justify-center mb-20 mx-[14px]">
      <div className="xl:max-w-[80%] w-full flex flex-col lg:flex-row items-center gap-8">
        <div className="bg-[#FFD7D780] max-w-[580px] w-full rounded-[16px] md:rounded-[32px] p-[16px] md:p-[40px]">
          <button className="p-[10px_16px] bg-[#0000000D] text-sm rounded-[100px]">
            Download
          </button>
          <h2 className="mt-5 mb-3 text-[20px] md:text-[32px] font-semibold">
            ORGANIZE, DISCOVER, AND EARN ON THE GO.
          </h2>

          <div className=" flex flex-col md:flex-row items-center justify-center my-3">
            <div
              className="bg-[#FFFFFF] 
            shadow-[1px_4px_10px_0px_#ABABAB1A,
             2px_17px_17px_0px_#ABABAB17,
             5px_39px_24px_0px_#ABABAB0D,
             9px_69px_28px_0px_#ABABAB03,
             15px_108px_30px_0px_#ABABAB00] rounded-[32px] w-full flex-1 p-[16px] md:p-[24px]
            "
            >
              <div className="flex flex-col text-[20px] gap-4">
                <button className="bg-[#F1F1F1] flex justify-center items-center gap-2 rounded-[100px] p-[16px] w-full">
                  <img src={Appstore_logo} alt="app store icon" />
                  Apple App Store
                </button>
                <button className="bg-[#F1F1F1] flex justify-center items-center gap-2 rounded-[100px] p-[16px] w-full">
                  <img src={Playstore_logo} alt="play store icon" />
                  Google Play Store
                </button>
              </div>
              <div className="mt-5 flex justify-center md:hidden">
                <img src={Barcode} className="w-[150px]" alt="barcode" />
              </div>
            </div>
            <div className="hidden -ml-5 md:block">
              <img src={Barcode} className="w-[150px]" alt="barcode" />
            </div>
          </div>
          <button className="rounded-[100px] bg-[#FFFFFFCC] w-full mt-3 p-[16px] md:p-[24px] text-[20px] text-start">
            ⌛ Coming soon
          </button>
        </div>
        <div className="bg-[#111111] rounded-[16px] md:rounded-[32px] max-w-[580px]  p-[16px] md:p-[40px] w-full ">
          <button className="p-[10px_16px] bg-[#FFFFFF3D] text-white text-sm rounded-[100px]">
           Benefits
          </button>
          <ul className="space-y-4 my-5">
            <li className="flex items-center gap-4">
              <span className="w-4 h-4 rounded-full bg-white flex-shrink-0"></span>
              <span className="text-[18px] md:text-[24px] font-bold text-white">
                QUICK DAILY CHECK-INS
              </span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-4 h-4 rounded-full bg-[#ffffff4f] flex-shrink-0"></span>
              <span className="text-[18px] md:text-[24px] font-bold text-[#ffffff4f]">
                DISCOVER TOOLS ANYWHERE
              </span>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-4 h-4 rounded-full bg-[#ffffff4f] flex-shrink-0"></span>
              <span className="text-[18px] md:text-[24px] font-bold text-[#ffffff4f]">
                NEVER MISS A REWARD
              </span>
            </li>
          </ul>

          <img src={HIW} alt="how it works" className="mt-10" />
        </div>
      </div>
    </section>
  );
}
