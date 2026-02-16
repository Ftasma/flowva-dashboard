import supabase from "../../lib/supabase";

export const toggleLike = async (reviewId: string, userId: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/toggle_like`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      review_id: reviewId,
      user_id: userId,
    }),
  });

  const result = await res.json();
  return {
    status: res.status,
    ...result,
  };
};
