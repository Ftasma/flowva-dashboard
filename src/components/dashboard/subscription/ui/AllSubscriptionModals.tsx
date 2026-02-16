import React from "react";
import { Tool } from "../../../../interfaces/toolsData";
import {
  AddSubscriptionFormData,
  ReminderSettings,
  ToolSubscription,
} from "../types";
import AddSubscriptionModal from "./AddSubscriptionModal";
import EditSubscriptionModal from "./EditSubscriptionModal";
import FilterModal from "./FilterModal";
import ReminderModal, { ManageAllRemindersModal } from "./ReminderModal";
import RenewalSettingsModal from "./RenewalSettingsModal";
import ConfirmationModal from "../../Modals/ConfirmationModal";

interface AllSubscriptionModalsProps {
  modals: {
    addSubscription: boolean;
    filter: boolean;
    reminder: boolean;
    manageReminders: boolean;
    editSubscription: boolean;
    renewalSettings: boolean;
    viewAllRenewals: boolean;
    viewAllUnused: boolean;
  };
  locationData: {
    showModal: boolean;
    tool: Tool;
    modal: any;
  };
  activeFilters: {
    status: string;
    renewal: string;
    usage: string;
    price: string;
  };
  selectedSubscription: ToolSubscription | any;
  closeModal: (text: string | any) => void;
  handleAddSubscription: (a: AddSubscriptionFormData) => void;
  handleApplyFilters: (a: any) => void;
  handleUpdateSubscription: (
    id: string,
    updatedData: Partial<ToolSubscription>
  ) => void;
  handleSaveRenewalSettings: (a: any) => void;
  handleSaveAllReminders: (a: any) => void;
  handleSaveReminder: (a: ReminderSettings) => void;
  setConfirmationModalVisible: () => void;
  handleConfirmDelete: () => void;
  confirmationModalVisible: boolean;
}

const AllSubscriptionModals: React.FC<AllSubscriptionModalsProps> = ({
  confirmationModalVisible,
  setConfirmationModalVisible,
  locationData,
  modals,
  closeModal,
  handleAddSubscription,
  handleApplyFilters,
  activeFilters,
  selectedSubscription,
  handleSaveReminder,
  handleSaveAllReminders,
  handleSaveRenewalSettings,
  handleUpdateSubscription,
  handleConfirmDelete,
}) => {
  return (
    <>
      {" "}
      <AddSubscriptionModal
        data={locationData?.tool}
        isOpen={modals.addSubscription}
        onClose={() => closeModal("addSubscription")}
        onSubmit={handleAddSubscription}
      />
      <FilterModal
        isOpen={modals.filter}
        onClose={() => closeModal("filter")}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
      <ReminderModal
        isOpen={modals.reminder}
        onClose={() => closeModal("reminder")}
        subscription={selectedSubscription}
        onSave={handleSaveReminder}
      />
      <ManageAllRemindersModal
        isOpen={modals.manageReminders}
        onClose={() => closeModal("manageReminders")}
        onSave={handleSaveAllReminders}
      />
      <RenewalSettingsModal
        isOpen={modals.renewalSettings}
        onClose={() => closeModal("renewalSettings")}
        subscription={selectedSubscription}
        onSave={handleSaveRenewalSettings}
      />
      <EditSubscriptionModal
        isOpen={modals.editSubscription}
        onClose={() => closeModal("editSubscription")}
        subscription={selectedSubscription}
        onSubmit={handleUpdateSubscription}
      />
      <ConfirmationModal
        message="Are you sure you want to remove your subscription? This action cannot be undone."
        title='Comfirm to Remove Subscription'
        visible={confirmationModalVisible}
        onClose={setConfirmationModalVisible}
        onClick={handleConfirmDelete}
      />
    </>
  );
};

export default AllSubscriptionModals;
