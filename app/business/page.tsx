"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Navigation from "@/components/navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Layout,
  PieChart,
  Users,
  Calendar,
  ChevronDown,
} from "lucide-react";

const mockData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
  { name: "Jun", value: 900 },
];

export default function Page() {
  const router = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });

  const stats = [
    {
      title: "Total Campaigns",
      value: "24",
      change: "+12%",
      icon: <Layout className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Active Ads",
      value: "12",
      change: "+5%",
      icon: <PieChart className="w-5 h-5 text-green-600" />,
    },
    {
      title: "Total Impressions",
      value: "48.2K",
      change: "+18%",
      icon: <Users className="w-5 h-5 text-purple-600" />,
    },
    {
      title: "Engagement Rate",
      value: "6.8%",
      change: "+2.2%",
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="  bg-white border-b border-gray-200">
          <div className="h-full px-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 lg:w-20 lg:h-24">
                <div className="relative w-12 h-12 sm:w-24 sm:h-24">
                  <Image
                    src="/trans.png"
                    sizes="(max-width: 768px) 48px, 56px"
                   fill
                    quality={100}
                    alt="Poynt Logo"
                    className="rounded object-contain"
                  />
                </div>
              </div>
              {isSidebarOpen && (
                <span className="font-semibold text-gray-900 text-xl">
                  Poynt
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/80 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </button>
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Campaign Overview
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage your advertising campaigns
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
                    <span
                      className={`text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900">
                    Performance Overview
                  </h2>
                  <select className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{
                          stroke: "#2563EB",
                          strokeWidth: 2,
                          fill: "#fff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Campaign "Summer Sale" started
                        </p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Campaigns Table */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  Recent Campaigns
                </h2>
              </div>
              <div className="p-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Layout className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Summer Sale Campaign
                        </h4>
                        <p className="text-sm text-gray-500">
                          Created 2 days ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                        Active
                      </span>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
