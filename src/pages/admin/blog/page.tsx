import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "../../../context/SidebarContext";
import { Icons } from "../../../icons";
import { Search } from "lucide-react";
import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthors } from "../../../context/adminContext/blog/fetchAuthorContext";
import { useBlogs } from "../../../hooks/admin/blog/useBlogs";
import { JSX, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ActionModal from "../../../components/dashboard/AdminDashboard/Modals/ActionModal";

interface Filters {
  status: string | null;
  author: string | null;
  dateRange: [string, string] | null;
  search: string;
}

export default function AdminBlog() {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<
    "publish" | "archive" | "draft" | "delete" | "pin"
  >("archive");
  const [selectedId, setSelectedId] = useState("");
  const [pinned, setPinned] = useState(false);
  const { toggleMobileMenu } = useSidebar();
  const { authors } = useAuthors();
  const authorOptions = [
    { value: "all", label: "Author" },
    ...authors.map((author) => ({
      value: author.user_id,
      label: author.name,
    })),
  ];

  const navigate = useNavigate();

  const { RangePicker } = DatePicker;

  const [filters, setFilters] = useState<Filters>({
    status: null,
    author: null,
    dateRange: null,
    search: "",
  });

  const { blogs, pagination, loading, fetchBlogs } = useBlogs({
    page: 1,
    limit: 10,
    ...filters,
  });

  const handleFilterChange = (
    field: keyof Filters,
    value: string | [string, string] | null
  ) => {
    const newFilters: Filters = {
      ...filters,
      [field]: value === "all" ? null : value,
    };
    setFilters(newFilters);
    fetchBlogs({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    fetchBlogs({ ...filters, page: newPage });
  };

  type BlogStatus = "active" | "draft" | "archived";

  const statusTags: Record<BlogStatus, JSX.Element> = {
    active: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99902 0.833008C11.9571 0.833008 15.166 4.04196 15.166 8C15.166 11.958 11.9571 15.167 7.99902 15.167C4.04098 15.167 0.832031 11.958 0.832031 8C0.832031 4.04196 4.04098 0.833008 7.99902 0.833008ZM11.251 5.34668C11.0743 5.0237 10.6687 4.90538 10.3457 5.08203C9.12675 5.74874 8.11915 7.03546 7.44141 8.07324C7.19106 8.45659 6.97685 8.81947 6.80566 9.12695C6.646 8.97204 6.48714 8.83839 6.3457 8.72656C6.16068 8.58028 5.99449 8.46432 5.87305 8.38477L5.66309 8.25391C5.34326 8.0715 4.93534 8.1831 4.75293 8.50293C4.57059 8.82263 4.68241 9.2296 5.00195 9.41211L5.14258 9.5C5.23775 9.56236 5.37049 9.6554 5.51855 9.77246C5.82359 10.0136 6.15321 10.3295 6.36035 10.6758C6.48741 10.8881 6.72167 11.0125 6.96875 10.999C7.21596 10.9854 7.43606 10.8355 7.53906 10.6104L7.60449 10.4736C7.64963 10.3813 7.71673 10.2462 7.80469 10.0801C7.98102 9.74695 8.23804 9.29111 8.55762 8.80176C9.21304 7.79821 10.0714 6.75193 10.9854 6.25195C11.3084 6.07529 11.4276 5.66972 11.251 5.34668Z"
          fill="#14AE5C"
        />
      </svg>
    ),
    draft: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99902 0.833008C11.9571 0.833008 15.166 4.04196 15.166 8C15.166 11.958 11.9571 15.167 7.99902 15.167C4.04098 15.167 0.832031 11.958 0.832031 8C0.832031 4.04196 4.04098 0.833008 7.99902 0.833008ZM10.4707 5.52832C10.2104 5.26798 9.7877 5.26798 9.52734 5.52832L7.99902 7.05762L6.4707 5.5293C6.21034 5.26896 5.78768 5.26894 5.52734 5.5293C5.26739 5.78963 5.26725 6.21144 5.52734 6.47168L7.05566 8L5.52734 9.52832C5.26725 9.78856 5.26739 10.2104 5.52734 10.4707C5.78768 10.7311 6.21034 10.731 6.4707 10.4707L7.99902 8.94238L9.52734 10.4717C9.7877 10.732 10.2104 10.732 10.4707 10.4717C10.731 10.2113 10.731 9.78866 10.4707 9.52832L8.94141 8L10.4707 6.47168C10.731 6.21134 10.731 5.78867 10.4707 5.52832Z"
          fill="#E8B931"
        />
      </svg>
    ),
    archived: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7.167" fill="red" />
        <line
          x1="4.5"
          y1="8"
          x2="11.5"
          y2="8"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toLocaleUpperCase() + status.slice(1);
  };

  return (
    <div className="relative bg-white px-[6px]">
      <div className="sticky top-0 z-20  pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0 ">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3 ">
            <button className="lg:hidden" onClick={toggleMobileMenu}>
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={28}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
          <div className="flex justify-between w-full border-b border-[#e0e0e0] border-t-0 border-r-0 border-l-0 items-center">
            <h1 className="text-xl  font-medium  ">Blog management</h1>
            <UserControll />
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex  flex-row-reverse justify-between items-center mb-2  mt-2 ">
        <div className="relative">
          <Search
            className="absolute text-gray-400 top-1/2 bottom-1/2 -translate-y-1/2 ml-3"
            size={13}
          />
          <input
            type="text"
            placeholder="Search by title, summary or tags"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchBlogs({
                  ...filters,
                  search: e.currentTarget.value,
                  page: 1,
                });
              }
            }}
            className="border outline-none focus:border-[#9013fe] px-8 py-[8px] w-[300px] text-sm rounded-[8px]"
          />
        </div>
        <div className="flex w-fit items-center gap-3">
          <button
            onClick={() => navigate("/admin/blog/create")}
            className="p-[10px_24px]  w-fit flex items-center rounded-[24px] text-sm  transtion-all duration-300 ease-linear bg-[#9013FE] border border-[#e0e0e0] text-white hover:bg-[#790bd8]"
          >
            <FontAwesomeIcon className="mr-1" icon={Icons.Plus} /> Add New Blog
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 my-5">
        <p className="text-[#757575]">Filter by:</p>

        <Select
          defaultValue="all"
          style={{ width: 160 }}
          className="filter-select"
          options={[
            { value: "all", label: "Status" },
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" },
          ]}
          onChange={(val) => handleFilterChange("status", val)}
        />
        <Select
          defaultValue="all"
          style={{ width: 160 }}
          className="filter-select"
          options={authorOptions}
          onChange={(val) => handleFilterChange("author", val)}
        />
        <RangePicker
          style={{ width: 260 }}
          className="custom-datepicker"
          onChange={(_dates, dateStrings) => {
            if (dateStrings && dateStrings[0] && dateStrings[1]) {
              handleFilterChange("dateRange", [dateStrings[0], dateStrings[1]]);
            } else {
              handleFilterChange("dateRange", null);
            }
          }}
        />
      </div>
      <div>
        <div>
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-[30px]  relative overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                ))}
            </div>
          ) : (
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="text-left text-sm text-[#1C1C1C66]">
                  <th className="p-2 font-manrope border-b border-[#1C1C1C33] w-[40%]">
                    Title
                  </th>
                  <th className="p-2 font-manrope border-b border-[#1C1C1C33] w-[15%]">
                    Author
                  </th>
                  <th className="p-2 font-manrope border-b border-[#1C1C1C33] w-[20%]">
                    Date Uploaded
                  </th>
                  <th className="p-2 font-manrope border-b border-[#1C1C1C33] w-[10%]">
                    Status
                  </th>
                  <th className="p-2 font-manrope border-b border-[#1C1C1C33] w-[15%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="border-t text-sm hover:bg-gray-50"
                    >
                      <td className="p-2 font-manrope truncate max-w-[400px]">
                        {blog.title}
                        {blog.pinned && (
                          <span className="ml-2 text-yellow-500" title="Pinned">
                            📌
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-manrope">
                        {blog?.user_profiles.name}{" "}
                        {blog?.user_profiles.last_name}
                      </td>
                      <td className="p-2 font-manrope">{blog.publish_date}</td>
                      <td className="p-2 font-manrope flex items-center gap-2">
                        {formatStatus(blog.status)}{" "}
                        <span>{statusTags[blog?.status as BlogStatus]}</span>
                      </td>
                      <td className="p-2 font-manrope">
                        {blog.status === "active" && (
                          <div className="flex  gap-4 items-center">
                            <button
                              onClick={() =>
                                navigate(`/admin/blog/edit/${blog.id}`)
                              }
                              className="cursor-pointer"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.81 3.32159L11.7446 2.38709C12.2607 1.87097 13.0975 1.87097 13.6136 2.38709C14.1297 2.9032 14.1297 3.73999 13.6136 4.2561L12.6791 5.19061M10.81 3.32159L7.3208 6.81084C6.62394 7.5077 6.27549 7.85614 6.03823 8.28074C5.80097 8.70534 5.56225 9.70794 5.33398 10.6667C6.29271 10.4384 7.29531 10.1997 7.71991 9.96242C8.14451 9.72516 8.49294 9.37672 9.18982 8.67985L12.6791 5.19061M10.81 3.32159L12.6791 5.19061"
                                  stroke="#757575"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 8C14 10.8284 14 12.2426 13.1213 13.1213C12.2426 14 10.8284 14 8 14C5.17157 14 3.75736 14 2.87868 13.1213C2 12.2426 2 10.8284 2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2"
                                  stroke="#757575"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setModalOpen(true);
                                setSelectedId(blog.id);
                                setAction("archive");
                              }}
                              className="group"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                className="transition-colors duration-300 group-hover:text-red-500 text-gray-500"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.6822 3.6665C3.06551 4.74143 2 6.57953 2 8.6665C2 11.9802 4.68629 14.6665 8 14.6665C11.3137 14.6665 14 11.9802 14 8.6665C14 6.57953 12.9345 4.74143 11.3178 3.6665"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M8 1.3335V6.66683"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(blog.id);
                                setModalOpen(true);
                                setAction("pin");
                                setPinned(blog.pinned);
                              }}
                              className={`group ${
                                blog.pinned
                                  ? "text-yellow-500"
                                  : "text-gray-500 hover:text-yellow-500"
                              } transition`}
                              title={blog.pinned ? "Unpin Blog" : "Pin Blog"}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 fill-gray-500 group-hover:fill-black transition-colors duration-200"
                              >
                                <polygon points="2.77 20.53 8.78 13.81 10.19 15.22 3.47 21.23 2.77 20.53" />
                                <path
                                  d="M13.73,18.76,5.24,10.27A5.94,5.94,0,0,1,9.48,8.52,5.42,5.42,0,0,1,11,8.73L14.5,5.26a1.49,1.49,0,0,1,2-2,1.32,1.32,0,0,1,.42.29l3.53,3.53a1.32,1.32,0,0,1,.29.42,1.49,1.49,0,0,1-2,2L15.27,13a5.42,5.42,0,0,1,.21,1.55A5.94,5.94,0,0,1,13.73,18.76Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        {blog.status === "draft" && (
                          <div className="flex  gap-4 items-center">
                            <button
                              onClick={() =>
                                navigate(`/admin/blog/edit/${blog.id}`)
                              }
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.81 3.32159L11.7446 2.38709C12.2607 1.87097 13.0975 1.87097 13.6136 2.38709C14.1297 2.9032 14.1297 3.73999 13.6136 4.2561L12.6791 5.19061M10.81 3.32159L7.3208 6.81084C6.62394 7.5077 6.27549 7.85614 6.03823 8.28074C5.80097 8.70534 5.56225 9.70794 5.33398 10.6667C6.29271 10.4384 7.29531 10.1997 7.71991 9.96242C8.14451 9.72516 8.49294 9.37672 9.18982 8.67985L12.6791 5.19061M10.81 3.32159L12.6791 5.19061"
                                  stroke="#757575"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 8C14 10.8284 14 12.2426 13.1213 13.1213C12.2426 14 10.8284 14 8 14C5.17157 14 3.75736 14 2.87868 13.1213C2 12.2426 2 10.8284 2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2"
                                  stroke="#757575"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setModalOpen(true);
                                setSelectedId(blog.id);
                                setAction("publish");
                              }}
                              className="group"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                className="transition-colors duration-300 text-gray-500 group-hover:text-green-500"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.00065 3.00033L8.00065 9.66699M8.00065 3.00033C7.53383 3.00033 6.66167 4.32986 6.33398 4.66699M8.00065 3.00033C8.46747 3.00033 9.33963 4.32986 9.66732 4.66699"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M13.3327 11C13.3327 12.6547 12.9873 13 11.3327 13H4.66602C3.01135 13 2.66602 12.6547 2.66602 11"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setModalOpen(true);
                                setSelectedId(blog.id);
                                setAction("delete");
                              }}
                              className="group transition-colors"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-500 group-hover:text-red-500 transition-colors duration-300"
                              >
                                <path
                                  d="M13 3.6665L12.5868 10.3499C12.4813 12.0575 12.4285 12.9113 12.0005 13.5251C11.7889 13.8286 11.5164 14.0847 11.2005 14.2772C10.5614 14.6665 9.70599 14.6665 7.99516 14.6665C6.28208 14.6665 5.42554 14.6665 4.78604 14.2765C4.46987 14.0836 4.19733 13.827 3.98579 13.5231C3.55792 12.9082 3.5063 12.0532 3.40307 10.3433L3 3.6665"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M2 3.66683H14M10.7038 3.66683L10.2487 2.72798C9.94638 2.10433 9.79522 1.79251 9.53448 1.59803C9.47664 1.5549 9.4154 1.51652 9.35135 1.4833C9.06261 1.3335 8.71608 1.3335 8.02302 1.3335C7.31255 1.3335 6.95732 1.3335 6.66379 1.48958C6.59873 1.52417 6.53666 1.56409 6.4782 1.60894C6.21443 1.8113 6.06709 2.13453 5.7724 2.781L5.36862 3.66683"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M6.33398 11L6.33398 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M9.66602 11L9.66602 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        {blog.status === "archived" && (
                          <div className="flex  gap-4 items-center">
                            <button
                              onClick={() =>
                                navigate(`/admin/blog/edit/${blog.id}`)
                              }
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.81 3.32159L11.7446 2.38709C12.2607 1.87097 13.0975 1.87097 13.6136 2.38709C14.1297 2.9032 14.1297 3.73999 13.6136 4.2561L12.6791 5.19061M10.81 3.32159L7.3208 6.81084C6.62394 7.5077 6.27549 7.85614 6.03823 8.28074C5.80097 8.70534 5.56225 9.70794 5.33398 10.6667C6.29271 10.4384 7.29531 10.1997 7.71991 9.96242C8.14451 9.72516 8.49294 9.37672 9.18982 8.67985L12.6791 5.19061M10.81 3.32159L12.6791 5.19061"
                                  stroke="#757575"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 8C14 10.8284 14 12.2426 13.1213 13.1213C12.2426 14 10.8284 14 8 14C5.17157 14 3.75736 14 2.87868 13.1213C2 12.2426 2 10.8284 2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2"
                                  stroke="#757575"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setModalOpen(true);
                                setSelectedId(blog.id);
                                setAction("publish");
                              }}
                              className="group"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                className="transition-colors duration-300 text-gray-500 group-hover:text-green-500"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.00065 3.00033L8.00065 9.66699M8.00065 3.00033C7.53383 3.00033 6.66167 4.32986 6.33398 4.66699M8.00065 3.00033C8.46747 3.00033 9.33963 4.32986 9.66732 4.66699"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M13.3327 11C13.3327 12.6547 12.9873 13 11.3327 13H4.66602C3.01135 13 2.66602 12.6547 2.66602 11"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => {
                                setModalOpen(true);
                                setSelectedId(blog.id);
                                setAction("delete");
                              }}
                              className="group transition-colors"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-500 group-hover:text-red-500 transition-colors duration-300"
                              >
                                <path
                                  d="M13 3.6665L12.5868 10.3499C12.4813 12.0575 12.4285 12.9113 12.0005 13.5251C11.7889 13.8286 11.5164 14.0847 11.2005 14.2772C10.5614 14.6665 9.70599 14.6665 7.99516 14.6665C6.28208 14.6665 5.42554 14.6665 4.78604 14.2765C4.46987 14.0836 4.19733 13.827 3.98579 13.5231C3.55792 12.9082 3.5063 12.0532 3.40307 10.3433L3 3.6665"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M2 3.66683H14M10.7038 3.66683L10.2487 2.72798C9.94638 2.10433 9.79522 1.79251 9.53448 1.59803C9.47664 1.5549 9.4154 1.51652 9.35135 1.4833C9.06261 1.3335 8.71608 1.3335 8.02302 1.3335C7.31255 1.3335 6.95732 1.3335 6.66379 1.48958C6.59873 1.52417 6.53666 1.56409 6.4782 1.60894C6.21443 1.8113 6.06709 2.13453 5.7724 2.781L5.36862 3.66683"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M6.33398 11L6.33398 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M9.66602 11L9.66602 7"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2 font-manrope items-center">
          {/* Prev */}
          <button
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border 
      ${
        pagination.page <= 1
          ? "opacity-100 cursor-not-allowed"
          : "border-black text-black hover:bg-black hover:text-white"
      }`}
          >
            ‹
          </button>

          {/* Page numbers */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-full 
        ${
          pagination.page === pageNum
            ? "bg-black text-white"
            : "border border-black text-black hover:bg-black hover:text-white"
        }`}
              >
                {pageNum}
              </button>
            )
          )}

          {/* Next */}
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full border 
      ${
        pagination.page >= pagination.totalPages
          ? "opacity-100 cursor-not-allowed"
          : "border-black text-black hover:bg-black hover:text-white"
      }`}
          >
            ›
          </button>
        </div>
      </div>
      <ActionModal
        id={selectedId}
        action={action}
        openModal={modalOpen}
        setModalOpen={setModalOpen}
        refetch={() => fetchBlogs({ ...filters, page: 1 })}
        pinned={pinned}
      />
    </div>
  );
}
