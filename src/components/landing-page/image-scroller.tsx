import Chatgpt_logo from "../../assets/chatgpt.svg";
import Flowva_Coin from "../../assets/flowva_coin.svg";
import Asana_logo from "../../assets/asana.svg";
import Vscode_logo from "../../assets/vs_code.svg";
import Framer_logo from "../../assets/framer.svg";
import Google_logo from "../../assets/google3d.svg";
import Zoom_logo from "../../assets/zoom.svg";
import Canva_logo from "../../assets/canva.svg";
// import Keeper_logo from "../../assets/keeper.svg";

export default function ImageScroller() {
  const images = [
    Chatgpt_logo,
    Flowva_Coin,
    Asana_logo,
    Flowva_Coin,
    Vscode_logo,
    Flowva_Coin,
    Framer_logo,
    Flowva_Coin,
    Google_logo,
    Flowva_Coin,
    Zoom_logo,
    Flowva_Coin,
    Canva_logo,
    Flowva_Coin,
    // Keeper_logo,
    // Flowva_Coin,
  ];

  return (
    <div className="overflow-hidden mt-12 md:mt-20 relative w-full ">
      {/* Scroll Left */}
      <div className="flex w-max animate-scrollLeft">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="mx-4">
            <img
              src={src}
              alt="icons"
              className=" w-[77px] h-[77px] md:w-[127px] md:h-[127px] "
            />
          </div>
        ))}
      </div>

      {/* Scroll Right */}
      <div className="flex w-max animate-scrollRight mt-5 md:mt-10">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="mx-4">
            <img
              src={src}
              alt="icons"
              className=" w-[77px] h-[77px] md:w-[127px] md:h-[127px] "
            />
          </div>
        ))}
      </div>
    </div>
  );
}
