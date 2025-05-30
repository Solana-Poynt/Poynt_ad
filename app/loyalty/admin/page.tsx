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
} from "lucide-react";
import { useLoyalty } from "@/utils/hooks/useLoyalty";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import Notification from "@/components/Notification";

const ADMIN_EMAIL = "danielfrancis32610@gmail.com";

// Point actions for Poynt
const POINT_ACTIONS = {
  ad_view: 10,
  ad_click: 25,
  ad_complete: 50,
  daily_login: 25,
  streak_bonus: 100,
  referral: 1000,
  profile_complete: 200,
} as const;

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

interface CreateProgramFormData {
  loyaltyProgramName: string;
  organizationName: string;
  brandColor: string;
  metadataUri: string;
}

interface IssuePassFormData {
  collectionAddress: string;
  recipient: string;
  passName: string;
  passMetadataUri: string;
}

interface TabComponentProps {
  isLoading: boolean;
  showNotification: (message: string, status: "success" | "error") => void;
  showResultModal: (
    title: string,
    data: any,
    type?: "success" | "error"
  ) => void;
}

interface CreateProgramTabProps extends TabComponentProps {
  createProgram: (params: any) => Promise<any>;
}

interface UpdateProgramTabProps extends TabComponentProps {
  updateProgram: (params: any) => Promise<any>;
}

interface IssuePassTabProps extends TabComponentProps {
  issuePass: (params: any) => Promise<any>;
}

interface ManagePointsTabProps extends TabComponentProps {
  awardPoints: (
    passAddress: string,
    action: string,
    multiplier?: number
  ) => Promise<any>;
  revokePoints: (params: any) => Promise<any>;
  giftPoints: (params: any) => Promise<any>;
}

interface SearchPassTabProps extends TabComponentProps {
  getPassData: (passAddress: string) => Promise<any>;
}

