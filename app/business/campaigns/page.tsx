"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  status: "Active" | "Paused" | "Draft";
  budget: number;
  reach: number;
  impressions: number;
  costPerReach: number;
  fundsSpent: number;
  isActive: boolean;
}

export default function Page() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);

  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "Summer Sale Campaign",
      status: "Active",
      budget: 20000,
      reach: 5000,
      impressions: 2500,
      costPerReach: 500,
      fundsSpent: 13000,
      isActive: true,
    },
    {
      id: 2,
      name: "Back to School Promo",
      status: "Paused",
      budget: 15000,
      reach: 3000,
      impressions: 1800,
      costPerReach: 400,
      fundsSpent: 8000,
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

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-col justify-between w-full lg:flex-row items-start lg:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Campaign Manager</h1>

          {/* Account Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropDown(!showDropDown)}
              className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-[#B71C1C] rounded-full flex items-center justify-center">
                <span className="text-white font-medium">P</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">
                  Business Account
                </p>
                <p className="text-xs text-gray-500">sol_poynt@gmail.com</p>
              </div>
              {showDropDown ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showDropDown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {["Business Account 1", "Business Account 2"].map(
                    (account, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md"
                      >
                        <p className="font-medium text-gray-700">{account}</p>
                        <p className="text-sm text-gray-500">
                          account{index + 1}@example.com
                        </p>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <Wallet size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">
              1FfmbH...paPH
            </span>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#805c02] transition-colors">
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#805c02] transition-colors">
            <Plus size={16} />
            <span>New Business</span>
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedCampaigns.length === campaigns.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="w-16 p-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Campaign
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Budget
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Reach
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Impressions
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Cost/Reach
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Spent
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="w-12 p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={() => toggleCampaign(campaign.id)}
                    />
                  </td>
                  <td className="w-16 p-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={campaign.isActive}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {campaign.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">
                      ${campaign.budget.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">
                      {campaign.reach.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">
                      {campaign.impressions.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">
                      ${campaign.costPerReach}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">
                      ${campaign.fundsSpent.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
