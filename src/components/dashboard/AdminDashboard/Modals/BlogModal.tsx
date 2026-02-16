import { Modal, Select, DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import type { DatePickerProps } from "antd";
import {
  sendBlogPost,
  updateBlogPost,
} from "../../../../services/admin/blogServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface BlogModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: {
    title: string;
    author: string | null;
    summary: string;
    content: string;
  };
  type?: "update" | "create";
  blogId?: string;
}

export default function BlogModal({
  openModal,
  setModalOpen,
  formData,
  blogId,
  type,
}: BlogModalProps) {
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState<string | string[] | null>(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    cover?: string;
    tags?: string;
    date?: string;
  }>({});

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachmentFile(file);
  };

  const onTagsChange = (values: string[]) => {
    setTags(values);
  };

  const onDateChange: DatePickerProps["onChange"] = (_, dateString) => {
    setDate(dateString || null);
  };

  const handleSubmit = async (action: "draft" | "publish") => {
    const newErrors: { cover?: string; tags?: string; date?: string } = {};

    if (!coverImageFile) newErrors.cover = "Cover image is required";
    if (tags.length === 0) newErrors.tags = "At least one tag is required";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const finalData = {
      ...formData,
      coverImageFile: coverImageFile as File,
      tags,
      attachmentFile,
      date,
      action,
    };

    //Set loading state for correct button
    if (action === "draft") setLoadingDraft(true);
    else setLoadingPublish(true);

    const setLoadingState = (value: boolean) => {
      if (action === "draft") setLoadingDraft(value);
      else setLoadingPublish(value);
    };

    try {
      const response =
        type === "update"
          ? await updateBlogPost({ ...finalData, id: blogId })
          : await sendBlogPost(finalData);

      if (response.success) {
        toast.success(type === "update" ? "Blog updated" : "Blog created");
        setTimeout(() => navigate("/admin/blog"), 500);
        setModalOpen(false);
      } else {
        console.error("❌ Failed:", response.message);
      }
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <Modal
      open={openModal}
      footer={null}
      title={
        <h1 className="md:text-lg font-manrope font-semibold">Add/Edit Blog</h1>
      }
      className="blog-modal"
      maskStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      width={800}
      centered
      onCancel={() => setModalOpen(false)}
    >
      <div>
        <div className="flex justify-center items-start gap-6">
          {/* COVER IMAGE */}
          <div className="w-[50%] ">
            <h3 className="font-manrope mb-1 font-semibold">Cover Image</h3>
            <input
              className="hidden"
              accept="image/*"
              type="file"
              id="cover-image"
              onChange={handleCoverChange}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleCoverDrop}
              className={`w-full grid place-items-center h-[150px] p-[3px] border-2 border-dashed rounded-[8px] cursor-pointer transition-colors ${
                isDragging ? "border-[#9013fe] bg-purple-50" : "border-gray-300"
              }`}
              onClick={() => document.getElementById("cover-image")?.click()}
            >
              {coverPreview ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverPreview(null);
                      setCoverImageFile(null);
                      const input = document.getElementById(
                        "cover-image"
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    className="absolute top-2 right-2 bg-white border rounded-full size-6 flex justify-center items-center shadow-md hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.49935 0.749675L7.49935 9.08301M7.49935 0.749675C6.91583 0.749675 5.82562 2.41159 5.41602 2.83301M7.49935 0.749675C8.08287 0.749675 9.17307 2.41159 9.58268 2.83301"
                      stroke="#141B34"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.1673 10.75C14.1673 12.8183 13.7357 13.25 11.6673 13.25H3.33398C1.26565 13.25 0.833984 12.8183 0.833984 10.75"
                      stroke="#141B34"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-center font-manrope font-semibold">
                    Drag and Drop or{" "}
                    <span className="text-[#9013fe]">Choose file</span> to
                    upload
                  </p>
                </div>
              )}
            </div>
            {errors.cover && (
              <p className="text-red-500 text-xs mt-1">{errors.cover}</p>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full">
            <h3 className="font-manrope mb-1 font-semibold mt-3">
              Tags <span className="text-gray-400">(maximum 5)</span>
            </h3>
            <Select
              mode="multiple"
              allowClear
              maxTagCount={5}
              className="custom-multiple-select"
              style={{ width: "100%" }}
              placeholder="Filter by category"
              value={tags}
              onChange={onTagsChange}
              options={[
                { value: "tutorial", label: "Tutorial" },
                { value: "tech", label: "Tech" },
                { value: "software", label: "Software" },
                { value: "customers", label: "Customers" },
                { value: "partners", label: "Partners" },
                { value: "promotion", label: "Promotion" },
                { value: "updates", label: "Updates" },
                { value: "stories", label: "Stories" },
                { value: "products", label: "Products" },
                { value: "announcement", label: "Announcement" },
              ]}
            />

            <p className="font-manrope mb-1 font-semibold mt-1 text-xs">
              Suggested:{" "}
              <span className="text-gray-400"> Arbitration etc..</span>
            </p>
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
            )}
            <hr className="my-5" />

            <div className="flex items-start gap-5">
              {/* ATTACH FILE */}
              <div className="w-full">
                <h3 className="font-manrope font-semibold mb-1">
                  Attach file <span className="text-gray-400">(Optional)</span>
                </h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-[42px] flex items-center justify-between p-4 rounded-[8px] border border-[#e0e0e0] cursor-pointer hover:bg-gray-100"
                >
                  <p>Attach file</p>
                  <svg
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.5 1.50003C9.5 1.50003 6.55404 5.49999 5.49997 5.5C4.44589 5.50001 1.5 1.5 1.5 1.5"
                      stroke="#757575"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {attachmentFile && (
                  <p className="mt-2 text-xs text-gray-700">
                    📎 {attachmentFile.name}
                  </p>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttachmentChange}
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.zip,.rar"
                />
              </div>

              {/* DATE PICKER */}
              <div className="w-full">
                <h3 className="font-manrope font-semibold mb-1">Date</h3>
                <DatePicker
                  className="custom-datepicker"
                  style={{ height: 42, width: "100%" }}
                  onChange={onDateChange}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <button
              disabled={loadingDraft || loadingPublish}
              onClick={() => setModalOpen(false)}
              className="rounded-[100px] font-manrope font-semibold border p-[14px_24px] border-[#D9D9D9] text-black"
            >
              Cancel
            </button>

            <button
              disabled={loadingDraft || loadingPublish}
              onClick={() => handleSubmit("draft")}
              className="rounded-[100px] font-manrope font-semibold border p-[14px_24px] border-[#9013FE] text-[#9013fe]"
            >
              {loadingDraft ? "Saving..." : "Save as Draft"}
            </button>

            <button
              disabled={loadingDraft || loadingPublish}
              onClick={() => handleSubmit("publish")}
              className="rounded-[100px] font-manrope font-semibold p-[14px_24px] bg-[#9013FE] text-white"
            >
              {loadingPublish ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
