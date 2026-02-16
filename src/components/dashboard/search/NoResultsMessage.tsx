import React from "react";

/**
 * Message shown when no search results are found
 */
const NoResultsMessage: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center py-8 md:py-16 mt-8 md:mt-16 px-4">
      <p className="text-base md:text-xl font-medium text-center">
        No Result Found
      </p>
    </div>
  );
};

export default NoResultsMessage;
