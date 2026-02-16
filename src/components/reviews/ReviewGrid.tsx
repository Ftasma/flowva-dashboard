import { ReviewsData } from "../../hooks/review/useReviews";
import { formatDate, StarRating } from "../../utils/helper";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import CommentsDisabledOutlinedIcon from "@mui/icons-material/CommentsDisabledOutlined";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { toggleLike } from "../../services/review/toggleLikeService";
import { IconButton } from "@mui/material";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useRef, useState } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext";
import ProfilePicModal from "../dashboard/Modals/ProfilePicModal";
import { logUserActivity } from "../../services/user/activityTrack";

interface ReviewPageData {
  reviews: ReviewsData[];
  currentReviews: ReviewsData[];
  editReview: (data: ReviewsData) => void;
  likedReviewIds: string[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetchLikedReviews: () => Promise<void>;
  fetchHelpfulCount: (review_id: string) => Promise<void>;
}

function ReviewGrid({
  reviews,
  currentReviews,
  likedReviewIds,
  setModalOpen,
  editReview,
  refetchLikedReviews,
  fetchHelpfulCount,
}: ReviewPageData) {
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id.toString() ?? "";
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});
  const [localLikedIds, setLocalLikedIds] = useState<string[]>(likedReviewIds);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPicUrl, setSelectedPicUrl] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  const categoryCache = useRef<Record<string, string[]>>({});

  const getCategories = (reviewId: string, categories: string[]) => {
    if (categoryCache.current[reviewId]) {
      return categoryCache.current[reviewId];
    }

    const shuffled =
      categories.length <= 2
        ? categories
        : [...categories].sort(() => 0.5 - Math.random()).slice(0, 2);

    categoryCache.current[reviewId] = shuffled;
    return shuffled;
  };

  const handleEdit = (review: ReviewsData) => {
    editReview(review);
    setModalOpen(true);
  };

  const handleProfileSelect = (review: ReviewsData) => {
    setOpenModal(true);
    setSelectedPicUrl(review.user_profiles?.profile_pic ?? "");
    setSelectedName(`${review?.user_name ?? ""} ${review?.last_name ?? ""}`);
  };

  const handleReviewLike = async (review: ReviewsData) => {
    const reviewId = review.id;
    const newLiked = !localLikedIds.includes(reviewId);

    setLikeLoading((prev) => ({
      ...prev,
      [reviewId]: true,
    }));

    // Optimistically update UI
    review.helpful_count += newLiked ? 1 : -1;
    setLocalLikedIds((prev) =>
      newLiked ? [...prev, reviewId] : prev.filter((id) => id !== reviewId)
    );

    try {
      await toggleLike(reviewId, userId);
      await logUserActivity({
        userId,
        action: newLiked
          ? `Liked a review by ${review?.user_name}`
          : `Unliked a review by ${review?.user_name}`,
        metadata: {
          service: "review",
          reviewId,
          toolName: review.tool_name,
        },
      });
      await refetchLikedReviews();
      await fetchHelpfulCount(reviewId);
    } catch (err) {
      console.error("Failed to toggle like", err);
      // Revert optimistic update
      review.helpful_count -= newLiked ? 1 : -1;
      setLocalLikedIds((prev) =>
        newLiked ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
      );
    } finally {
      setLikeLoading((prev) => ({
        ...prev,
        [reviewId]: false,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-[16px] ">
      {reviews?.length > 0 ? (
        currentReviews?.length > 0 ? (
          currentReviews.map((review) => {
            const categoriesToShow = getCategories(
              review.id,
              review?.default_tools?.category ?? []
            );

            return (
              <div
                key={review.id}
                className="bg-white p-[20px] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 ease-linear hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:transform hover:translate-y-[-2px]"
              >
                <div className="flex justify-between mb-[12px] items-center">
                  <div className="flex gap-[12px] items-center">
                    <div
                      onClick={() => handleProfileSelect(review)}
                      className="w-10 h-10 rounded-full relative cursor-pointer overflow-hidden flex font-semibold justify-center items-center text-[#9013FE] bg-[#e5e7eb]"
                    >
                      {review.user_profiles?.profile_pic ? (
                        <img
                          src={review.user_profiles.profile_pic}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review?.user_name.charAt(0)
                      )}
                    </div>

                    <div>
                      <span className=" block font-semibold">
                        {review?.user_name}
                      </span>
                      <span className="block text-[0.875rem] text-[#374151]">
                        {formatDate(review?.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <StarRating rating={Number(review?.rating)} />
                    {review.user_id === userId && (
                      <div className="relative group">
                        <IconButton>
                          <MoreVertOutlinedIcon sx={{ fontSize: "15px" }} />
                        </IconButton>
                        <div className="flex flex-col absolute z-10 min-w-40 -right-4 mt-2 rounded-md w-fit opacity-0 group-hover:opacity-100 px-3 py-2 bg-white shadow-lg border transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(review)}
                            className="bg-transparent border-none text-left w-full px-2 py-1 text-sm text-gray-700 hover:text-[#9013FE] hover:bg-gray-100 rounded transition-colors duration-150"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-[16px] text-[0.95rem] leading-[1.7]">
                  {review?.content}
                </div>
                <div className="flex justify-between text-[0.875rem]">
                  <div className="flex gap-[6px]">
                    {categoriesToShow.map((cat, i) => (
                      <span
                        key={i}
                        className="p-[4px_8px] rounded-[4px] text-[0.75rem] bg-[#f3f4f6] truncate max-w-[138px] sm:max-w-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-[12px]">
                    <div className="relative flex items-center justify-center gap-[6px] cursor-pointer">
                      <button
                        className={`hover:text-[#9013FE] ${
                          localLikedIds.includes(review.id)
                            ? "text-[#9013FE]"
                            : ""
                        }`}
                        disabled={likeLoading[review.id]}
                        onClick={() => handleReviewLike(review)}
                      >
                        <ThumbUpOffAltOutlinedIcon sx={{ fontSize: "15px" }} />
                      </button>
                      <span>{review.helpful_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No match found</p>
        )
      ) : (
        <div className="mt-5 md:mt-10">
          <div className="flex justify-center">
            <CommentsDisabledOutlinedIcon sx={{ fontSize: "23px" }} />
          </div>
          <h2 className="font-semibold text-center mb-[10px] text-2xl">
            No reviews yet for this tool
          </h2>
          <p className="text-center">Be the first to share your experience!</p>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="border-none py-[10px] px-[20px] font-medium text-white text-sm rounded-[8px] bg-[#9013FE] flex gap-[8px] justify-center items-center transition-all duration-300 ease-linear hover:bg-[#FF8687] hover:shadow-[0_4px_12px_rgba(144,_19,_254,_0.2)]"
            >
              <ModeEditOutlineIcon sx={{ fontSize: "18px" }} />
              <span className=" font-medium">Write the first review</span>
            </button>
          </div>
        </div>
      )}
      <ProfilePicModal
        open={openModal}
        closeModal={setOpenModal}
        imgUrl={selectedPicUrl}
        firstName={selectedName.split(" ")[0]}
        lastName={selectedName.split(" ")[1]}
      />
    </div>
  );
}

export default ReviewGrid;
