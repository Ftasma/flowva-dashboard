import { Select } from "antd";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useEffect, useRef, useState } from "react";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { toast } from "react-toastify";
import ReviewToolsModal from "../../components/reviews/ReviewModal";
import "../../components/reviews/custom-tab.css";
import { ReviewsData, useReviews } from "../../hooks/review/useReviews";
import ReviewSkeleton from "../../components/skeletons/ToolReviews";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReviewHeaderSkeleton from "../../components/skeletons/ReviewHeaderSkeleton";
import Breadcrumbs from "../../components/reviews/BreadCrumbs";
import ReviewGrid from "../../components/reviews/ReviewGrid";
import { useSidebar } from "../../context/SidebarContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { RatingCircle } from "../../utils/helper";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { useCurrentUser } from "../../context/CurrentUserContext";

function Reviews() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<{
    id: string;
    title: string;
    desc: string;
    logo: string | undefined;
  } | null>(null);

  const [reviewEditData, setReviewEditdata] = useState<ReviewsData | null>(
    null
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get("toolId");
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { label: "All", value: "all" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const [sortBy, setSortBy] = useState<
    "recent" | "helpful" | "highest" | "lowest"
  >("recent");

  const { allTools } = useDefaultTools();
  const { currentUser } = useCurrentUser();

  const userId = currentUser?.id.toString() ?? "";
  const { toggleMobileMenu } = useSidebar();

  const reviewsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  const {
    reviews,
    refetch,
    loading,
    fetchHelpfulCount,
    likedReviewIds,
    cumulativeRatings,
    refetchLikedReviews,
  } = useReviews(selectedTool?.id?.toString(), userId);

  const toNumber = (value: string | number | undefined) =>
    value === undefined ? 0 : Number(value);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpful_count - a.helpful_count;

      case "highest":
        return toNumber(b.rating) - toNumber(a.rating);

      case "lowest":
        return toNumber(a.rating) - toNumber(b.rating);

      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  const indexOfLastReview = currentPage * reviewsPerPage;

  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  const filteredReviews =
    activeTab === "all"
      ? sortedReviews
      : sortedReviews.filter(
          (review) => String(Math.round(Number(review.rating))) === activeTab
        );

  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const onChange = (value: string) => {
    const selected = allTools.find((tool) => tool.id === value);
    if (selected) {
      setCurrentPage(1);

      setSelectedTool({
        id: selected.id,
        title: selected.title,
        desc: selected.description,
        logo: selected.toolLogo,
      });

      navigate(`?toolId=${selected.id}`, { replace: false });
    }
  };

  useEffect(() => {
    if (toolId && allTools.length > 0) {
      const matchedTool = allTools.find((tool) => tool.id === toolId);
      if (matchedTool) {
        setSelectedTool({
          id: matchedTool.id,
          title: matchedTool.title,
          desc: matchedTool.description,
          logo: matchedTool.toolLogo,
        });
      }
    }
  }, [toolId, allTools]);

  const handleReviewEdit = (review: ReviewsData) => {
    setReviewEditdata(review);
  };

  return (
    <div>
      <div className=" w-full relative ">
        <div className="bg-gray-50 sticky top-0 z-20 pb-2 py-2 pt-3 lg:pt-0 lg:py-0">
          <div className="w-full flex justify-between items-center ">
            <div className="flex w-fit gap-3 ">
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                <svg
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width={28}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#000000"
                      fillRule="evenodd"
                      d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
              <h1 className="text-xl md:text-[1.5rem] font-medium text-black mr-[24px]">
                Reviews
              </h1>
              <div className="relative group w-full hidden md:block">
                <Select
                  showSearch
                  placeholder="Select a tool"
                  optionFilterProp="label"
                  style={{ width: "180px" }}
                  className="custom-select"
                  value={selectedTool?.id || undefined}
                  onChange={onChange}
                  options={allTools.map((tool) => ({
                    value: tool.id,
                    label: tool.title,
                  }))}
                />
                <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
              </div>
            </div>
            <button
              onClick={() => {
                if (!selectedTool) {
                  toast.info("select a tool to review");
                  return;
                }
                setModalOpen(true);
              }}
              className="border-none md:py-[10px] md:px-[20px] font-medium text-white text-sm rounded-[100px] h-5 w-5 p-4 md:w-auto md:h-auto md:rounded-[8px] bg-[#9013FE] flex gap-[8px] justify-center items-center transition-all duration-300 ease-linear hover:bg-[#FF8687] hover:shadow-[0_4px_12px_rgba(144,_19,_254,_0.2)]"
            >
              <ModeEditOutlineIcon sx={{ fontSize: "18px" }} />
              <span className="hidden md:block">Write a review</span>
            </button>
          </div>
          <Breadcrumbs
            selectedTool={selectedTool}
            toolId={toolId}
            setSelectedTool={setSelectedTool}
          />
          <div className="relative pb-4 lg:pb-0 flex mt-2 justify-center group w-full md:hidden">
            <Select
              showSearch
              placeholder="Select a tool"
              optionFilterProp="label"
              style={{ width: "180px" }}
              className="custom-select"
              value={selectedTool?.id || undefined}
              onChange={onChange}
              options={allTools.map((tool) => ({
                value: tool.id,
                label: tool.title,
              }))}
              getPopupContainer={(trigger) => trigger.parentElement}
            />
            <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
          </div>
        </div>
        <div className="lg:h-[calc(100vh-155px)]  [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto">
          {!selectedTool && !toolId ? (
            <div className=" text-center py-[60px] px-[20px] flex flex-col justify-center items-center min-h-[300px] text-[#374151]">
              <ConstructionOutlinedIcon />
              <h2 className="font-semibold mb-[10px] text-xl">
                Select a tool to view reviews
              </h2>
              <p>
                Choose from the dropdown above to see detailed reviews and
                ratings
              </p>
            </div>
          ) : (
            <div>
              <div className="mt-1">
                <div className="bg-white  rounded-[16px] p-[24px] mb-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex   justify-between">
                  {selectedTool ? (
                    <>
                      <div className="flex items-center gap-[16px]">
                        <div className="relative w-full h-full max-w-[45px] max-h-[45px] overflow-hidden md:max-w-[64px] md:max-h-[64px] rounded-[16px] self-start flex items-center justify-center text-[2rem]">
                          <img
                            src={selectedTool?.logo}
                            className="w-full h-full"
                            alt="logo"
                          />
                        </div>
                        <div>
                          <h1 className="text-xl md:text-[1.75rem] mb-[4px]">
                            {selectedTool?.title}
                          </h1>
                          <p className="text-sm md:text-[#374151]">
                            {selectedTool?.desc}
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#9013FE] py-[8px] h-fit text-sm md:text-base px-[12px] text-white rounded-xl font-semibold flex items-center gap-[6px]">
                        <StarOutlinedIcon
                          sx={{
                            color: "white",
                            fontSize: {
                              sm: "10px",
                              md: "16px",
                            },
                          }}
                        />
                        <span>{(cumulativeRatings?.avgRating).toFixed(1)}</span>
                      </div>
                    </>
                  ) : (
                    <ReviewHeaderSkeleton />
                  )}
                </div>
              </div>
              <div className="w-full lg:grid lg:grid-cols-[1fr_2fr] lg:gap-[24px]">
                <div className="rounded-[16px] p-[24px] bg-white h-fit shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  <h2 className="mb-[20px] text-[1.25rem] pb-[10px] text-[#1f2937] border-b-[1px] border-[#e5e7eb]">
                    Rating Breakdown
                  </h2>
                  <div className="flex flex-col items-center mb-[24px]">
                    <RatingCircle
                      rating={Number((cumulativeRatings?.avgRating).toFixed(1))}
                    />
                    <p>
                      {reviews.length} review{reviews.length > 1 && "s"}
                    </p>
                  </div>
                  <div className="my-[16px] mx-0 ">
                    <div className="flex justify-between mb-[8px]">
                      <label>Ease of Use</label>
                      <span className=" font-semibold">
                        {(cumulativeRatings?.avgEaseOfUse).toFixed(1)}
                      </span>
                    </div>
                    <div className="rounded-[8px] h-[10px] relative overflow-hidden bg-[#e5e7eb]">
                      <div
                        className="h-full bg-[#9013FE] rounded-[8px] transition-all  duration-100 ease-out"
                        style={{
                          width: `${
                            (cumulativeRatings?.avgEaseOfUse / 5) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="my-[16px] mx-0 ">
                    <div className="flex justify-between mb-[8px]">
                      <label>Customer Support</label>
                      <span className=" font-semibold">
                        {(cumulativeRatings?.avgCustomerSupport).toFixed(1)}
                      </span>
                    </div>
                    <div className="rounded-[8px] h-[10px] relative overflow-hidden bg-[#e5e7eb]">
                      <div
                        className="h-full bg-[#9013FE] rounded-[8px] transition-all  duration-100 ease-out"
                        style={{
                          width: `${
                            (cumulativeRatings?.avgCustomerSupport / 5) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="my-[16px] mx-0 ">
                    <div className="flex justify-between mb-[8px]">
                      <label>Value For Money</label>
                      <span className=" font-semibold">
                        {(cumulativeRatings?.avgValueForMoney).toFixed(1)}
                      </span>
                    </div>
                    <div className="rounded-[8px] h-[10px] relative overflow-hidden bg-[#e5e7eb]">
                      <div
                        className="h-full bg-[#9013FE] rounded-[8px] transition-all  duration-100 ease-out"
                        style={{
                          width: `${
                            (cumulativeRatings.avgValueForMoney / 5) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="my-[16px] mx-0 ">
                    <div className="flex justify-between mb-[8px]">
                      <label>Feature Tools</label>
                      <span className=" font-semibold">
                        {(cumulativeRatings?.avgFeatureTools).toFixed(1)}
                      </span>
                    </div>
                    <div className="rounded-[8px] h-[10px] relative overflow-hidden bg-[#e5e7eb]">
                      <div
                        className="h-full bg-[#9013FE] rounded-[8px] transition-all  duration-100 ease-out"
                        style={{
                          width: `${
                            (cumulativeRatings.avgFeatureTools / 5) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0">
                  <div className="flex flex-col md:flex-row justify-between mb-[24px] items-center">
                    <div className="flex gap-3" ref={reviewsRef}>
                      {tabs.map((tab) => (
                        <div
                          key={tab.value}
                          onClick={() => {
                            setActiveTab(tab.value);
                            setCurrentPage(1);
                          }}
                          className={`cursor-pointer whitespace-nowrap  py-[6px] px-[12px] rounded-[20px] text-[0.875rem] transition-all duration-200 ease-linear 
                          ${
                            activeTab === tab.value
                              ? "bg-[#9013FE] text-white"
                              : "bg-[#f3f4f6] text-black"
                          }`}
                        >
                          {tab.label}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-[8px] mt-3 md:mt-0 text-[0.875rem]">
                      <p className=" whitespace-nowrap">Sort by:</p>
                      <div className="relative pb-4 lg:-mt-1 flex mt-2 justify-center group w-full">
                        <Select
                          placeholder="Sort by"
                          optionFilterProp="label"
                          style={{ maxWidth: "180px", width: "100%" }}
                          className="custom-select"
                          value={sortBy}
                          onChange={(value) => {
                            setCurrentPage(1);
                            setSortBy(value as typeof sortBy);
                          }}
                          options={[
                            { value: "recent", label: "Most Recent" },
                            { value: "helpful", label: "Most Helpful" },
                            { value: "highest", label: "Highest Rated" },
                            { value: "lowest", label: "Lowest Rated" },
                          ]}
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
                      </div>
                    </div>
                  </div>
                  {loading ? (
                    <ReviewSkeleton cards={3} />
                  ) : (
                    <ReviewGrid
                      reviews={reviews}
                      setModalOpen={setModalOpen}
                      editReview={handleReviewEdit}
                      currentReviews={currentReviews}
                      likedReviewIds={likedReviewIds}
                      refetchLikedReviews={refetchLikedReviews}
                      fetchHelpfulCount={fetchHelpfulCount}
                    />
                  )}
                  {currentReviews.length > 0 && (
                    <div className="flex mb-3 items-center justify-center gap-2 mt-6">
                      <button
                        className="text-[#9013FE] px-3 py-1 border border-[#9013FE] rounded hover:bg-[#9013FE] hover:text-white transition"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
                        Prev
                      </button>

                      <span className="mx-2 font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        className="text-[#9013FE] px-3 py-1 border border-[#9013FE] rounded hover:bg-[#9013FE] hover:text-white transition"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ReviewToolsModal
        editData={reviewEditData}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        toolId={selectedTool?.id || ""}
        toolTitle={selectedTool?.title || ""}
        refresh={refetch}
      />
    </div>
  );
}

export default Reviews;
