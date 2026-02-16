import { Select } from "antd";
import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { useSidebar } from "../../../context/SidebarContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import BlogModal from "../../../components/dashboard/AdminDashboard/Modals/BlogModal";
import { useAuthors } from "../../../context/adminContext/blog/fetchAuthorContext";
import { useParams } from "react-router-dom";
import { useBlog } from "../../../hooks/admin/blog/useBlogs";

export default function EditBlog() {
  const { toggleMobileMenu } = useSidebar();

  const { id } = useParams();
  const { blog } = useBlog(id as string);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setSummary(blog.summary || "");
      setMessage(blog.content || "");
      setAuthor(blog.author_id || null);
    }
  }, [blog]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");

  const { authors } = useAuthors();
  const authorOptions = [
    ...authors.map((author) => ({
      value: author.user_id,
      label: author.name,
    })),
  ];

  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    summary?: string;
    content?: string;
  }>({});

  const [openModal, setModalOpen] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!author) newErrors.author = "Author is required";
    if (!summary.trim()) newErrors.summary = "Summary is required";
    if (!message.trim()) newErrors.content = "Blog content is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setModalOpen(true);
  };

  const blogData = {
    title,
    author,
    summary,
    content: message,
  };

  return (
    <div className="relative bg-white px-[6px]">
      {/* Header */}
      <div className="sticky top-0 z-20 pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={toggleMobileMenu}>
              {/* menu icon */}
              <svg viewBox="0 0 20 20" width={28}>
                <path
                  fill="#000"
                  d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-between w-full border-b border-[#e0e0e0] items-center">
            <h1 className="text-xl font-medium">Add/Edit</h1>
            <UserControll />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="lg:h-[calc(100vh-100px)] overflow-y-auto">
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="flex gap-10 items-center justify-between">
            {/* Title */}
            <div className="w-full">
              <label className="font-manrope font-semibold mb-1 block">
                BLOG TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full outline-none focus:border-[#9013fe] h-[43px] border border-[#CDCDCD] rounded-[8px] p-4"
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div className="w-full">
              <label className="font-manrope font-semibold mb-1 block">
                BLOG AUTHOR
              </label>
              <Select
                placeholder="Select Author"
                style={{ width: "100%", height: 42 }}
                className="custom-select"
                value={author || undefined}
                onChange={(val) => setAuthor(val)}
                options={authorOptions}
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="w-full mt-2">
            <label className="font-manrope font-semibold mb-1 block">
              BLOG SUMMARY
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border bg-white border-[#CDCDCD] rounded-[8px] p-3"
              rows={2}
              placeholder="Brief Description"
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>

          {/* Content */}
          <div className="h-[500px] overflow-y-auto my-5 no-scrollbar">
            <ReactQuill
              theme="snow"
              value={message}
              onChange={setMessage}
              modules={modules}
              placeholder="Type your message here..."
              className="h-full flex flex-col"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-1">
            <button
              type="submit"
              className="bg-[#9013fe] text-white px-6 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Modal Preview */}
      <BlogModal
        openModal={openModal}
        setModalOpen={setModalOpen}
        blogId={id}
        formData={blogData}
        type="update"
      />
    </div>
  );
}
