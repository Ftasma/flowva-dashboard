import { useState, useEffect } from "react";
import supabase from "../lib/supabase";

interface Subscription {
  id: string;
  user_id: string;
  user_type: "free" | "pro" | "teams";
  status: string;
  renewal_date: string | null;
  created_at: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubscription(null);
          setLoading(false);
          return;
        }

        // Query subscriptions table
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (error) {
          // If no subscription found, create a default free one
          if (error.code === "PGRST116") {
            const { data: newSubscription, error: insertError } = await supabase
              .from("subscriptions")
              .insert([{
                user_id: user.id,
                user_type: "free",
                status: "active"
              }])
              .select()
              .single();

            if (!insertError && newSubscription) {
              setSubscription(newSubscription as Subscription);
            } else {
              console.error("Error creating default subscription:", insertError);
            }
          } else {
            console.error("Error fetching subscription:", error);
          }
        } else if (data) {
          setSubscription(data as Subscription);
        }
      } catch (err) {
        console.error("Unexpected error in useSubscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Function to refetch subscription data
  const refetch = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSubscription(null);
        return;
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (!error && data) {
        setSubscription(data as Subscription);
      }
    } catch (err) {
      console.error("Error refetching subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return { subscription, loading, refetch };
}