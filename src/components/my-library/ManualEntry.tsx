import { Select } from "antd";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { addCustomToolAndLibrary } from "../../services/my-library/customToolServices";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { logUserActivity } from "../../services/user/activityTrack";

interface ManualEntry {
  categories: string[];
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTools: () => void;
}

type ManualAddTool = {
  toolName: string;
  category: string[];
  websiteURL: string;
  description: string;
};

export default function CompleteEnhancedManualEntry({
  categories,
  setModalOpen,
  refreshTools,
}: ManualEntry) {
  const [formData, setFormData] = useState<ManualAddTool>({
    toolName: "",
    category: [],
    websiteURL: "",
    description: "",
  });
  const [urlError, setUrlError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toolSearchValue, setToolSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { currentUser } = useCurrentUser();

  const { allTools: userLibraryTools } = useDefaultTools();

  // Filter library tools based on search input
  const matchingTools = useMemo(() => {
    if (!toolSearchValue || toolSearchValue.length < 2) return [];

    return userLibraryTools
      .filter((tool) =>
        tool.title.toLowerCase().includes(toolSearchValue.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [toolSearchValue, userLibraryTools]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "websiteURL") {
      const isValidUrl = validateURL(value);
      setUrlError(isValidUrl ? "" : "Please enter a valid URL.");
    }

    if (name === "toolName") {
      setToolSearchValue(value);
      // Show suggestions when typing and there are matches
      setShowSuggestions(value.length >= 2);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const validateURL = (url: string): boolean => {
    const trimmedUrl = url.trim();
    const pattern = new RegExp(
      "^(https?:\\/\\/)" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(trimmedUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if tool already exists in library
    const existingTool = userLibraryTools.find(
      (tool) => tool.title.toLowerCase() === formData.toolName.toLowerCase()
    );

    if (existingTool) {
      toast.warning(`"${existingTool.title}" is already in your library!`);
      return;
    }

    if (!validateURL(formData.websiteURL)) {
      setUrlError("Please enter a valid URL.");
      return;
    }

    setUrlError("");

    if (!currentUser?.id) {
      toast.error("User ID not available. Please log in again.");
      return;
    }

    setIsLoading(true);
    const { status, error, duplicate } = await addCustomToolAndLibrary(
      currentUser.id,
      { ...formData, category: formData.category }
    );
    setIsLoading(false);

    if (status === 409 && duplicate) {
      toast.info("This tool is already in your library.");
    } else if (status === 403 && error?.toLowerCase().includes("tool limit")) {
      toast.warning(
        "You've reached your tool limit. Upgrade to Pro to save more tools."
      );
    } else if (status !== 200) {
      toast.error(`Something went wrong: ${error || "Unknown error"}`);
    } else {
      toast.success("Tool added successfully!");
      await logUserActivity({
        userId: currentUser.id,
        action: "Added a custom tool to library",
        metadata: {
          service: "library",
          toolName: formData.toolName,
        },
      });
      await NotificationHelpers.onToolAdded(formData.toolName, currentUser?.id);
      await refreshTools();
      setModalOpen(false);
      setFormData({
        toolName: "",
        category: [],
        websiteURL: "",
        description: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="font-semibold" htmlFor="toolName">
          Tool Name
        </label>
        <div className="relative group w-full mt-2">
          <input
            type="text"
            name="toolName"
            value={formData.toolName}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(toolSearchValue.length >= 2)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="e.g. Figma, Notion, Slack"
            className="peer w-full border py-[11px] px-[14px] text-base border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
            required
          />
          <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>

          {/* Suggestions Dropdown */}
          {showSuggestions && matchingTools.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-64 overflow-y-auto">
              <div className="p-3 border-b bg-yellow-50 border-yellow-200">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <InfoCircleOutlined />
                  <span className="font-medium">Tool already exists:</span>
                </div>
              </div>

              {matchingTools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 border-b last:border-b-0 bg-yellow-50/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {tool.toolLogo ? (
                        <img
                          src={tool.toolLogo}
                          alt={tool.title}
                          className="w-8 h-8 rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-bold">
                          {tool.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {tool.title}
                        </span>
                        <CheckCircleOutlined className="text-green-500 text-sm" />
                        <span className="text-xs text-green-600 font-medium">
                          In Library
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tool.category.slice(0, 3).map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-gray-50 text-center border-t">
                <p className="text-sm text-gray-600">
                  This tool is already in Home page. You don't need to create it
                  again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="font-semibold block" htmlFor="category">
          Category
        </label>
        <div className="relative group w-full mt-2">
          <Select
            id="category"
            mode="multiple"
            placeholder="Select categories"
            style={{ width: "100%", overflowY: "auto" }}
            className="custom-select peer"
            value={formData.category}
            onChange={handleCategoryChange}
            options={
              categories?.map((category) => ({
                value: category,
                label: category,
              })) || []
            }
          />
          <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
        </div>
      </div>

      <div className="mb-3">
        <label className="font-semibold" htmlFor="url">
          Website URL
        </label>
        <div className="relative group w-full mt-2">
          <input
            type="text"
            name="websiteURL"
            value={formData.websiteURL}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="peer w-full border py-[11px] px-[14px] text-base border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe]"
            required
          />
          <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
        </div>
        <span className="text-sm text-red-500">{urlError}</span>
      </div>

      <div className="mb-3">
        <label className="font-semibold" htmlFor="description">
          Description
        </label>
        <div className="relative group w-full mt-2">
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Brief tool description"
            className="peer box-border w-full border py-[11px] px-[14px] text-base border-[#EDE9FE] transition-all ease-linear duration-[.2s] rounded-md outline-none resize-none focus:border-[#9013fe] bg-white"
            required
          ></textarea>
        </div>
      </div>

      <hr className="my-5" />
      <div className="ml-auto w-fit flex gap-4 mt-4">
        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="rounded-[100px] p-[0.75rem_1rem]  text-xs md:text-[0.95rem] font-semibold transition-all duration-200 bg-white text-[#020617] border-2 border-[#e9ecef]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-[100px] p-[0.75rem_1rem] font-semibold  gap-2 flex text-xs md:text-[0.95rem] justify-center items-center min-w-[120px]  border-none transition-all duration-200 bg-[#9013FE] hover:bg-[#7a0fd8] hover:transform hover:translate-y-[-1px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && <div className="form-loader"></div>}
          Save Tool
        </button>
      </div>
    </form>
  );
}
