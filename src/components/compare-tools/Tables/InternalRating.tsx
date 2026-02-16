import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { ToolReviewData } from "../../../pages/compare/page";
import { Tooltip } from "antd";
import { StarRating } from "../../../utils/helper";



function InternalRatingTable({toolReviews}: {toolReviews: ToolReviewData[]}) {
      const ratingCategories = [{ key: "avgRating", label: "Rating" }];
  return (
    <div>
      <table className="min-w-full table-auto w-full text-sm shadow-md rounded-xl overflow-hidden border border-gray-200">
        <thead className="bg-[#eef2ff] text-black uppercase text-xs">
          <tr>
            <th className="text-left px-4 py-3 font-semibold"></th>
            {toolReviews.map((arr, index) => (
              <th key={index} className="text-left px-4 py-3 font-semibold">
                <div className="inline-flex items-center gap-1">
                  <span>{arr?.tool_name}</span>
                  {arr.reviews.length < 3 && arr.reviews.length > 0 && (
                    <Tooltip
                      placement="top"
                      overlayInnerStyle={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      title={
                        "This rating is based on limited reviews and may not reflect overall performance."
                      }
                      arrow={true}
                    >
                      <FontAwesomeIcon className="text-xs" icon={Icons.Info} />
                    </Tooltip>
                  )}
                  {arr.reviews.length === 0 && (
                    <Tooltip
                      placement="top"
                      overlayInnerStyle={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      title={"There is no rating for the tool yet"}
                      arrow={true}
                    >
                      <FontAwesomeIcon className="text-xs" icon={Icons.Info} />
                    </Tooltip>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={toolReviews.length + 1}
              className="text-xs italic text-gray-500 px-[16px] py-[12px] bg-[#fefce8]"
            >
              {<FontAwesomeIcon icon={Icons.Info} />} Ratings shown are averages
              provided by our users. Some tools may have fewer ratings, which can
              impact reliability. Hover on "{" "}
              {<FontAwesomeIcon icon={Icons.Info} />}" for more.
            </td>
          </tr>
          <tr className="bg-white">
            <td className="whitespace-nowrap text-[#374151] p-[14px_20px] border-b border-[#e5e7eb]">
              No of User(s)
            </td>
            {toolReviews.map((arr, index) => (
              <td
                className="text-[#374151] p-[14px_20px] border-b border-[#e5e7eb] "
                key={index}
              >
                <div className=" inline-flex items-baseline  gap-2">
                  <FontAwesomeIcon
                    className="text-[#9013FE]"
                    icon={Icons.User}
                  />
                  <span>
                    {arr.reviews.length +
                      " " +
                      (arr.reviews.length > 1 ? "users" : "user")}
                  </span>
                </div>
              </td>
            ))}
          </tr>
          {ratingCategories.map(({ key, label }) => (
            <tr key={key} className="bg-white">
              <td className="whitespace-nowrap text-[#374151] p-[14px_20px] border-b border-[#e5e7eb]">
                {label}
              </td>
              {toolReviews.map((arr, i) => (
                <td
                  key={i}
                  className="text-[#374151] p-[14px_20px] border-b border-[#e5e7eb]"
                >
                  {Number(arr.cumulativeRatings[key]) === 0 ? (
                    <span className="text-gray-400 italic">Nil</span>
                  ) : (
                    <div className="inline-flex items-center gap-1">
                      <StarRating rating={Number(arr.cumulativeRatings[key])} />
                      {Number(arr.cumulativeRatings[key]).toFixed(1)}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InternalRatingTable;
