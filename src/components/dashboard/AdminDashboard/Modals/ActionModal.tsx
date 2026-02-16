import { Modal } from "antd";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  deleteBlogPost,
  pinBlogPost,
  updateBlogStatus,
} from "../../../../services/admin/blogServices";
import { BlogQueryParams } from "../../../../hooks/admin/blog/getBlogs";
import { toast } from "react-toastify";

interface ActionModalProps {
  openModal: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  refetch: (params?: BlogQueryParams) => Promise<void>;
  action: "publish" | "archive" | "draft" | "delete" | "pin";
  pinned?: boolean;
}

export default function ActionModal({
  openModal,
  setModalOpen,
  id,
  refetch,
  action,
  pinned,
}: ActionModalProps) {
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (id: string) => {
    try {
      setLoading(true);

      if (action === "delete") {
        await deleteBlogPost(id);
        toast.success("Blog deleted");
      } else if (action === "pin") {
        const result = await pinBlogPost(id, !pinned);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(`Failed: ${result.message}`);
        }
      } else {
        await updateBlogStatus({ id, action });
        toast.success("Blog status updated");
      }

      await refetch();
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={openModal}
      footer={null}
      centered
      width={350}
      onCancel={() => setModalOpen(false)}
    >
      <div className=" py-1">
        <h2 className="font-manrope font-semibold">
          {action === "pin"
            ? pinned
              ? "Unpin this blog post?"
              : "Pin this blog post? Only one blog can be pinned at a time."
            : `Are You sure you want to ${action} this blog post`}
        </h2>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-1 text-sm font-medium rounded-[100px] border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUpdate(id)}
            disabled={loading}
            className="px-4 py-1 text-sm font-medium  text-white cursor-pointer rounded-[100px]"
            style={{ backgroundColor: "#9013fe" }}
          >
            {loading ? "loading.." : "Yes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
