import React, { useEffect, useState } from "react";
import { Shield, Mail, Upload} from "lucide-react";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import { AddSubscriptionFormData } from "../types";
import { Tool } from "../../../../interfaces/toolsData";
import dayjs from "dayjs";
import AddNewToolsModal from "../../../my-library/Modals/AddNewToolsModal";
import { DatePicker, Modal, Select } from "antd";
import { useCurrentUser } from "../../../../context/CurrentUserContext";
import { useLibraryToolsContext } from "../../../../context/LibraryToolsContext";
import "../sub-custom-select.css";
import { fetchUserCurrency } from "../../../../utils/helper";
import { logUserActivity } from "../../../../services/user/activityTrack";

interface AddSubscriptionModalProps {
  data?: Tool;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddSubscriptionFormData) => void;
}

interface ImportViaEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (email: string, provider: string) => void;
}

const ImportViaEmailModal: React.FC<ImportViaEmailModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [importing, setImporting] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  const handleImport = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setImporting(true);
    try {
      toast.info("Scanning your email for subscriptions...");

      // Simulate email scanning delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate finding subscriptions`
      const foundSubscriptions = [
        {
          name: "Netflix",
          tier: "Premium",
          price: 19.99,
          billingCycle: "monthly",
        },
        {
          name: "Spotify",
          tier: "Premium Family",
          price: 15.99,
          billingCycle: "monthly",
        },
        {
          name: "Adobe Creative Cloud",
          tier: "All Apps",
          price: 59.99,
          billingCycle: "monthly",
        },
      ];

      setScanResults(foundSubscriptions);
      toast.success(`Found ${foundSubscriptions.length} subscriptions!`);
    } catch (error) {
      toast.error("Failed to import subscriptions");
    } finally {
      setImporting(false);
    }
  };

  const handleConfirmImport = () => {
    onImport(email, provider);
    setScanResults(null);
    setEmail("");
    setProvider("");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Import via Email"
      centered
      width={600}
      footer={null}
    >
      <div className="p-6">
        {!scanResults ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="your@email.com"
                  required
                />
                <p className="text-xs text-gray-600 mt-2">
                  We'll scan your email for subscription receipts and add them
                  automatically.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="">Select provider (optional)</option>
                  <option value="gmail">Gmail</option>
                  <option value="outlook">Microsoft Outlook</option>
                  <option value="yahoo">Yahoo Mail</option>
                  <option value="icloud">iCloud Mail</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="text-purple-600" size={20} />
                  <div className="font-semibold text-purple-900">
                    Your data is secure
                  </div>
                </div>
                <div className="text-sm text-purple-800">
                  We use read-only access to scan for subscription emails. Your
                  login details are never stored.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleImport} loading={importing}>
                {importing ? "Scanning Email..." : "Import Subscriptions"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Found {scanResults.length} Subscriptions
                </h3>
                <p className="text-gray-600">
                  Review and confirm the subscriptions we found in your email.
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3">
                {scanResults.map((sub: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {sub.name}
                        </div>
                        <div className="text-sm text-gray-600">{sub.tier}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${sub.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          {sub.billingCycle}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setScanResults(null)}>
                Scan Again
              </Button>
              <Button onClick={handleConfirmImport}>
                Import These Subscriptions
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  data,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<AddSubscriptionFormData>({
    serviceName: "",
    tool_id: "",
    billingCycle: "",
    price: "",
    currency: "USD",
    startDate: getCurrentDate(),
    tier: "",
    // isCustom: ,
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [errors, setErrors] = useState<Partial<AddSubscriptionFormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingCurrency, setLoadingCurrency] = useState(false);

  // Effect to populate form when data prop changes
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        serviceName: data.title || "",
        tool_id: data.id || "",
        isCustom: data.isCustom,
      }));
    }
  }, [data]);

  useEffect(() => {
    const detectCurrency = async () => {
      setLoadingCurrency(true);
      const currency = await fetchUserCurrency();
      setLoadingCurrency(false);
      setFormData((prev) => ({ ...prev, currency }));
    };

    if (isOpen) {
      detectCurrency();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        serviceName: "",
        tool_id: "",
        billingCycle: "",
        price: "",
        currency: "USD",
        startDate: getCurrentDate(),
        tier: "",
        notes: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AddSubscriptionFormData> = {};

    if (!formData.serviceName.trim())
      newErrors.serviceName = "Service name is required";
    if (!formData.currency) newErrors.currency = "Currency is required";

    if (!formData.billingCycle)
      newErrors.billingCycle = "Billing cycle is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (Number(formData.price) < 0.01) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.startDate) newErrors.startDate = "Start date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmission = () => {
    if (validateForm()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      onSubmit(formData);
      setLoading(true);
      await logUserActivity({
        userId: currentUser?.id as string,
        action: "Added subscription",
        metadata: {
          service: 'subscription',
          toolName: formData.serviceName,
          price: formData.price,
          currency: formData.currency,
          billingCycle: formData.billingCycle
        },
      });

      setLoading(false);
      // Reset form
      setFormData({
        serviceName: "",
        billingCycle: "",
        price: "",
        currency: "",
        tool_id: "",
        startDate: "",
        tier: "",
        notes: "",
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (
    field: keyof AddSubscriptionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImportEmail = () => {
    setShowImportModal(false);
    toast.success("3 subscriptions imported successfully!");
  };

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
  const symbol = symbolMap[formData.currency];

  const renderStep = () => {
    return (
      <div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name
            </label>
            <div className="relative group w-full ">
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) =>
                  handleInputChange("serviceName", e.target.value)
                }
                className={`peer w-full h-full border  py-[0.6rem] px-[1rem] text-base  transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe] ${
                  errors.serviceName ? "border-red-500" : "border-[#EDE9FE]"
                }`}
                placeholder="Enter service name..."
              />
              <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
            </div>
            {errors.serviceName && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceName}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Billing Cycle
            </label>
            <Select
              value={formData.billingCycle || undefined}
              onChange={(value) => handleInputChange("billingCycle", value)}
              className="w-full currency-select"
              placeholder="Select billing cycle"
              status={errors.billingCycle ? "error" : undefined}
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "annual", label: "Annual" },
                { value: "quarterly", label: "Quarterly" },
              ]}
            />
            {errors.billingCycle && (
              <p className="text-red-500 text-xs mt-3">{errors.billingCycle}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price
            </label>

            <div className="flex items-center space-x-2">
              <p>
                {loadingCurrency ? <div className="form-loader"></div> : symbol}
              </p>
              <div className="relative w-full">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={`peer flex-1 w-full h-full border py-[0.6rem] px-[1rem] text-base  transition-all ease-linear duration-[.2s] rounded-md outline-none focus:border-[#9013fe] ${
                    errors.price ? "border-red-500" : "border-[#EDE9FE]"
                  }`}
                  placeholder="0.00"
                  step="0.01"
                />
                <div className="pointer-events-none absolute inset-0 rounded-md peer-focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"></div>
              </div>
            </div>

            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <DatePicker
              value={formData.startDate ? dayjs(formData.startDate) : null}
              onChange={(date) =>
                handleInputChange(
                  "startDate",
                  date ? date.format("YYYY-MM-DD") : ""
                )
              }
              className="w-full custom-date-picker"
              placeholder="Select start date"
              status={errors.startDate ? "error" : undefined}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { currentUser } = useCurrentUser();

  const { refreshTools, setUserId } = useLibraryToolsContext();

  useEffect(() => {
    if (currentUser) setUserId(currentUser?.id);
  }, [currentUser]);

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        title={<h1 className="md:text-lg">Add New Subscription</h1>}
        centered
        width={600}
      >
        <div className="p-4">
          {/* Import Option */}
          <div className="mb-3">
            <Button
              variant="outline"
              fullWidth
              className="focus:!ring-0 focus:!outline-none"
              icon={Mail}
              // onClick={() => setShowImportModal(true)}
            >
              Import via Email (incoming 🔒)
            </Button>
            <div className="text-center text-gray-500 text-sm my-3">or</div>
          </div>
          <div className="mb-3">
            <Button
              variant="outline"
              fullWidth
              icon={Mail}
              onClick={() => setModalOpen(true)}
            >
              Choose from Library
            </Button>
            {/* <div className="text-center text-gray-500 text-sm my-3">or</div> */}
          </div>

          {/* Step Content */}
          <div>{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-end gap-5 mt-5">
            <Button
              className="text-4xl h-[40px] border"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button className="h-[40px]" onClick={handleSubmission}>
              {loading && <div className="form-loader"></div>}
              Add Subscription
            </Button>
          </div>
        </div>
      </Modal>

      {modalOpen && (
        <AddNewToolsModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onToolAdded={refreshTools}
          hideTab={true}
        />
      )}
      {showImportModal && (
        <ImportViaEmailModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportEmail}
        />
      )}
    </>
  );
};

export default AddSubscriptionModal;
