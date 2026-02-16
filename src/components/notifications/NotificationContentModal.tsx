import { useEffect, useState, useMemo } from "react";
import { Modal, Spin, Empty } from "antd";
import supabase from "../../lib/supabase";
import { Notification } from "../../utils/notifications/notifications.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../icons";
import { MailOpenIcon } from "lucide-react";
import { IconButton } from "../reward/Refer";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import {
  CollectionFormData,
  createOrUpdateCollection,
} from "../../services/upsertCollection.service";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { toast } from "react-toastify";
import { addToLibrary } from "../../services/my-library/libraryService";
import { addCustomToolAndLibrary } from "../../services/my-library/customToolServices";
import { useCollectionsContext } from "../../context/CollectionsContext";
import { useLibraryToolsContext } from "../../context/LibraryToolsContext";
import { useNavigate } from "react-router-dom";
import { useCollectionToolsByIdContext } from "../../context/CollectionToolsByIdContext";
import { useToolByLibraryIdContext } from "../../context/ToolByLibraryIdContext";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { useUserProfile } from "../../context/UseProfileContext";

interface ModalSettings {
  modalOpen: boolean;
  data: Notification | null;
  setModalOpen: (data: boolean) => void;
}

export default function NotificationContentModal({
  modalOpen,
  setModalOpen,
  data,
}: ModalSettings) {
  const parsedContent = useMemo(() => {
    try {
      return data?.content ? JSON.parse(data.content) : null;
    } catch {
      return null;
    }
  }, [data]);

  const { allTools } = useDefaultTools();

  const { item_id, token, item_type } = parsedContent || {};

  const type = data?.type;

  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [senderName, setSenderName] = useState("");
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [senderId, setSenderId] = useState<string>("");

  const { collectionToolsMap, loadingMap, fetchToolsByCollectionId } =
    useCollectionToolsByIdContext();

  useEffect(() => {
    if (item_id) fetchToolsByCollectionId(item_id);
  }, [item_id]);

  const tools = collectionToolsMap[item_id] || [];
  const loadingTools = loadingMap[item_id];
  const { userProfileData } = useUserProfile();
  const {
    fetchToolByLibraryId,
    toolMap,
    loadingMap: toolloadingMap,
  } = useToolByLibraryIdContext();

  useEffect(() => {
    if (item_id && item_type === "tool") {
      fetchToolByLibraryId(item_id);
    }
  }, [item_id, item_type]);

  const singleTool = toolMap[item_id];
  const loadingTool = toolloadingMap[item_id];

  const navigate = useNavigate();

  const { currentUser } = useCurrentUser();

  const { fetchCollections, setUserId: setCollectionUserId } =
    useCollectionsContext();

  useEffect(() => {
    if (currentUser) {
      setCollectionUserId(currentUser.id);
    }
  }, [currentUser]);

  const { refreshTools, setUserId } = useLibraryToolsContext();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    // Reset UI state when modal opens with new data
    if (!modalOpen || !data) return;
    setCollectionName("");
    setCollectionDescription("");
    setSenderName("");
  }, [modalOpen, data]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!modalOpen || !token) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: shareRow, error } = await supabase
        .from("shared_items")
        .select("*")
        .eq("token", token)
        .eq("recipient_id", user.id)
        .single();

      if (!shareRow || error) return;

      if (shareRow.sender_id) {
        const { data: sender } = await supabase
          .from("user_profiles")
          .select("name")
          .eq("user_id", shareRow.sender_id)
          .single();

        if (sender?.name) {
          setSenderName(sender.name);
          setSenderId(shareRow.sender_id);
        }
      }

      if (item_type === "stack" && item_id) {
        const { data: collectionData } = await supabase
          .from("collections")
          .select("name, description")
          .eq("id", item_id)
          .single();

        if (collectionData) {
          setCollectionName(collectionData.name);
          setCollectionDescription(collectionData.description || "");
        }
      }
    };

    fetchMetadata();
  }, [modalOpen, token, item_id, item_type]);

  const handleAccept = async () => {
    if (!currentUser?.id || !userProfileData) {
      toast.error("Please log in first.");
      return;
    }

    try {
      setAcceptLoading(true);

      // Fetch shared row
      const { data: shareRow, error: fetchError } = await supabase
        .from("shared_items")
        .select("*")
        .eq("token", token)
        .eq("recipient_id", currentUser.id)
        .single();

      if (fetchError || !shareRow) {
        console.error("Error fetching shared item:", fetchError);
        toast.error("Could not retrieve the shared item.");
        return;
      }

      // Mark as accepted if not already
      if (!shareRow.accepted) {
        const { error: updateError } = await supabase
          .from("shared_items")
          .update({
            accepted: true,
            accepted_at: new Date().toISOString(),
          })
          .eq("id", shareRow.id);

        if (updateError) {
          console.error("Error updating shared item:", updateError);
          toast.error("Failed to mark the stack as accepted.");
          return;
        }

        await NotificationHelpers.onShareAccepted(
          senderId,
          item_type,
          userProfileData?.name
        );

        await NotificationHelpers.onShareItemAdded(
          currentUser.id,
          item_type,
          item_type === "stack"
            ? (collectionName as string)
            : (singleTool?.title as string)
        );
      } else {
        setAcceptLoading(false);
        toast.info("You've accepted this share already");
        return;
      }

      // Fetch latest user library
      const { data: initialLibrary, error: libraryFetchError } = await supabase
        .from("library_tools")
        .select("id, default_tool_id, custom_tool_id")
        .eq("user_id", currentUser.id);

      if (libraryFetchError || !initialLibrary) {
        console.error("Failed to fetch user library tools", libraryFetchError);
        toast.error("Something went wrong fetching your library.");
        return;
      }

      // shared Tool
      if (item_type === "tool" && singleTool) {
        if (singleTool.isCustom) {
          const customToolData = {
            toolName: singleTool.title,
            category: singleTool.category,
            websiteURL: singleTool.url,
            description: singleTool.description,
          };

          const { status, error, duplicate } = await addCustomToolAndLibrary(
            currentUser.id,
            customToolData
          );

          if (status === 409 && duplicate) {
            toast.info("You already have this custom tool in your library.");
          } else if (status === 200) {
            navigate("/dashboard/library");
            toast.success("Tool added to your library!");
          } else {
            throw new Error(error || "Error adding custom tool");
          }
        } else {
          if (!singleTool?.defaultToolId) return;
          const { status, error, duplicate } = await addToLibrary(
            currentUser.id,
            singleTool?.defaultToolId.toString()
          );

          if (status === 409 && duplicate) {
            toast.info("You already have this tool in your library.");
          } else if (status === 200) {
            navigate("/dashboard/library");
            toast.success("Tool added to your library!");
          } else {
            throw new Error(error || "Error adding tool");
          }
        }

        await refreshTools();
        setModalOpen(false);
        return;
      }

      const libraryToolIds: string[] = [];

      // Add tools
      for (const tool of tools) {
        if (tool.isCustom) {
          const customToolData = {
            toolName: tool.title,
            category: tool.category,
            websiteURL: tool.url,
            description: tool.description,
          };

          const { status, error, libraryToolId, duplicate } =
            await addCustomToolAndLibrary(currentUser.id, customToolData);

          if (status === 200 && libraryToolId) {
            libraryToolIds.push(libraryToolId);
          }

          if (status === 409 && duplicate) {
            const match = initialLibrary.find(
              (libTool) => libTool.custom_tool_id === tool.id
            );
            if (match) libraryToolIds.push(match.id);
            continue;
          }

          if (status === 200) {
            const { data: updatedLib } = await supabase
              .from("library_tools")
              .select("id, custom_tool_id")
              .eq("user_id", currentUser.id);

            const match = updatedLib?.find((libTool) =>
              allTools.find(
                (t) => t.id === libTool.custom_tool_id && t.title === tool.title
              )
            );
            if (match) libraryToolIds.push(match.id);
          } else {
            throw new Error(error || "Error adding custom tool");
          }
        } else {
          const { status, error, duplicate } = await addToLibrary(
            currentUser.id,
            tool.id.toString()
          );

          if (status === 409 && duplicate) {
            const match = initialLibrary.find(
              (libTool) => libTool.default_tool_id === tool.id
            );
            if (match) libraryToolIds.push(match.id);
            continue;
          }

          if (status === 200) {
            const { data: updatedLib } = await supabase
              .from("library_tools")
              .select("id, default_tool_id")
              .eq("user_id", currentUser.id);

            const match = updatedLib?.find(
              (libTool) => libTool.default_tool_id === tool.id
            );
            if (match) libraryToolIds.push(match.id);
          } else {
            throw new Error(error || "Error adding default tool");
          }
        }
      }

      //  Create new collection
      const stackData: CollectionFormData = {
        name: collectionName,
        userId: currentUser.id,
        description: collectionDescription,
        color: "#9013FE",
        toolIds: libraryToolIds,
      };

      const { status, error: createError } = await createOrUpdateCollection(
        currentUser.id,
        stackData
      );

      if (status === 200 || status === 201) {
        await fetchCollections();
        await refreshTools();
        toast.success("Tech Stack Accepted!");
        setModalOpen(false);
        navigate("/dashboard/tech-stack");
      } else {
        console.error("Error creating collection:", createError);
        toast.error("Failed to create the collection.");
      }
    } catch (err) {
      console.error("Unexpected error during acceptance:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setAcceptLoading(false);
    }
  };

  const rewardTitle = parsedContent?.metadata?.rewardName;
  const brandName =
    parsedContent?.metadata?.toolName || parsedContent?.metadata?.itemName;
  const tool = allTools.find((tool) => tool.title === brandName);

  const host = typeof window !== "undefined" ? window.location.hostname : "";
  let domain = "https://app.flowvahub.com";
  if (host === "flowvahub.com") domain = "https://flowvahub.com";
  if (host === "app.flowvahub.com") domain = "https://app.flowvahub.com";

  const shareMessage = `🎉 I just claimed a ${rewardTitle} reward on Flowva!

Flowva is a platform where you discover top tools, earn exclusive rewards, and grow with a vibrant community.

✨ Join me on Flowva and start earning too — sign up now and get rewarded: ${domain}`;

  const openSocial = (platform: string) => {
    const encoded = encodeURIComponent(shareMessage);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encoded}`,
      x: `https://twitter.com/intent/tweet?text=${encoded}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?summary=${encoded}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encoded}`,
    };
    window.open(urls[platform], "_blank");
  };

  if (!modalOpen || !data) return null;

  return (
    <Modal
      width="100%"
      style={{ maxWidth: 500, padding: "8px" }}
      title={
        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <MailOpenIcon size={20} />
          <h3 className="md:text-lg font-semibold">
            {parsedContent?.title || "Notification"}
          </h3>
        </div>
      }
      styles={{
        body: {
          padding: "0px",
        },
        content: {
          padding: "0px",
        },
      }}
      open={modalOpen}
      footer={null}
      onCancel={() => setModalOpen(false)}
    >
      <div className=" min-h-24 space-y-4 px-3 pb-3">
        {/* Normal (non-share) notification */}

        <p className="text-sm">
          {(type === "tool_added" || type === "tool_removed") && (
            <img
              src={tool?.toolLogo}
              className="w-7 h-7 rounded-sm"
              alt="logo"
            />
          )}
          {type !== "tool_shared" && type !== "stack_shared" && (
            <span
              dangerouslySetInnerHTML={{
                __html: parsedContent?.body || "No details provided.",
              }}
            />
          )}
        </p>
        {type === "claimed_reward" && (
          <div>
            <h2 className="text-center font-semibold text-[#9103fe] mt-6">
              🎁&nbsp;Share your win and earn 50 Flowva points!
            </h2>
            <p className="text-center text-sm">
              Let others know about your reward:
            </p>
            <div className="flex justify-center gap-[1rem] mt-[1rem]">
              <IconButton
                platform="facebook"
                color="#1877F2"
                icon={Icons.Facebook}
                onClick={openSocial}
              />
              <IconButton
                platform="x"
                color="black"
                icon={Icons.X}
                onClick={openSocial}
              />
              <IconButton
                platform="linkedin"
                color="#0077B5"
                icon={Icons.Linkedin}
                onClick={openSocial}
              />
              <IconButton
                platform="whatsapp"
                color="#25D366"
                icon={Icons.Whatsapp}
                onClick={openSocial}
              />
            </div>
            <p className="text-center text-sm">
              Send proof to{" "}
              <a className="text-[#9103fe]" href="mailto:support@flowvahub.com">
                support@flowvahub.com
              </a>{" "}
              to claim 50 points
            </p>
          </div>
        )}

        {/* Share: Collection metadata */}
        {collectionName && item_type === "stack" && (
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Stack:</strong> {collectionName}
            </p>
            <p className="text-sm">
              <strong>Shared by:</strong> {senderName}
            </p>

            {collectionDescription && (
              <p className="text-sm">
                <strong>Description:</strong> {collectionDescription}
              </p>
            )}
          </div>
        )}

        {/* Share: Tool metadata */}
        {singleTool && item_type === "tool" && (
          <>
            <p className="text-sm">
              <strong>Tool Name:</strong> {singleTool.title}
            </p>
            <p className="text-sm">
              <strong>Description:</strong> {singleTool.description}
            </p>
            <p className="text-sm">
              <strong>Shared by:</strong> {senderName}
            </p>
          </>
        )}

        {/* Tool UI */}
        {loadingTool || loadingTools ? (
          <Spin />
        ) : item_type === "tool" && singleTool ? (
          <div
            key={singleTool.id}
            className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => window.open(singleTool.url, "_blank")}
          >
            <div className="flex items-center gap-2">
              <img
                src={singleTool.toolLogo}
                alt={singleTool.title}
                className="h-6 w-6 object-contain"
              />
              <span>{singleTool.title}</span>
            </div>
            <FontAwesomeIcon
              icon={Icons.ExternalLink}
              className="text-purple-600"
            />
          </div>
        ) : tools.length && item_type === "stack" ? (
          <div className=" max-h-[300px] overflow-y-auto">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex h-full  min-w-max justify-between items-center p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => window.open(tool.url, "_blank")}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={tool.toolLogo}
                    alt={tool.title}
                    className="h-6 w-6 object-contain"
                  />
                  <span>{tool.title}</span>
                </div>
                <FontAwesomeIcon
                  icon={Icons.ExternalLink}
                  className="text-purple-600"
                />
              </div>
            ))}
          </div>
        ) : (
          item_type === "collection" && (
            <Empty description="No tools in this collection" />
          )
        )}
        {(type === "tool_shared" || type === "stack_shared") && (
          <div className="flex justify-end">
            <button
              onClick={handleAccept}
              className="text-white bg-[#9013fe] gap-3 hover:bg-[#780dd6] flex justify-center items-center rounded-[100px] py-[5px] px-3"
            >
              {acceptLoading && <div className="form-loader"></div>}{" "}
              {acceptLoading ? (
                <p>
                  Accepting<span className=" animate-pulse"> ...</span>
                </p>
              ) : (
                <span>Accept</span>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
