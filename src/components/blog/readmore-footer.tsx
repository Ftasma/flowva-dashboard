import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import flowva_logo from "../../assets/flowva_icon_white.svg";
import { Icons } from "../../icons";
import Flowva_footer_logo from "../../assets/flowva_footer_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { addToNewsletter } from "../../services/moosend-services";
import { useState } from "react";
import { toast } from "react-toastify";
import { RelatedBlog } from "../../hooks/blog/useBlogs";
import { formatDate } from "../../utils/helper";
import RelatedBlogSkeleton from "../skeletons/RelatedBlogSkeleton";

export default function ReadMoreAndFooter({
  relatedBlogs,
  relatedBlogLoading,
}: {
  relatedBlogs: RelatedBlog[];
  relatedBlogLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await addToNewsletter(email);
      toast.success("Successfully subscribed!");
      setEmail("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to subscribe. Try again!");
      setLoading(false);
    }
  };

  if (!relatedBlogs) return;
  return (
    <footer className="bg-black grid place-items-center rounded-tl-[16px] md:rounded-tl-[32px] rounded-tr-[32px] pb-14">
      <div className="lg:max-w-[80%]  mx-auto w-full px-[14px]">
        <div className="flex items-center justify-between my-20">
          <h2 className="font-semibold text-[20px] md:text-[32px] font-manrope text-[#FFFFFF]">
            Read More
          </h2>
          <button
            onClick={() => navigate("/blog")}
            className="lg:p-[20px_40px] p-[10px_25px] text-[#FFFFFF] text-sm md:text-base font-semibold rounded-[100px] border border-[#FFFFFF80]"
          >
            VIEW ALL ARTICLES
          </button>
        </div>
        {relatedBlogLoading ? (
          <RelatedBlogSkeleton />
        ) : (
          <div className="space-y-10">
            {relatedBlogs.map((blog, index) => (
              <div
                onClick={() => navigate(`/blog/${blog.id}`)}
                key={index}
                className="p-[24px] group relative transition-all duration-500  cursor-pointer rounded-[24px] bg-[#FFFFFF1A] flex flex-col lg:flex-row justify-between items-center gap-10"
              >
                <div className="h-[302px] w-full overflow-hidden rounded-[16px] relative">
                  <img
                    src={blog.cover_image_url}
                    className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-110"
                    alt="blog cover"
                  />{" "}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="max-w-xl w-full flex flex-col gap-[24px]">
                  <div className="flex gap-5 items-center">
                    <div className="flex gap-4 items-center">
                      {blog?.blog_tags?.slice(0, 2).map((tag, i) => (
                        <div
                          key={i}
                          className="rounded-[8px] font-manrope text-xs md:text-sm font-bold bg-[#F1F1F1] p-[12px]"
                        >
                          {tag.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[#5F5F5F] font-manrope">
                      {formatDate(blog?.publish_date as string)}
                    </p>
                  </div>
                  <h2 className=" text-[20px] md:text-[36px] font-semibold text-[#FFFFFF] font-manrope ">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-manrope text-[#767676]">
                      BY
                    </span>
                    <div className="overflow-hidden flex justify-center items-center bg-[#9013fe] text-white text-base font-manrope font-semibold rounded-full h-[24px] w-[24px]">
                      {blog?.user_profiles?.profile_pic ? (
                        <img
                          src={blog?.user_profiles?.profile_pic}
                          className="object-cover object-center w-full h-full"
                          alt="author"
                        />
                      ) : (
                        <h2>
                          {(
                            blog?.user_profiles?.name?.[0] ?? "F"
                          ).toUpperCase()}
                        </h2>
                      )}
                    </div>{" "}
                    <span className=" text-sm text-[#FFFFFF] font-manrope font-semibold">
                      {`${blog?.user_profiles?.name ?? ""} ${
                        blog?.user_profiles?.last_name ?? ""
                      }`.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#767676] font-manrope">
                    {blog?.summary && blog.summary.length > 100
                      ? blog.summary.substring(0, 100) + "..."
                      : blog?.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-[#FFFFFF0D] w-full max-w-[745px] grid place-items-center mt-20 pb-10 rounded-bl-[32px] rounded-br-[32px]">
        <img src={flowva_logo} alt="flowva logo" className="mt-10 md:mt-16" />

        <div className="w-full flex justify-center mt-5 ">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-[320px] md:max-w-[503px]"
          >
            <input
              type="email"
              placeholder="Enter email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-[320px] pr-[40%] border border-[#00000014]  outline-none focus:border-[#9013FE] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(144,19,254,0.1)] transition md:max-w-[503px] text-white p-[16px] rounded-[24px] h-[64px] md:h-[68px] bg-[#FFFFFF29] "
            />
            <button
              disabled={loading}
              className="bg-white  hover:bg-[#b362fae3] transition-all  hover:shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset] hover:transition-all ease-linear duration-200 group flex items-center hover:text-white text-black absolute p-[8px_16px] rounded-[100px] right-5 top-1/2 -translate-y-1/2"
            >
              {loading ? "Submitting.. " : " Submit"}
              {!loading && (
                <FontAwesomeIcon
                  className="ml-[0.5rem] group-hover:translate-x-[3px] transition-all duration-300 ease-in-out"
                  icon={Icons.ArrowRight}
                />
              )}
            </button>
          </form>
        </div>
        <p className="text-[#FFFFFF80] text-sm md:text-base mt-5 text-center">
          10,000+ end their week inspired. Join Friday Flow.
        </p>
      </div>
      <div className="flex w-full justify-start md:justify-center mt-14 px-[14px]">
        <div className=" grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-8  w-full md:max-w-[80%] ">
          {/* Tagline */}
          <div className="col-span-2 space-y-6 hidden md:block">
            <div>
              <img src={Flowva_footer_logo} alt="flowva logo" />
            </div>
            <p className="text-[#FFFFFF] text-sm">
              The smart way to manage your digital life and get rewarded
            </p>
            <p className="text-[#FFFFFF] text-sm">© 2025 Flowva</p>
          </div>

          {/* Hubs */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-2">Hub</h4>
            <ul className="space-y-3 text-sm text-[#A5A5A5] ">
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Discover
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-2">Company</h4>
            <ul className="space-y-3 text-sm text-[#A5A5A5] ">
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-3 text-sm text-[#A5A5A5] ">
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1">
            <h4 className="font-semibold text-white mb-2">Community</h4>
            <ul className="space-y-3 text-sm text-[#A5A5A5] ">
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Affiliate
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Influencer
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Referral
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 whitespace-nowrap">
            <h4 className="font-semibold text-white mb-2">Legal</h4>
            <ul className="space-y-3 text-sm text-[#A5A5A5] ">
              <li>
                <Link
                  to="#"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  target="_blanck"
                  to="https://docs.google.com/document/d/12S_rqEERUuq_NrS2WKoG7pt_pAQqy9Q37BLxGOTMKQs/edit?usp=drivesdk"
                  className="hover:underline underline-offset-2  font-bold"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="md:w-fit flex items-center gap-5 justify-between w-full mt-10 px-[14px]">
        <Link
          target="_blanck"
          to="https://www.facebook.com/share/1DKr8atT1i/"
          className="flex items-center gap-2 hover:underline underline-offset-1"
        >
          <svg
            width="30"
            height="35"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.268 6.12501C12.5384 6.12495 11.8895 6.1249 11.3657 6.19535C10.7963 6.27192 10.2214 6.44849 9.7515 6.91852C9.28162 7.38855 9.10511 7.96364 9.02856 8.53319C8.95813 9.05719 8.95819 9.70624 8.95825 10.4361L8.95825 11.1266H8.33325C7.75796 11.1266 7.29158 11.5931 7.29158 12.1686C7.29158 12.7441 7.75796 13.2106 8.33325 13.2106H8.95825V18.2085C8.95825 18.6037 8.95825 18.8013 8.83434 18.9237C8.71043 19.0461 8.51434 19.0436 8.12217 19.0386C7.13097 19.0261 6.28804 18.9913 5.57327 18.8952C4.42606 18.7409 3.51585 18.4183 2.80068 17.7029C2.08552 16.9875 1.76299 16.077 1.60875 14.9294C1.45823 13.8096 1.45824 12.3752 1.45825 10.5491V10.4537C1.45824 8.62757 1.45823 7.19321 1.60875 6.07335C1.76299 4.92577 2.08552 4.01527 2.80068 3.29988C3.51585 2.58449 4.42606 2.26186 5.57327 2.10757C6.69278 1.95701 8.1267 1.95702 9.95227 1.95703H10.0476C11.8731 1.95702 13.3071 1.95701 14.4266 2.10757C15.5738 2.26186 16.484 2.58449 17.1992 3.29988C17.9143 4.01527 18.2368 4.92577 18.3911 6.07335C18.5416 7.19321 18.5416 8.62758 18.5416 10.4537V10.5491C18.5416 12.3752 18.5416 13.8096 18.3911 14.9294C18.2368 16.077 17.9143 16.9875 17.1992 17.7029C16.484 18.4183 15.5738 18.7409 14.4266 18.8952C13.7118 18.9913 12.8689 19.0261 11.8777 19.0386C11.4855 19.0436 11.2894 19.0461 11.1655 18.9237C11.0416 18.8013 11.0416 18.6037 11.0416 18.2085V13.2106L12.4999 13.2106C13.0752 13.2106 13.5416 12.7441 13.5416 12.1686C13.5416 11.5931 13.0752 11.1266 12.4999 11.1266L11.0416 11.1266V10.5014C11.0416 9.68601 11.0438 9.1793 11.0933 8.81087C11.138 8.47834 11.204 8.41266 11.2236 8.39312L11.2246 8.39212L11.2256 8.39112C11.2452 8.37148 11.3108 8.30546 11.6433 8.26075C12.0116 8.21122 12.5181 8.20901 13.3333 8.20901H14.1666C14.7419 8.20901 15.2083 7.74249 15.2083 7.16701C15.2083 6.59153 14.7419 6.12502 14.1666 6.12502L13.268 6.12501Z"
              fill="white"
            />
          </svg>
          <span className="font-manrope text-[#A5A5A5] text-sm font-semibold whitespace-nowrap hidden md:block">
            Facebook
          </span>
        </Link>
        <Link
          target="_blanck"
          to="https://x.com/FlowvaHub"
          className="flex items-center gap-2 hover:underline underline-offset-1"
        >
          <svg
            width="30"
            height="35"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.96408 2.81761C2.10299 2.54594 2.38239 2.375 2.6875 2.375H6.75C7.0109 2.375 7.25593 2.50029 7.40868 2.71179L11.2795 8.07143L16.738 2.61298C17.0553 2.29567 17.5697 2.29567 17.887 2.61298C18.2043 2.93028 18.2043 3.44472 17.887 3.76202L12.2432 9.4058L17.9712 17.3368C18.1498 17.5841 18.1748 17.9107 18.0359 18.1824C17.897 18.4541 17.6176 18.625 17.3125 18.625H13.25C12.9891 18.625 12.7441 18.4997 12.5913 18.2882L8.72047 12.9286L3.26203 18.387C2.94473 18.7043 2.43028 18.7043 2.11298 18.387C1.79568 18.0697 1.79568 17.5553 2.11298 17.238L7.75676 11.5942L2.02883 3.66321C1.85018 3.41586 1.82518 3.08927 1.96408 2.81761Z"
              fill="white"
            />
          </svg>
          <span className="font-manrope text-[#A5A5A5] text-sm font-semibold whitespace-nowrap hidden md:block">
            X (Formerly Twitter)
          </span>
        </Link>
        <Link
          target="_blanck"
          to="https://www.instagram.com/flowvahub?igsh=MXE0cGsyMnRzc3FpeQ%3D%3D&utm_source=qr"
          className="flex items-center gap-2 hover:underline underline-offset-1"
        >
          <svg
            width="30"
            height="35"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0474 19.041C11.8728 19.041 13.3068 19.0411 14.4263 18.8906C15.5734 18.7364 16.4836 18.4133 17.1987 17.6982C17.9139 16.9831 18.2369 16.073 18.3911 14.9258C18.5416 13.8063 18.5415 12.3724 18.5415 10.5469V10.4512C18.5415 8.62568 18.5416 7.19174 18.3911 6.07227C18.2369 4.92509 17.9139 4.01495 17.1987 3.2998C16.4836 2.58472 15.5734 2.26165 14.4263 2.10742C13.3068 1.95693 11.8728 1.95702 10.0474 1.95703H9.95166C8.12629 1.95702 6.69218 1.95692 5.57275 2.10742C4.42568 2.26168 3.5154 2.5847 2.80029 3.2998C2.08524 4.01492 1.76312 4.92519 1.60889 6.07227C1.45838 7.19174 1.45848 8.62568 1.4585 10.4512V10.5469C1.45848 12.3724 1.45838 13.8063 1.60889 14.9258C1.76312 16.0729 2.08524 16.9831 2.80029 17.6982C3.5154 18.4133 4.42568 18.7364 5.57275 18.8906C6.69218 19.0411 8.12629 19.041 9.95166 19.041H10.0474ZM14.5854 6.74902C14.1276 6.74879 13.7565 6.37596 13.7563 5.91602C13.7563 5.45592 14.1275 5.08226 14.5854 5.08203H14.5933C15.0514 5.08203 15.4233 5.45578 15.4233 5.91602C15.4232 6.3761 15.0513 6.74902 14.5933 6.74902H14.5854ZM9.99951 14.249C7.92856 14.2489 6.24951 12.57 6.24951 10.499C6.24951 8.42804 7.92856 6.74916 9.99951 6.74902C12.0706 6.74902 13.7495 8.42796 13.7495 10.499C13.7495 12.5701 12.0706 14.249 9.99951 14.249Z"
              fill="white"
            />
          </svg>
          <span className="font-manrope text-[#A5A5A5] text-sm font-semibold whitespace-nowrap hidden md:block">
            Instagram
          </span>
        </Link>
        <Link
          target="_blanck"
          to="https://www.linkedin.com/company/flowva/"
          className="flex items-center gap-2 hover:underline underline-offset-1"
        >
          <svg
            width="30"
            height="35"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0479 18.541C11.8732 18.541 13.3073 18.5411 14.4268 18.3906C15.574 18.2364 16.485 17.9134 17.2002 17.1982C17.9152 16.4831 18.2374 15.5728 18.3916 14.4258C18.5421 13.3063 18.542 11.8724 18.542 10.0469V9.95117C18.542 8.12569 18.5421 6.69173 18.3916 5.57227C18.2374 4.42524 17.9152 3.51491 17.2002 2.7998C16.485 2.08464 15.574 1.76166 14.4268 1.60742C13.3073 1.45697 11.8732 1.45702 10.0479 1.45703H9.95313C8.12778 1.45702 6.69366 1.45697 5.57422 1.60742C4.427 1.76166 3.51595 2.08464 2.80078 2.7998C2.08581 3.51491 1.7636 4.42524 1.60938 5.57227C1.45887 6.69174 1.45897 8.12568 1.45898 9.95117V10.0469C1.45897 11.8724 1.45887 13.3063 1.60938 14.4258C1.7636 15.5728 2.08581 16.4831 2.80078 17.1982C3.51595 17.9134 4.427 18.2364 5.57422 18.3906C6.69367 18.5411 8.12778 18.541 9.95312 18.541H10.0479ZM5.83496 6.87402C5.25967 6.87402 4.79297 6.40733 4.79297 5.83203C4.79314 5.25688 5.25977 4.79102 5.83496 4.79102H5.84277C6.41759 4.79146 6.88361 5.25716 6.88379 5.83203C6.88379 6.40706 6.4177 6.87358 5.84277 6.87402H5.83496ZM14.1689 14.999C13.709 14.9988 13.3361 14.626 13.3359 14.166L13.3359 10.832C13.3358 9.91187 12.5891 9.16628 11.6689 9.16602C10.7487 9.16619 10.0031 9.91181 10.0029 10.832L10.0029 14.166C10.0028 14.6259 9.62885 14.9988 9.16895 14.999C8.70897 14.9988 8.33611 14.626 8.33594 14.166L8.33594 8.33203C8.33611 7.87205 8.70897 7.4992 9.16895 7.49902C9.50654 7.49922 9.79793 7.70047 9.92871 7.98926C10.4351 7.67869 11.0313 7.49908 11.6689 7.49902C13.5096 7.49929 15.0028 8.99139 15.0029 10.832L15.0029 14.166C15.0028 14.6259 14.6288 14.9988 14.1689 14.999ZM5.83594 14.999C5.37581 14.999 5.00311 14.6261 5.00293 14.166L5.00293 8.74902C5.00293 8.28879 5.3757 7.91602 5.83594 7.91602C6.29595 7.91628 6.66895 8.28895 6.66895 8.74902L6.66895 14.166C6.66877 14.6259 6.29584 14.9988 5.83594 14.999Z"
              fill="white"
            />
          </svg>
          <span className="font-manrope text-[#A5A5A5] text-sm font-semibold whitespace-nowrap hidden md:block">
            Linkedin
          </span>
        </Link>
        <Link
          to="https://www.tiktok.com/@flowva.hub"
          target="_blanck"
          className="flex items-center gap-2 hover:underline underline-offset-1"
        >
          <svg
            width="30"
            height="35"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0479 19.041C11.8732 19.041 13.3073 19.0411 14.4268 18.8906C15.574 18.7364 16.485 18.4134 17.2002 17.6982C17.9152 16.9831 18.2374 16.0728 18.3916 14.9258C18.5421 13.8063 18.542 12.3724 18.542 10.5469V10.4512C18.542 8.62569 18.5421 7.19173 18.3916 6.07227C18.2374 4.92523 17.9152 4.01491 17.2002 3.2998C16.485 2.58464 15.574 2.26166 14.4268 2.10742C13.3073 1.95697 11.8732 1.95702 10.0479 1.95703H9.95313C8.12778 1.95702 6.69366 1.95697 5.57422 2.10742C4.427 2.26166 3.51595 2.58464 2.80078 3.2998C2.08581 4.01491 1.7636 4.92524 1.60938 6.07227C1.45887 7.19174 1.45897 8.62568 1.45898 10.4512V10.5469C1.45897 12.3724 1.45887 13.8063 1.60938 14.9258C1.7636 16.0728 2.08581 16.9831 2.80078 17.6982C3.51595 18.4134 4.427 18.7364 5.57422 18.8906C6.69367 19.0411 8.12778 19.041 9.95312 19.041H10.0479ZM8.46191 15.916C6.55023 15.916 5.001 14.3567 5.00098 12.4336C5.00098 10.5105 6.55021 8.95123 8.46191 8.95117C8.62888 8.95117 8.79366 8.96313 8.95508 8.98633C9.37563 9.04684 9.66855 9.43925 9.6084 9.8623C9.54822 10.2853 9.15784 10.5791 8.7373 10.5186C8.64779 10.5057 8.5558 10.499 8.46191 10.499C7.39988 10.4991 6.53906 11.3652 6.53906 12.4336C6.53909 13.5019 7.3999 14.3681 8.46191 14.3682C9.52398 14.3682 10.3847 13.502 10.3848 12.4336L10.3848 5.85645C10.3848 5.42909 10.7295 5.08205 11.1543 5.08203C11.5791 5.08203 11.9238 5.42908 11.9238 5.85645C11.9239 6.31726 12.1703 6.79329 12.6279 7.17773C13.0863 7.56281 13.6848 7.79102 14.2314 7.79102C14.6562 7.79112 15 8.13717 15 8.56445C15 8.99175 14.6562 9.33779 14.2314 9.33789C13.411 9.33789 12.5902 9.05069 11.9238 8.58203L11.9238 12.4336C11.9238 14.3567 10.3737 15.916 8.46191 15.916Z"
              fill="white"
            />
          </svg>
          <span className="font-manrope text-[#A5A5A5] text-sm font-semibold whitespace-nowrap hidden md:block">
            Tiktok
          </span>
        </Link>
      </div>
      <div className="w-full flex justify-center  px-[14px] md:hidden gap-2 mt-5 items-center">
        <p className="text-[#A5A5A5] text-sm font-semibold whitespace-nowrap mt-7">
          © 2025 Flowva
        </p>
      </div>
    </footer>
  );
}
