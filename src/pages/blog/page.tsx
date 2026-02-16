import React, { useState } from "react";
import InfoBanner from "../../components/landing-page/info-banner";
import Usersmenu from "../../components/landing-page/Menu/users-menu";
import Header from "../../components/landing-page/header";
import { usePublicBlogs } from "../../context/BlogContext";
import { formatDate } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import ReadMoreButton from "../../components/blog/Buttons/ReadMore";
import PinnedBlogSkeleton from "../../components/skeletons/PinnedBlogSkeleton";
import BlogCardsSkeleton from "../../components/skeletons/BlogCardsSkeleton";
import { addToNewsletter } from "../../services/moosend-services";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";
export default function Blog() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loadingSubmit, setLoading] = useState(false);
  const {
    blogs,
    loading,
    categories,
    pinnedBlog,
    pagination,
    setFilters,
    filters,
  } = usePublicBlogs();
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

  return (
    <div className="!min-h-screen">
      <SEO
        title="Flowva Blog – Insights, Tutorials & Product Updates"
        description="Explore Flowva’s latest articles on technology, productivity tools, and SaaS trends. Learn from tutorials, industry insights, and expert discussions."
        url="https://flowvahub.com/blog"
        // image="https://flowvahub.com/og-blog.png"
        type="website"
      />
      <Usersmenu isOpen={menuOpen} />
      <InfoBanner />
      <div className="px-2">
        <Header setIsOpen={setMenuOpen} isOpen={menuOpen} />
      </div>

      <main className="flex justify-center">
        <div className="w-full p-[14px] md:max-w-[80%]">
          <div className="flex flex-col md:flex-row items-start md:items-center my-10 md:my-16 justify-between ">
            <h1 className="font-[impact] text-[54px] md:text-[64px]">Blog</h1>
            <div className="max-w-xl">
              <p className="font-manrope font-semibold text-[#767676]">
                Read our latest posts to learn more about technology and market
                trends, plus technical deep dives and useful tutorials.
              </p>
            </div>
          </div>
          <hr />
          {loading ? (
            <PinnedBlogSkeleton />
          ) : (
            <div className="my-10 md:my-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="h-[350px] md:h-[449px] w-full overflow-hidden rounded-[16px] relative">
                <img
                  src={pinnedBlog?.cover_image_url}
                  className="object-cover object-center w-full h-full"
                  alt="blog cover"
                />
              </div>
              <div className="max-w-xl w-full flex flex-col gap-[16px] md:gap-[24px]">
                <p className="text-sm font-manrope">
                  {formatDate(pinnedBlog?.created_at as string)}
                </p>
                <h2 className="text-[24px] md:text-[36px] font-semibold font-manrope ">
                  {pinnedBlog?.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-manrope text-[#767676]">
                    BY
                  </span>
                  <div className="overflow-hidden flex justify-center items-center bg-[#9013fe] text-white text-base font-manrope font-semibold  rounded-full h-[24px] w-[24px] relative">
                    {pinnedBlog?.user_profiles?.profile_pic ? (
                      <img
                        src={pinnedBlog?.user_profiles?.profile_pic}
                        className="object-cover object-center w-full h-full"
                        alt="author"
                      />
                    ) : (
                      <h2>
                        {(
                          pinnedBlog?.user_profiles?.name?.[0] ?? "F"
                        ).toUpperCase()}
                      </h2>
                    )}
                  </div>{" "}
                  <span className=" text-sm font-manrope font-semibold">
                    {`${pinnedBlog?.user_profiles?.name ?? ""} ${
                      pinnedBlog?.user_profiles?.last_name ?? ""
                    }`.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm md:text-base text-[#767676] font-manrope">
                  {pinnedBlog?.summary}
                </p>

                <ReadMoreButton blogId={pinnedBlog?.id} />
              </div>
            </div>
          )}
          <hr />
          <h2 className="font-[impact] text-[36px] md:text-[48px] mt-14">
            Latest Articles
          </h2>
          <div>
            <div className="flex flex-col gap-6 lg:flex-row  justify-between w-full">
              <div>
                <h3 className="font-manrope text-sm font-semibold text-[#767676]">
                  FILTER BY CATEGORY
                </h3>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {/* Default "All" button */}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: "", // empty means all
                        page: 1, // reset to first page
                      }))
                    }
                    className={`rounded-[8px] font-manrope text-xs  font-bold p-[12px] transition ${
                      filters.category === ""
                        ? "bg-[#9013FE] text-white"
                        : "bg-[#F1F1F1] hover:bg-[#E5E5E5]"
                    }`}
                  >
                    ALL
                  </button>

                  {/* Dynamic categories */}
                  {categories?.map((category, index) => {
                    const isActive = filters.category === category;
                    return (
                      <button
                        key={index}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            category:
                              prev.category === category ? "" : category, // toggle
                            page: 1, // reset page
                          }))
                        }
                        className={`rounded-[8px] font-manrope text-xs  font-bold p-[12px] transition ${
                          isActive
                            ? "bg-[#9013FE] text-white"
                            : "bg-[#F1F1F1] hover:bg-[#E5E5E5]"
                        }`}
                      >
                        {category.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="md:w-fit w-full">
                <h3 className="font-manrope text-sm font-semibold text-[#767676]">
                  SEARCH
                </h3>
                <div className="relative mt-5">
                  <input
                    type="text"
                    placeholder="Search by Keyword"
                    defaultValue={filters.search}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); //
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          setFilters((prev) => ({
                            ...prev,
                            search: value,
                            page: 1,
                          }));
                        }
                      }
                    }}
                    className="border outline-none focus:border-[#9013fe] px-2 py-[9px] w-full md:w-[380px] text-sm rounded-[8px]"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <BlogCardsSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {blogs.map((blog, i) => {
                  // Insert the subscription form *at index 2*, but still show the blog later
                  if (i === 2) {
                    return (
                      <React.Fragment key={`form-${i}`}>
                        {/* The form itself */}
                        <div className="flex flex-col gap-4 bg-white p-6 rounded-[16px] border-[#E9E9E9] border">
                          <h2 className="text-[#767676] font-semibold font-manrope">
                            SUBSCRIBE
                          </h2>
                          <p className="font-manrope font-bold text-[36px]">
                            Get posts straight in your inbox
                          </p>
                          <p className="text-[#767676] text-sm font-manrope">
                            Subscribe to updates and we'll send you occasional
                            emails with posts we think you'll like.
                          </p>

                          <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3 mt-auto"
                          >
                            <div>
                              <label
                                htmlFor="email"
                                className="font-manrope text-sm font-semibold mb-2 block"
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
                              <div className="w-full flex justify-center items-center whitespace-nowrap h-full px-[24px] rounded-[100px] bg-[#111111] hover:bg-[#b362fae3] transition-all duration-200 text-white shadow-[0px_2px_4px_0px_#0000001A,0px_6px_6px_0px_#00000017,0px_14px_9px_0px_#0000000D,0px_26px_10px_0px_#00000003,0px_40px_11px_0px_#00000000,-4px_13px_19px_0px_#ECD6FF80_inset]">
                                {loadingSubmit ? "Submitting.. " : " Submit"}
                              </div>
                            </button>
                          </form>
                        </div>

                        {/* Also render the blog that was meant for this position */}

                        <div
                          onClick={() => navigate(`/blog/${blog.id}`)}
                          key={`blog-${i}`}
                          className="flex flex-col gap-[24px] group relative transition-all duration-500  hover:rounded-[16px]"
                        >
                          <div className="h-[302px] w-full overflow-hidden rounded-[16px] relative">
                            <img
                              src={blog?.cover_image_url}
                              className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-110"
                              alt="blog cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>{" "}
                          <div>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-4 items-center">
                                {blog?.blog_tags.slice(0, 2).map((tag, i) => (
                                  <div
                                    key={i}
                                    className="rounded-[8px] font-manrope text-xs md:text-sm font-bold bg-[#F1F1F1] p-[12px]"
                                  >
                                    {tag.toUpperCase()}
                                  </div>
                                ))}
                              </div>
                              <p className="text-sm text-[#5F5F5F] font-manrope">
                                {formatDate(blog?.created_at as string)}
                              </p>
                            </div>
                            <h2 className="text-[20px] md:text-[32px] font-semibold font-manrope">
                              {blog?.title}
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
                              </div>
                              <span className=" text-sm font-manrope font-semibold">
                                {`${blog?.user_profiles?.name ?? ""} ${
                                  blog?.user_profiles?.last_name ?? ""
                                }`.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm md:text-base text-[#767676] font-manrope mt-2">
                              {blog?.summary && blog.summary.length > 100
                                ? blog.summary.substring(0, 100) + "..."
                                : blog?.summary}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  }

                  // Normal blog cards
                  return (
                    <div
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      key={`blog-${i}`}
                      className="flex flex-col gap-[24px] group relative transition-all duration-500 rounded-[16px] p-[16px] border"
                    >
                      <div className="h-[302px] w-full overflow-hidden rounded-[16px] relative">
                        <img
                          src={blog?.cover_image_url}
                          className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-110"
                          alt="blog cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            {blog?.blog_tags.slice(0, 2).map((tag, i) => (
                              <div
                                key={i}
                                className="rounded-[8px] font-manrope text-xs md:text-sm font-bold bg-[#F1F1F1] p-[12px]"
                              >
                                {tag.toUpperCase()}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-[#5F5F5F] font-manrope">
                            {formatDate(blog?.created_at as string)}
                          </p>
                        </div>
                        <h2 className="text-[20px] md:text-[32px] font-semibold font-manrope">
                          {blog?.title}
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
                          </div>
                          <span className="text-sm font-manrope font-semibold">
                            {`${blog?.user_profiles?.name ?? ""} ${
                              blog?.user_profiles?.last_name ?? ""
                            }`.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-[#767676] font-manrope mt-2">
                          {blog?.summary && blog.summary.length > 100
                            ? blog.summary.substring(0, 100) + "..."
                            : blog?.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="flex justify-center my-8">
        {pagination && filters.page < pagination.totalPages && (
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="flex p-[20px_40px] hover:bg-[#b362fae3] hover:text-white transition-all duration-200 font-semibold w-fit items-center rounded-[100px] border border-[#00000014]"
          >
            LOAD MORE
          </button>
        )}
      </div>
    </div>
  );
}