export default function PoyntAdminDashboard(): JSX.Element {
  const {
    isLoading,
    createProgram,
    updateProgram,
    issuePass,
    awardPoints,
    revokePoints,
    giftPoints,
    getPassData,
  } = useLoyalty();

  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("create");
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
      <div>
        <Loader className="w-8 h-8 animate-spin text-gray-500 mx-auto my-20" />
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
          <div className="flex border-b overflow-x-auto">
            {[
              {
                id: "create",
                label: "Create Program",
                icon: <Plus className="w-4 h-4" />,
              },
              {
                id: "update",
                label: "Update Program",
                icon: <Settings className="w-4 h-4" />,
              },
              {
                id: "issue",
                label: "Issue Pass",
                icon: <Award className="w-4 h-4" />,
              },
              {
                id: "points",
                label: "Manage Points",
                icon: <Coins className="w-4 h-4" />,
              },
              {
                id: "search",
                label: "Search Pass",
                icon: <Search className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <CreateProgramTab
              createProgram={createProgram}
              isLoading={isLoading}
              showNotification={showNotification}
              showResultModal={showResultModal}
            />
          )}
          {activeTab === "update" && (
            <UpdateProgramTab
              updateProgram={updateProgram}
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
          {activeTab === "points" && (
            <ManagePointsTab
              awardPoints={awardPoints}
              revokePoints={revokePoints}
              giftPoints={giftPoints}
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

// Create Program Tab
const CreateProgramTab: React.FC<CreateProgramTabProps> = ({
  createProgram,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [formData, setFormData] = useState<CreateProgramFormData>({
    loyaltyProgramName: "",
    organizationName: "",
    brandColor: "#8B1212",
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
      const result = await createProgram({
        ...formData,
        tiers: [
          { name: "Grind", xpRequired: 0, rewards: ["5% discount"] },
          { name: "Explorer", xpRequired: 500, rewards: ["10% discount"] },
          { name: "Achiever", xpRequired: 2000, rewards: ["15% discount"] },
          { name: "Legend", xpRequired: 5000, rewards: ["20% discount"] },
          { name: "Master", xpRequired: 10000, rewards: ["25% discount"] },
        ],
        pointsPerAction: POINT_ACTIONS,
      });

      showNotification("Loyalty program created successfully!", "success");
      showResultModal("Program Created", result, "success");

      // Reset form
      setFormData({
        loyaltyProgramName: "",
        organizationName: "",
        brandColor: "#8B1212",
        metadataUri: "",
      });
    } catch (error) {
      showNotification("Failed to create loyalty program", "error");
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
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Create Loyalty Program
      </h2>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Color
            </label>
            <input
              type="color"
              value={formData.brandColor}
              onChange={(e) =>
                setFormData({ ...formData, brandColor: e.target.value })
              }
              className="w-full h-10 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
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
          Create Program
        </button>
      </form>
    </motion.div>
  );
};

// Update Program Tab
const UpdateProgramTab: React.FC<UpdateProgramTabProps> = ({
  updateProgram,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [collectionAddress, setCollectionAddress] = useState<string>("");
  const [pointsPerAction, setPointsPerAction] =
    useState<Record<string, number>>(POINT_ACTIONS);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Update Program</h2>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(pointsPerAction).map(([action, points]) => (
              <div key={action}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {action.replace("_", " ")}
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => updateAction(action, e.target.value)}
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
const IssuePassTab: React.FC<IssuePassTabProps> = ({
  issuePass,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [formData, setFormData] = useState<IssuePassFormData>({
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

// Manage Points Tab
const ManagePointsTab: React.FC<ManagePointsTabProps> = ({
  awardPoints,
  revokePoints,
  giftPoints,
  isLoading,
  showNotification,
  showResultModal,
}) => {
  const [activeAction, setActiveAction] = useState<string>("award");
  const [passAddress, setPassAddress] = useState<string>("");
  const [action, setAction] = useState<string>("ad_view");
  const [multiplier, setMultiplier] = useState<string>("1");
  const [points, setPoints] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    if (!passAddress) {
      showNotification("Please enter pass address", "error");
      return;
    }

    try {
      let result: any;

      switch (activeAction) {
        case "award":
          result = await awardPoints(passAddress, action, parseInt(multiplier));
          showNotification(`Points awarded for ${action}!`, "success");
          showResultModal("Points Awarded", result, "success");
          break;

        case "revoke":
          if (!points) {
            showNotification("Please enter points to revoke", "error");
            return;
          }
          result = await revokePoints({
            passAddress,
            points: parseInt(points),
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
      setAction("ad_view");
      setMultiplier("1");
      setPoints("");
      setReason("");
    } catch (error) {
      showNotification(`Failed to ${activeAction} points`, "error");
      showResultModal(`${activeAction} Failed`, error, "error");
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
      <div className="flex gap-2 mb-6">
        {[
          { id: "award", label: "Award", icon: <Plus className="w-4 h-4" /> },
          {
            id: "revoke",
            label: "Revoke",
            icon: <Minus className="w-4 h-4" />,
          },
          { id: "gift", label: "Gift", icon: <Gift className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAction(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeAction === tab.id
                ? "bg-[#8B1212] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
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

        {activeAction === "award" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action *
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
              >
                {Object.entries(POINT_ACTIONS).map(([actionKey, points]) => (
                  <option key={actionKey} value={actionKey}>
                    {actionKey.replace("_", " ").toUpperCase()} ({points} pts)
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
        )}

        {(activeAction === "revoke" || activeAction === "gift") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {activeAction === "gift" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Optional reason"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212]"
                />
              </div>
            )}
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
              {activeAction === "award" && <Plus className="w-5 h-5" />}
              {activeAction === "revoke" && <Minus className="w-5 h-5" />}
              {activeAction === "gift" && <Gift className="w-5 h-5" />}
            </>
          )}
          {activeAction === "award"
            ? "Award Points"
            : activeAction === "revoke"
            ? "Revoke Points"
            : "Gift Points"}
        </button>
      </div>
    </motion.div>
  );
};

// Search Pass Tab
const SearchPassTab: React.FC<SearchPassTabProps> = ({
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
