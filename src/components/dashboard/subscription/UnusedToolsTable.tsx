import React from "react";
import { UnusedTool } from "./types";
import ServiceIcon from "./ServiceIcon";
import Button from "./ui/Button";

interface UnusedToolsTableProps {
  tools: UnusedTool[];
  onAction: (action: string, tool: UnusedTool) => void;
}

const UnusedToolsBadge: React.FC<{ status: UnusedTool["status"] }> = ({
  status,
}) => {
  const styles = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const labels = {
    critical: "Critical",
    warning: "Warning",
  };

  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${styles[status]}
    `}
    >
      {labels[status]}
    </span>
  );
};

export const UnusedToolsTable: React.FC<UnusedToolsTableProps> = ({
  tools,
  onAction,
}) => {
  const formatLastUsed = (lastUsed: string) => {
    const date = new Date(lastUsed);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const getLastUsedColor = (lastUsed: string) => {
    const date = new Date(lastUsed);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 60) return "text-red-600";
    if (diffDays > 30) return "text-yellow-600";
    return "text-gray-900";
  };

  if (tools.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            All tools are being used!
          </h3>
          <p className="text-gray-500">
            Great job keeping your subscriptions active and useful.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tool
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Used
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <ServiceIcon
                      name={tool.name}
                      icon={tool.icon}
                      color={tool.color}
                      size="md"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {tool.name}
                      </div>
                      <div className="text-sm text-gray-600">{tool.tier}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`text-sm font-medium ${getLastUsedColor(
                      tool.lastUsed
                    )}`}
                  >
                    {formatLastUsed(tool.lastUsed)}
                  </div>
                  {/* <div className="text-xs text-gray-500">
                    {new Date(tool.lastUsed).toLocaleDateString()}
                  </div> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">
                    ${tool.monthlyCost.toFixed(2)}
                  </div>
                  {/* <div className="text-sm text-gray-600">per month</div> */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <UnusedToolsBadge status={tool.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {tool.status === "critical" ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onAction("cancel", tool)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAction("review", tool)}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnusedToolsTable;
