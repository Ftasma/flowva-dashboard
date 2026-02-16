import Users_chip from "../../assets/users_chip.svg";
import Tools_chip from "../../assets/Tools_chip.svg";
import Country_flags from "../../assets/country_flags.svg";
export default function Stats() {
  return (
    <section className="flex justify-center px-[14px]">
      <div className="flex  flex-col md:flex-row w-full lg:w-[80%] items-center gap-5 ">
        <div className=" w-full shadow-md max-w-[417.67px] pb-10 flex flex-col justify-between p-[16px] h-[327px] md:h-[384px] rotate-0 opacity-100 rounded-2xl border border-[#0000001F] bg-[#F5EBFF]">
          <div className=" flex flex-col gap-[12px]">
            <h2 className="font-[impact] text-[56px]">10,000+</h2>
            <p className="text-[24px]">Users</p>
          </div>
          <p className="text-[20px] font-manrope text-[#5F5F5F]">
            Already simplifying their workflow with Flowva
          </p>
          <div className="flex items-center gap-2">
            <img src={Users_chip} alt="users" />
            <span className="font-semibold font-manrope">10,000+</span>
          </div>
        </div>
        <div className=" w-full shadow-md max-w-[417.67px] pb-10  flex flex-col justify-between p-[16px] h-[327px] md:h-[384px] rotate-0 opacity-100 rounded-2xl border border-[#0000001F] bg-[#F5EBFF]">
          <div className=" flex flex-col gap-[12px]">
            <h2 className="font-[impact] text-[56px]">200+</h2>
            <p className="text-[24px]">Tools</p>
          </div>
          <p className="text-[20px] font-manrope text-[#5F5F5F]">
            Curated and organized for you in the library
          </p>
          <div className="flex items-center gap-2">
            <img src={Tools_chip} alt="tools" />
            <span className="font-semibold font-manrope">and many more</span>
          </div>
        </div>
        <div className=" w-full shadow-md max-w-[417.67px] pb-10  flex flex-col justify-between p-[16px] h-[327px] md:h-[384px] rotate-0 opacity-100 rounded-2xl border border-[#0000001F] bg-[#F5EBFF]">
          <div className=" flex flex-col gap-[12px]">
            <h2 className="font-[impact] text-[56px]">25+</h2>
            <p className="text-[24px]">Countries</p>
          </div>
          <p className="text-[20px] font-manrope text-[#5F5F5F]">
            Reviewing tools and building smarter stacks every day
          </p>
          <div className="flex items-center">
            <img src={Country_flags} alt="flags" />
          </div>
        </div>
      </div>
    </section>
  );
}
