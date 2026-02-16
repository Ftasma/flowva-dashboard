export { default as Modal } from "./Modal";
// export { default as AccountModal } from "./AccountModal";
export { default as NotificationsModal } from "./NotificationsModal";
// export { default as BillingModal } from "./BillingModal";
// export { default as InviteTeamModal } from "./InviteTeamModal";

// Type for modal names
export type ModalType =
  | "account"
  | "notifications"
  | "pro"
  | "invite"
  | null;
