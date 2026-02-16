/**
 * Email template utilities for Flowva
 */

import { useCurrentUser } from "../context/CurrentUserContext";
import { useUserProfile } from "../context/UseProfileContext";
// import useUserProfile from "../hooks/auth/useUserProfile";

// Type for the shared item types in the system
export type ItemType = "tool" | "collection";

// Parameters for email template generation
export interface EmailTemplateParams {
  senderName: string;
  itemType: ItemType;
  previewUrl?: string;
  customMessage?: string;
  recipientFirstName?: string;
  sharedUrl: string;
}

/**
 * Extract the first name from a full name
 * @param fullName - The full name to extract from (e.g. "Jane Smith")
 * @returns The first name portion
 */
export function getFirstName(fullName: string): string {
  if (!fullName || !fullName.trim()) {
    return "";
  }
  return fullName.split(" ")[0].trim();
}

/**
 * Hook to get the current user's display name using the available hooks
 * @returns The name to use as the sender in emails and loading state
 */
/**
 * Enhanced hook to get the current user's display name using the available hooks
 * This version focuses on getting the actual user name (not ID) and includes
 * better debugging and fallback mechanisms
 * @returns The name to use as the sender in emails and loading state
 */
export function useSenderName(): { senderName: string; isLoading: boolean } {
  // const { userProfile, loading: profileLoading } = useUserProfile();
  const { userProfileData, loading } = useUserProfile();
  const { currentUser, loading: currentUserLoading } = useCurrentUser();

  const isLoading = loading || currentUserLoading;

  // Explicitly check for name fields, not just truthy values
  // This helps avoid using IDs or other non-name properties
  const profileName = userProfileData?.name || userProfileData?.name || null;
  const supabaseName = userProfileData?.name || userProfileData?.name || null;
  const currentUserName = currentUser?.name || currentUser?.name || null;

  // Use the first available actual name, with a clear fallback chain
  const senderName =
    profileName || supabaseName || currentUserName || "Flowva User";

  return { senderName, isLoading };
}

/**
 * Fallback function to get sender name outside React components
 * @returns The name to use as the sender in emails
 */
export function getSenderDisplayName(): string {
  // This is a non-hook implementation that should be used in non-component contexts
  try {
    // Try to get from localStorage as fallback
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.displayName || user.name || user.firstName || "Flowva User";
    }
    return "Flowva User";
  } catch (error) {
    console.error("Error getting sender name:", error);
    return "Flowva User";
  }
}

/**
 * Generate the HTML body for a "You've been invited" email.
 */
