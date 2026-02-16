import React from "react";
import PurpleSearch from "../../../assets/purple-search.svg";

interface SearchComponentProps {
  onSearch?: (query: string) => void;
  currentQuery?: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  currentQuery = "",
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-2 sm:my-3 md:my-4 sm:px-2 px-2">
      <div className="w-full h-fit py-3 sm:py-4 md:py-6 px-4 sm:px-6 md:px-8 rounded-2xl flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl pt-2 font-semibold-bold text-black mb-2 sm:mb-3 md:mb-4 text-center">
          Find The Right Tools
        </h2>

        <div className="relative w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <input
            type="text"
            value={currentQuery}
            onChange={handleSearchChange}
            placeholder="Search tools or categories..."
            className="w-full h-[45px] bg-[#E9ECEF] placeholder:text-[#00000080] rounded-full py-2 sm:py-4 px-4 sm:px-6 text-md sm:text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="absolute lg:right-[2px] right-1 lg:-mt-[1px] top-1/2 transform -translate-y-1/2 cursor-pointer">
            <img
              src={PurpleSearch}
              alt="Search"
              className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
