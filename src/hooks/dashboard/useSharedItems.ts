import { useState, useEffect, useCallback } from "react";
import supabase from "../../lib/supabase";

export interface SharedItem {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  recipient_email: string | null;
  item_id: string;
  item_type: "tool" | "collection";
  shared_via: string;
  token: string;
  created_at: string;
  accepted: boolean;
  accepted_at: string | null;
}

export type TokenProcessed = {
  success: boolean;
  itemType?: "tool" | "collection";
  error?: string;
} | null;

export function useSharedWithMe() {
  const [items, setItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // for token-based shares
  const [processingToken] = useState(false);
  const [tokenProcessed, setTokenProcessed] = useState<TokenProcessed>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("shared_items")
      .select("*")
      .eq("recipient_id", user.id)
      .eq("claimed", true)
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as SharedItem[]);
    setLoading(false);
  }, []);

  const clearTokenProcessed = () => setTokenProcessed(null);

  useEffect(() => {
    fetchItems();
    // TODO: implement token handling logic here, setting processingToken / tokenProcessed
  }, [fetchItems]);

  return {
    items,
    loading,
    refetch: fetchItems,
    processingToken,
    tokenProcessed,
    clearTokenProcessed,
  };
}

export function useSharedByMe() {
  const [items, setItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("shared_items")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as SharedItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    refetch: fetchItems,
  };
}
