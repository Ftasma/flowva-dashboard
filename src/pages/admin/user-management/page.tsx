import UserControll from "../../../components/dashboard/AdminDashboard/userControll";
import { useSidebar } from "../../../context/SidebarContext";
import { useAllUsers } from "../../../context/adminContext/allUsersContext";
import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../icons";
import { Search } from "lucide-react";
import ConfirmationModal from "../../../components/dashboard/Modals/ConfirmationModal";
import {
  adminMessage,
  banUsers,
  deleteUsers,
  unbanUsers,
} from "../../../services/admin/userService";
import { toast } from "react-toastify";
import Google from "../../../assets/google.svg";
import BulkActions from "../../../components/dashboard/AdminDashboard/Buttons/bulk-action";
import UserInfoDrawer from "../../../components/dashboard/AdminDashboard/userInfoDrawer";
import BroadcastEmail from "../../../components/dashboard/AdminDashboard/Buttons/broadcastEmail";
import MessageModal from "../../../components/dashboard/AdminDashboard/Modals/MessageModal";
import UsersPagination from "../../../components/dashboard/AdminDashboard/userPagination";

interface SortDropdownProps {
  column: string;
  onSort: (column: string, order: "asc" | "desc") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ column, onSort }) => {
  const items: MenuProps["items"] = [
    { label: "Ascending", key: "asc", onClick: () => onSort(column, "asc") },
    { label: "Descending", key: "desc", onClick: () => onSort(column, "desc") },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <DownOutlined style={{ fontSize: "8px", cursor: "pointer" }} />
        </Space>
      </a>
    </Dropdown>
  );
};

