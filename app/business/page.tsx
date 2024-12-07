"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Plus } from "lucide-react";

const adCards = [
  {
    title: "First campaign",
    rate: "0%",
    bgColor: "bg-[#FEF3C7]",
    iconBg: "bg-[#D9770680]",
    rateColor: "text-amber-800",
  },
  {
    title: "Second campaign",
    rate: "0%",
    bgColor: "bg-[#DCFCE7]",
    iconBg: "bg-[#16A34A80]",
    rateColor: "text-green-800",
  },
  {
    title: "Third campaign",
    rate: "0%",
    bgColor: "bg-[#F3E8FF]",
    iconBg: "bg-[#9747FF80]",
    rateColor: "text-purple-800",
  },
];

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    name: string | null;
    email: string | null;
  }>({
    name: null,
    email: null,
  });

  useEffect(() => {
    setMounted(true);
    const name = getDataFromLocalStorage("name");
    const email = getDataFromLocalStorage("email");
    setUserData({ name, email });
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex flex-col w-full h-screen">
      {/* Fixed Header */}
      <div className="bg-[#F0F0F0] pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-base font-semibold text-text">
              Performance Overview
            </h1>

            <div className="flex flex-row justify-between items-center bg-white w-full p-8 rounded-lg">
              <div className="flex flex-col gap-3 w-1/2 text-text">
                <h1>Hello {userData.name}</h1>
                <h1 className="text-xl font-medium">
                  Create and manage your advertising campaigns
                </h1>
                <button
                  className="hidden md:flex items-center mt-4 w-1/2 p-3 bg-side text-white rounded-lg hover:bg-[#B71C1C] transition-colors duration-200 whitespace-nowrap"
                  onClick={() => router.push("/create_campaign")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm">Create a Campaign</span>
                </button>
              </div>
              <div>
                <Image
                  src="/ink-layer.svg"
                  width={200}
                  height={200}
                  quality={90}
                  priority
                  alt="Poynt Logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-[#F0F0F0]">
        <div className="max-w-7xl w-full mx-auto pl-5 py-6">
          <div className="flex flex-row w-full gap-5 mb-6">
            {/* Top performing ads */}
            <div className="col-span-2 w-[60%] bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-text mb-6">
                Top performing ads
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {adCards.map((card, index) => (
                  <div
                    key={index}
                    className={`${card.bgColor} rounded-xl p-4 transition-all duration-200 hover:shadow-lg`}
                  >
                    <div
                      className={`${card.iconBg} w-10 h-10 rounded-full flex items-center justify-center mb-3`}
                    >
                      <Trophy className="w-5 h-5 text-gray-700" />
                    </div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      {card.title}
                    </h4>
                    <div className="flex flex-col gap-2">
                      <p className={`text-sm font-bold ${card.rateColor}`}>
                        {card.rate}
                      </p>
                      <p className="text-xs text-gray-600">
                        Click through rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet Card */}
            <div className="bg-white w-[40%] p-3 rounded-lg">
              <Card
                className="rounded-2xl p-6 text-white relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                style={{
                  background:
                    "radial-gradient(366.41% 171.35% at 89.31% -24.73%, rgba(180, 30, 30, 0.95) 0%, rgba(20, 2, 2, 0.95) 83.5%)",
                  boxShadow: `-4px -4px 12px 0px rgba(230, 160, 160, 0.25) inset,
                              4px 4px 12px 0px rgba(230, 160, 160, 0.25) inset,
                              0 10px 30px -10px rgba(0, 0, 0, 0.5)`,
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Decorative elements remain the same */}
                <CardContent className="p-0 relative z-10">
                  <div className="flex flex-row justify-between mb-4">
                    <span className="text-sm font-medium text-white/80">
                      Balance
                    </span>
                    <span className="text-xl font-bold tracking-tight">
                      $ 0.00
                    </span>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/70 font-medium">
                      Wallet Address
                    </p>
                    <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                      <p className="text-sm font-mono truncate text-white/90">
                        No Wallet
                      </p>
                      <button
                        className="ml-3 p-2 rounded-md hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
                        onClick={() =>
                          navigator.clipboard.writeText("Zxcyfc5VG678Mn69m")
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button className="w-full py-2 px-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Withdraw
                </button>
                <button className="w-full py-2 px-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Deposit
                </button>
              </div>
            </div>
          </div>

          {/* Recent Campaigns Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Recent Campaigns</h2>
            </div>
            <div className="flex p-8 w-full justify-center">
              <h1>No Campaigns Yet</h1>
            </div>
            {/* <div className="p-4">
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
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
