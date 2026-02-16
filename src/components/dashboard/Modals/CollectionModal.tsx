import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Select,
  Space,
  Typography,
  Popover,
  Tag,
} from "antd";
import { SketchPicker, ColorResult } from "react-color";
import { CollectionFormData } from "../../../services/upsertCollection.service";
import NotificationHelpers from "../../../utils/notifications/notificationHelpers";
import { useLibraryToolsContext } from "../../../context/LibraryToolsContext";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { useCollectionTools } from "../../../context/CollectionToolsContext";
import {
  logUserActivity
} from "../../../services/user/activityTrack";

const { TextArea } = Input;
const { Title } = Typography;

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CollectionFormData) => Promise<void>;
  initialData?: CollectionFormData;
}

const CollectionModal: React.FC<CollectionModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const { currentUser } = useCurrentUser();
  const { tools, setUserId } = useLibraryToolsContext();
  useEffect(() => {
    if (currentUser) setUserId(currentUser?.id);
  }, [currentUser]);

  const { collectionTools, setUserId: collectionUserId } = useCollectionTools();
  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser?.id);
      collectionUserId(currentUser.id);
    }
  }, [currentUser]);
  const [form, setForm] = useState<CollectionFormData>({
    name: "",
    userId: "",
    description: "",
    color: "#9013FE",
    toolIds: [],
  });
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalToolIds, setOriginalToolIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      // Start with the initial data
      let formData = { ...initialData };

      // If we're editing an existing collection, get the tool IDs from collectionTools
      if (initialData.id) {
        // Find all tools that belong to this collection
        const collectionToolIds = collectionTools
          .filter((tool) => tool.collectionId === initialData.id)
          .map((tool) => tool.libraryId);

        // Update the toolIds with the actual tools in the collection
        formData.toolIds = collectionToolIds;
        setOriginalToolIds(collectionToolIds);
      }

      setForm(formData);
    }
  }, [initialData, collectionTools]);

  const handleChange = <K extends keyof CollectionFormData>(
    key: K,
    value: any
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!currentUser?.id || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Identify removed tools before saving
      const removedToolIds = originalToolIds.filter(
        (id) => !form.toolIds.includes(id)
      );

      await onSave(form);

      await logUserActivity({
        userId: currentUser.id,
        action: initialData ? "Updated a stack" : "Created a stack",
        metadata: {
          service: 'stack',
          collectionName: form.name,
          collectionId: initialData?.id || null,
          toolCount: form.toolIds.length,
        },
      });

      removedToolIds.forEach((toolId) => {
        const removedTool = tools.find((t) => t.libraryId === toolId);

        if (removedTool && initialData?.name && initialData?.id) {
          NotificationHelpers.onToolRemovedFromStack(
            removedTool.title,
            initialData.name,
            initialData.id,
            currentUser.id
          );
        }
      });
      onClose();
      setForm({
        name: "",
        description: "",
        color: "#9013FE",
        toolIds: [],
        userId: "",
      });
    } catch (error) {
      console.error("Error saving collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the list of tools that are in the collection
  const existingTools = tools.filter((tool) =>
    form.toolIds.includes(tool.libraryId)
  );

  // Get tools not in the collection yet for the dropdown
  const availableTools = tools.filter(
    (tool) => !form.toolIds.includes(tool.libraryId)
  );

  return (
    <Modal
      open={open}
      title={initialData?.id ? "Edit Tech Stack" : "+ Add New Tech Stack"}
      footer={null}
      onCancel={onClose}
      centered
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          placeholder="Tech Stack Name"
          className="h-10 text-base"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextArea
          placeholder="Description (optional)"
          rows={3}
          className="text-base"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* Color Picker Popover */}
        <div>
          <Title level={5}>Color</Title>
          <Popover
            content={
              <SketchPicker
                color={form.color}
                onChangeComplete={(c: ColorResult) =>
                  handleChange("color", c.hex)
                }
              />
            }
            trigger="click"
            open={colorPickerVisible}
            onOpenChange={setColorPickerVisible}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: form.color,
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer",
              }}
            />
          </Popover>
        </div>

        <div>
          <Title level={5}>Add Tools</Title>

          {/* Display existing tools as tags */}
          {existingTools.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ marginBottom: 5 }}>Selected tools:</div>
              <Space wrap>
                {existingTools.map((tool) => (
                  <Tag
                    key={tool.libraryId}
                    closable
                    onClose={() => {
                      const updatedToolIds = form.toolIds.filter(
                        (id) => id !== tool.libraryId
                      );
                      handleChange("toolIds", updatedToolIds);
                    }}
                  >
                    {tool.title}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {/* Select for adding new tools */}
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={
              existingTools.length > 0
                ? "Add more tools"
                : "Select from your library"
            }
            value={[]} // Always keep empty so we can add but not see what's already been added
            onChange={(ids) => {
              // Combine existing IDs with newly selected IDs
              const updatedToolIds = [...form.toolIds, ...ids];
              handleChange("toolIds", updatedToolIds);
            }}
          >
            {availableTools.map((tool) => (
              <Select.Option key={tool.libraryId} value={tool.libraryId}>
                {tool.title}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Action Buttons */}
        <Space
          style={{ marginTop: 16, justifyContent: "flex-end", width: "100%" }}
        >
          <Button
            onClick={onClose}
            className="rounded-[100px] h-9 py-2 font-semibold"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="rounded-[100px] h-9 py-2 font-semibold"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !form.name.trim()}
            style={{
              backgroundColor: "#9013FE",
              borderColor: "#9013FE",
              color: "white",
              padding: "12px",
            }}
          >
            {initialData?.id ? "Update Tech Stack" : "Create Tech Stack"}
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default CollectionModal;
