"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Plus,
  Edit2,
  ChevronDown,
  ChevronUp,
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
import Notification from "../../../components/notification";
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

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //Get users current businessId
  const businessId = getDataFromLocalStorage("businessId");
  // Fetch businessData
  const {
    data: businessRetrievedData,
    isLoading: businessIsLoading,
    error: businessError,
  } = useGetBusinessQuery({ id: businessId });
  const business = businessRetrievedData && businessRetrievedData?.data;
  const businessCampaigns: Campaign[] = business?.campaigns || [];

  // FILTER ADS FOR TABS
  const activeCampaigns =
    businessCampaigns &&
    businessCampaigns.filter(
      (item: Campaign) => item.campaignStatus === "Active"
    );
  const inactiveCampaigns =
    businessCampaigns &&
    businessCampaigns.filter(
      (item: Campaign) => item.campaignStatus === "Paused"
    );
  const pendingCampaigns =
    businessCampaigns &&
    businessCampaigns.filter(
      (item: Campaign) => item.campaignStatus === "Pending"
    );

  const campaigns: Campaign[] =
    activeTab === "Active"
      ? activeCampaigns
      : activeTab === "Paused"
      ? inactiveCampaigns
      : activeTab === "Pending"
      ? pendingCampaigns
      : businessCampaigns;

  // Calculate total pages
  const totalPages = Math.ceil((campaigns?.length || 0) / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = campaigns?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const toggleSelectAll = () => {
    if (selectedCampaigns.length === currentItems.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(currentItems.map((camp) => camp.id));
    }
  };

  const toggleCampaign = (id: string) => {
    if (selectedCampaigns.includes(id)) {
      setSelectedCampaigns((prev) => prev.filter((campId) => campId !== id));
    } else {
      setSelectedCampaigns((prev) => [...prev, id]);
    }
  };

  const getStatusColor = (status: string) => {
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
  };

  //MAKE API CALL TO delete a campaign.
  const [deleteFunc, { isLoading, reset }] = useSendDataMutation();
  const deleteCampaign = async () => {
    if (selectedCampaigns.length > 0) {
      const request: any = await deleteFunc({
        url: `campaign`,
        data: { arrayOfCampaignIds: selectedCampaigns },
        type: "DELETE",
      });
      if (request?.data) {
        const { data, message, status } = request?.data;
        setSelectedCampaigns([]);
        showNotification(message, "success");
      } else {
        showNotification(
          request?.error?.data?.message
            ? request?.error?.data?.message
            : "Check Internet Connection and try again",
          "error"
        );
      }
    } else {
      showNotification("No campaign selected", "error");
    }
  };
  
  //MAKE API CALL TO switch campaign status.
  const [pauseFunc, { isLoading: pauseIsLoading, reset: pauseReset }] =
    useSendDataMutation();
  const pauseCampaign = async (id: string) => {
    const request: any = await pauseFunc({
      url: `campaign/status/${id}`,
      data: {},
      type: "PATCH",
    });
    if (request?.data) {
      const { data, message, status } = request?.data;
      showNotification(message, "success");
    } else {
      showNotification(
        request?.error?.data?.message
          ? request?.error?.data?.message
          : "Check Internet Connection and try again",
        "error"
      );
    }
  };

  return (
    <div className="px-3 sm:px-6 relative max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-12">
        <h1 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-0">Campaign</h1>
        <button
          onClick={() => router.push("/create_campaign")}
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
              <button
                onClick={() => setActiveTab("All")}
                className={`px-3 sm:px-4 py-2 whitespace-nowrap font-medium text-xs sm:text-sm ${
                  activeTab === "All"
                    ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                    : "text-gray-500"
                }`}
              >
                All ads
              </button>
              <button
                onClick={() => setActiveTab("Active")}
                className={`px-3 sm:px-4 py-2 whitespace-nowrap font-medium text-xs sm:text-sm ${
                  activeTab === "Active"
                    ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                    : "text-gray-500"
                }`}
              >
                Active ads
              </button>
              <button
                onClick={() => setActiveTab("Paused")}
                className={`px-3 sm:px-4 py-2 whitespace-nowrap font-medium text-xs sm:text-sm ${
                  activeTab === "Paused"
                    ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                    : "text-gray-500"
                }`}
              >
                Inactive ads
              </button>
              <button
                onClick={() => setActiveTab("Pending")}
                className={`px-3 sm:px-4 py-2 whitespace-nowrap font-medium text-xs sm:text-sm ${
                  activeTab === "Pending"
                    ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                    : "text-gray-500"
                }`}
              >
                Pending ads
              </button>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex justify-end gap-2 p-3 border-b border-gray-100">
            <button 
              disabled={selectedCampaigns.length === 0}
              className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={deleteCampaign}
              disabled={selectedCampaigns.length === 0}
              className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
            <button
              disabled={selectedCampaigns.length === 0}
              className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              <FileText size={16} />
              <span>Report</span>
            </button>
            <button
              disabled={selectedCampaigns.length === 0}
              className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              <Copy size={16} />
              <span>Copy</span>
            </button>
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
                <button onClick={deleteCampaign} className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-sm">
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
        {businessIsLoading && (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 mb-4 rounded-full bg-gray-200"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!businessIsLoading && campaigns?.length === 0 && (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns found</h3>
            <p className="text-gray-500 mb-4">Try changing filters or create your first campaign</p>
            <button
              onClick={() => router.push("/create_campaign")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors text-sm"
            >
              <Plus size={16} />
              <span>Create a campaign</span>
            </button>
          </div>
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
                  <tr
                    key={campaign.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => toggleCampaign(campaign.id)}
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
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="px-4 py-3">${campaign.budget}</td>
                    <td className="px-4 py-3">${campaign.amountSpent}</td>
                    <td className="px-4 py-3">{campaign.reached}</td>
                    <td className="px-4 py-3">${campaign.costPerReach}</td>
                    <td className="px-4 py-3">{campaign.linkClick}</td>
                    <td className="px-4 py-3">
                      {campaign.linkClick !== 0
                        ? `${Number((campaign.linkClick / campaign.reached) * 100).toFixed(2)}%`
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
                              ? pauseCampaign(campaign.id)
                              : ""
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Campaigns Cards - Mobile */}
        {!businessIsLoading && campaigns?.length > 0 && (
          <div className="md:hidden">
            {currentItems.map((campaign) => (
              <div key={campaign.id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 rounded border-gray-300"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={() => toggleCampaign(campaign.id)}
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
                          ? pauseCampaign(campaign.id)
                          : ""
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
                        ? `${Number((campaign.linkClick / campaign.reached) * 100).toFixed(2)}%`
                        : "0%"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!businessIsLoading && campaigns?.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button 
              className={`flex items-center gap-1 text-xs sm:text-sm text-gray-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'}`}
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
              className={`flex items-center gap-1 text-xs sm:text-sm text-gray-600 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'}`}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next <ChevronDown size={16} className="-rotate-90" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {notification.show && (
          <Notification
            message={notification.message}
            status={notification.status}
            switchShowOff={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}