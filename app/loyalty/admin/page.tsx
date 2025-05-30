"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Search,
  Award,
  Gift,
  Minus,
  Copy,
  Target,
  Coins,
  Settings,
  X,
  CheckCircle,
  AlertTriangle,
  Loader,
  Users,
  Package,
  Info,
  ExternalLink,
} from "lucide-react";
import { useLoyalty } from "@/utils/hooks/useLoyalty";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import Notification from "@/components/Notification";

const ADMIN_EMAIL = "danielfrancis32610@gmail.com";

interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}

interface ModalData {
  show: boolean;
  title: string;
  data: any;
  type: "success" | "error";
}

// interface TabComponentProps {
//   isLoading: boolean;
//   showNotification: (message: string, status: "success" | "error") => void;
//   showResultModal: (
//     title: string,
//     data: any,
//     type?: "success" | "error"
//   ) => void;
// }

export default function PoyntAdminDashboard(): JSX.Element {
  const {
    isLoading,
    error,
    // Business functions
    createBusinessProgram,
    awardBusinessCampaignPoints,
    // Protocol functions
    createProtocolProgram,
    awardProtocolPoints,
    // Admin functions
    updateProgram,
    issuePass,
    awardPoints,
    revokePoints,
    giftPoints,
    // Batch operations
    batchAwardPoints,
    batchIssuePasses,
    // Data retrieval
    getPassData,
    getProgramData,
    // Utility functions
    getDefaultBusinessTierRequirements,
    previewBusinessTiers,
    getAvailableProtocolActions,
    // Templates
    businessTemplate,
    protocolTemplate,
  } = useLoyalty();

  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("create-business");
  const [userEmail, setUserEmail] = useState<string>("");
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });
  const [resultModal, setResultModal] = useState<ModalData>({
    show: false,
    title: "",
    data: null,
    type: "success",
  });

  useEffect(() => {
    setMounted(true);
    const email: string = getDataFromLocalStorage("email") || "";
    setUserEmail(email);
  }, []);

  // Show error notifications from hook
  useEffect(() => {
    if (error) {
      showNotification(error, "error");
    }
  }, [error]);

  const showNotification = useCallback(
    (message: string, status: "success" | "error"): void => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const hideNotification = useCallback((): void => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const showResultModal = useCallback(
    (title: string, data: any, type: "success" | "error" = "success"): void => {
      setResultModal({ show: true, title, data, type });
    },
    []
  );

  const hideResultModal = useCallback((): void => {
    setResultModal((prev) => ({ ...prev, show: false }));
  }, []);

  if (!mounted)
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );

  const isAdmin: boolean = userEmail === ADMIN_EMAIL;

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              This is the Poynt admin dashboard. Only authorized administrators
              can access this area.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "create-business",
      label: "Create Business Program",
      icon: <Package className="w-4 h-4" />,
      category: "Business",
    },
    {
      id: "create-protocol",
      label: "Create Protocol Program",
      icon: <Plus className="w-4 h-4" />,
      category: "Protocol",
    },
    {
      id: "update",
      label: "Update Program",
      icon: <Settings className="w-4 h-4" />,
      category: "Admin",
    },
    {
      id: "issue",
      label: "Issue Pass",
      icon: <Award className="w-4 h-4" />,
      category: "Admin",
    },
    {
      id: "batch-issue",
      label: "Batch Issue Passes",
      icon: <Users className="w-4 h-4" />,
      category: "Admin",
    },
    {
      id: "points",
      label: "Manage Points",
      icon: <Coins className="w-4 h-4" />,
      category: "Admin",
    },
    {
      id: "batch-points",
      label: "Batch Points",
      icon: <Target className="w-4 h-4" />,
      category: "Admin",
    },
    {
      id: "search",
      label: "Search Pass",
      icon: <Search className="w-4 h-4" />,
      category: "Data",
    },
    {
      id: "program-data",
      label: "Program Data",
      icon: <Info className="w-4 h-4" />,
      category: "Data",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8B1212] rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Poynt Admin
                </h1>
                <p className="text-sm text-gray-600">Loyalty Pass Management</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Admin: {userEmail}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#8B1212] text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                <span className="text-xs text-center leading-tight">
                  {tab.label}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "create-business" && (
            <CreateBusinessProgramTab
              createBusinessProgram={createBusinessProgram}
              getDefaultBusinessTierRequirements={
                getDefaultBusinessTierRequirements
              }
              previewBusinessTiers={previewBusinessTiers}
              businessTemplate={businessTemplate}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "create-protocol" && (
            <CreateProtocolProgramTab
              createProtocolProgram={createProtocolProgram}
              protocolTemplate={protocolTemplate}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "update" && (
            <UpdateProgramTab
              updateProgram={updateProgram}
              getAvailableProtocolActions={getAvailableProtocolActions}
              protocolTemplate={protocolTemplate}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "issue" && (
            <IssuePassTab
              issuePass={issuePass}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "batch-issue" && (
            <BatchIssuePassTab
              batchIssuePasses={batchIssuePasses}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "points" && (
            <ManagePointsTab
              awardPoints={awardPoints}
              awardProtocolPoints={awardProtocolPoints}
              awardBusinessCampaignPoints={awardBusinessCampaignPoints}
              revokePoints={revokePoints}
              giftPoints={giftPoints}
              getAvailableProtocolActions={getAvailableProtocolActions}
              protocolTemplate={protocolTemplate}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "batch-points" && (
            <BatchPointsTab
              batchAwardPoints={batchAwardPoints}
              getAvailableProtocolActions={getAvailableProtocolActions}
              protocolTemplate={protocolTemplate}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "search" && (
            <SearchPassTab
              getPassData={getPassData}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "program-data" && (
            <ProgramDataTab
              getProgramData={getProgramData}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {resultModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {resultModal.type === "success" ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    {resultModal.title}
                  </h2>
                </div>
                <button
                  onClick={hideResultModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(resultModal.data, null, 2)}
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence mode="wait">
        {notification.show && (
          <Notification
            message={notification.message}
            status={notification.status}
            switchShowOff={hideNotification}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// Create Business Program Tab
const CreateBusinessProgramTab: React.FC<any> = ({
  createBusinessProgram,
  getDefaultBusinessTierRequirements,
  previewBusinessTiers,
  businessTemplate,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [formData, setFormData] = useState({
    loyaltyProgramName: "",
    organizationName: "",
    metadataUri: "",
    customTierRequirements: getDefaultBusinessTierRequirements(),
  });
  const [showTierPreview, setShowTierPreview] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.loyaltyProgramName || !formData.organizationName) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      const result = await createBusinessProgram(formData);
      showNotification(
        "Business loyalty program created successfully!",
        "success"
      );
      showResultModal("Business Program Created", result, "success");

      // Reset form
      setFormData({
        loyaltyProgramName: "",
        organizationName: "",
        metadataUri: "",
        customTierRequirements: getDefaultBusinessTierRequirements(),
      });
    } catch (error) {
      showNotification("Failed to create business loyalty program", "error");
      showResultModal("Creation Failed", error, "error");
    }
  };

  const updateTierRequirement = (index: number, value: string): void => {
    const newRequirements = [...formData.customTierRequirements];
    newRequirements[index] = parseInt(value) || 0;
    setFormData({ ...formData, customTierRequirements: newRequirements });
  };

  const resetToDefaults = (): void => {
    setFormData({
      ...formData,
      customTierRequirements: getDefaultBusinessTierRequirements(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Create Business Loyalty Program
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            Business Template
          </span>
        </div>
      </div>

      {businessTemplate && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Business Template Info
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            Fixed campaign completion points:{" "}
            <strong>{businessTemplate.campaignCompletionPoints} points</strong>
          </p>
          <p className="text-sm text-blue-700">
            Customize tier requirements below (campaigns needed for each tier)
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Name *
            </label>
            <input
              type="text"
              value={formData.loyaltyProgramName}
              onChange={(e) =>
                setFormData({ ...formData, loyaltyProgramName: e.target.value })
              }
              placeholder="Enter program name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
              placeholder="Enter organization name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metadata URI
            </label>
            <input
              type="url"
              value={formData.metadataUri}
              onChange={(e) =>
                setFormData({ ...formData, metadataUri: e.target.value })
              }
              placeholder="https://arweave.net/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
            />
          </div>
        </div>

        {/* Tier Requirements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Tier Requirements (Campaigns Needed)
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetToDefaults}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={() => setShowTierPreview(!showTierPreview)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                {showTierPreview ? "Hide Preview" : "Preview Tiers"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.customTierRequirements.map(
              (requirement: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier {index + 1}
                  </label>
                  <input
                    type="number"
                    value={requirement}
                    onChange={(e) =>
                      updateTierRequirement(index, e.target.value)
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                  />
                </div>
              )
            )}
          </div>

          {showTierPreview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Tier Preview</h4>
              <div className="space-y-2">
                {previewBusinessTiers(formData.customTierRequirements).map(
                  (tier: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-white rounded border"
                    >
                      <span className="font-medium">{tier.name}</span>
                      <span className="text-sm text-gray-600">
                        {tier.campaignsRequired} campaigns required
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Package className="w-5 h-5" />
          )}
          Create Business Program
        </button>
      </form>
    </motion.div>
  );
};

// Create Protocol Program Tab
const CreateProtocolProgramTab: React.FC<any> = ({
  createProtocolProgram,
  protocolTemplate,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [formData, setFormData] = useState({
    loyaltyProgramName: "",
    organizationName: "",
    metadataUri: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.loyaltyProgramName || !formData.organizationName) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      const result = await createProtocolProgram(formData);
      showNotification(
        "Protocol loyalty program created successfully!",
        "success"
      );
      showResultModal("Protocol Program Created", result, "success");

      // Reset form
      setFormData({
        loyaltyProgramName: "",
        organizationName: "",
        metadataUri: "",
      });
    } catch (error) {
      showNotification("Failed to create protocol loyalty program", "error");
      showResultModal("Creation Failed", error, "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Create Protocol Loyalty Program
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
            Protocol Template
          </span>
        </div>
      </div>

      {protocolTemplate && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">
            Protocol Template Info
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {Object.entries(protocolTemplate.pointsPerAction).map(
              (action: any, points: any) => (
                <div key={action} className="text-purple-800">
                  <strong>{action.replace("_", " ").toUpperCase()}:</strong>{" "}
                  {points} pts
                </div>
              )
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Name *
            </label>
            <input
              type="text"
              value={formData.loyaltyProgramName}
              onChange={(e) =>
                setFormData({ ...formData, loyaltyProgramName: e.target.value })
              }
              placeholder="Enter program name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
              placeholder="Enter organization name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metadata URI
            </label>
            <input
              type="url"
              value={formData.metadataUri}
              onChange={(e) =>
                setFormData({ ...formData, metadataUri: e.target.value })
              }
              placeholder="https://arweave.net/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          Create Protocol Program
        </button>
      </form>
    </motion.div>
  );
};

// Update Program Tab
const UpdateProgramTab: React.FC<any> = ({
  updateProgram,
  getAvailableProtocolActions,
  protocolTemplate,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [pointsPerAction, setPointsPerAction] = useState<
    Record<string, number>
  >(protocolTemplate?.pointsPerAction || {});

  useEffect(() => {
    if (protocolTemplate?.pointsPerAction) {
      setPointsPerAction(protocolTemplate.pointsPerAction);
    }
  }, [protocolTemplate]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!collectionAddress) {
      showNotification("Please enter collection address", "error");
      return;
    }

    try {
      const result = await updateProgram({
        collectionAddress,
        newPointsPerAction: pointsPerAction,
      });

      showNotification("Program updated successfully!", "success");
      showResultModal("Program Updated", result, "success");
    } catch (error) {
      showNotification("Failed to update program", "error");
      showResultModal("Update Failed", error, "error");
    }
  };

  const updateAction = (action: string, value: string): void => {
    setPointsPerAction((prev) => ({
      ...prev,
      [action]: parseInt(value) || 0,
    }));
  };

  const resetToDefaults = (): void => {
    if (protocolTemplate?.pointsPerAction) {
      setPointsPerAction(protocolTemplate.pointsPerAction);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Update Program</h2>
        <button
          type="button"
          onClick={resetToDefaults}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Reset to Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Address *
          </label>
          <input
            type="text"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
            placeholder="Enter program collection address"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Points Per Action
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(pointsPerAction).map(([action, points]) => (
              <div key={action}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {action.replace("_", " ")}
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => updateAction(action, e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Settings className="w-5 h-5" />
          )}
          Update Program
        </button>
      </form>
    </motion.div>
  );
};

// Issue Pass Tab
const IssuePassTab: React.FC<any> = ({
  issuePass,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [formData, setFormData] = useState({
    collectionAddress: "",
    recipient: "",
    passName: "",
    passMetadataUri: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (
      !formData.collectionAddress ||
      !formData.recipient ||
      !formData.passName
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      const result = await issuePass(formData);

      showNotification("Loyalty pass issued successfully!", "success");
      showResultModal("Pass Issued", result, "success");

      // Reset form
      setFormData({
        collectionAddress: "",
        recipient: "",
        passName: "",
        passMetadataUri: "",
      });
    } catch (error) {
      showNotification("Failed to issue loyalty pass", "error");
      showResultModal("Issue Failed", error, "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Issue Loyalty Pass
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Address *
            </label>
            <input
              type="text"
              value={formData.collectionAddress}
              onChange={(e) =>
                setFormData({ ...formData, collectionAddress: e.target.value })
              }
              placeholder="Enter loyalty program collection address"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address *
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) =>
                setFormData({ ...formData, recipient: e.target.value })
              }
              placeholder="Enter user's wallet address"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pass Name *
            </label>
            <input
              type="text"
              value={formData.passName}
              onChange={(e) =>
                setFormData({ ...formData, passName: e.target.value })
              }
              placeholder="e.g., John's Poynt Pass"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pass Metadata URI
            </label>
            <input
              type="url"
              value={formData.passMetadataUri}
              onChange={(e) =>
                setFormData({ ...formData, passMetadataUri: e.target.value })
              }
              placeholder="https://arweave.net/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Award className="w-5 h-5" />
          )}
          Issue Pass
        </button>
      </form>
    </motion.div>
  );
};

// Batch Issue Pass Tab
const BatchIssuePassTab: React.FC<any> = ({
  batchIssuePasses,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [recipients, setRecipients] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!collectionAddress || !recipients.trim()) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      // Parse recipients (each line should be: address,name,metadataUri)
      const recipientLines = recipients.trim().split("\n");
      const recipientData = recipientLines.map((line, index) => {
        const parts = line.split(",").map((part) => part.trim());
        if (parts.length < 2) {
          throw new Error(
            `Invalid format on line ${
              index + 1
            }. Expected: address,name[,metadataUri]`
          );
        }
        return {
          recipient: parts[0],
          passName: parts[1],
          passMetadataUri: parts[2] || "",
        };
      });

      const result = await batchIssuePasses(collectionAddress, recipientData);

      showNotification(
        `${recipientData.length} passes issued successfully!`,
        "success"
      );
      showResultModal("Batch Passes Issued", result, "success");

      // Reset form
      setCollectionAddress("");
      setRecipients("");
    } catch (error) {
      showNotification("Failed to batch issue passes", "error");
      showResultModal("Batch Issue Failed", error, "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Batch Issue Passes
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Format Instructions
        </h3>
        <p className="text-sm text-blue-800 mb-2">
          Enter one recipient per line in the format:
        </p>
        <code className="text-xs bg-blue-100 p-2 rounded block">
          wallet_address,pass_name[,metadata_uri]
        </code>
        <p className="text-xs text-blue-700 mt-2">
          Metadata URI is optional. Example:
        </p>
        <code className="text-xs bg-blue-100 p-2 rounded block mt-1">
          ABC123...XYZ,John's Pass,https://arweave.net/abc123
        </code>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collection Address *
          </label>
          <input
            type="text"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
            placeholder="Enter loyalty program collection address"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients Data *
          </label>
          <textarea
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="ABC123...XYZ,John's Pass,https://arweave.net/abc123&#10;DEF456...UVW,Jane's Pass"
            rows={8}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212] font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Lines: {recipients.split("\n").filter((line) => line.trim()).length}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Users className="w-5 h-5" />
          )}
          Batch Issue Passes
        </button>
      </form>
    </motion.div>
  );
};

// Manage Points Tab
const ManagePointsTab: React.FC<any> = ({
  awardPoints,
  awardProtocolPoints,
  awardBusinessCampaignPoints,
  revokePoints,
  giftPoints,
  getAvailableProtocolActions,
  protocolTemplate,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [activeAction, setActiveAction] = useState<string>("award-protocol");
  const [passAddress, setPassAddress] = useState<string>("");
  const [action, setAction] = useState<string>("ad_view");
  const [multiplier, setMultiplier] = useState<string>("1");
  const [points, setPoints] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const availableActions = getAvailableProtocolActions();

  useEffect(() => {
    if (availableActions.length > 0) {
      setAction(availableActions[0]);
    }
  }, [availableActions]);

  const handleSubmit = async (): Promise<void> => {
    if (!passAddress) {
      showNotification("Please enter pass address", "error");
      return;
    }

    try {
      let result: any;

      switch (activeAction) {
        case "award-protocol":
          result = await awardProtocolPoints(
            passAddress,
            action,
            parseInt(multiplier)
          );
          showNotification(`Protocol points awarded for ${action}!`, "success");
          showResultModal("Protocol Points Awarded", result, "success");
          break;

        case "award-business":
          result = await awardBusinessCampaignPoints(passAddress);
          showNotification("Business campaign points awarded!", "success");
          showResultModal("Business Points Awarded", result, "success");
          break;

        case "award-admin":
          result = await awardPoints(passAddress, action, parseInt(multiplier));
          showNotification(`Admin points awarded for ${action}!`, "success");
          showResultModal("Admin Points Awarded", result, "success");
          break;

        case "revoke":
          if (!points) {
            showNotification("Please enter points to revoke", "error");
            return;
          }
          result = await revokePoints({
            passAddress,
            points: parseInt(points),
            reason: reason || "Admin revocation",
          });
          showNotification(`${points} points revoked!`, "success");
          showResultModal("Points Revoked", result, "success");
          break;

        case "gift":
          if (!points) {
            showNotification("Please enter points to gift", "error");
            return;
          }
          result = await giftPoints({
            passAddress,
            points: parseInt(points),
            reason: reason || "Admin gift",
          });
          showNotification(`${points} points gifted!`, "success");
          showResultModal("Points Gifted", result, "success");
          break;
      }

      // Reset form
      setPassAddress("");
      setAction(availableActions[0] || "ad_view");
      setMultiplier("1");
      setPoints("");
      setReason("");
    } catch (error) {
      showNotification(
        `Failed to ${activeAction.replace("-", " ")} points`,
        "error"
      );
      showResultModal(
        `${activeAction.replace("-", " ")} Failed`,
        error,
        "error"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Points</h2>

      {/* Action Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {[
          {
            id: "award-protocol",
            label: "Award Protocol",
            icon: <Target className="w-4 h-4" />,
            color: "purple",
          },
          {
            id: "award-business",
            label: "Award Business",
            icon: <Package className="w-4 h-4" />,
            color: "blue",
          },
          {
            id: "award-admin",
            label: "Award Admin",
            icon: <Plus className="w-4 h-4" />,
            color: "green",
          },
          {
            id: "revoke",
            label: "Revoke",
            icon: <Minus className="w-4 h-4" />,
            color: "red",
          },
          {
            id: "gift",
            label: "Gift",
            icon: <Gift className="w-4 h-4" />,
            color: "yellow",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAction(tab.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg font-medium transition-colors text-sm ${
              activeAction === tab.id
                ? "bg-[#8B1212] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            <span className="text-xs text-center leading-tight">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pass Address *
          </label>
          <input
            type="text"
            value={passAddress}
            onChange={(e) => setPassAddress(e.target.value)}
            placeholder="Enter user's pass address"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
          />
        </div>

        {/* Protocol Points Award */}
        {activeAction === "award-protocol" && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-3">
              Protocol Points Award
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action *
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                >
                  {availableActions.map((actionKey: any) => (
                    <option key={actionKey} value={actionKey}>
                      {actionKey.replace("_", " ").toUpperCase()} (
                      {protocolTemplate?.pointsPerAction[actionKey] || 0} pts)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiplier
                </label>
                <select
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                >
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                </select>
              </div>
            </div>
            <div className="mt-3 text-sm text-purple-700">
              Total points to award:{" "}
              <strong>
                {(protocolTemplate?.pointsPerAction[action] || 0) *
                  parseInt(multiplier)}{" "}
                points
              </strong>
            </div>
          </div>
        )}

        {/* Business Campaign Award */}
        {activeAction === "award-business" && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Business Campaign Completion
            </h3>
            <p className="text-sm text-blue-700">
              This will award <strong>40 points</strong> for campaign
              completion.
            </p>
          </div>
        )}

        {/* Admin Award */}
        {activeAction === "award-admin" && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">
              Admin Points Award
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action *
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                >
                  {availableActions.map((actionKey: any) => (
                    <option key={actionKey} value={actionKey}>
                      {actionKey.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiplier
                </label>
                <select
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                >
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {(activeAction === "revoke" || activeAction === "gift") && (
          <div
            className={`p-4 rounded-lg ${
              activeAction === "revoke" ? "bg-red-50" : "bg-yellow-50"
            }`}
          >
            <h3
              className={`font-semibold mb-3 ${
                activeAction === "revoke" ? "text-red-900" : "text-yellow-900"
              }`}
            >
              {activeAction === "revoke" ? "Revoke Points" : "Gift Points"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points *
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="Enter points amount"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Reason for ${activeAction}`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {activeAction === "award-protocol" && (
                <Target className="w-5 h-5" />
              )}
              {activeAction === "award-business" && (
                <Package className="w-5 h-5" />
              )}
              {activeAction === "award-admin" && <Plus className="w-5 h-5" />}
              {activeAction === "revoke" && <Minus className="w-5 h-5" />}
              {activeAction === "gift" && <Gift className="w-5 h-5" />}
            </>
          )}
          {activeAction === "award-protocol"
            ? "Award Protocol Points"
            : activeAction === "award-business"
            ? "Award Business Points"
            : activeAction === "award-admin"
            ? "Award Admin Points"
            : activeAction === "revoke"
            ? "Revoke Points"
            : "Gift Points"}
        </button>
      </div>
    </motion.div>
  );
};

// Batch Points Tab
const BatchPointsTab: React.FC<any> = ({
  batchAwardPoints,
  getAvailableProtocolActions,
  protocolTemplate,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [passAddresses, setPassAddresses] = useState<string>("");
  const [action, setAction] = useState<string>("ad_view");
  const [multiplier, setMultiplier] = useState<string>("1");

  const availableActions = getAvailableProtocolActions();

  useEffect(() => {
    if (availableActions.length > 0) {
      setAction(availableActions[0]);
    }
  }, [availableActions]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!passAddresses.trim()) {
      showNotification("Please enter pass addresses", "error");
      return;
    }

    try {
      const addressList = passAddresses
        .trim()
        .split("\n")
        .map((addr) => addr.trim())
        .filter((addr) => addr.length > 0);

      if (addressList.length === 0) {
        showNotification("No valid addresses found", "error");
        return;
      }

      const result = await batchAwardPoints(
        addressList,
        action,
        parseInt(multiplier)
      );

      showNotification(
        `Points awarded to ${addressList.length} passes!`,
        "success"
      );
      showResultModal("Batch Points Awarded", result, "success");

      // Reset form
      setPassAddresses("");
      setAction(availableActions[0] || "ad_view");
      setMultiplier("1");
    } catch (error) {
      showNotification("Failed to batch award points", "error");
      showResultModal("Batch Award Failed", error, "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Batch Award Points
      </h2>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
        <p className="text-sm text-blue-800">
          Enter one pass address per line. All addresses will receive the same
          points for the selected action.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pass Addresses *
          </label>
          <textarea
            value={passAddresses}
            onChange={(e) => setPassAddresses(e.target.value)}
            placeholder="ABC123...XYZ&#10;DEF456...UVW&#10;GHI789...RST"
            rows={8}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212] font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Addresses:{" "}
            {passAddresses.split("\n").filter((line) => line.trim()).length}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action *
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              required
            >
              {availableActions.map((actionKey: any) => (
                <option key={actionKey} value={actionKey}>
                  {actionKey.replace("_", " ").toUpperCase()} (
                  {protocolTemplate?.pointsPerAction[actionKey] || 0} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multiplier
            </label>
            <select
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
            >
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Batch Summary</h3>
          <div className="text-sm text-gray-700">
            <p>
              Action: <strong>{action.replace("_", " ").toUpperCase()}</strong>
            </p>
            <p>
              Points per address:{" "}
              <strong>
                {(protocolTemplate?.pointsPerAction[action] || 0) *
                  parseInt(multiplier)}{" "}
                points
              </strong>
            </p>
            <p>
              Total addresses:{" "}
              <strong>
                {passAddresses.split("\n").filter((line) => line.trim()).length}
              </strong>
            </p>
            <p>
              Total points to distribute:{" "}
              <strong>
                {(protocolTemplate?.pointsPerAction[action] || 0) *
                  parseInt(multiplier) *
                  passAddresses.split("\n").filter((line) => line.trim())
                    .length}{" "}
                points
              </strong>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Target className="w-5 h-5" />
          )}
          Batch Award Points
        </button>
      </form>
    </motion.div>
  );
};

// Search Pass Tab
const SearchPassTab: React.FC<any> = ({
  getPassData,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [passAddress, setPassAddress] = useState<string>("");
  const [passData, setPassData] = useState<any>(null);

  const handleSearch = async (): Promise<void> => {
    if (!passAddress) {
      showNotification("Please enter a pass address", "error");
      return;
    }

    try {
      const result = await getPassData(passAddress);
      setPassData(result);
      showNotification("Pass data loaded successfully", "success");
      showResultModal("Pass Data Retrieved", result, "success");
    } catch (error) {
      showNotification("Failed to fetch pass data", "error");
      showResultModal("Search Failed", error, "error");
      setPassData(null);
    }
  };

  const handleCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard", "success");
    } catch (err) {
      showNotification("Failed to copy", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Search Pass Data
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            value={passAddress}
            onChange={(e) => setPassAddress(e.target.value)}
            placeholder="Enter pass address to search"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !passAddress}
            className="px-6 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </div>
      </div>

      {/* Pass Data Display */}
      {passData && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pass Details
            </h3>
            <button
              onClick={() => handleCopy(JSON.stringify(passData, null, 2))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy all data"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {passData.totalPoints !== undefined && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Total Points
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {passData.totalPoints?.toLocaleString() || 0}
                </span>
              </div>
            )}

            {passData.currentTier && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Current Tier
                  </span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {passData.currentTier}
                </span>
              </div>
            )}

            {passData.owner && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Owner
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-green-600 truncate">
                    {passData.owner.slice(0, 6)}...{passData.owner.slice(-4)}
                  </span>
                  <button
                    onClick={() => handleCopy(passData.owner)}
                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {(passData.passAddress || passData.collectionAddress) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {passData.passAddress && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Pass Address
                    </span>
                    <button
                      onClick={() => handleCopy(passData.passAddress)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-mono text-gray-600 break-all">
                    {passData.passAddress}
                  </span>
                </div>
              )}

              {passData.collectionAddress && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Collection Address
                    </span>
                    <button
                      onClick={() => handleCopy(passData.collectionAddress)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs font-mono text-gray-600 break-all">
                    {passData.collectionAddress}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Raw Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Raw Data</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(passData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Program Data Tab
const ProgramDataTab: React.FC<any> = ({
  getProgramData,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [programData, setProgramData] = useState<any>(null);

  const handleSearch = async (): Promise<void> => {
    if (!collectionAddress) {
      showNotification("Please enter a collection address", "error");
      return;
    }

    try {
      const result = await getProgramData(collectionAddress);
      setProgramData(result);
      showNotification("Program data loaded successfully", "success");
      showResultModal("Program Data Retrieved", result, "success");
    } catch (error) {
      showNotification("Failed to fetch program data", "error");
      showResultModal("Search Failed", error, "error");
      setProgramData(null);
    }
  };

  const handleCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard", "success");
    } catch (err) {
      showNotification("Failed to copy", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Get Program Data
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
            placeholder="Enter collection address to get program data"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !collectionAddress}
            className="px-6 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Info className="w-4 h-4" />
            )}
            Get Data
          </button>
        </div>
      </div>

      {/* Program Data Display */}
      {programData && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Program Details
            </h3>
            <button
              onClick={() => handleCopy(JSON.stringify(programData, null, 2))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy all data"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Program Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {programData.programName && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Program Name
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {programData.programName}
                </span>
              </div>
            )}

            {programData.organizationName && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Organization
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {programData.organizationName}
                </span>
              </div>
            )}

            {programData.totalPasses !== undefined && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Total Passes
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {programData.totalPasses?.toLocaleString() || 0}
                </span>
              </div>
            )}

            {programData.programType && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">
                    Program Type
                  </span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {programData.programType}
                </span>
              </div>
            )}
          </div>

          {/* Points Per Action */}
          {programData.pointsPerAction && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Points Per Action
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(programData.pointsPerAction).map(
                  (action: any, points: any) => (
                    <div key={action} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 capitalize">
                        {action.replace("_", " ")}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {points} pts
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Tiers */}
          {programData.tiers && programData.tiers.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Program Tiers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programData.tiers.map((tier: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {tier.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {tier.xpRequired || tier.campaignsRequired || 0}{" "}
                        required
                      </span>
                    </div>
                    {tier.rewards && (
                      <div className="text-sm text-gray-600">
                        Rewards:{" "}
                        {Array.isArray(tier.rewards)
                          ? tier.rewards.join(", ")
                          : tier.rewards}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collection Address */}
          {programData.collectionAddress && (
            <div className="mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Collection Address
                  </span>
                  <button
                    onClick={() => handleCopy(programData.collectionAddress)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs font-mono text-gray-600 break-all">
                  {programData.collectionAddress}
                </span>
              </div>
            </div>
          )}

          {/* Metadata URI */}
          {programData.metadataUri && (
            <div className="mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Metadata URI
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(programData.metadataUri)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <a
                      href={programData.metadataUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-600 break-all">
                  {programData.metadataUri}
                </span>
              </div>
            </div>
          )}

          {/* Raw Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Raw Data</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(programData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </motion.div>
  );
};
