import supabase from "../../lib/supabase";

export const logUserActivity = async ({
  userId,
  action,
  metadata = {},
}: {
  userId: string;
  action: string;
  metadata?: Record<string, any>;
}) => {
  const { error } = await supabase.from("user_activities").insert([
    {
      user_id: userId,
      action,
      metadata,
    },
  ]);

  if (error) {
    console.error("Failed to log activity:", error.message);
  }
};