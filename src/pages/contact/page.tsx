import { useState } from "react";
import Header from "../../components/landing-page/header";
import Usersmenu from "../../components/landing-page/Menu/users-menu";
import InfoBanner from "../../components/landing-page/info-banner";
import User_img from "../../assets/contact-user-photo.jpg";
import Press_media_3d from "../../assets/press_media_3d.svg";
import Question_3d from "../../assets/question_3d.svg";
import Partner_3d from "../../assets/partner_3d.svg";
import { sendContactFormMessage } from "../../services/user/contact";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const supportCards = [
  {
    img: Question_3d,
    title: "Enquiries",
    description: "For general questions, account support, and user help.",
    email: "support@flowvahub.com",
  },
  {
    img: Partner_3d,
    title: "Partner with Us",
    description: "For tool companies and collaborations.",
    email: "partners@flowvahub.com",
  },
  {
    img: Press_media_3d,
    title: "Press & Media",
    description: "For interviews, press releases, and media kits.",
    email: "press@flowvahub.com",
  },
];

export default function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    agreed: false,
  });
  const [loading, setLoading] = useState(false);

  // handleChange works for both input/textarea and checkbox
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (!form.agreed) {
      toast.error("You must agree to the Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const response = await sendContactFormMessage(
        form.name,
        form.email,
        form.message
      );
      if (response.success) {
        toast.success(
          "Message sent successfully! Our team will contact you soon."
        );
        setForm({ name: "", email: "", message: "", agreed: false });
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[linear-gradient(180deg,_#F8F7FF_0%,_#FFFFFF_100%)]  min-h-screen">
      <SEO
        title="Contact Flowva – Get in Touch"
        description="Have questions, partnership ideas, or press inquiries? Contact Flowva’s team for support, collaborations, or media requests."
        url="https://flowvahub.com/contact"
        // image="https://flowvahub.com/og-contact.png"
      />
      <Usersmenu isOpen={menuOpen} />
      <InfoBanner />
      <div className="px-2">
        <Header setIsOpen={setMenuOpen} isOpen={menuOpen} />
      </div>
      <main className="flex justify-center">
        <div className="w-full p-[14px] md:max-w-[80%]">
          <h1 className="text-[48px] my-16 md:my-20 md:text-[64px] font-[impact] text-center">
            WE’D LOVE TO HEAR FROM YOU
          </h1>
          <div className="min-h-[794px] gap-[20px] lg:gap-[10px] flex flex-col items-center lg:items-stretch lg:flex-row p-[24px_16px] lg:p-[48px_40px] bg-[#FFFFFF] rounded-[24px] ">
            <div className="flex flex-col justify-between h-auto w-full max-w-[524px] ">
              <div>
                <p className="text-[20px] font-manrope text-[#5F5F5F]">
                  Questions, ideas, or partnership inquiries? The Flowva team is
                  here to help.
                </p>
                <p className="text-[20px] font-manrope text-[#5F5F5F] mt-7">
                  Just drop an “Hi” through the form & our team willl be in
                  touch with you in the 42 hours.
                </p>
              </div>
              <div className=" flex-col gap-8 hidden lg:flex ">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.9935 2.0835C21.7423 2.0835 23.1198 3.40438 23.9992 5.18669L26.936 11.1088C27.025 11.292 27.2361 11.5501 27.5534 11.7862C27.8705 12.0221 28.1809 12.1522 28.3852 12.1865L33.7012 13.077C35.6215 13.3997 37.2309 14.341 37.7534 15.98C38.2755 17.6177 37.5106 19.3195 36.1297 20.7029L36.1284 20.7043L31.9985 24.8683C31.8348 25.0333 31.6515 25.3442 31.5365 25.7492C31.4223 26.1515 31.4121 26.518 31.4639 26.7547L31.4647 26.758L32.6462 31.9091C33.1362 34.0531 32.9739 36.179 31.4618 37.2905C29.9445 38.4057 27.8711 37.9114 25.9875 36.7895L21.0043 33.8152C20.795 33.6902 20.4356 33.5889 20.0018 33.5889C19.5712 33.5889 19.2043 33.6888 18.9814 33.8185L18.9782 33.8203L14.0048 36.7888C12.1234 37.9146 10.0526 38.4002 8.53518 37.2839C7.02415 36.1722 6.85357 34.0502 7.34518 31.908L8.5265 26.758L8.52722 26.7547C8.57902 26.518 8.56888 26.1515 8.45466 25.7492C8.33967 25.3442 8.15631 25.0333 7.99263 24.8683L3.85975 20.7012C2.48774 19.3179 1.72534 17.6175 2.24325 15.9823C2.76266 14.3422 4.36905 13.3998 6.29055 13.0769L11.6022 12.1872L11.6039 12.1869C11.7986 12.1531 12.1045 12.0244 12.4208 11.788C12.7377 11.5511 12.9493 11.2924 13.0385 11.1088L13.043 11.0996L15.976 5.18512L15.9772 5.18279C16.8649 3.40196 18.2467 2.0835 19.9935 2.0835Z"
                        fill="#FF9F2A"
                      />
                    </svg>
                  ))}
                </div>
                <p className="font-manrope text-[20px]">
                  Flowvahub is my new sidekick. It keeps my apps in line, my
                  subs in check, and still finds a way to pay me in rewards. If
                  it could make coffee, I’d marry it
                </p>
                <div className=" flex items-center gap-4">
                  <div className="rounded-full h-[58px]  w-[58px] overflow-hidden relative ">
                    <img
                      src={User_img}
                      alt="user avatar"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold font-manrope">
                      Adewale O.
                    </h3>
                    <p className="font-manrope text-[#00000099]">Freelancer</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center lg:justify-end">
              <form
                onSubmit={handleSubmit}
                className="bg-[#F8F7FF] w-full  max-w-[559px] space-y-[31px] rounded-[24px] h-full p-[16px] lg:p-[40px]"
              >
                <div>
                  <label htmlFor="fullname" className="font-manrope mb-2 block">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full h-[60px] py-[20px] px-[16px] border border-[#00000014] bg-[#FFFFFF] rounded-[100px] outline-none focus:border-[#9013FE] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(144,19,254,0.1)] transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="font-manrope mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className="w-full h-[60px] py-[20px] px-[16px] border border-[#00000014] bg-[#FFFFFF] rounded-[100px] outline-none focus:border-[#9013FE] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(144,19,254,0.1)] transition"
                  />
                </div>
                <div>
                  <div>
                    <label
                      htmlFor="message"
                      className="font-manrope mb-2 block"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Enter Your Message"
                      className="w-full h-[178px] p-[20px]  border border-[#00000014] bg-[#FFFFFF] rounded-[8px]"
                    />
                  </div>
                  <div className="flex mt-3 md:items-center gap-2">
                    <input
                      className="size-[17px] mt-1 accent-black border border-[#A5A5A5]"
                      type="checkbox"
                      id="agreed"
                      checked={form.agreed}
                      onChange={handleChange}
                    />
                    <span className="font-manrope">
                      By reaching out to us, you agree to our Privacy Policy.
                    </span>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="font-manrope relative w-full  font-bold border-[#9013FE1A] rounded-[100px] border p-[6px]"
                >
                  <div className=" w-full font-manrope  whitespace-nowrap p-[24px] rounded-[100px] relative bg-[#111111] hover:bg-[#b362fae3] transition-all ease-linear duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
                    {loading ? "Sending..." : "Send Message"}
                  </div>
                </button>
              </form>
            </div>
          </div>
          <div className="my-16 md:my-20">
            <h2 className="text-[40px] font-bold font-manrope text-center">
              For other dedicated support
            </h2>

            <div className="flex-col lg:flex-row flex mt-10 gap-[24px] justify-between">
              {supportCards.map((support, index) => (
                <div
                  key={index}
                  className="bg-white h-[413px] lg:h-[327px] shadow hover:shadow-lg flex flex-col justify-between p-[24px] w-full max-w-[417px] rounded-[16px] border border-[#00000014]"
                >
                  <img
                    src={support.img}
                    className="h-[140px] w-[140px] lg:h-[90px] lg:w-[90px]"
                    alt={support.title}
                  />

                  <div>
                    <h3 className="text-[20px] font-manrope font-bold ">
                      {support.title}
                    </h3>
                    <p className="text-sm font-manrope font-semibold text-[#00000080] mt-4">
                      {support.description}
                    </p>
                  </div>

                  <a
                    href={`mailto:${support.email}`}
                    className="rounded-[100px] font-bold w-full max-w-[240px] p-[16px_24px] border-[1.5px] border-[#CDCDCD]"
                  >
                    {support.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
