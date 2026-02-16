import { ReactNode } from "react";
import TawkChatWidget from "../landing-page/Buttons/TawkChatWidget";

interface TawkLayoutProps {
  children: ReactNode;
}

export const TawkLayout: React.FC<TawkLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <TawkChatWidget />
    </>
  );
};
