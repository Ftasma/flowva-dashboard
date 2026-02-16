import supabase from "../lib/supabase";


export interface CollectionFormData {
  id?: string;
  userId: any;
  name: string;
  description?: string;
  color: string;
  toolIds: string[];
}

export const createOrUpdateCollection = async (
  userId: string,
  formData: CollectionFormData
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upsert_collection_with_tools`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      ...formData
    }),
  });

  const json = await res.json();
  return {
    status: res.status,
    ...json,
  };
};
