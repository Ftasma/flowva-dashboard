import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import React, { useState } from "react";
import { useAllUsers } from "../../../context/adminContext/allUsersContext";

const UsersPagination = () => {
  const {
    page,
    perPage,
    total,
    fetchUsers,
    status,
    search,
    sortColumn,
    sortOrder,
    loading,
  } = useAllUsers();

  const [pageInput, setPageInput] = useState(String(page));
  const totalPages = Math.ceil(total / perPage) || 1;

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage, perPage, status, search, sortColumn, sortOrder);
      setPageInput(String(newPage));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = Number(pageInput);
      goToPage(newPage);
    }
  };

  return (
    <div className="flex  items-center justify-end mt-2 text-sm text-[#666]">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1 || loading}
        className={`hover:text-[#9013fe] text-sm mr-1 transition ${
          page <= 1 || loading ? "opacity-40 cursor-not-allowed" : ""
        }`}
      >
        <ChevronLeftCircle size={20} />
      </button>

      <span className="flex gap-2 items-center">
        Page{" "}
        <input
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border text-black border-[#e0e0e0] outline-none w-10 pl-2 rounded-md"
        />{" "}
        of {totalPages}
      </span>

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages || loading}
        className={`hover:text-[#9013fe] text-sm ml-1 transition ${
          page >= totalPages || loading
            ? "opacity-40 cursor-not-allowed"
            : ""
        }`}
      >
        <ChevronRightCircle size={20} />
      </button>
    </div>
  );
};

export default UsersPagination;
