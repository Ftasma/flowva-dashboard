import BoltShift_logo from "../../assets/bolt_shift_logo.svg";
import LightBox_logo from "../../assets/light_box_logo.svg";
import FeatherDev_logo from "../../assets/father_dev_logo.svg";
import Spherule_logo from "../../assets/sphere_rule_logo.svg";
import GlobalBank_logo from "../../assets/gblobank_logo.svg";
import Nietz_logo from "../../assets/nietz_logo.svg";

export default function CompanyLogos() {
  const companyLogos = [
    BoltShift_logo,
    LightBox_logo,
    FeatherDev_logo,
    Spherule_logo,
    GlobalBank_logo,
    Nietz_logo,
  ];
  return (
    <div className="text-center w-full flex justify-center my-16 md:my-24 px-[14px]">
      <div className="w-full md:max-w-[80%]">
        <p className="text-[#535862]">
          <strong>Trusted by 20+ forward-thinking brands</strong> <br /> Join
          companies already reaching 10,000+ remote workers and freelancers
          actively discovering and organizing their digital tools
        </p>
        <div className="flex justify-center flex-wrap w-full gap-5 mt-5">
          {companyLogos.map((logo, index) => (
            <img src={logo} className="w-[127.5px]" alt={`logo ${index + 1}`} />
          ))}
        </div>

        {/* <p className="px-[14px] text-[20px]  md:text-[36px] my-16 md:my-28 leading-[32px] md:leading-[40px] tracking-[0%] text-center font-semibold font-manrope">
          Connect with tech professionals who actually engage.{" "}
          <br className="hidden md:block" /> Launch campaigns, reward
          participation,
          <br className="hidden md:block" /> track performance — all in one
          platform.
        </p> */}
      </div>
    </div>
  );
}
