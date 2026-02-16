import dayjs from "dayjs";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StarRating({ rating }: { rating: number }) {
  // Make sure rating is between 0 and 5 (or your max)
  const maxStars = 5;
  const fullStars = Math.round(rating); // rounds to nearest integer

  // Create an array of stars (★ or ☆)
  const stars = Array.from({ length: maxStars }, (_, i) =>
    i < fullStars ? "★" : "☆"
  ).join("");

  return <div className="text-[1.125rem] text-[#eab308]">{stars}</div>;
}

export const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import supabase from "../lib/supabase";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

export const RatingCircle = ({ rating }: { rating: number }) => {
  const percentage = (rating / 5) * 100;
  const angle = (360 * percentage) / 100;

  const circleStyle = {
    background: `conic-gradient(#9013fe ${angle}deg, #e5e7eb ${angle}deg)`,
  };

  return (
    <div
      className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center text-2xl font-bold text-[#9013fe] mb-3"
      style={circleStyle}
    >
      <div className="absolute inset-2 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-[#9013fe]">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
};

export const fetchUserCurrency = async (): Promise<string> => {
  try {
    const { data } = await supabase.functions.invoke("ip_api");
    return data.currency || "USD"; // fallback to USD
  } catch (error) {
    console.error("Failed to fetch user currency:", error);
    return "USD"; // fallback on error
  }
};

export interface UserLocation {
  city: string;
  country: string;
  flag: string;
  country_code: string;
  country_code_iso3: string;
  continent_code: string;
}

export const fetchUserLoginLocation =
  async (): Promise<UserLocation | null> => {
    try {
      const { data } = await supabase.functions.invoke("ip_api");

      return {
        city: data.city,
        country: data.country_name,
        flag: `https://flagcdn.com/${data.country_code.toLowerCase()}.svg`,
        country_code: data.country_code,
        country_code_iso3: data.country_code_iso3,
        continent_code: data.continent_code,
      };
    } catch (error) {
      console.error("Failed to fetch user location:", error);
      return null;
    }
  };

export const extractStoragePath = (publicUrl: string) => {
  const parts = publicUrl.split("/storage/v1/object/public/avatars/");
  return parts[1] || null;
};

export const storeReferralCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");

  if (ref) {
    localStorage.setItem("referral_code", ref);
  }
};

export const getNextBillingDate = (
  startDate: string,
  billingCycle: string
): string => {
  switch (billingCycle) {
    case "monthly":
      return dayjs(startDate).add(1, "month").format("YYYY-MM-DD");
    case "quarterly":
      return dayjs(startDate).add(3, "month").format("YYYY-MM-DD");
    case "annual":
      return dayjs(startDate).add(1, "year").format("YYYY-MM-DD");
    default:
      return startDate;
  }
};

export const formatPrevRange = (prevRange?: { start: string; end: string }) => {
  if (!prevRange) return "";
  const start = new Date(prevRange.start);
  const end = new Date(prevRange.end);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  
  if (start.toDateString() === end.toDateString()) {
    return `on ${start.toLocaleDateString(undefined, options)}`;
  }
  return `from ${start.toLocaleDateString(undefined, options)} to ${end.toLocaleDateString(undefined, options)}`;
};
