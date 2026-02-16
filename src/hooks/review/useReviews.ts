import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

export interface ReviewsData {
  id: string;
  content: string;
  tool_name: string;
  default_tools: { description: string; title?: string, category: string[] };
  user_name: string;
  last_name: string;
  user_id: string;
  rating: string;
  ease_of_use: string;
  customer_support: string;
  value_for_money: string;
  feature_tools: string;
  helpful_count: number;
  created_at: string;
  user_profiles?: {
    profile_pic: string;
  };
}

//helper function
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

export function useReviews(
  tool_id: string | undefined,
  currentUserId?: string
) {
  const [reviews, setReviews] = useState<ReviewsData[]>([]);
  const [likedReviewIds, setLikedReviewIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cumulativeRatings, setCumulativeRatings] = useState({
    avgRating: 0,
    avgEaseOfUse: 0,
    avgCustomerSupport: 0,
    avgValueForMoney: 0,
    avgFeatureTools: 0,
  });

  const fetchReviews = async () => {
    if (!tool_id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("tool_reviews")
      .select(
        `
        *,
        default_tools (
          description,
          title,
          category
        ),  user_profiles (
      profile_pic, last_name
    )
      `
      )
      .eq("tool_id", tool_id.trim())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setCumulativeRatings({
        avgRating: 0,
        avgEaseOfUse: 0,
        avgCustomerSupport: 0,
        avgValueForMoney: 0,
        avgFeatureTools: 0,
      });
    } else {
      setReviews(data || []);
      setCumulativeRatings(calculateCumulativeRatings(data || []));
    }

    setLoading(false);
  };

  const fetchLikedReviews = async () => {
    if (!currentUserId) {
      setLikedReviewIds([]);
      return;
    }

    const { data, error } = await supabase
      .from("review_likes")
      .select("review_id")
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Error fetching liked reviews:", error);
      setLikedReviewIds([]);
    } else {
      setLikedReviewIds(data?.map((item) => item.review_id) || []);
    }
  };

  const fetchHelpfulCount = async (review_id: string) => {
    const { data, error } = await supabase
      .from("tool_reviews")
      .select("helpful_count")
      .eq("id", review_id)
      .single();

    if (error) {
      console.error("Error fetching helpful_count:", error);
      return;
    }

    setReviews((prev) =>
      prev.map((review) =>
        review.id === review_id
          ? { ...review, helpful_count: data.helpful_count }
          : review
      )
    );
  };

  useEffect(() => {
    fetchReviews();
  }, [tool_id]);

  useEffect(() => {
    fetchLikedReviews();
  }, [currentUserId]);

  return {
    reviews,
    likedReviewIds,
    loading,
    cumulativeRatings,
    refetch: fetchReviews,
    fetchHelpfulCount,
    refetchLikedReviews: fetchLikedReviews,
  };
}
