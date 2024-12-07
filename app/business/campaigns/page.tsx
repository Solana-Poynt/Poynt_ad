"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Edit2,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  FileText,
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  status: "Active" | "Inactive" | "Pending";
  budget: number;
  amountSpent: number;
  reached: number;
  costPerView: number;
  linkClick: number;
  ctr: string;
  isActive: boolean;
}

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);

  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "Summer sales campaign",
      status: "Active",
      budget: 200,
      amountSpent: 200,
      reached: 100,
      costPerView: 0.085,
      linkClick: 10,
      ctr: "1%",
      isActive: true,
    },
    {
      id: 2,
      name: "Summer sales campaign",
      status: "Pending",
      budget: 200,
      amountSpent: 200,
      reached: 100,
      costPerView: 0.085,
      linkClick: 10,
      ctr: "1%",
      isActive: false,
    },
    {
      id: 3,
      name: "Summer sales campaign",
      status: "Inactive",
      budget: 200,
      amountSpent: 200,
      reached: 100,
      costPerView: 0.085,
      linkClick: 10,
      ctr: "1%",
      isActive: false,
    },
  ];

  const toggleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map((camp) => camp.id));
    }
  };

  const toggleCampaign = (id: number) => {
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
      case "Inactive":
        return "text-gray-400";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="px-6 relative max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-20">
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
      <div className=" mb-8 bg-white rounded-xl overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex flex-row">
          <div className="absolute top-28 bg-white rounded-3xl p-5">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "all"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              All ads
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "active"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              Active ads
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "inactive"
                  ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                  : "text-gray-500"
              }`}
            >
              Inactive ads
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "pending"
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
            <button className="py-1 px-2 flex bg-white flex-row items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-lg text-xs">
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
        <div>
          <table className="bg-white rounded-xl w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={selectedCampaigns.length === campaigns.length}
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
                  Cost per view
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
              {campaigns.map((campaign) => (
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
                        campaign.status
                      )}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="px-4 py-3">${campaign.budget}</td>
                  <td className="px-4 py-3">${campaign.amountSpent}</td>
                  <td className="px-4 py-3">{campaign.reached}</td>
                  <td className="px-4 py-3">${campaign.costPerView}</td>
                  <td className="px-4 py-3">{campaign.linkClick}</td>
                  <td className="px-4 py-3">{campaign.ctr}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={campaign.isActive}
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
    </div>
  );
}
