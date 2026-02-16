import supabase from "../../lib/supabase";

export const addToLibrary = async (userId: string, toolId: string) => {
  // use fetch instead of invoke to get full status response
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  const url = `${
    import.meta.env.VITE_SUPABASE_URL
  }/functions/v1/add_to_library`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      tool_id: toolId,
      is_custom: false,
    }),
  });

  const json = await res.json();
 return {
  status: res.status,
  toolId: json.tool_id,
  libraryToolId: json.library_tool_id,
  error: json.error,
  ...json
};
};
