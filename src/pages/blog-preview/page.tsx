import { useState } from "react";
import Header from "../../components/landing-page/header";
import InfoBanner from "../../components/landing-page/info-banner";
import Usersmenu from "../../components/landing-page/Menu/users-menu";
import { useParams } from "react-router-dom";
import { useBlogById } from "../../hooks/blog/useBlogs";
import { formatDate } from "../../utils/helper";
import ReadMoreAndFooter from "../../components/blog/readmore-footer";
import BlogDetailsSkeleton from "../../components/skeletons/BlogpageSkeleton";
import { toast } from "react-toastify";
import { addToNewsletter } from "../../services/moosend-services";
import SEO from "../../components/SEO";

export default function BlogPreview() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loadingSubmit, setLoading] = useState(false);
  const { id } = useParams();

  const { blog, relatedBlogs, loading } = useBlogById(id);
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

  const blogUrl = `https://flowvahub.com/blog/${id}`;
  const blogImage =
    blog?.cover_image_url ?? "https://flowvahub.com/og-blog.png";
  return (
    <div className="flex flex-col">
      <div className="min-h-screen">
        <SEO
          title={blog?.title ?? "Flowva Blog Post"}
          description={blog?.summary ?? "Read insightful articles from Flowva."}
          image={blogImage}
          url={blogUrl}
          type="article"
        />
        <Usersmenu isOpen={menuOpen} />
        <InfoBanner />
        <div className="px-2">
          <Header setIsOpen={setMenuOpen} isOpen={menuOpen} />
        </div>
        <main className="flex justify-center">
          {loading ? (
            <BlogDetailsSkeleton />
          ) : (
            <div className="w-full p-[14px] md:max-w-[80%] my-10 md:my-24">
              <p className="text-[#5F5F5F] text-sm font-manrope">
                {formatDate(blog?.created_at as string)}
              </p>
              <h1 className="text-[36px] md:text-[64px] font-semibold font-manrope">
                {blog?.title}
              </h1>
              <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center">
                <div className=" max-w-3xl">
                  <p className=" text-base md:text-lg text-[#767676]">
                    {blog?.summary}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="overflow-hidden flex justify-center items-center bg-[#9013fe] text-white text-base font-manrope font-semibold rounded-full h-[24px] w-[24px]">
                    {blog?.user_profiles?.profile_pic ? (
                      <img
                        src={blog?.user_profiles?.profile_pic}
                        className="object-cover object-center w-full h-full"
                        alt="author"
                      />
                    ) : (
                      <h2>
                        {(blog?.user_profiles?.name?.[0] ?? "F").toUpperCase()}
                      </h2>
                    )}
                  </div>
                  <span className="text-sm font-manrope font-semibold">
                    {`${blog?.user_profiles?.name ?? ""} ${
                      blog?.user_profiles?.last_name ?? ""
                    }`.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mt-16">
                <div className="lg:w-[60%] w-full">
                  <p
                    className="font-manrope"
                    dangerouslySetInnerHTML={{
                      __html: blog?.content as string,
                    }}
                  />
                </div>
                <div className="flex-1 w-full lg:max-w-[336px]">
                  <div className="flex flex-col gap-4 bg-[#9013FE] p-6 rounded-[16px] border-[#E9E9E9] border">
                    <h2 className="text-[#FFFFFFCC] font-semibold font-manrope">
                      SUBSCRIBE
                    </h2>
                    <p className="font-manrope text-[#FFFFFF] font-bold text-[36px]">
                      Get posts straight in your inbox
                    </p>
                    <p className="text-[#FFFFFFCC] text-sm font-manrope">
                      Subscribe to updates and we'll send you occasional emails
                      with posts we think you'll like.
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 mt-auto w-full"
                    >
                      <div>
                        <label
                          htmlFor="email"
                          className="font-manrope text-[#FFFFFFCC] text-sm font-semibold mb-2 block"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Your Email"
                          className="w-full h-[52px] p-[16px] border border-[#00000014] bg-[#FFFFFF] rounded-[8px] outline-none focus:border-[#9013FE] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(144,19,254,0.1)] transition"
                        />
                      </div>
                      <button
                        disabled={loadingSubmit}
                        className="font-manrope relative w-full h-[64px] mt-3 font-bold border-[#9013FE1A] rounded-[100px] border p-[6px]"
                      >
                        <div className="w-full flex justify-center items-center whitespace-nowrap h-full px-[24px] rounded-[100px] bg-white hover:bg-[#b362fae3] transition-all duration-200 text-black shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
                          {loadingSubmit ? "Submitting.. " : " Submit"}
                        </div>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <ReadMoreAndFooter
        relatedBlogLoading={loading}
        relatedBlogs={relatedBlogs}
      />
    </div>
  );
}
