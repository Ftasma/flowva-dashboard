import supabase from "../../lib/supabase";

type ReviewData = {
  rating: number;
  review: string;
  tool_id: string;
  tool_name: string;
  ease_of_use: number;
  customer_support: number;
  value_for_money: number;
  features_tools: number;
};

export const addReview = async (
  user: { id: string; name: string },
  reviewData: ReviewData
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add_review`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: user.id,
      user_name: user.name,
      tool_id: reviewData.tool_id,
      tool_name: reviewData.tool_name,
      content: reviewData.review,
      rating: reviewData.rating,
      ease_of_use: reviewData.ease_of_use,
      customer_support: reviewData.customer_support,
      value_for_money: reviewData.value_for_money,
      feature_tools: reviewData.features_tools,
    }),
  });

  const result = await res.json();

  return {
    status: res.status,
    ...result,
  };
};

export const updateReview = async (
  reviewId: string,
  reviewData: ReviewData
): Promise<
  { status: number; message: string } | { status: number; error: string }
> => {
  const { error } = await supabase
    .from("tool_reviews")
    .update({
      content: reviewData.review,
      rating: reviewData.rating,
      ease_of_use: reviewData.ease_of_use,
      customer_support: reviewData.customer_support,
      value_for_money: reviewData.value_for_money,
      feature_tools: reviewData.features_tools,
    })
    .eq("id", reviewId);

  if (error) {
    console.error("Failed to update review:", error.message);
    return {
      status: 500,
      error: "Failed to update review. Please try again later.",
    };
  }

  return {
    status: 200,
    message: "Review updated successfully.",
  };
};
