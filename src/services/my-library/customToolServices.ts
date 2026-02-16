import supabase from "../../lib/supabase";

export type ManualAddTool = {
  toolName: string;
  category: string[];
  currency?: string;
  websiteURL: string;
  description: string;
};

export const addCustomToolAndLibrary = async (
  userId: string,
  customToolData: ManualAddTool
) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const url = `${
    import.meta.env.VITE_SUPABASE_URL
  }/functions/v1/add_custom_tools`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
      tool_name: customToolData.toolName,
      description: customToolData.description,
      category: customToolData.category,
      website_url: customToolData.websiteURL,
    }),
  });

  const result = await res.json();

 return {
  status: res.status,
  toolId: result.tool_id,
  libraryToolId: result.library_tool_id,
  error: result.error,
  ...result
};
};

export const useCreateCustomTool = () => {
  const createCustomTool = async (
    userId: string,
    customToolData: ManualAddTool
  ) => {
    const { data, error } = await supabase
      .from("custom_tools")
      .insert({
        title: customToolData.toolName,
        description: customToolData.description,
        category: Array.isArray(customToolData.category)
          ? customToolData.category
          : [customToolData.category],
        url: customToolData.websiteURL?.trim() || "",
        is_ai_tool: true,
        user_id: userId,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Failed to create custom tool: ${error.message}`);
    }

    return {
      success: true,
      tool_id: data.id,
      data,
    };
  };

  return { createCustomTool };
};
