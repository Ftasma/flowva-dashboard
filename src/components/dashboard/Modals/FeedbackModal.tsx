import { useState, useEffect } from "react";
import { Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import useUserProfile from "../../../hooks/auth/useUserProfile";
import FeedbackService from "../../../services/feeedback.service";
import "./feedbackmodal.css";
import { useCurrentUser } from "../../../context/CurrentUserContext";

export interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { userProfile, loading: userProfileLoading } = useUserProfile();
  const { currentUser, loading: currentUserLoading } = useCurrentUser();

  const loading = userProfileLoading || currentUserLoading;
  const userName = userProfile?.name || currentUser?.name || "User";
  const userId = currentUser?.id;

  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  const resetForm = (): void => {
    setFeedbackText("");
    setIsSubmitted(false);
    setError(null);
    setIsSubmitting(false);
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (): Promise<void> => {
    if (!feedbackText.trim()) {
      setError("Please enter your feedback before submitting.");
      return;
    }

    if (!userId) {
      setError("User not found. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the updated feedback service
      const result = await FeedbackService.submitFeedback({
        user_id: userId,
        content: feedbackText.trim(),
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit feedback");
      }

      setIsSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error: unknown) {
      console.error("Error submitting feedback:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit feedback. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      width={500}
      className="feedback-modal"
      maskStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div>
        <div className="modal-header">
          <div className="modal-title">
            {loading
              ? "Hi there! We'd love to hear from you."
              : `Hi ${userName}! We'd love to hear from you.`}
          </div>
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <CheckCircleFilled className="success-icon" />
            <h3 className="success-title">Thank You!</h3>
            <p className="success-text">
              We appreciate your feedback and will use it to improve our
              product.
            </p>
            <div className="success-emoji">
              <span>✨</span>
            </div>
          </div>
        ) : (
          <div className="feedback-form">
            <p className="feedback-description">
              Got suggestions on how we can improve? Share your feedback with
              us. We'll get back to you.
            </p>
            <textarea
              className="feedback-textarea"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your feedback here..."
              disabled={isSubmitting}
            />
            {error && <div className="feedback-error">{error}</div>}
          </div>
        )}

        <div className="modal-footer">
          {!isSubmitted && (
            <>
              <button
                onClick={handleClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={isSubmitting || !feedbackText.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
