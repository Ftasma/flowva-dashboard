import React from "react";
import { Modal, Tabs } from "antd";
import type { TabsProps } from "antd";
import "../custom-tab.css";
import Homepage from "../Homepage";
import ManualEntry from "../ManualEntry";
import { useDefaultTools } from "../../../context/DefaultToolsContext";

type AddNewToolsModalProps = {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onToolAdded: () => void;
  hideTab: boolean;
};

const AddNewToolsModal: React.FC<AddNewToolsModalProps> = ({
  modalOpen,
  setModalOpen,
  onToolAdded,
  hideTab,
}) => {
  const { categories } = useDefaultTools();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Home Page",
      children: (
        <Homepage
          hideTab={hideTab}
          setModalOpen={setModalOpen}
          refreshTools={onToolAdded}
        />
      ),
    },
    {
      key: "2",
      label: "Manual Entry",
      children: (
        <ManualEntry
          setModalOpen={setModalOpen}
          categories={categories}
          refreshTools={onToolAdded}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {hideTab ? "Choose from Subscription Library" : "  Add New Tool"}
        </h2>
      }
      width="100%"
      style={{ top: 20, maxWidth: 600, margin: "0 auto", padding: "5px" }}
      open={modalOpen}
      footer={null}
      onOk={() => setModalOpen(false)}
      onCancel={async () => {
        setModalOpen(false);
        await onToolAdded();
      }}
    >
      <hr />
      {hideTab ? (
        // Render only the Homepage tab content when tabs are hidden
        <div style={{ marginTop: "20px" }}>
          <Homepage
            hideTab={hideTab}
            setModalOpen={setModalOpen}
            refreshTools={onToolAdded}
          />
        </div>
      ) : (
        <Tabs
          style={{ marginTop: "20px" }}
          defaultActiveKey="1"
          items={items}
          onChange={() => {}}
        />
      )}
    </Modal>
  );
};

export default AddNewToolsModal;
