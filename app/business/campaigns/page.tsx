"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState, useMemo, memo } from "react";
import {
  Plus,
  Edit2,
  ChevronDown,
  Copy,
  Trash2,
  FileText,
  Menu,
  MoreVertical,
} from "lucide-react";
import {
  useGetBusinessQuery,
  useSendDataMutation,
} from "../../../store/api/api";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { NotificationState } from "@/types/general";
import Notification from "../../../components/Notification";
import { AnimatePresence } from "framer-motion";

interface Campaign {
  id: string;
  name: string;
  campaignStatus: "Active" | "Paused" | "Pending" | "Completed" | "Rejected";
  budget: number;
  amountSpent: number;
  reached: number;
  costPerReach: number;
  linkClick: number;
  ctr: string;
}

// Memoized components for better performance
const ActionButton = memo(({ onClick, disabled, icon, label }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {icon}
    <span>{label}</span>
  </button>
));
ActionButton.displayName = "ActionButton";

const TabButton = memo(({ isActive, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-3 sm:px-4 py-2 whitespace-nowrap font-medium text-xs sm:text-sm ${
      isActive ? "text-[#8B1212] border-b-2 border-[#8B1212]" : "text-gray-500"
    }`}
  >
    {label}
  </button>
));
TabButton.displayName = "TabButton";

const EmptyState = memo(({ onCreateCampaign }: any) => (
  <div className="p-8 text-center">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FileText size={24} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">
      No campaigns found
    </h3>
    <p className="text-gray-500 mb-4">
      Try changing filters or create your first campaign
    </p>
    <button
      onClick={onCreateCampaign}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors text-sm"
    >
      <Plus size={16} />
      <span>Create a campaign</span>
    </button>
  </div>
));
EmptyState.displayName = "EmptyState";

const LoadingState = memo(() => (
  <div className="p-8 text-center text-gray-500">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 w-8 mb-4 rounded-full bg-gray-200"></div>
      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
));
LoadingState.displayName = "LoadingState";

// Campaign table row component
const CampaignTableRow = memo(
  ({ campaign, isSelected, onToggle, onPause, getStatusColor }: any) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300"
          checked={isSelected}
          onChange={onToggle}
        />
      </td>
      <td className="px-4 py-3">
        <span
          className={`flex items-center gap-2 ${getStatusColor(
            campaign.campaignStatus
          )}`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {campaign.campaignStatus}
        </span>
      </td>
      <td className="px-4 py-3 font-medium text-gray-900">{campaign.name}</td>
      <td className="px-4 py-3">{campaign.budget} SOL</td>
      <td className="px-4 py-3">{campaign.amountSpent} SOL</td>
      <td className="px-4 py-3">{campaign.reached}</td>
      <td className="px-4 py-3">{campaign.costPerReach}</td>
      <td className="px-4 py-3">{campaign.linkClick}</td>
      <td className="px-4 py-3">
        {campaign.linkClick !== 0
          ? `${Number((campaign.linkClick / campaign.reached) * 100).toFixed(
              2
            )}%`
          : "0%"}
      </td>
      <td className="px-4 py-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={campaign.campaignStatus === "Active"}
            onChange={() =>
              campaign.campaignStatus === "Paused" ||
              campaign.campaignStatus === "Active"
                ? onPause(campaign.id)
                : null
            }
            disabled={
              campaign.campaignStatus !== "Paused" &&
              campaign.campaignStatus !== "Active"
            }
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8B1212] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B1212] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
        </label>
      </td>
    </tr>
  )
);
CampaignTableRow.displayName = "CampaignTableRow";

// Campaign mobile card component
const CampaignMobileCard = memo(
  ({ campaign, isSelected, onToggle, onPause, getStatusColor }: any) => (
    <div className="border-b border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="w-4 h-4 mt-1 rounded border-gray-300"
            checked={isSelected}
            onChange={onToggle}
          />
          <div>
            <h3 className="font-medium text-gray-900">{campaign.name}</h3>
            <span
              className={`flex items-center gap-1 text-xs ${getStatusColor(
                campaign.campaignStatus
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {campaign.campaignStatus}
            </span>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={campaign.campaignStatus === "Active"}
            onChange={() =>
              campaign.campaignStatus === "Paused" ||
              campaign.campaignStatus === "Active"
                ? onPause(campaign.id)
                : null
            }
            disabled={
              campaign.campaignStatus !== "Paused" &&
              campaign.campaignStatus !== "Active"
            }
          />
          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8B1212] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#8B1212] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500 mb-1">Budget</div>
          <div className="font-medium">${campaign.budget}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500 mb-1">Amount spent</div>
          <div className="font-medium">${campaign.amountSpent}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500 mb-1">Reached</div>
          <div className="font-medium">{campaign.reached}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500 mb-1">Link clicks</div>
          <div className="font-medium">{campaign.linkClick}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500 mb-1">Cost per reach</div>
          <div className="font-medium">${campaign.costPerReach}</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500 mb-1">CTR</div>
          <div className="font-medium">
            {campaign.linkClick !== 0
              ? `${Number(
                  (campaign.linkClick / campaign.reached) * 100
                ).toFixed(2)}%`
              : "0%"}
          </div>
        </div>
      </div>
    </div>
  )
);
CampaignMobileCard.displayName = "CampaignMobileCard";

const Pagination = memo(
  ({ currentPage, totalPages, paginate, prevPage, nextPage }: any) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <button
        className={`flex items-center gap-1 text-xs sm:text-sm text-gray-600 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-gray-900"
        }`}
        onClick={prevPage}
        disabled={currentPage === 1}
      >
        <ChevronDown size={16} className="rotate-90" /> Previous
      </button>

      <div className="hidden sm:flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
          let pageNumber;

          // Calculate which page numbers to show
          if (totalPages <= 5) {
            pageNumber = index + 1;
          } else if (currentPage <= 3) {
            pageNumber = index + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + index;
          } else {
            pageNumber = currentPage - 2 + index;
          }

          return (
            <button
              key={index}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === pageNumber
                  ? "bg-[#8B1212] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => paginate(pageNumber)}
            >
              {String(pageNumber).padStart(2, "0")}
            </button>
          );
        })}

        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <span className="text-gray-600">...</span>
            <button
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm"
              onClick={() => paginate(totalPages)}
            >
              {String(totalPages).padStart(2, "0")}
            </button>
          </>
        )}
      </div>

      {/* Mobile pagination just shows current/total */}
      <div className="sm:hidden text-xs text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      <button
        className={`flex items-center gap-1 text-xs sm:text-sm text-gray-600 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-gray-900"
        }`}
        onClick={nextPage}
        disabled={currentPage === totalPages}
      >
        Next <ChevronDown size={16} className="-rotate-90" />
      </button>
    </div>
  )
);
Pagination.displayName = "Pagination";

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const businessId = useMemo(() => getDataFromLocalStorage("businessId"), []);

  // Fetch businessData
  const {
    data: businessRetrievedData,
    isLoading: businessIsLoading,
    error: businessError,
  } = useGetBusinessQuery({ id: businessId }, { skip: !businessId });

  const business = businessRetrievedData?.data;
  const businessCampaigns: Campaign[] = business?.campaigns || [];

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });


  const campaigns = useMemo(() => {
    if (activeTab === "Active") {
      return businessCampaigns.filter(
        (item) => item.campaignStatus === "Active"
      );
    } else if (activeTab === "Paused") {
      return businessCampaigns.filter(
        (item) => item.campaignStatus === "Paused"
      );
    } else if (activeTab === "Pending") {
      return businessCampaigns.filter(
        (item) => item.campaignStatus === "Pending"
      );
    }
    return businessCampaigns;
  }, [businessCampaigns, activeTab]);

  // Memoize pagination calculations
  const { totalPages, currentItems } = useMemo(() => {
    const total = Math.ceil((campaigns?.length || 0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = campaigns?.slice(indexOfFirstItem, indexOfLastItem) || [];

    return { totalPages: total, currentItems: items };
  }, [campaigns, currentPage, itemsPerPage]);

  // Callbacks for state updates
  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const toggleSelectAll = useCallback(() => {
    if (selectedCampaigns.length === currentItems.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(currentItems.map((camp) => camp.id));
    }
  }, [selectedCampaigns.length, currentItems]);

  const toggleCampaign = useCallback((id: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((campId) => campId !== id) : [...prev, id]
    );
  }, []);

  const navigateToCreateCampaign = useCallback(() => {
    router.push("/create_campaign");
  }, [router]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Paused":
        return "text-gray-400";
      case "Rejected":
        return "text-red-400";
      default:
        return "text-gray-600";
    }
  }, []);

  // API mutations
  const [deleteFunc] = useSendDataMutation();
  const [pauseFunc] = useSendDataMutation();

  const deleteCampaign = useCallback(async () => {
    if (selectedCampaigns.length === 0) {
      showNotification("No campaign selected", "error");
      return;
    }

    try {
      const request = await deleteFunc({
        url: `campaign`,
        data: { arrayOfCampaignIds: selectedCampaigns },
        type: "DELETE",
      });

      if (request?.data) {
        const { message } = request.data;
        setSelectedCampaigns([]);
        showNotification(message, "success");
      } else {
        const errorMessage =
          request?.error?.data?.message ||
          "Check Internet Connection and try again";
        showNotification(errorMessage, "error");
      }
    } catch (error) {
      showNotification("An error occurred while deleting campaigns", "error");
    }
  }, [selectedCampaigns, deleteFunc, showNotification]);

  const pauseCampaign = useCallback(
    async (id: string) => {
      try {
        const request = await pauseFunc({
          url: `campaign/status/${id}`,
          data: {},
          type: "PATCH",
        });

        if (request?.data) {
          const { message } = request.data;
          showNotification(message, "success");
        } else {
          const errorMessage =
            request?.error?.data?.message ||
            "Check Internet Connection and try again";
          showNotification(errorMessage, "error");
        }
      } catch (error) {
        showNotification(
          "An error occurred while updating campaign status",
          "error"
        );
      }
    },
    [pauseFunc, showNotification]
  );

  return (
    <div className="px-3 sm:px-6 relative max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-12">
        <h1 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-0">
          Campaign
        </h1>
        <button
          onClick={navigateToCreateCampaign}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors text-sm sm:text-base"
        >
          <Plus size={16} />
          <span>Create a campaign</span>
        </button>
      </div>

      {/* Tabs and Actions Container */}
      <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row">
          <div className="w-full overflow-x-auto">
            <div className="flex p-3 sm:p-5 border-b border-gray-100">
              <TabButton
                isActive={activeTab === "All"}
                onClick={() => setActiveTab("All")}
                label="All ads"
              />
              <TabButton
                isActive={activeTab === "Active"}
                onClick={() => setActiveTab("Active")}
                label="Active ads"
              />
              <TabButton
                isActive={activeTab === "Paused"}
                onClick={() => setActiveTab("Paused")}
                label="Inactive ads"
              />
              <TabButton
                isActive={activeTab === "Pending"}
                onClick={() => setActiveTab("Pending")}
                label="Pending ads"
              />
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex justify-end gap-2 p-3 border-b border-gray-100">
            <ActionButton
              onClick={() => {}}
              disabled={selectedCampaigns.length === 0}
              icon={<Edit2 size={16} />}
              label="Edit"
            />
            <ActionButton
              onClick={deleteCampaign}
              disabled={selectedCampaigns.length === 0}
              icon={<Trash2 size={16} />}
              label="Delete"
            />
            <ActionButton
              onClick={() => {}}
              disabled={selectedCampaigns.length === 0}
              icon={<FileText size={16} />}
              label="Report"
            />
            <ActionButton
              onClick={() => {}}
              disabled={selectedCampaigns.length === 0}
              icon={<Copy size={16} />}
              label="Copy"
            />
          </div>

          {/* Action Button - Mobile */}
          <div className="sm:hidden flex justify-end p-3 border-b border-gray-100 relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-2 rounded-full hover:bg-gray-100"
              disabled={selectedCampaigns.length === 0}
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {showActionMenu && selectedCampaigns.length > 0 && (
              <div className="absolute top-12 right-3 bg-white shadow-lg rounded-lg z-20 w-36">
                <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-sm">
                  <Edit2 size={14} /> <span>Edit</span>
                </button>
                <button
                  onClick={deleteCampaign}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-sm"
                >
                  <Trash2 size={14} /> <span>Delete</span>
                </button>
                <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-sm">
                  <FileText size={14} /> <span>Report</span>
                </button>
                <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-sm">
                  <Copy size={14} /> <span>Copy</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {businessIsLoading && <LoadingState />}

        {/* Empty State */}
        {!businessIsLoading && campaigns?.length === 0 && (
          <EmptyState onCreateCampaign={navigateToCreateCampaign} />
        )}

        {/* Campaigns Table - Desktop */}
        {!businessIsLoading && campaigns?.length > 0 && (
          <div className="hidden md:block overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={
                        currentItems &&
                        currentItems.length > 0 &&
                        selectedCampaigns.length === currentItems.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Campaign
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Amount spent
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Reached
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Cost per reach
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Link click
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    CTR
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    On/Off
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((campaign) => (
                  <CampaignTableRow
                    key={campaign.id}
                    campaign={campaign}
                    isSelected={selectedCampaigns.includes(campaign.id)}
                    onToggle={() => toggleCampaign(campaign.id)}
                    onPause={pauseCampaign}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Campaigns Cards - Mobile */}
        {!businessIsLoading && campaigns?.length > 0 && (
          <div className="md:hidden">
            {currentItems.map((campaign) => (
              <CampaignMobileCard
                key={campaign.id}
                campaign={campaign}
                isSelected={selectedCampaigns.includes(campaign.id)}
                onToggle={() => toggleCampaign(campaign.id)}
                onPause={pauseCampaign}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!businessIsLoading && campaigns?.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {notification.show && (
          <Notification
            message={notification.message}
            status={notification.status}
            switchShowOff={hideNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
