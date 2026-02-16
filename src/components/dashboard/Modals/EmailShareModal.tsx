import { useState } from "react";
import { Modal, Button, Form, Input, message, Alert, Spin } from "antd";
import { sendShareEmail } from "../../../services/shareService";
import {
  invitationEmailHtml,
  invitationEmailText,
  getFirstName,
  useSenderName,
} from "../../../utils/emailTemplates";
import { InfoCircleOutlined } from "@ant-design/icons";

// Rename shareUrl to signinUrl for clarity
interface Props {
  open: boolean;
  onClose: () => void;
  shareUrl: string; // Using the existing prop name but treating it as signinUrl
  itemType: "tool" | "collection";
}

interface ShareFormValues {
  recipientEmail: string;
  recipientName?: string;
  message: string;
}

export default function EmailShareModal({
  open,
  onClose,
  shareUrl, // Shortened Url
  itemType,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  // Use the hook to get sender name
  const { senderName: hookSenderName, isLoading: loadingSenderName } =
    useSenderName();

  // Use the name from the hook
  const effectiveSenderName = hookSenderName;

  // Reset form and error when modal opens/closes
  const handleClose = () => {
    form.resetFields();
    setError(null);
    onClose();
  };

  const onFinish = async (values: ShareFormValues) => {
    // Additional validation
    if (!values.recipientEmail || !values.recipientEmail.trim()) {
      setError("Please enter a recipient email address");
      return;
    }

    // Check if shortenedUrl is valid
    if (!shareUrl) {
      setError(
        "Share URL is not ready yet. Please wait a moment and try again."
      );
      return;
    }

    // Check if we have a sender name
    if (!effectiveSenderName) {
      setError("Unable to determine sender name. Please try again later.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const email = values.recipientEmail.trim();
      const subject = `${effectiveSenderName} shared a ${itemType} with you`;

      // Extract recipient's first name if provided
      const recipientFirstName = values.recipientName
        ? getFirstName(values.recipientName)
        : "";

    

      // Create email content
      const htmlBody = invitationEmailHtml({
        senderName: effectiveSenderName,
        itemType,
        sharedUrl: shareUrl,
        customMessage: values.message || "",
        recipientFirstName,
      });

      const textBody = invitationEmailText({
        senderName: effectiveSenderName,
        itemType,
        sharedUrl: shareUrl,
        customMessage: values.message || "",
        recipientFirstName,
      });

      // Send the email
      await sendShareEmail(email, subject, htmlBody, textBody);

      message.success("Email sent successfully!");
      handleClose();
    } catch (e: any) {
      console.error("Email sending failed:", e);
      setError(e.message || "Failed to send email. Please try again later.");
      message.error("Failed to send email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Share via Email"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose={true}
      maskClosable={!submitting}
      closable={!submitting}
    >
      {!shareUrl || loadingSenderName ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin />
          <p style={{ marginTop: "10px" }}>
            {!shareUrl
              ? "Generating share link..."
              : "Loading user information..."}
          </p>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ recipientEmail: "", recipientName: "", message: "" }}
        >
          {error && (
            <Form.Item>
              <Alert
                type="error"
                message={error}
                showIcon
                closable
                onClose={() => setError(null)}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Alert
              type="info"
              showIcon
              icon={<InfoCircleOutlined style={{ color: "#9031fe" }} />}
              message={`Email will be sent as: ${effectiveSenderName}`}
              style={{
                marginBottom: "16px",
                borderColor: "#9031fe",
                backgroundColor: "#eef2ff",
              }}
            />
          </Form.Item>

          <Form.Item
            name="recipientEmail"
            label="Recipient Email"
            rules={[
              { required: true, message: "Please enter recipient email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              className="w-full h-full border py-[0.5rem] px-[1rem] text-base border-[#EDE9FE] rounded-md 
             hover:border-[#9013fe] focus:border-[#9013fe] focus:outline-none focus:ring-0"
              placeholder="myfriend@example.com"
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item name="message" label="Your Message">
            <Input.TextArea
              rows={4}
              placeholder="Optional note to include with your share..."
              disabled={submitting}
              className="w-full h-full border py-[0.5rem] px-[1rem] text-base border-[#EDE9FE] rounded-md 
               hover:border-[#9013fe] focus:border-[#9013fe] focus:outline-none focus:ring-0 resize-none"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            className="w-full text-white hover:!text-white border-none rounded-[100px] text-base font-semibold h-[40px] bg-[#9013fe] hover:!bg-[#8c0bfd]
             focus:!outline-none focus:!ring-0 focus:!shadow-none hover:!shadow-none active:!shadow-none"
            loading={submitting}
            disabled={!shareUrl || submitting}
          >
            Send Email
          </Button>
        </Form>
      )}
    </Modal>
  );
}
