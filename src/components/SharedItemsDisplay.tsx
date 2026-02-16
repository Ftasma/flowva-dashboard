import React, { useState, useEffect } from "react";
import {
  Tabs,
  Spin,
  Card,
  Button,
  Modal,
  Typography,
  Space,
  Alert,
  Popconfirm,
  notification,
} from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import supabase from "../lib/supabase";
import { addToLibrary } from "../services/my-library/libraryService";
import { copyCustomTool, copyCollection } from "../helpers/copyCustomTool";
import { useSharedWithMe, SharedItem } from "../hooks/dashboard/useSharedItems";
import { useSharedByMe } from "../hooks/dashboard/useSharedItems";
import { useToolDetails } from "../hooks/dashboard/useToolDetails";
import { useCollectionDetails } from "../hooks/dashboard/useToolDetails";
import { useSubscription } from "../hooks/usesubscriptions";
// import { useLibraryTools } from "../hooks/my-library/useLibraryTools";
// import { useCollections } from "../hooks/dashboard/useCollections";
import PremiumModal from "./dashboard/Modals/PremiumModal";

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const SharedItemsDisplay: React.FC = () => {
  // ─── Hooks & Data ──
  const {
    items: withMe,
    loading: loadingWithMe,
    refetch: refetchWithMe,
    processingToken,
    tokenProcessed,
    clearTokenProcessed,
  } = useSharedWithMe();


  const {
    items: byMe,
    loading: loadingByMe,
    refetch: refetchByMe,
  } = useSharedByMe();

  const { subscription, loading: loadingSubscription } = useSubscription();

  // Selected shared item + details
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const { tool, loading: loadingTool } = useToolDetails(
    selectedItem?.item_id ?? "",
    selectedItem?.item_type === "tool" ? "tool" : ""
  );
  const { collection, loading: loadingCollection } = useCollectionDetails(
    selectedItem?.item_id ?? "",
    selectedItem?.item_type === "collection" ? "collection" : ""
  );

  // ─── Local UI State ─────────
  const [modalVisible, setModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

  // FIXED: Move the premium modal state to the component level
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  // ─── 1) Claim shared token on page load ───────────────────────────────────
  useEffect(() => {
    const processToken = async () => {
      const flow = localStorage.getItem("sharedFlow");

      if (flow !== "true") {
        // Try to get token directly from URL as fallback
        const urlParams = new URLSearchParams(location.search);
        const urlToken = urlParams.get("token");
        if (urlToken) {
          localStorage.setItem("sharedToken", urlToken);
          localStorage.setItem("sharedFlow", "true");
        } else {
          return;
        }
      }

      // Primary: localStorage.sharedToken; Fallback: ?token=
      let token = localStorage.getItem("sharedToken") || "";

      if (!token) {
        const urlParams = new URLSearchParams(location.search);
        token = urlParams.get("token") || "";
      }

      if (!token) {
        localStorage.setItem("sharedFlow", "false");
        return;
      }

      try {
        // 1) Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Not authenticated");

        // 2) Fetch original share row

        const { data: shareData, error: fetchErr } = await supabase
          .from("shared_items")
          .select();

        if (fetchErr) throw fetchErr;

        // Filter manually to avoid query parameter issues
        const original = shareData?.find((item) => item.token === token);

        if (!original) throw new Error("Invalid token");

        // 3) Check if already claimed
        const { data: allClaims, error: existingErr } = await supabase
          .from("shared_items")
          .select("id, token, recipient_id");

        if (existingErr) throw existingErr;

        // Filter manually to avoid query parameter issues
        const existing = allClaims?.find(
          (item) => item.token === token && item.recipient_id === user.id
        );

       

        if (existing) {
          notification.info({ message: "Already claimed this share." });
        } else {
          // 4) Insert new claimed row
          const newClaim = {
            sender_id: original.sender_id,
            recipient_email: user.email,
            recipient_id: user.id,
            item_id: original.item_id,
            item_type: original.item_type,
            shared_via: original.shared_via,
            token: original.token,
            claimed: true,
          };

          const { error: insertErr } = await supabase
            .from("shared_items")
            .insert(newClaim);

          if (insertErr) throw insertErr;

          notification.success({ message: "Shared item claimed!" });
          localStorage.removeItem("sharedToken");
          refetchWithMe();
          // useCollections(currentUser?.id || null);
          // useLibraryTools(currentUser?.id || null);
        }
      } catch (err: any) {
        console.error("Error claiming share:", err);
        notification.error({
          message: "Failed to claim share",
          description: err.message,
        });
      } finally {
        localStorage.setItem("sharedFlow", "false");
      }
    };

    processToken();
  }, [location.search, refetchWithMe]);

  // ─── 2) Token-processed notifications ────
  useEffect(() => {
    if (!tokenProcessed) return;

    if (tokenProcessed.success) {
      notification.success({
        message: "Shared Item Added",
        description: `A shared ${tokenProcessed.itemType} was added.`,
      });
    } else {
      notification.error({
        message: "Share Processing Failed",
        description: tokenProcessed.error,
        btn: (
          <Button size="small" onClick={clearTokenProcessed}>
            Retry
          </Button>
        ),
      });
    }

    clearTokenProcessed();
  }, [tokenProcessed, clearTokenProcessed]);

  // ─── Handlers ─────
  const handleViewItem = (item: SharedItem) => {
    setSelectedItem(item);
    setModalVisible(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleAccept = async () => {
    if (!selectedItem) return;
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      // a) Mark accepted
      const { error: acceptErr } = await supabase
        .from("shared_items")
        .update({ accepted: true, accepted_at: new Date().toISOString() })
        .match({ id: selectedItem.id });

      if (acceptErr) throw acceptErr;

      // b) Get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // c) Add or copy
      if (selectedItem.item_type === "tool") {
        if (!tool) throw new Error("Tool details missing");

        let toolIdToAdd = tool.id;
        if (tool.is_custom) {
          const {
            success,
            toolId,
            error: copyErr,
          } = await copyCustomTool(tool.id, user.id);
          if (!success || !toolId) throw new Error(copyErr || "Copy failed");
          toolIdToAdd = toolId;
        }

        const res = await addToLibrary(user.id, toolIdToAdd);
        if (res.status !== 200) throw new Error(res.error || "Add failed");
      } else {
        if (!collection) throw new Error("Collection details missing");

        const {
          success,
          collectionId,
          error: collErr,
        } = await copyCollection(collection.id, user.id);
        if (!success || !collectionId)
          throw new Error(collErr || "Copy failed");
      }

      setSuccess("Accepted!");
      refetchWithMe();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = () => {
    handleCloseModal();
  };

  const handleDeleteItem = async (id: string, byMe = false) => {
    setDeletingItem(id);
    try {
      const { error: delErr } = await supabase
        .from("shared_items")
        .delete()
        .match({ id: id });

      if (delErr) throw delErr;
      byMe ? refetchByMe() : refetchWithMe();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingItem(null);
    }
  };

  // FIXED: Added these functions at component level
  const showPremiumModal = () => {
    setIsPremiumModalVisible(true);
  };

  const handleClosePremiumModal = () => {
    setIsPremiumModalVisible(false);
  };

  // const handleUpgrade = () => {
  //   alert('User clicked upgrade');
  //   setIsPremiumModalVisible(false);
  // };

  // ─── Modal Content ─────────────────────────────────────────────────────────
  const renderModalContent = () => {
    if (loadingSubscription) return <Spin size="large" />;

    // FIXED: Removed the hooks and function declarations from here

    const userType = subscription?.user_type ?? "free";
    if (userType === "free") {
      return (
        <>
          <div style={{ textAlign: "center", padding: 24 }}>
            <Title level={4}>Upgrade Required</Title>
            <Paragraph>
              You need a Pro or Teams plan to view this shared item.
            </Paragraph>
            <Button type="primary" size="large" onClick={showPremiumModal}>
              Upgrade Now
            </Button>
          </div>

          {/* PremiumModal is now rendered in the main component return */}
        </>
      );
    }

    if (selectedItem?.item_type === "tool") {
      if (loadingTool) return <Spin size="large" />;
      if (!tool) return <Alert type="error" message="Tool not found" />;

      return (
        <>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            {tool.icon_url && (
              <img
                src={tool.icon_url}
                alt={tool.title}
                style={{
                  width: 80,
                  height: 80,
                  marginBottom: 16,
                  borderRadius: 8,
                }}
              />
            )}
            <Title level={3}>{tool.title}</Title>
          </div>
          <Paragraph>{tool.description}</Paragraph>
          {tool.category?.length && (
            <Paragraph>
              <Text strong>Categories:</Text> {tool.category.join(", ")}
            </Paragraph>
          )}
          {tool.url && (
            <Paragraph>
              <Text strong>URL:</Text>{" "}
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                {tool.url}
              </a>
            </Paragraph>
          )}
          <Paragraph>
            <Text strong>Tool Type:</Text>{" "}
            {tool.is_custom ? "Custom" : "Default"}
          </Paragraph>
          <Paragraph type="secondary" code>
            Token: {selectedItem.token}
          </Paragraph>

          {error && (
            <Alert type="error" message={error} style={{ marginBottom: 16 }} />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              style={{ marginBottom: 16 }}
            />
          )}

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button
              type="primary"
              onClick={handleAccept}
              loading={processing}
              disabled={!!success}
            >
              Accept
            </Button>{" "}
            <Button onClick={handleDecline}>Decline</Button>
          </div>
        </>
      );
    }

    if (selectedItem?.item_type === "collection") {
      if (loadingCollection) return <Spin size="large" />;
      if (!collection)
        return <Alert type="error" message="Collection not found" />;

      return (
        <>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: collection.color || "#1890ff",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: "white",
                marginBottom: 16,
              }}
            >
              {collection.name.charAt(0).toUpperCase()}
            </div>
            <Title level={3}>{collection.name}</Title>
          </div>
          <Paragraph>{collection.description}</Paragraph>
          <Paragraph>
            <Text strong>Total Tools:</Text> {collection.total_tool_count}
          </Paragraph>
          {collection.tools?.length && (
            <Paragraph>
              <Text strong>Contains:</Text>
              <ul>
                {collection.tools.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </Paragraph>
          )}
          <Paragraph type="secondary" code>
            Token: {selectedItem.token}
          </Paragraph>

          {error && (
            <Alert type="error" message={error} style={{ marginBottom: 16 }} />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              style={{ marginBottom: 16 }}
            />
          )}

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button
              type="primary"
              onClick={handleAccept}
              loading={processing}
              disabled={!!success}
            >
              Accept
            </Button>{" "}
            <Button onClick={handleDecline}>Decline</Button>
          </div>
        </>
      );
    }

    return <Alert type="error" message="Unknown item type" />;
  };

  // ─── Render ────────
  return (
    <>
      <Card>
        {processingToken && (
          <Alert
            message="Processing Shared Item"
            description="Adding the shared item to your account..."
            type="info"
            showIcon
            action={
              <Button size="small" onClick={clearTokenProcessed}>
                Retry
              </Button>
            }
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Add explicit claim button for token in localStorage */}
        {(() => {
          const token = localStorage.getItem("sharedToken");
          if (token) {
            return (
              <Alert
                message="Shared Item Available"
                description="A shared item token is available in your browser. Click to claim it."
                type="info"
                showIcon
                action={
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      localStorage.setItem("sharedFlow", "true");
                      window.location.reload();
                    }}
                  >
                    Claim Item
                  </Button>
                }
                style={{ marginBottom: 16 }}
              />
            );
          }
          return null;
        })()}

        <Tabs defaultActiveKey="withMe">
          <TabPane tab="Shared With Me" key="withMe">
            {loadingWithMe || processingToken ? (
              <Spin />
            ) : withMe.length === 0 ? (
              <Alert type="info" message="No items shared with you yet." />
            ) : (
              withMe.map((item) => (
                <Card
                  key={item.id}
                  size="small"
                  style={{ marginBottom: 12 }}
                  title={`Shared ${item.item_type}`}
                  extra={
                    <Space>
                      <Button size="small" onClick={() => handleViewItem(item)}>
                        View
                      </Button>
                      <Popconfirm
                        title="Delete this shared item?"
                        description="Removes it from your list; original stays intact."
                        onConfirm={() => handleDeleteItem(item.id)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          loading={deletingItem === item.id}
                        />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <Paragraph>
                    <Text strong>From:</Text> {item.sender_id}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Via:</Text> {item.shared_via}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Token:</Text> <code>{item.token}</code>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>At:</Text>{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </Paragraph>
                </Card>
              ))
            )}
          </TabPane>

          <TabPane tab="Shared By Me" key="byMe">
            {loadingByMe ? (
              <Spin />
            ) : byMe.length === 0 ? (
              <Alert type="info" message="You haven't shared anything yet." />
            ) : (
              byMe.map((item) => (
                <Card
                  key={item.id}
                  size="small"
                  style={{ marginBottom: 12 }}
                  title={`Shared ${item.item_type}`}
                  extra={
                    <Space>
                      <Link to={`/share/${item.token}`}>
                        <Button size="small">Link</Button>
                      </Link>
                      <Popconfirm
                        title="Revoke this shared access?"
                        description="The recipient will no longer be able to accept or view this."
                        onConfirm={() => handleDeleteItem(item.id, true)}
                        okText="Revoke"
                        cancelText="Cancel"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          loading={deletingItem === item.id}
                        />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <Paragraph>
                    <Text strong>To:</Text> {item.recipient_email ?? "—"}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Via:</Text> {item.shared_via}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Token:</Text> <code>{item.token}</code>
                  </Paragraph>
                  <Paragraph>
                    <Text strong>At:</Text>{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </Paragraph>
                </Card>
              ))
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={
          selectedItem?.item_type === "tool"
            ? "Shared Tool"
            : "Shared Collection"
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        {renderModalContent()}
      </Modal>

      <PremiumModal
        isVisible={isPremiumModalVisible}
        onClose={handleClosePremiumModal}
        // onUpgrade={handleUpgrade}
      />
    </>
  );
};

export default SharedItemsDisplay;
