import supabase from "../lib/supabase";

export const addToCollection = async (
  userId: string,
  toolId: string,
  collectionId: string,
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add_to_collection`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, tool_id: toolId, collection_id: collectionId }),
  });

  const json = await res.json();
  return {
    status: res.status,
    ...json,
  };
};
