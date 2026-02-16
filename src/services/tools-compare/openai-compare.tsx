import supabase from "../../lib/supabase";
type AIComparisonResult = {
  tools: {
    name: string;
    overview: string;
    pricing: string;
    bestFor: string;
    pros: string[];
    cons: string[];
  }[];
  featureMatrix: {
    feature: string;
    [toolName: string]: string; // dynamic keys like Zoom, ChatGPT
  }[];
  verdict: string;
};
export const fetchAIComparison = async (
  tools: string[]
): Promise<{ status: number; result: AIComparisonResult | null }> => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return { status: 401, result: null };

  const token = data.session.access_token;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tools-compare`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toolNames: tools }),
      }
    );

    const result = await res.json();
    return {
      status: res.status,
      result: result?.result ?? null,
    };
  } catch (e) {
    console.error("Error calling AI comparison function:", e);
    return { status: 500, result: null };
  }
};