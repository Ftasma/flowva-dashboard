import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { useCurrentUser } from "./CurrentUserContext";

interface StreakContextType {
  streak: number;
  isClaimed: boolean;
  loading: boolean;
  totalPoints: number;
  claimToday: () => Promise<void>;
  refetchStreak: () => Promise<void>;
  // spin: boolean;
  // setSpin: React.Dispatch<React.SetStateAction<boolean>>;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser: user } = useCurrentUser();
  const [streak, setStreak] = useState(0);
  const [isClaimed, setIsClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  // const [spin, setSpin] = useState(false);

  // Global UTC today string: "YYYY-MM-DD"
  const todayDate = new Date();
  const today = todayDate.toISOString().split("T")[0];

  const fetchStreak = async () => {
    if (!user) return;
    setLoading(true);

    const { data: streakData } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("total_points")
      .eq("user_id", user.id)
      .single();

    if (profileData?.total_points != null) {
      setTotalPoints(profileData.total_points);
    }

    if (streakData) {
      const lastClaimed = streakData.last_claimed_date;

      const yesterday = new Date(todayDate);
      yesterday.setUTCDate(todayDate.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const shouldReset = lastClaimed !== today && lastClaimed !== yesterdayStr;

      if (shouldReset) {
        await supabase
          .from("user_streaks")
          .update({ current_streak: 0, last_claimed_date: null })
          .eq("user_id", user.id);

        setStreak(0);
        setIsClaimed(false);
      } else {
        setStreak(streakData.current_streak);
        setIsClaimed(lastClaimed === today);
      }
    } else {
      await supabase
        .from("user_streaks")
        .insert([
          { user_id: user.id, current_streak: 0, last_claimed_date: null },
        ])
        .select()
        .single();

      setStreak(0);
      setIsClaimed(false);
    }

    setLoading(false);
  };

  const claimToday = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      const lastDate = data.last_claimed_date;
      const yesterday = new Date(todayDate);
      yesterday.setUTCDate(todayDate.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const todayStr = today;

      let newStreak = 1;

      if (lastDate === yesterdayStr) {
        newStreak = data.current_streak + 1;
      } else if (lastDate === todayStr) {
        return;
      } else {
        await supabase
          .from("user_streaks")
          .update({ current_streak: 0, last_claimed_date: null })
          .eq("user_id", user.id);
      }

      const pointsToAdd = 5;
      // const pointsToAdd = newStreak > 6 ? 10 : 5;
      // const shouldSpin = newStreak % 7 === 0;

      await supabase.from("user_point_events").insert({
        user_id: user.id,
        source: "streak",
        points: pointsToAdd,
      });

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("total_points")
        .eq("user_id", user.id)
        .single();

      const currentPoints = profileData?.total_points ?? 0;

      await supabase
        .from("user_profiles")
        .update({ total_points: currentPoints + pointsToAdd })
        .eq("user_id", user.id);

      await supabase
        .from("user_streaks")
        .update({ current_streak: newStreak, last_claimed_date: todayStr })
        .eq("user_id", user.id);

      setStreak(newStreak);
      setIsClaimed(true);

      setTotalPoints((prev) => prev + pointsToAdd);
      // setSpin(shouldSpin);
    }
  };

  useEffect(() => {
    if (user) fetchStreak();
  }, [user]);

  return (
    <StreakContext.Provider
      value={{
        streak,
        isClaimed,
        // spin,
        // setSpin,
        loading,
        totalPoints,
        claimToday,
        refetchStreak: fetchStreak,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
};
