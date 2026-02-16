import React, { useState } from "react";
import FlowvaLogo from "../../assets/flowva-logo.svg";
import { useNavigate } from "react-router-dom";

interface UninstallFeedbackProps {
  onSubmit?: (feedback: { reason: string; additionalFeedback: string }) => void;
}

const UninstallFeedback: React.FC<UninstallFeedbackProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState<string>("");
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleReasonChange = (selectedReason: string) => {
    setReason(selectedReason);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit feedback data
      if (onSubmit) {
        onSubmit({
          reason,
          additionalFeedback,
        });
      }

      // Optional: send to backend
      // const response = await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     reason,
      //     additionalFeedback
      //   }),
      // });

      // Redirect to homepage or thank you page
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <nav className="w-full bg-white py-4 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center mr-60">
            <img src={FlowvaLogo} alt="Flowva logo" className="h-auto w-auto" />
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <button className="font-semibold text-[#E01E5A] border-2 border-[#E01E5A] px-8 py-4 rounded-full hover:bg-opacity-90 transition-colors text-2xl ml-10">
              + Reinstall Extension
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow mx-auto px-4 py-12 max-w-xl relative z-10">
        <div className="bg-white rounded-xl p-8">
          <div className="text-left mb-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              We're Sorry to See You Go!
            </h2>
          </div>
          <div className="text-left mb-8 max-w-md mx-auto">
            <p className="text-gray-600">
              We'd love to understand your experience. <br />
              Please take a moment to share your feedback.
            </p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg mb-3 text-gray-700">
                  <span className="font-bold">What happened?</span> (Select an
                  option)
                </h2>
                <div className="space-y-2">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="reason"
                      value="no-longer-need"
                      checked={reason === "no-longer-need"}
                      onChange={() => handleReasonChange("no-longer-need")}
                      className="mt-0.5"
                    />
                    <span className="text-gray-700">I no longer need it</span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="reason"
                      value="not-expected"
                      checked={reason === "not-expected"}
                      onChange={() => handleReasonChange("not-expected")}
                      className="mt-0.5"
                    />
                    <span className="text-gray-700">
                      It wasn't what I expected
                    </span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="reason"
                      value="technical-issues"
                      checked={reason === "technical-issues"}
                      onChange={() => handleReasonChange("technical-issues")}
                      className="mt-0.5"
                    />
                    <span className="text-gray-700">
                      I had technical issues
                    </span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="reason"
                      value="prefer-another"
                      checked={reason === "prefer-another"}
                      onChange={() => handleReasonChange("prefer-another")}
                      className="mt-0.5"
                    />
                    <span className="text-gray-700">I prefer another tool</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Any additional feedback?
                </h2>
                <textarea
                  value={additionalFeedback}
                  onChange={(e) => setAdditionalFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9013FE]"
                  placeholder="Please share any thoughts on how we could improve..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-[#9013FE] text-white px-8 py-3 rounded-full font-medium
                    ${
                      submitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-opacity-90"
                    }`}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UninstallFeedback;
