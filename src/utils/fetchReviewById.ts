import supabase from "../lib/supabase";
import { ReviewsData } from "../hooks/review/useReviews";

// Reuse your existing function
const calculateCumulativeRatings = (reviews: ReviewsData[]) => {
  if (reviews.length === 0) {
    return {
      avgRating: 0,
      avgEaseOfUse: 0,
      avgCustomerSupport: 0,
      avgValueForMoney: 0,
      avgFeatureTools: 0,
    };
  }

  const totalRating = reviews.reduce((acc, r) => acc + parseFloat(r.rating), 0);
  const totalEaseOfUse = reviews.reduce(
    (acc, r) => acc + parseFloat(r.ease_of_use),
    0
  );
  const totalCustomerSupport = reviews.reduce(
    (acc, r) => acc + parseFloat(r.customer_support),
    0
  );
  const totalValueForMoney = reviews.reduce(
    (acc, r) => acc + parseFloat(r.value_for_money),
    0
  );
  const totalFeatureTools = reviews.reduce(
    (acc, r) => acc + parseFloat(r.feature_tools),
    0
  );

  const count = reviews.length;

  return {
    avgRating: parseFloat((totalRating / count).toFixed(1)),
    avgEaseOfUse: parseFloat((totalEaseOfUse / count).toFixed(1)),
    avgCustomerSupport: parseFloat((totalCustomerSupport / count).toFixed(1)),
    avgValueForMoney: parseFloat((totalValueForMoney / count).toFixed(1)),
    avgFeatureTools: parseFloat((totalFeatureTools / count).toFixed(1)),
  };
};

export async function fetchReviewsByToolId(toolId: string) {
  const trimmedToolId = toolId.trim();

  
  const { data: reviewData, error: reviewError } = await supabase
    .from("tool_reviews")
    .select(
      `
      *,
      default_tools (
        description,
        title,
        category
      ),
      user_profiles (
        profile_pic
      )
    `
    )
    .eq("tool_id", trimmedToolId)
    .order("created_at", { ascending: false });

  if (reviewError) throw new Error(reviewError.message);

  const reviews: ReviewsData[] = reviewData || [];
  const cumulativeRatings = calculateCumulativeRatings(reviews);

  
  const { data: toolMeta, error: toolError } = await supabase
    .from("default_tools")
    .select("title")
    .eq("id", trimmedToolId)
    .single();

  if (toolError) throw new Error(toolError.message);

  return {
    reviews,
    cumulativeRatings,
    toolTitle: toolMeta?.title ?? "Untitled Tool",
  };
}
