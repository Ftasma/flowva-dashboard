import supabase from "../lib/supabase";

export const deleteItem = async (
  userId: string,
  target: "collections" | "library_tools" | "collection_has_tools",
  id: string,
  reason = "user_deleted"
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soft_delete_items`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, target, id, reason }),
  });

  const json = await res.json();
  return {
    status: res.status,
    ...json,
  };
};