export default function UsersManagement() {
  const { toggleMobileMenu } = useSidebar();
  const {
    users,
    fetchUsers,
    perPage,
    status,
    loading,
    refetch,
    setSort,
  } = useAllUsers();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [filterStatus, setFilterStatus] = useState(status);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [banModal, setBanModal] = useState<boolean>(false);
  const [unbanModal, setUnbanModal] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [banning, setBanning] = useState<boolean>(false);
  const [unbanning, setUnbanning] = useState<boolean>(false);
  const [messageModal, setMessageModal] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const openDrawer = (user: any) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleSort = (column: string, order: "asc" | "desc") => {
    setSort(column, order);
  };

  // Load first page when component mounts or filter changes
  useEffect(() => {
    fetchUsers(1, perPage, filterStatus);
  }, [filterStatus]);

  const handleChange = (value: string) => {
    setFilterStatus(value);
  };

  useEffect(() => {
    fetchUsers(1, perPage, filterStatus, searchEmail);
  }, [filterStatus, searchEmail]);

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSetEmail = (email: string) => {
    setUserEmail((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
      setUserEmail([]);
    } else {
      setSelectedUsers(users.map((user) => user.id || ""));
      setUserEmail(users.map((user) => user.email || ""));
    }
  };

  const handleCloseModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleCloseBanModal = () => {
    setBanModal(!banModal);
  };
  const handleCloseUnbanModal = () => {
    setUnbanModal(!unbanModal);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedUsers.length === 0) {
        toast.warning("No users selected for deletion");
        return;
      }
      setDeleting(true);
      const result = await deleteUsers(selectedUsers);
      setDeleting(false);
      if (result.success) {
        toast.success(result.message);

        setSelectedUsers([]);
        setUserEmail([]);

        setDeleteModal(false);

        // Refresh the user list
        await fetchUsers(1, perPage, filterStatus, searchEmail);
      } else {
        setDeleting(false);
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleConfirmBan = async (reason: string | undefined) => {
    try {
      if (selectedUsers.length === 0) {
        toast.warning("No users selected for deletion");
        return;
      }
      setBanning(true);
      const result = await banUsers(selectedUsers, reason as string);
      setBanning(false);

      if (result.success) {
        toast.success(result.message);

        setSelectedUsers([]);
        setUserEmail([]);

        setBanModal(false);

        // Refresh the user list
        await fetchUsers(1, perPage, filterStatus, searchEmail);
      } else {
        setBanning(false);
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleConfirmUnban = async () => {
    try {
      if (selectedUsers.length === 0) {
        toast.warning("No users selected for deletion");
        return;
      }
      setUnbanning(true);
      const result = await unbanUsers(selectedUsers);
      setUnbanning(false);

      if (result.success) {
        toast.success(result.message);

        setSelectedUsers([]);
        setUserEmail([]);

        setUnbanModal(false);

        // Refresh the user list
        await fetchUsers(1, perPage, filterStatus, searchEmail);
      } else {
        setUnbanning(false);
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleMessage = async (data: {
    recipients: string[];
    subject: string;
    message: string;
  }) => {
    try {
      setSendingMessage(true);

      const result = await adminMessage(data);

      if (result.success) {
        toast.success(result.message || "Message sent successfully");
        setMessageModal(false);
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(
        error.message || "Something went wrong while sending message"
      );
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="relative bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50  pb-2 flex py-2 pt-3 lg:pt-0 lg:py-0">
        <div className="w-full">
          <div className="bg-gray-50 flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                <svg viewBox="0 0 20 20" fill="none" width={28}>
                  <path
                    fill="#000000"
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex justify-between w-full border-b border-[#e0e0e0] items-center">
              <h1 className="text-xl font-medium">User Management</h1>
              <UserControll />
            </div>
          </div>
          {/* Filters */}
          <div className="flex justify-between border border-[#e0e0e0] items-center mb-2 p-[6px] mt-2 bg-white rounded-lg shadow-[0_2px_10px_rgba(0,_0,_0,_0.05)]">
            <div className="relative">
              <Search
                className="absolute text-gray-400 top-1/2 bottom-1/2 -translate-y-1/2 ml-1"
                size={13}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="search by email"
                defaultValue={searchEmail}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    setSearchEmail(target.value);
                    searchInputRef.current?.blur();
                  }
                }}
                className="border pl-5 px-2 py-[6px] max-w-[300px] text-sm rounded-[6px] w-full"
              />
            </div>
            <div className="flex w-fit items-center gap-3">
              <button
                onClick={() => setDeleteModal(true)}
                className={`p-[5px_12px] text-white bg-red-500 font-semibold rounded-[4px] w-fit flex items-center gap-1 text-[11px] transtion-all duration-300 ease-linear  border border-[#e0e0e0]  hover:bg-red-600 
                    ${selectedUsers.length > 0 ? "block" : "hidden"}`}
              >
                <FontAwesomeIcon className="mr-[1px]" icon={Icons.Trash} />
                Delete {selectedUsers?.length}{" "}
                {selectedUsers?.length > 1 ? "users" : "user"}
              </button>
              <BulkActions
                setBanModal={setBanModal}
                setUnbanModal={setUnbanModal}
                selectedUsers={selectedUsers}
                setMessageModal={setMessageModal}
                users={users}
              />
              <BroadcastEmail />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                  { value: "all", label: "All users" },
                  { value: "verified", label: "Verified users" },
                  { value: "unverified", label: "Unverified users" },
                  { value: "banned", label: "Banned users" },
                  { value: "not_onboarded", label: "Not Onboarded users" },
                  { value: "inactive_30_days", label: "Inactive more than 30 days" },
                ]}
              />

              <button
                onClick={() => refetch()}
                className="p-[5px_12px] rounded-[4px] font-semibold w-fit flex items-center gap-2 text-sm  transtion-all duration-300 ease-linear bg-transparent border border-[#e0e0e0] text-[#666] hover:bg-[#f8f9fa]"
              >
                <FontAwesomeIcon
                  className={`mr-[5px] ${
                    loading && "animate-spin text-[#9013fe]"
                  }`}
                  icon={Icons.Sync}
                />{" "}
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="lg:h-[calc(100vh-200px)] overflow-y-scroll relative [scrollbar-width:none] [-ms-overflow-style:none]">
        {/* Table */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] shadow p-[20px]">
          <div className="overflow-x-auto">
            <table className="w-full overflow-x-auto">
              <thead>
                <tr className="text-xs whitespace-nowrap">
                  <th className="bg-[#f8f9fa] p-[12px_15px] border-b text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === users.length &&
                        users.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b"></th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    User
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Email <SortDropdown column="email" onSort={handleSort} />
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Total points{" "}
                    <SortDropdown column="total_points" onSort={handleSort} />
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Referral count{" "}
                    <SortDropdown column="referral_count" onSort={handleSort} />
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Current streak{" "}
                    <SortDropdown column="current_streak" onSort={handleSort} />
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Created at{" "}
                    <SortDropdown column="created_at" onSort={handleSort} />
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Country
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    City
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Provider
                  </th>
                  <th className="bg-[#f8f9fa] p-[12px_15px] text-left border-b">
                    Last sign in at
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const isSelected = selectedUsers.includes(user.id || "");
                  return (
                    <tr
                      key={index}
                      className={`text-[#666] whitespace-nowrap text-sm cursor-pointer hover:bg-[#f8f9fa] ${
                        isSelected ? "bg-[#f8f9fa]" : ""
                      }`}
                      onClick={() => openDrawer(user)}
                    >
                      <td className="p-[12px_15px] border-b">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id || "")}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => {
                            toggleUserSelection(user.id || "");
                            handleSetEmail(user?.email);
                          }}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="p-[12px_15px] border-b">
                        <div className="overflow-hidden text-white text-xs  flex justify-center items-center bg-[#9013fe] rounded-full h-6 w-6 relative">
                          {user.profile_pic ||
                          user.raw_user_meta_data?.avatar_url ? (
                            <img
                              src={
                                user.profile_pic ??
                                user.raw_user_meta_data?.avatar_url?.replace(
                                  /=s\d+-c/,
                                  "=s400-c"
                                )
                              }
                              alt="avatar"
                            />
                          ) : (
                            user?.email.charAt(0).toUpperCase()
                          )}
                        </div>
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.name || "—"}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.email || "—"}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.total_points ?? 0}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.referral_count ?? 0}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.current_streak ?? 0}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.created_at || null}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        <div className="flex items-center gap-2">
                          {user?.flag && (
                            <img
                              src={user.flag}
                              alt="flag"
                              className="w-5 h-3 object-cover "
                            />
                          )}
                          <span>{user?.country || "—"}</span>
                        </div>
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.city || "—"}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.raw_app_meta_data?.providers &&
                        user.raw_app_meta_data.providers.length > 0 ? (
                          <div className="flex gap-2">
                            {user.raw_app_meta_data.providers.map(
                              (provider: string) => {
                                switch (provider) {
                                  case "google":
                                    return (
                                      <img
                                        src={Google}
                                        alt="google"
                                        className="w-4"
                                      />
                                    );
                                  case "email":
                                    return (
                                      <FontAwesomeIcon
                                        key="email"
                                        icon={Icons.openMessage}
                                        className="text-blue-500"
                                      />
                                    );
                                  default:
                                    return null;
                                }
                              }
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <img src={Google} alt="google" className="w-4" />
                            <FontAwesomeIcon icon={Icons.openMessage} />
                          </div>
                        )}
                      </td>
                      <td className="p-[12px_15px] border-b">
                        {user?.last_sign_in_at || "awaiting verification"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <UserInfoDrawer
              selectedUser={selectedUser}
              refetch={refetch}
              drawerOpen={drawerOpen}
              closeDrawer={closeDrawer}
            />
          </div>
        </div>
      </div>
      <UsersPagination />
      <ConfirmationModal
        message={`<strong><span style="position: relative; top: -2px; font-size: 20px">⚠️</span> Deleting users is irreversible</strong></br>
        This will remove the selected ${
          selectedUsers.length > 1 ? selectedUsers.length : ""
        } ${
          selectedUsers.length > 1 ? "users" : "user"
        } from the project and all associated data. <hr style="margin: 12px 0;"/>This is permanent! Are you sure you want to delete the selected ${
          selectedUsers.length > 1
            ? selectedUsers.length
            : `<strong>${userEmail[0]}</strong>`
        } ${
          selectedUsers.length > 1 ? "users" : ""
        } ?  <hr style="margin: 12px 0;"/>`}
        title={`Confirm to delete ${selectedUsers.length} ${
          selectedUsers.length > 1 ? "users" : "user"
        } `}
        visible={deleteModal}
        loading={deleting}
        onClose={handleCloseModal}
        onClick={handleConfirmDelete}
      />

      <ConfirmationModal
        visible={banModal}
        title={`Ban ${selectedUsers.length > 1 ? "Users" : "User"}`}
        message={`<strong>🚫 Banning users will prevent login</strong><br/>
    Are you sure you want to ban ${
      selectedUsers.length > 1
        ? selectedUsers.length + " users"
        : `<strong>${userEmail[0]}</strong>`
    } ?`}
        withReason
        loading={banning}
        onClose={handleCloseBanModal}
        onClick={(reason) => handleConfirmBan(reason)}
      />

      <ConfirmationModal
        visible={unbanModal}
        title={`Unban ${selectedUsers.length > 1 ? "Users" : "User"}`}
        message={`<strong>✅ Unbanning users will restore their login access</strong><br/>
    Are you sure you want to unban ${
      selectedUsers.length > 1
        ? selectedUsers.length + " users"
        : `<strong>${userEmail[0]}</strong>`
    } ? <hr style="margin: 12px 0;"/>`}
        loading={unbanning}
        onClose={handleCloseUnbanModal}
        onClick={handleConfirmUnban}
      />
      <MessageModal
        openModal={messageModal}
        setModalOpen={setMessageModal}
        selectedEmails={userEmail}
        loading={sendingMessage}
        onSend={(data) => {
          handleMessage(data);
        }}
      />
    </div>
  );
}
