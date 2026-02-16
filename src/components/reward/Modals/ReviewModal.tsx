import React, { useEffect, useState } from "react";
import { Modal, Rate } from "antd";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import "../../reviews/custom-tab.css";
import { toast } from "react-toastify";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useUserProfile } from "../../../context/UseProfileContext";
import { ReviewsData } from "../../../hooks/review/useReviews";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import {
  addReview,
  updateReview,
} from "../../../services/review/toolReviewService";
import { handleDailyClaim } from "../../../services/rewardService";
import { logUserActivity } from "../../../services/user/activityTrack";

type ReviewToolsModalProps = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toolId: string;
  editData?: ReviewsData | null;
  toolTitle: string;
  refresh: () => void;
  refetchPoint: () => void;
  setConfetti: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleStatus: (value: number) => void;
};

const ReviewToolsModal: React.FC<ReviewToolsModalProps> = ({
  modalOpen,
  setModalOpen,
  toolId,
  editData,
  toolTitle,
  setConfetti,
  setShowModal,
  refresh,
  refetchPoint,
  handleStatus,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [easeOfUse, setEaseOfUse] = useState<number>(0);
  const [customerSupport, setCustomerSupport] = useState<number>(0);
  const [valueForMoney, setValueForMoney] = useState<number>(0);
  const [featuresTools, setFeaturesTools] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const { userProfileData, refetchUserProfile } = useUserProfile();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editData && modalOpen) {
      setRating(Number(editData.rating) || 0);
      setEaseOfUse(Number(editData.ease_of_use) || 0);
      setCustomerSupport(Number(editData.customer_support) || 0);
      setValueForMoney(Number(editData.value_for_money) || 0);
      setFeaturesTools(Number(editData.feature_tools) || 0);
      setReview(editData.content || "");
    } else if (!modalOpen && !editData) {
      setRating(0);
      setEaseOfUse(0);
      setCustomerSupport(0);
      setValueForMoney(0);
      setFeaturesTools(0);
      setReview("");
    }
  }, [editData, modalOpen]);

  useEffect(() => {
    const ratings = [
      easeOfUse,
      customerSupport,
      valueForMoney,
      featuresTools,
    ].filter((r) => r > 0);
    if (ratings.length > 0) {
      const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      setRating(parseFloat(avg.toFixed(1)));
    } else {
      setRating(0);
    }
  }, [easeOfUse, customerSupport, valueForMoney, featuresTools]);

  const wordCount = review.trim().split(/\s+/).filter(Boolean).length;
  const isSubmitDisabled =
    rating === 0 ||
    wordCount < 10 ||
    easeOfUse === 0 ||
    customerSupport === 0 ||
    valueForMoney === 0 ||
    featuresTools === 0;

  const resetForm = () => {
    setRating(0);
    setReview("");
    setCustomerSupport(0);
    setEaseOfUse(0);
    setFeaturesTools(0);
    setValueForMoney(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      rating,
      review,
      tool_name: toolTitle,
      tool_id: toolId,
      ease_of_use: easeOfUse,
      customer_support: customerSupport,
      value_for_money: valueForMoney,
      features_tools: featuresTools,
    };
    if (!currentUser) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    setLoading(true);

    if (editData) {
      const { status } = await updateReview(editData.id, formData);

      await logUserActivity({
        userId: currentUser.id.toString(),
        action: "Edited a review",
        metadata: {
          service: "review",
          toolId: toolId,
          toolName: toolTitle,
          reviewId: editData.id,
        },
      });

      if (status === 200) {
        refresh();
        resetForm();
        setModalOpen(false);
      }
    } else {
      const { status } = await addReview(
        {
          id: currentUser.id.toString(),
          name: userProfileData?.name || currentUser.name.toString(),
        },
        formData
      );

      await logUserActivity({
        userId: currentUser.id.toString(),
        action: "Submited a review",
        metadata: {
          service: "review",
          toolId: toolId,
          toolName: toolTitle,
        },
      });

      if (status === 200) {
        handleDailyClaim("review")
          .then((res) => {
            if (res?.status === 409) {
              handleStatus(409);
            } else {
              refetchPoint();
              setConfetti(true);
              setShowModal(true);
            }
          })
          .catch((err) => {
            console.error("Reward claim failed", err);
          });

        refetchUserProfile();
        refresh();
        resetForm();
        setModalOpen(false);
      }
    }

    setLoading(false);
  };

  const ratingTexts = [
    "",
    "Poor - Needs improvement",
    "Fair - Could be better",
    "Good - Met expectations",
    "Great - Very satisfied",
    "Excellent - Perfect experience",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  return (
    <Modal
      width="100%"
      styles={{
        body: {
          padding: 0,
          margin: 0,
          overflow: "hidden",
        },
        content: {
          padding: 0,
          borderRadius: 12,
          overflow: "hidden",
          background: "linear-gradient(90deg, #9013FE, #FF8687)",
        },
      }}
      style={{ top: 20, maxWidth: 500, margin: "0 auto", padding: "8px" }}
      open={modalOpen}
      footer={null}
      onCancel={() => setModalOpen(false)}
    >
      <div className="w-full rounded-xl mt-1 bg-white p-[40px]">
        <div className="text-center mb-[20px]">
          <h1 className="text-2xl font-bold mb-[8px] text-[#1f2937]">
            Share Your Experience on {toolTitle}
          </h1>
          <p className="custom-paragraph">We value your honest feedback</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-[12px] text-[15px] font-semibold text-center">
            How would you rate your experience?
          </label>
          <div className="">
            <div className="flex justify-center text-[24px] font-bold text-[#9013FE]">
              {rating > 0 ? `${rating.toFixed(1)}` : ""}
            </div>
            <div className="text-sm font-medium h-fit text-center text-[#6b7280]">
              {rating > 0 ? ratingTexts[Math.round(rating)] : ""}
            </div>
          </div>
          <hr className="mt-2" />
          <div className="mb-[12px] mt-2">
            <p className="text-[15px] font-semibold text-center">Ease of Use</p>
            <div className="custom-rate flex justify-center">
              <Rate
                value={easeOfUse}
                style={{ fontSize: 25 }}
                onChange={setEaseOfUse}
              />
            </div>
          </div>

          <div className="mb-[12px]">
            <p className="text-[15px] font-semibold text-center">
              Customer Support
            </p>
            <div className="custom-rate flex justify-center">
              <Rate
                value={customerSupport}
                style={{ fontSize: 25 }}
                onChange={setCustomerSupport}
              />
            </div>
          </div>

          <div className="mb-[12px]">
            <p className="text-[15px] font-semibold text-center">
              Value for Money
            </p>
            <div className="custom-rate flex justify-center">
              <Rate
                value={valueForMoney}
                style={{ fontSize: 25 }}
                onChange={setValueForMoney}
              />
            </div>
          </div>

          <div className="mb-[12px]">
            <p className="text-[15px] font-semibold text-center">
              Feature Tools
            </p>
            <div className="custom-rate flex justify-center">
              <Rate
                value={featuresTools}
                style={{ fontSize: 25 }}
                onChange={setFeaturesTools}
              />
            </div>
          </div>
          <label
            htmlFor="review"
            className="block my-[12px] text-[15px] font-semibold text-center"
          >
            Tell us more about your experience (minimum 10 words)
          </label>
          <textarea
            value={review}
            onChange={handleChange}
            className="h-[140px] text-base p-[15px] border-[#e5e7eb] resize-y bg-[#f9fafb] text-[15px] text-[#1f2937] transition-all duration-200 ease-linear rounded-xl w-full"
            placeholder="What did you like or what could be improved?"
            required
          ></textarea>
          <div
            className={`${
              wordCount < 10 ? "text-[#ef4444]" : "text-[#6b7280]"
            } text-[13px] mt-[5px] text-right`}
          >
            {wordCount} words{" "}
            {wordCount < 10 && <span>(minimum 10 required)</span>}
          </div>
          <button
            className={`${
              isSubmitDisabled
                ? "bg-[#e5e7eb] cursor-not-allowed"
                : "bg-[#9013FE] hover:bg-[#7a0dd6] hover:translate-y-[-2px] hover:shadow-[0_1px_2px_rgba(0,_0,_0,_0.05)]"
            } text-base text-white p-[14px] border-none rounded-xl mt-[10px] font-semibold w-full flex justify-center gap-2 items-center transition-all duration-200 ease-linear`}
            type="submit"
            disabled={isSubmitDisabled}
          >
            {loading ? (
              editData ? (
                "Updatting..."
              ) : (
                "Submitting..."
              )
            ) : (
              <>
                <SendOutlinedIcon
                  sx={{ transform: "rotate(-30deg)", marginTop: "-4px" }}
                />
                {editData ? "Update Review" : "Submit Review"}
              </>
            )}
          </button>
        </form>
        <div className="flex justify-center mt-[20px] text-sm text-[#6b7280] transition-all duration-200 ease-linear hover:text-[#9013FE]">
          <button type="button" onClick={() => setModalOpen(false)}>
            <KeyboardBackspaceOutlinedIcon
              sx={{ marginRight: "6px" }}
              fontSize="small"
            />
            Back to Reviews
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewToolsModal;
