import { useState, useEffect } from "react";

interface UseExtensionProps {
  extensionId?: string;
  checkInterval?: number;
}

/**
 * Custom hook to check if a Chrome extension is installed
 */
const useExtension = ({
  extensionId = "",
  checkInterval = 0, // Default to no periodic check
}: UseExtensionProps = {}) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [previousInstallState, setPreviousInstallState] = useState<boolean | null>(null);

  // Check if Chrome runtime is available
  const checkChromeRuntime = (): boolean => {
    return !!(window && (window as any).chrome && (window as any).chrome.runtime);
  };

  // Function to open extension in Web Store
  const openExtensionPage = () => {
    window.open(
      "https://chrome.google.com/webstore/detail/" + extensionId,
      "_blank"
    );
  };

  // Function to manually check extension
  const checkExtension = () => {
    if (!checkChromeRuntime()) {
      setIsInstalled(false);
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      (window as any).chrome.runtime.sendMessage(
        extensionId,
        {
          type: "PING",
          payload: {},
        },
        (response: any) => {
          const isExtensionInstalled = !((window as any).chrome.runtime.lastError) && 
                                      response && 
                                      response.status === "ok";
          
          setIsInstalled(isExtensionInstalled);
          resolve(isExtensionInstalled);
        }
      );
    });
  };

  // Check extension status on focus and visibility change
  useEffect(() => {
    // Initial check
    checkExtension();
    
    // Check when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkExtension();
      }
    };
    
    // Check when window regains focus
    const handleFocus = () => {
      checkExtension();
    };
    
    // Set up event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Optional interval check if specified
    const interval = checkInterval > 0 ? setInterval(checkExtension, checkInterval) : null;
    
    // Clean up
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (interval) clearInterval(interval);
    };
  }, [extensionId, checkInterval]);

  // Update previousInstallState whenever isInstalled changes
  useEffect(() => {
    if (previousInstallState !== isInstalled) {
      setPreviousInstallState(isInstalled);
    }
  }, [isInstalled, previousInstallState]);

  return {
    isInstalled,
    previousInstallState,
    openExtensionPage,
    checkExtension // Expose the check function
  };
};

export default useExtension;