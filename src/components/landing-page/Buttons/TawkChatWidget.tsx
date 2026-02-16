import { useEffect } from "react";

const TawkChatWidget = () => {
  useEffect(() => {
    // Prevent adding the script multiple times
    if (document.getElementById("tawk-to-script")) return;

    // Create the script tag
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];

    s1.async = true;
    s1.src = "https://embed.tawk.to/67cfd863c76634190e89a8f7/1im1upra1";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s1.id = "tawk-to-script";

    // Insert before the first script tag
    s0.parentNode?.insertBefore(s1, s0);

    return () => {
      // Optional cleanup (if you ever unmount the component)
      const existing = document.getElementById("tawk-to-script");
      if (existing) existing.remove();
      (window as any).Tawk_API = null;
      (window as any).Tawk_LoadStart = null;
    };
  }, []);

  return null;
};

export default TawkChatWidget;
