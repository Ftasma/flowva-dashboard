import { SubscriptionHeader } from "./subscription/SubscriptionHeader";
import { SubscriptionLoader } from "./subscription/ui/SubscriptionLoader";
import React, { useState, useCallback, useEffect } from "react";
import {
  Filter,
  Download,
  Calendar,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import SummaryCard from "./subscription/SummaryCard";
import SubscriptionTable from "./subscription/SubscriptionTable";
import RenewalCard from "./subscription/RenewalCard";
import UnusedToolsTable from "./subscription/UnusedToolsTable";
import Button from "./subscription/ui/Button";

// Hooks
import {
  useUnusedTools,
  // useUnusedTools,
} from "../../hooks/subscriptions/useToolsSubscriptions";

// Types
import {
  Subscription,
  FilterOptions,
  AddSubscriptionFormData,
  ReminderSettings,
  RenewalCard as RenewalCardType,
  UnusedTool,
  RenewalSettings,
  ToolSubscription,
} from "./subscription/types";
import { useSidebar } from "../../context/SidebarContext";
import EmptyStateDashboard from "./subscription/EmptyStateDashboard";
import { Tool } from "../../interfaces/toolsData";
import AllSubscriptionModals from "./subscription/ui/AllSubscriptionModals";
import {
  ManualAddTool,
  useCreateCustomTool,
} from "../../services/my-library/customToolServices";
import NotificationHelpers from "../../utils/notifications/notificationHelpers";
import { useSubscriptionContext } from "../../context/SubscriptionContext";
import { useCurrentUser } from "../../context/CurrentUserContext";
import { getNextBillingDate } from "../../utils/helper";
import RenewalUpdateModal from "./subscription/ui/RenewalUpdateModal";

const SubscriptionDashboard: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [subDataProp, setSubDataProp] = useState<ToolSubscription | null>(null);
  const [showRenewalActions, setShowRenewalActions] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<
    ToolSubscription | undefined
  >();
  const { createCustomTool } = useCreateCustomTool();

  const location = useLocation();
  const navigate = useNavigate();
  const locationData = location.state as {
    showModal: boolean;
    tool: Tool;
    modal: keyof typeof modals;
    isCustom: boolean;
  };

  useEffect(() => {
    if (location.state && location.state.showModal && location.state.modal) {
      openModal(location.state.modal);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    status: "",
    renewal: "",
    usage: "",
    price: "",
  });

  const [modals, setModals] = useState({
    addSubscription: false,
    filter: false,
    reminder: false,
    manageReminders: false,
    editSubscription: false,
    renewalSettings: false,
    viewAllRenewals: false,
    viewAllUnused: false,
  });

  //disable scroll when modal is up
  useEffect(() => {
    const isAnyModalOpen = Object.values(modals).some(Boolean);

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modals]);

  // subscription context
  const {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    loading: subscriptionsLoading,
    getSummaryStats,
    getRenewals,
    setUserId: subUserId,
    updateAllReminderSettings,
    saveReminderSettings,
  } = useSubscriptionContext();

  useEffect(() => {
    if (currentUser) {
      subUserId(currentUser.id);
    }
  }, [currentUser]);

  const { unusedTools } = useUnusedTools(currentUser?.id);
  const userId = currentUser?.id as string;

  // Modal handlers
  const openModal = (modalName: keyof typeof modals) => {
    if (modalName === "viewAllRenewals") {
      setShowRenewalActions(true);
    }
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modals) => {
    if (modalName === "viewAllRenewals") {
      setShowRenewalActions(false);
    }
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<ToolSubscription | null>(null);

  // Action handlers
  const handleSubscriptionAction = useCallback(
    (action: string, subscription: ToolSubscription) => {
      setSelectedSubscription(subscription);

      switch (action) {
        case "edit":
          openModal("editSubscription");
          break;
        case "reminder":
          openModal("reminder");
          break;
        case "renewal":
          openModal("renewalSettings");
          break;
        case "remove":
          setSelectedSubscription(subscription);
          setSubscriptionToDelete(subscription);
          setConfirmationModalVisible(true);
          return;
      }
    },
    []
  );
  const handleConfirmDelete = async () => {
    if (!subscriptionToDelete) return;
    const userId = currentUser?.id as string;
    try {
      deleteSubscription(subscriptionToDelete.id);
      await NotificationHelpers.onSubscriptionRemoved(
        subscriptionToDelete.displayName,
        userId
      );
    } catch (err) {
      toast.error("Failed to delete subscription");
    } finally {
      setConfirmationModalVisible(false);
      setSubscriptionToDelete(null);
    }
  };

  const handleRenewalAction = useCallback(
    (action: string, renewal: RenewalCardType) => {
      const { subscription } = renewal;

      switch (action) {
        case "cancel":
          if (
            window.confirm(
              `Are you sure you want to cancel ${subscription.name}?`
            )
          ) {
            deleteSubscription(subscription.id);
          }
          break;
      }
    },
    [deleteSubscription]
  );

  const handleUnusedToolAction = useCallback(
    (action: string, tool: UnusedTool) => {
      switch (action) {
        case "cancel":
          if (window.confirm(`Are you sure you want to cancel ${tool.name}?`)) {
            // In real app, you'd use deleteUnusedTool
            toast.warning(`Cancellation initiated for ${tool.name}.`);
          }
          break;
        case "review":
          toast.info(`Reviewing usage for ${tool.name}...`);
          break;
      }
    },
    []
  );

  // Form handlers
  const handleAddSubscription = async (formData: AddSubscriptionFormData) => {
    let toolId = formData.tool_id;
    let isCustomTool = false;

    if (!toolId || formData.isCustom) {
      const customToolData: ManualAddTool = {
        toolName: formData.serviceName,
        currency: formData.currency,
        description: `Custom tool for ${formData.serviceName}`,
        category: ["Custom"],
        websiteURL: "",
      };

      try {
        let customToolResult = null;
        if (!formData.isCustom) {
          customToolResult = await createCustomTool(userId, customToolData);

          toolId = customToolResult?.tool_id;
        }

        isCustomTool = true;
      } catch (error) {
        console.error("Failed to create custom tool:", error);
        throw error;
      }
    }

    const subscriptionData: Omit<
      Subscription,
      "id" | "createdAt" | "updatedAt"
    > = {
      name: formData.serviceName,
      tier: formData.tier || "Standard",
      status: "active",
      nextBilling: getNextBillingDate(
        formData.startDate,
        formData.billingCycle
      ),
      tool_id: toolId,
      currency: formData.currency,
      is_custom: isCustomTool,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle as "monthly" | "annual" | "quarterly",
      usage: Math.floor(Math.random() * 100),
      icon: formData.serviceName.substring(0, 2).toUpperCase(),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };

    const newSubscription = await addSubscription(subscriptionData);

    const reminderSettings: ReminderSettings = {
      enabled: true,
      timing: "1-week",
      email: true,
      inApp: true,
    };

    // Save reminder settings for the newly added subscription
    if (newSubscription?.id) {
      await saveReminderSettings(reminderSettings, newSubscription.id);
      toast.success("Subscription added successfully");
    }

    await NotificationHelpers.onSubscriptionAdded(formData.serviceName, userId);
    closeModal("addSubscription");
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    toast.success("Filters applied successfully!");
    closeModal("filter");
  };

  const handleSaveReminder = async (settings: ReminderSettings) => {
    saveReminderSettings(settings, selectedSubscription?.id)
      .then(() => {
        closeModal("reminder");
      })
      .catch((err) => {
        console.error("Error saving reminder:", err);
        toast.error("Failed to save reminder settings.");
      });

    await NotificationHelpers.onSubscriptionReminderUpdated(
      selectedSubscription?.displayName as string,
      userId,
      settings.timing,
      settings.timeOfDay
    );
  };

  const handleSaveAllReminders = (
    settings: ReminderSettings & { applyToAll: boolean }
  ) => {
    // const selectedOption = settings.timing;

    updateAllReminderSettings(settings)
      .then(() => {
        closeModal("manageReminders");
      })
      .catch((err) => {
        console.error("Error saving reminder:", err);
        toast.error("Failed to save reminder settings.");
      });
  };

  const handleSaveRenewalSettings = (settings: RenewalSettings) => {
    if (!selectedSubscription) return;

    updateSubscription(selectedSubscription.id, {
      name: "",
    })
      .then(() => {
        // Then save the reminder settings if auto-renewal is enabled
        if (settings.autoRenewal) {
          // Set reminder based on settings.reminderTiming
          const reminderSettings: ReminderSettings = {
            enabled: true,
            timing: settings.reminderTiming as any,
            email:
              settings.notificationPreference === "email" ||
              settings.notificationPreference === "both",
            inApp:
              settings.notificationPreference === "app" ||
              settings.notificationPreference === "both",
          };

          // Here we would call a function to save reminder settings
          console.error(
            "Setting up renewal reminder with settings:",
            reminderSettings
          );
        }

        toast.success("Renewal settings saved successfully!");
        closeModal("renewalSettings");
      })
      .catch((error) => {
        console.error("Error saving renewal settings:", error);
        toast.error("Failed to save renewal settings");
      });
  };

  const handleUpdateSubscription = (
    id: string,
    updatedData: Partial<ToolSubscription>
  ) => {
    updateSubscription(id, updatedData)
      .then(() => {
        toast.success("Subscription updated successfully!");
      })
      .catch((error) => {
        toast.error("Failed to update subscription");
        console.error("Update error:", error);
      });
  };

  // Get data
  const summaryStats = getSummaryStats();
  const renewals = getRenewals();
  const { toggleMobileMenu } = useSidebar();

  // Filter subscriptions based on search and filters
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub?.tier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !activeFilters.status || sub.status === activeFilters.status;
    const matchesUsage =
      !activeFilters.usage ||
      (activeFilters.usage === "high" && sub.usage >= 70) ||
      (activeFilters.usage === "medium" && sub.usage >= 30 && sub.usage < 70) ||
      (activeFilters.usage === "low" && sub.usage < 30);

    const matchesPrice =
      !activeFilters.price ||
      (activeFilters.price === "0-10" && sub.price <= 10) ||
      (activeFilters.price === "10-20" && sub.price > 10 && sub.price <= 20) ||
      (activeFilters.price === "20-50" && sub.price > 20 && sub.price <= 50) ||
      (activeFilters.price === "50+" && sub.price > 50);

    return matchesSearch && matchesStatus && matchesUsage && matchesPrice;
  });

  // Handle export
  const handleExport = () => {
    const exportData = subscriptions.map((sub) => ({
      Name: sub.name,
      Tier: sub.tier,
      Status: sub.status,
      "Next Billing": sub.nextBilling,
      Price: sub.price,
      "Billing Cycle": sub.billingCycle,
      "Usage %": sub.usage,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(exportData[0]).join(",") +
      "\n" +
      exportData.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscriptions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Subscriptions exported successfully!");
  };

  const currency = subscriptions[0]?.currency || "USD";

  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    NGN: "₦",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    AUD: "A$",
    CAD: "C$",
    ZAR: "R",
    BRL: "R$",
    CNY: "¥",
  };
  const symbol = symbolMap[currency] || currency;

  if (subscriptionsLoading) {
    return <SubscriptionLoader />;
  }

  return (
    <div className="relative bg-gray-50   ">
      <SubscriptionHeader
        openModal={openModal}
        toggleMobileMenu={toggleMobileMenu}
      />

      <div className="lg:h-[calc(100vh-90px)]  [scrollbar-width:none] [-ms-overflow-style:none] overflow-y-auto">
        <div>
          {" "}
          {subscriptions.length == 0 ? (
            <EmptyStateDashboard
              onAddSubscription={() => openModal("addSubscription")}
              onImportViaEmail={() => openModal("manageReminders")}
            />
          ) : (
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                <SummaryCard
                  title="Active Subscriptions"
                  value={summaryStats.activeSubscriptions.toString()}
                  change={{
                    text: `${summaryStats.changes.subscriptions.value} added this month`,
                    positive: summaryStats.changes.subscriptions.positive,
                    icon: summaryStats.changes.subscriptions.positive
                      ? ArrowUp
                      : ArrowDown,
                  }}
                />
                <SummaryCard
                  title="Total Cost"
                  value={`${symbol}${summaryStats.totalCost.toFixed(2)}`}
                  change={{
                    text: `${symbol}${(
                      parseFloat(summaryStats.changes.cost.value) / 12
                    ).toFixed(2)} per month`,
                    positive: summaryStats.changes.cost.positive,
                    icon: ArrowUp,
                  }}
                />
                <SummaryCard
                  title="Upcoming Renewals"
                  value={summaryStats.upcomingRenewals.toString()}
                  change={{
                    text:
                      renewals.length > 0
                        ? `Next: ${renewals[0].subscription.name} in ${
                            renewals[0].daysToRenewal
                          } ${renewals[0].daysToRenewal > 1 ? "days" : "day"}`
                        : "No renewals this month",
                  }}
                />
                <SummaryCard
                  title="Potential Savings"
                  value={`${symbol}${summaryStats.potentialSavings.toFixed(2)}`}
                  change={{
                    text: `${symbol}${summaryStats.changes.savings.value} Available this month`,
                    positive: summaryStats.changes.savings.positive,
                  }}
                />
              </div>

              {/* Active Subscriptions */}
              <div className="mb-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Active Subscriptions
                  </h2>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      icon={Filter}
                      onClick={() => openModal("filter")}
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      icon={Download}
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                  </div>
                </div>

                <SubscriptionTable
                  subscriptions={filteredSubscriptions}
                  onAction={handleSubscriptionAction}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>

              {/* Upcoming Renewals */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 ">
                    Upcoming Renewals
                  </h2>
                  <Button
                    variant="outline"
                    icon={Calendar}
                    onClick={() => openModal("viewAllRenewals")}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-6">
                  {renewals.slice(0, 2).map((renewal) => (
                    // {mockRenewals.slice(0, 2).map((renewal) => (
                    <RenewalCard
                      key={renewal.id}
                      renewal={renewal}
                      showRenewalActions={showRenewalActions}
                      onAction={handleRenewalAction}
                      setModalOpen={setModalOpen}
                      setSubDataProp={setSubDataProp}
                    />
                  ))}
                  {renewals.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center">
                      <p className="text-gray-500">
                        No upcoming renewals in the next 30 days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Unused Tools */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Unused Tools
                  </h2>
                  <Button
                    variant="outline"
                    icon={Eye}
                    onClick={() => openModal("viewAllUnused")}
                  >
                    View All
                  </Button>
                </div>

                <UnusedToolsTable
                  tools={unusedTools.slice(0, 3)}
                  onAction={handleUnusedToolAction}
                />
              </div>
            </div>
          )}
          {/* Modals */}
          <AllSubscriptionModals
            confirmationModalVisible={confirmationModalVisible}
            setConfirmationModalVisible={() =>
              setConfirmationModalVisible(false)
            }
            handleConfirmDelete={handleConfirmDelete}
            //
            locationData={locationData}
            modals={modals}
            closeModal={closeModal}
            handleAddSubscription={handleAddSubscription}
            handleApplyFilters={handleApplyFilters}
            activeFilters={activeFilters}
            selectedSubscription={selectedSubscription}
            handleSaveReminder={handleSaveReminder}
            handleSaveAllReminders={handleSaveAllReminders}
            handleSaveRenewalSettings={handleSaveRenewalSettings}
            handleUpdateSubscription={handleUpdateSubscription}
          />
          {/* View All Renewals Modal */}
          {modals.viewAllRenewals && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">
                    All Upcoming Renewals
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => closeModal("viewAllRenewals")}
                  >
                    ×
                  </Button>
                </div>
                <div className="p-6 space-y-6">
                  {renewals.map((renewal) => (
                    <RenewalCard
                      key={renewal.id}
                      renewal={renewal}
                      showRenewalActions={showRenewalActions}
                      onAction={handleRenewalAction}
                    />
                  ))}
                  {renewals.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No upcoming renewals found
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end p-6 border-t">
                  <Button onClick={() => closeModal("viewAllRenewals")}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* View All Unused Tools Modal */}
          {modals.viewAllUnused && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900">
                    All Unused Tools
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => closeModal("viewAllUnused")}
                  >
                    ×
                  </Button>
                </div>
                <div className="p-6">
                  <UnusedToolsTable
                    tools={unusedTools}
                    onAction={handleUnusedToolAction}
                  />
                </div>
                <div className="flex justify-end p-6 border-t">
                  <Button onClick={() => closeModal("viewAllUnused")}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <RenewalUpdateModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          subscription={subDataProp}
        />
      </div>
    </div>
  );
};

export default SubscriptionDashboard;