export function invitationEmailHtml(params: EmailTemplateParams): string {
  const {
    senderName,
    itemType,
    sharedUrl,
    customMessage = "",
    recipientFirstName = "",
  } = params;

  const greeting = recipientFirstName
    ? `Hi ${recipientFirstName},`
    : "Hi there,";
  const itemTypeDisplay =
    itemType === "tool" ? "tool/tech stack" : "collection";

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔧 A new ${itemTypeDisplay} has been shared with you on Flowva</title>
  <style>
    body { margin: 0; padding: 0; font-family: Georgia, serif; background-color: #ffffff; }
    a { color: #9013fe; text-decoration: none; }
    .button { background-color: #9013fe; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; }
    .content { max-width: 600px; margin: auto; padding: 20px; }
    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 20px; }
    @media (max-width: 600px) {
      .content { padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="content">
    <img src="https://img.mailinblue.com/9006050/images/content_library/original/67f4434986bec7382dedeb19.png" alt="Flowva Banner" style="width: 100%; max-width: 570px; border-radius: 8px; display: block; margin-bottom: 20px;" />
    <p>${greeting}</p>

    <p><strong>${senderName}</strong> just shared a ${itemTypeDisplay} with you on Flowva.</p>

    ${customMessage ? `<p>"${customMessage}"</p>` : ""}

    <p>With one click, you’ll be able to view and interact with it — no hassle:</p>

    <p style="text-align: center;">
      <a href="${sharedUrl}" class="button" target="_blank">View Shared ${itemTypeDisplay}</a>
    </p>

    <p>
      Whether you’re new or returning, we’ll guide you through the right flow.
      No need to sign up or sign in first — just click the button.
    </p>

    <p>If that doesn’t work, copy and paste this link into your browser:</p>
    <p><a href="${sharedUrl}">${sharedUrl}</a></p>

    <div class="footer">
      <p>Sent with 💜 by the Flowva Team</p>
      <p>If you weren't expecting this email, you can safely ignore it.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Create a complete email with the current user as the sender
 * For use within React components
 */
export function useCreateInvitationEmail() {
  const { senderName } = useSenderName();

  return (params: Omit<EmailTemplateParams, "senderName">) => {
    return {
      html: invitationEmailHtml({ ...params, senderName }),
      text: invitationEmailText({ ...params, senderName }),
    };
  };
}

/**
 * Create a complete email with the current user as the sender
 * For use outside of React components
 * @returns Object containing both HTML and text versions of the email
 */
export function createInvitationEmail(
  params: Omit<EmailTemplateParams, "senderName">
) {
  const senderName = getSenderDisplayName();
  return {
    html: invitationEmailHtml({ ...params, senderName }),
    text: invitationEmailText({ ...params, senderName }),
  };
}

/**
 * Generate the plain-text fallback for the same email.
 */
export function invitationEmailText(params: EmailTemplateParams): string {
  const {
    senderName,
    itemType,
    sharedUrl,
    customMessage = "",
    recipientFirstName = "",
  } = params;

  const greeting = recipientFirstName
    ? `Hi ${recipientFirstName},`
    : "Hi there,";
  const itemTypeDisplay =
    itemType === "tool" ? "tool/tech stack" : "collection";

  return `${greeting}

${senderName} just shared a ${itemTypeDisplay} with you on Flowva.

${customMessage ? `"${customMessage}"\n\n` : ""}Here's what that means:
✅ You've got access to a curated setup that can help streamline your workflow.
✅ You can view, customize, and use it however it fits your needs.
✅ It's ready for you right now.

Click the link below to view it:
${sharedUrl}

No need to worry about logging in first — we'll guide you whether you're new or already have an account.

If the link doesn't open, simply copy and paste it into your browser:
${sharedUrl}

Enjoy exploring,  
The Flowva Team

Sent with 💜 by Flowva. If you didn't expect this, you can ignore it.
`;
}

type ToolReward = {
  title: string;
  header: string;
  coupon?: string;
  link: string;
};

// Email Subject constant
export const TOOL_REWARD_EMAIL_SUBJECT =
  "🎁 Your Flowva Tool Discount Reward Has Arrived!";

// HTML generator
export function generateToolRewardEmailHTML({
  name = "Buddie",
  tools,
}: {
  name: string;
  tools: ToolReward[];
}): string {
  const toolBlocks = tools
    .map(
      (tool) => `
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin: 0; font-size: 16px; color: #9013fe; font-family: Verdana;">${
              tool.title
            }</h3>
            <p style="margin: 4px 0; font-family: Verdana;">${tool.header}</p>
            ${
              tool.coupon
                ? `<p style="margin: 4px 0; font-weight: bold; font-family: Verdana;">${tool.coupon}</p>`
                : ""
            }
            <p style="margin: 4px 0; font-family: Verdana;">
              <a href="${tool.link}" target="_blank" style="color: #1a0dab;">${
        tool.link
      }</a>
            </p>
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <title>🎁 Your Flowva Gift Has Arrived!</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
    body {
      width: 100% ;
      margin: 0;
      padding: 0;
      font-family: Verdana, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #414141;
      background-color: #ffffff !important;
    }
    a {
      color: #9013fe;
      text-decoration: none;
    }
    img {
      display: block;
      border: none;
      outline: none;
      text-decoration: none;
    }
    table {
      border-collapse: collapse;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      opacity: 0;
      color: transparent;
      height: 0;
      width: 0;
      mso-hide: all;
      overflow: hidden;
    }
  </style>
</head>

<body>
  <!-- Preheader -->
  <div class="preheader">Your Flowva reward has arrived! Claim discounts from top tools 🎁</div>

  <!-- Main Table -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;">
          <tr>
            <td style="padding: 20px 15px;">
              <!-- Banner -->
              <img src="https://img.mailinblue.com/9006050/images/content_library/original/67f4434986bec7382dedeb19.png" width="570" alt="Flowva Gift Banner" style="width: 100%; max-width: 570px; border-radius: 8px;" />

              <!-- Greeting -->
              <p style="font-family: Palatino, Georgia, serif; margin-top: 24px; color:black">
                🎉 Congratulations ${name},
              </p>
              <p style="font-family: Palatino, Georgia, serif; color:black">
  You've unlocked access to some of our favorite tools—see them below.<br>
  We’re thrilled to share these perks with you. Let us know if you need help using them!
</p>
              <!-- Tool Discounts -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                ${toolBlocks}
              </table>

              <p style="font-family: Palatino, Georgia, serif; color:black">
                Thanks for using Flowva.<br>
                More surprises ahead. 💜
              </p>
              <p style="font-family: Palatino, Georgia, serif; margin-bottom: 20px; color:black">
                With love,<br>
                <strong>The Flowva Team</strong>
              </p>

              
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function generateToolRewardEmailText({
  name = "Buddie",
  tools,
}: {
  name: string;
  tools: ToolReward[];
}): string {
  const lines = tools.map((tool) => {
    return `🔧 ${tool.title}\n${tool.header}\n${
      tool.coupon ? tool.coupon + "\n" : ""
    }${tool.link}\n`;
  });

  return `Hi ${name},

Thanks for claiming your reward! 🎁

Here are your tool discounts:

${lines.join("\n")}

Most gifts arrive instantly. If anything is missing, feel free to reach out.

With love,  
The Flowva Team 💜`;
}

export const FLOWVA_GIFT_EMAIL_SUBJECT = "We’ve received your reward claim";

interface FlowvaGiftEmailParams {
  firstName?: string;
  customMessage?: string;
  encoded?: string;
  reward: string
}

export function generateFlowvaGiftEmailHTML({
  firstName = "Buddie",
  encoded,
  reward,
  customMessage = "",
}: FlowvaGiftEmailParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Your Flowva Gift Is on the Way</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Palatino, Georgia, serif;
      font-size: 16px;
      line-height: 1.5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header-img {
      width: 100%;
      border-radius: 8px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img class="header-img" src="https://img.mailinblue.com/9006050/images/content_library/original/67f4434986bec7382dedeb19.png" alt="Flowva Gift Banner" />

    <div class="content" style="color: #000000; font-family: Palatino, Georgia, serif;">
      <p style="color: #000000;">Hi ${firstName},</p>

      <p style="color: #000000;">We got your reward claim, and your ${reward} is on its way! 🚚</p>
      <p style="color: #000000;">Hang tight — it’ll be delivered to your inbox soon.</p>
      <p style="color: #000000;">Most gifts arrive within 7 days. If you don’t see it by then, feel free to reach out.</p>

      <p style="color: #000000;">📌 Tip: If you're using Gmail, the reward email might appear in your <strong style="color:#000000;">Promotions</strong> tab. Please check there as well!</p>

      ${
        customMessage
          ? `<p style="margin-top: 20px; color:#000000;"><strong style="color:#000000;">Note:</strong> ${customMessage}</p>`
          : ""
      }
              <!-- Social Share Section -->
<table width="100%" style="margin-top: 30px; background-color: #f9f9f9; padding: 16px; border-radius: 8px;">
  <tr>
    <td style="text-align: center;">
 <p style="font-size: 16px; text-align: center; margin: 0 0 10px; font-weight: bold; color: #9013fe;">
  <span style="font-size: 16px;">🎁&nbsp;Share and earn 50 Flowva points!</span>
</p>
      <p style="margin: 0 0 15px;">Let others know about your reward:</p>

      <!-- Centered container for icons -->
      <table align="center" style="margin: 0 auto;">
        <tr>
          <td style="padding: 0 8px;">
            <a href="https://twitter.com/intent/tweet?text=${encoded}" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/5968/5968958.png" width="20" alt="X (Twitter)" />
            </a>
          </td>
          <td style="padding: 0 8px;">
            <a href="https://www.facebook.com/sharer/sharer.php?quote=${encoded}" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" alt="Facebook" />
            </a>
          </td>
          <td style="padding: 0 8px;">
            <a href="https://www.linkedin.com/sharing/share-offsite/?summary=${encoded}" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" width="20" alt="LinkedIn" />
            </a>
          </td>
          <td style="padding: 0 8px;">
            <a href="https://api.whatsapp.com/send?text=${encoded}" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="20" alt="WhatsApp" />
            </a>
          </td>
        </tr>
      </table>
      <p>Send proof to support@flowvahub.com to claim 50 points</p>
    </td>
  </tr>
</table>
      <p style="margin-top: 24px; color:#000000;">Thanks for using Flowva.<br>More surprises ahead. 💜</p>

      <p style="margin-top: 24px; color:#000000;">With love,<br><strong style="color:#000000;">The Flowva Team</strong></p>
    </div>

    <div class="footer">
      Sent with 💜 by Flowva. If you didn't expect this, feel free to ignore it.
    </div>
  </div>
</body>
</html>`;
}



export function generateBankTransferHtml(name = "buddie") {
  const subject = "🎉 Congratulations! Claim Your $5 Reward";
  const body = `
    <p style="margin: 12px 0;">
      We’re excited to let you know that you’ve earned a <strong>$5 reward</strong> from Flowva Hub! 🎁
    </p>

    <p style="margin: 12px 0;">
      To receive your reward via bank transfer, please provide your payout details as a reply to this mail, or reach out to <a href="mailto:support@flowvahub.com">support@flowvahub.com</a>.
    </p>

    <p style="margin: 12px 0;">
      It only takes a minute, and once your details are confirmed, we’ll process your transfer within the next 7 days.
    </p>

    <p style="margin: 12px 0;">
      Thank you for being an amazing part of our community. 🌟
    </p>
  `;

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
  </head>
  <body style="margin:0; padding:0; background:#ffffff; font-family: Palatino, Georgia, serif, Arial; color:#414141; line-height:1.5;">
    <div style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
      
      <!-- Banner -->
      <img src="https://img.mailinblue.com/9006050/images/content_library/original/67f4434986bec7382dedeb19.png"
        alt="Flowva Banner" style="width:100%; display:block; border-radius:8px 8px 0 0;" />
      
      <!-- Content -->
      <div style="padding:24px 20px; font-size:16px; text-align:justify;">
        <p style="margin: 12px 0;">Hi ${name || "Buddie"},</p>
        ${body}
        <p style="margin:16px 0;">
          With love, <br> <strong>The Flowva Team</strong>
        </p>
    </div>
      
      <!-- Footer -->
      <div style="background:#9013fe; padding:20px; text-align:center; color:#fff; font-size:14px;">
        <div>
          <a href="https://www.facebook.com/share/1DKr8atT1i/" target="_blank">
            <img src="https://creative-assets.mailinblue.com/editor/social-icons/rounded_colored/facebook_32px.png"
              style="margin:0 6px; width:32px; height:32px;" />
          </a>
          <a href="https://www.instagram.com/flowva.hub" target="_blank">
            <img src="https://creative-assets.mailinblue.com/editor/social-icons/rounded_colored/instagram_32px.png"
              style="margin:0 6px; width:32px; height:32px;" />
          </a>
          <a href="https://x.com/FlowvaHub" target="_blank">
            <img src="https://creative-assets.mailinblue.com/editor/social-icons/rounded_colored/twitter_32px.png"
              style="margin:0 6px; width:32px; height:32px;" />
          </a>
          <a href="https://www.tiktok.com/@flowva.hub" target="_blank">
            <img src="https://creative-assets.mailinblue.com/editor/social-icons/rounded_colored/tiktok_32px.png"
              style="margin:0 6px; width:32px; height:32px;" />
          </a>
          <a href="https://www.linkedin.com/company/flowva/" target="_blank">
            <img src="https://creative-assets.mailinblue.com/editor/social-icons/rounded_colored/linkedin_32px.png"
              style="margin:0 6px; width:32px; height:32px;" />
          </a>
        </div>
        <h4 style="margin:12px 0 4px 0; color:white;">Flowva Hub</h4>
        <p style="margin:0;color:white;">Calgary, Alberta</p>
        <p style="margin:12px 0 0 0; font-size:12px; color:white;">
          You received this because you subscribed to our newsletter.
          <a href="{{ unsubscribe }}" target="_blank" style="color:#ecd6ff; text-decoration:none;"><u>Unsubscribe</u></a>
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}
