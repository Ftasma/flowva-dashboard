import supabase from "../../lib/supabase";

interface BlogPayload {
  title: string;
  author: string | null;
  summary: string;
  content: string;
  coverImageFile: File;
  attachmentFile?: File | null;
  tags: string[];
  date: string | string[] | null;
  action: "draft" | "publish";
}

interface UpdateBlogPayload {
  id?: string;
  title?: string;
  author?: string | null;
  summary?: string;
  content?: string;
  coverImageFile?: File | null; // optional new image
  attachmentFile?: File | null; // optional new file
  tags?: string[];
  date?: string | string[] | null;
  action?: "draft" | "publish" | "delete" | "archive";
}

export async function sendBlogPost(payload: BlogPayload) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    // Upload cover image
    const coverPath = `blogs/covers/${Date.now()}-${
      payload.coverImageFile.name
    }`;
    const { error: coverError } = await supabase.storage
      .from("blog-assets")
      .upload(coverPath, payload.coverImageFile);

    if (coverError) throw coverError;

    const { data: coverUrlData } = supabase.storage
      .from("blog-assets")
      .getPublicUrl(coverPath);

    const coverUrl = coverUrlData.publicUrl;

    // Upload attachment (optional)
    let attachmentUrl: string | null = null;
    if (payload.attachmentFile) {
      const attachmentPath = `blogs/attachments/${Date.now()}-${
        payload.attachmentFile.name
      }`;
      const { error: attachmentError } = await supabase.storage
        .from("blog-assets")
        .upload(attachmentPath, payload.attachmentFile);

      if (attachmentError) throw attachmentError;

      const { data: attachmentUrlData } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(attachmentPath);

      attachmentUrl = attachmentUrlData.publicUrl;
    }

    //  Construct final payload for edge function
    const blogPayload = {
      title: payload.title,
      summary: payload.summary,
      content: payload.content,
      coverUrl,
      attachmentUrl,
      tags: payload.tags,
      status: payload.action === "publish" ? "active" : "draft",
      publishDate: payload.date,
      author: payload.author,
    };

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(blogPayload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Edge function failed");
    }

    return {
      success: true,
      status: 200,
      message: "Blog sent successfully",
      data,
    };
  } catch (error: any) {
    console.error("Error sending blog:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    };
  }
}

export async function updateBlogPost(payload: UpdateBlogPayload) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    // Initialize update object
    const updateData: any = {
      title: payload.title,
      summary: payload.summary,
      content: payload.content,
      tags: payload.tags,
      publishDate: payload.date,
      author: payload.author,
      status: payload.action === "publish" ? "active" : "draft",
    };

    // Upload new cover image if changed
    if (payload.coverImageFile) {
      const coverPath = `blogs/covers/${Date.now()}-${
        payload.coverImageFile.name
      }`;
      const { error: coverError } = await supabase.storage
        .from("blog-assets")
        .upload(coverPath, payload.coverImageFile, { upsert: true });

      if (coverError) throw coverError;

      const { data: coverUrlData } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(coverPath);

      updateData.coverUrl = coverUrlData.publicUrl;
    }

    // Upload new attachment if provided
    if (payload.attachmentFile) {
      const attachmentPath = `blogs/attachments/${Date.now()}-${
        payload.attachmentFile.name
      }`;
      const { error: attachmentError } = await supabase.storage
        .from("blog-assets")
        .upload(attachmentPath, payload.attachmentFile, { upsert: true });

      if (attachmentError) throw attachmentError;

      const { data: attachmentUrlData } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(attachmentPath);

      updateData.attachmentUrl = attachmentUrlData.publicUrl;
    }

    // Send update request to your Edge Function (or directly via Supabase RPC)
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: payload.id,
          ...updateData,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Edge function failed");

    return {
      success: true,
      status: 200,
      message: "Blog updated successfully",
      data,
    };
  } catch (error: any) {
    console.error("Error updating blog:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    };
  }
}

export interface UpdateBlogStatusPayload {
  id: string; // blog id
  action: "publish" | "archive" | "draft" | "delete" | "pin"; //
}

export async function updateBlogStatus(payload: UpdateBlogStatusPayload) {
  try {
    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    // Determine new status
    let newStatus = "";
    switch (payload.action) {
      case "publish":
        newStatus = "active";
        break;
      case "archive":
        newStatus = "archived";
        break;
      case "draft":
        newStatus = "draft";
        break;
      default:
        return {
          success: false,
          status: 400,
          message: "Invalid action",
        };
    }

    // Call your Edge Function (or API route)
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-blog-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: payload.id,
          status: newStatus,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to update status");

    return {
      success: true,
      status: 200,
      message: `Blog status updated to ${newStatus}`,
      data,
    };
  } catch (error: any) {
    console.error("Error updating blog status:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    };
  }
}

export async function deleteBlogPost(blogId: string) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: blogId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete blog");
    }

    return {
      success: true,
      status: 200,
      message: data.message || "Blog deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting blog:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    };
  }
}

export async function pinBlogPost(blogId: string, pinned: boolean) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        success: false,
        status: 401,
        message: "Authentication required",
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pinned-blog`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: blogId, pinned }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update pinned state");
    }

    return {
      success: true,
      status: 200,
      message: data.message || "Pinned state updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating pinned state:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    };
  }
}
