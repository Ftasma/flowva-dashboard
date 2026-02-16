export interface ExtensionResponse {
    status: string;
    extensionId?: string;
    message?: string;
  }
  
  export const sendMessageToExtension = async (
    extensionId: string,
    message: any
  ): Promise<ExtensionResponse> => {
    if (typeof chrome === "undefined" || !chrome.runtime) {
      throw new Error(
        "Chrome extension runtime not available. Please install the extension."
      );
    }
  
    return new Promise<ExtensionResponse>((resolve, reject) => {
      chrome.runtime.sendMessage(extensionId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(response);
      });
    });
  };
  