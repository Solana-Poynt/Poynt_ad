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

  //Get users current businessId
  const businessId = getDataFromLocalStorage("businessId");
  // Fetch businessData
  const {
    data: businessRetrievedData,
    isLoading: businessIsLoading,
    error: businessError,
  } = useGetBusinessQuery({ id: businessId });
  const business = businessRetrievedData && businessRetrievedData?.data;
  const businessCampaigns: Campaign[] = business?.campaigns;

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
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map((camp) => camp.id));
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
    <div className="px-6 relative max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div className="flex flex-row w-full justify-between gap-4 items-center">
          <h1 className="text-2xl font-semibold text-text">Campaign</h1>
          <button
            onClick={() => router.push("/create_campaign")}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors"
          >
            <Plus size={16} />
            <span>Create a campaign</span>
          </button>
        </div>
      </div>
      {/* Tabs  */}
      <div className=" mb-2 bg-white rounded-xl over">
        {/* Tab Navigation */}
        <div className="flex flex-row">
          <div className="absolute top-20 bg-white rounded-3xl p-5">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "All"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              All ads
            </button>
            <button
              onClick={() => setActiveTab("Active")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "Active"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              Active ads
            </button>
            <button
              onClick={() => setActiveTab("Paused")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "Paused"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              Inactive ads
            </button>
            <button
              onClick={() => setActiveTab("Pending")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "Pending"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              Pending ads
            </button>
          </div>

          {/* Action Buttons */}
          <div className="bg-main w-full  flex justify-end gap-3 pb-4 mb-4">
            <button className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs">
              <Edit2 size={20} />
              <h1>Edit</h1>
            </button>
            <button
              onClick={deleteCampaign}
              className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs"
            >
              <Trash2 size={20} />
              <h1>Delete</h1>
            </button>
            <button className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs">
              <FileText size={20} />
              <h1>Report</h1>
            </button>

            <button className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs">
              <Copy size={20} />
              <h1>Copy</h1>
            </button>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="overflow-auto" style={{ maxHeight: "600px" }}>
          <table className="bg-white rounded-xl w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-200">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={
                      campaigns
                        ? selectedCampaigns.length === campaigns.length
                        : false
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
              {campaigns &&
                campaigns.map((campaign) => (
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
                        ? Number((campaign.linkClick / campaign.reached) * 100)
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
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8B1212] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B1212]"></div>
                      </label>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <button className="flex items-center gap-1 text-sm text-gray-600">
              <ChevronDown size={16} /> Previous
            </button>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded bg-[#8B1212] text-white">
                01
              </button>
              <button className="px-3 py-1 text-gray-600">02</button>
              <button className="px-3 py-1 text-gray-600">03</button>
              <button className="px-3 py-1 text-gray-600">04</button>
              <button className="px-3 py-1 text-gray-600">05</button>
              <span className="text-gray-600">...</span>
              <button className="px-3 py-1 text-gray-600">10</button>
            </div>
            <button className="flex items-center gap-1 text-sm text-gray-600">
              Next <ChevronUp size={16} className="rotate-90" />
            </button>
          </div>
        </div>
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
