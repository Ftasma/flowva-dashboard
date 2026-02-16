import supabase from "./supabase";

export async function notifyPendingShares() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: shares } = await supabase
    .from("shared_items")
    .select("id, token, item_id, item_type, accepted, claimed, sender_id")
    .eq("recipient_email", user.email)
    .eq("accepted", false);

  if (!shares?.length) return;

  for (const s of shares) {
    const { data: senderProfile } = await supabase
      .from("user_profiles")
      .select("name")
      .eq("user_id", s.sender_id)
      .maybeSingle();

    const senderName = senderProfile?.name || "Someone";

    const title = s.item_type === "tool" ? "Shared Tool" : "Shared Collection";
    const link = `/share/${s.token}`;

    await supabase.from("notifications").upsert(
      {
        user_id: user.id,
        type: "share_invite",
        content: JSON.stringify({
          title,
          body: `A ${s.item_type} was shared with you by ${senderName}`,
          token: s.token,
          item_id: s.item_id,
          item_type: s.item_type,
          link,
          senderName,
        }),
        related_token: s.token,
        read: false,
      },
      {
        onConflict: "user_id,type,related_token",
      }
    );
  }
}
