import { useEffect, useState } from "react";
import Flowva_icon from "../../assets/flowva_icon.png";
import UsersSVG from "./usersSVG";

export default function EventBanner() {
  // Set your event date and time (use 24-hour format)
  const eventDate = new Date("2025-10-23T18:30:00+01:00");

  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      // Convert milliseconds to days
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysRemaining(days > 0 ? days : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60 * 60 * 1000); // update hourly

    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="rounded-[16px] bg-[#111111] p-[20px] w-full min-h-[180px] space-y-2 h-fit">
      <div className="flex justify-between items-center">
        {/* Left - Flowvahub badge */}
        <div className="rounded-[100px] bg-[#9013FE3D] p-[6px_8px] flex items-center gap-2">
          <div className="bg-white p-[1px] rounded-full overflow-hidden relative h-[25px] w-[25px]">
            <img
              src={Flowva_icon}
              alt="flowva icon"
              className="object-center object-fit w-full h-full"
            />
          </div>
          <p className="text-sm text-white font-manrope font-semibold">Flowvahub</p>
        </div>

        {/* Right - Countdown badge */}
        <div className="rounded-[100px] bg-[#FFE0E0] p-[6px_8px] flex items-center gap-2">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="5" fill="#9B0000" />
          </svg>
          <p className="text-sm text-[#800000] font-semibold">
            {daysRemaining !== null
              ? daysRemaining > 0
                ? `${daysRemaining} day${
                    daysRemaining > 1 ? "s" : ""
                  } remaining`
                : "Event is live!"
              : "Loading..."}
          </p>
        </div>
      </div>

      <h2 className="font-bold text-[24px] text-white font-manrope">
        Want to work for global startups?
      </h2>
      <p className="font-manrope font-semibold text-sm text-[#CDCDCD]">
        Discover what they seek in remote talents.
      </p>

      <div className="flex justify-between">
        <div className="w-fit flex font-manrope flex-col gap-1">
          <h3 className="text-[#CDCDCD] font-semibold">Hosted by:</h3>
          <UsersSVG />
        </div>
        <div className="flex font-bold gap-3 items-center justify-self-end w-fit">
          <a
            target="_blank"
            href="https://luma.com/event/evt-UpymtyNOfrb85L2"
            data-luma-event-id="evt-UpymtyNOfrb85L2"
            data-luma-action="checkout"
            className="text-black bg-white rounded-[100px] p-[10px_24px] text-sm font-manrope font-semibold"
          >
            Book a Seat
          </a>
        </div>
      </div>
    </div>
  );
}
