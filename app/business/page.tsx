"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, memo } from "react";
import { useGetUserQuery } from "../../store/api/api";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { NotificationState } from "@/types/general";
import Notification from "@/components/Notification";
import { Trophy, Copy, Plus } from "lucide-react";
import QuickStartButton from "@/components/QuickModal";

const adCards = [
  {
    title: "1st Campaign",
    rate: "~%",
    bgColor: "bg-[#FEF3C7]",
    iconBg: "bg-[#D9770680]",
    rateColor: "text-[#575757]",
  },
  {
    title: "2nd Campaign",
    rate: "~%",
    bgColor: "bg-[#DCFCE7]",
    iconBg: "bg-[#16A34A80]",
    rateColor: "text-[#575757]",
  },
  {
    title: "3rd Campaign",
    rate: "~%",
    bgColor: "bg-[#F0F0F0]",
    iconBg: "bg-[#9747FF80]",
    rateColor: "text-[#575757]",
  },
];

interface UserData {
  name: string | null;
  email: string | null;
}

// Memoized components to prevent unnecessary rerenders
const AdCard = memo(({ card, index }: any) => (
  <div
    key={index}
    className={`${card.bgColor} rounded-xl p-3 flex flex-col gap-2 transition-all duration-200 hover:shadow-lg`}
  >
    <div
      className={`${card.iconBg} w-8 h-8 md:w-10 md:h-10 rounded-[9.6px] flex items-center justify-center mb-3`}
    >
      <Trophy className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
    </div>
    <h4 className="text-xs font-semibold text-gray-700 mb-2">{card.title}</h4>
    <div className="flex flex-col gap-2">
      <p className={`text-sm font-bold ${card.rateColor}`}>{card.rate}</p>
      <p className="text-xs text-gray-600">Click through rate</p>
    </div>
  </div>
));

AdCard.displayName = "AdCard";

const WalletCard = memo(
  ({ wallet, handleCopyWallet, router, truncateWallet }: any) => (
    <div className="w-full md:w-[342px] md:h-[272px] p-4 bg-[#FAFAFA] rounded-3xl">
      <div className="relative w-full h-32 md:w-[310px] md:h-[188px]">
        <Image
          src="/wallet-card.svg"
          fill
          quality={85}
          priority
          alt="Wallet Card"
          className="object-cover rounded-2xl"
        />

        <div className="relative">
          <div className="absolute left-4 top-12 md:top-24 pt-4 w-[280px]">
            <p className="text-xs md:text-sm text-white/70 font-medium">
              Wallet Address
            </p>
            {wallet ? (
              <div className="flex items-center rounded-lg p-2.5">
                <p className="text-xs md:text-sm font-mono text-white/90 truncate max-w-[130px]">
                  {truncateWallet(wallet)}
                </p>
                <button
                  className="ml-2 p-1.5 rounded-md hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
                  onClick={handleCopyWallet}
                  aria-label="Copy wallet address"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <p className="text-xs md:text-sm font-mono text-white/90">
                No Wallet Detected
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center mt-6 bg-[#F0F0F0] rounded-lg">
        <button
          className="w-full text-[#575757] p-2 md:p-2.5 text-xs md:text-sm font-medium hover:bg-gray-200 transition-colors rounded-lg"
          onClick={() => router.push("/business/wallet")}
        >
          View Wallet
        </button>
      </div>
    </div>
  )
);

WalletCard.displayName = "WalletCard";

// Main Dashboard Component
export default function Page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });
  const [userData, setUserData] = useState<UserData>({
    name: null,
    email: null,
  });

  // Get stored data - moved inside useEffect to avoid hydration issues
  const [storedData, setStoredData] = useState({
    id: "",
    wallet: "",
  });

  // Fetch user data
  const { data: userRetrievedData, isLoading } = useGetUserQuery(
    { id: storedData.id },
    { skip: !storedData.id }
  );

  const user = userRetrievedData?.data;

  useEffect(() => {
    setMounted(true);
    const id: any = getDataFromLocalStorage("id");
    const wallet: any = getDataFromLocalStorage("wallet");
    const name = getDataFromLocalStorage("name");
    const email = getDataFromLocalStorage("email");

    setStoredData({ id, wallet });
    setUserData({ name, email });
  }, []);

  useEffect(() => {
    if (user?.isOnBoarded === false) {
      setIsModalOpen(true);
    }
  }, [user]);

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const handleCopyWallet = useCallback(async () => {
    if (storedData.wallet) {
      try {
        await navigator.clipboard.writeText(storedData.wallet);
        showNotification("Wallet Address Copied", "success");
      } catch (err) {
        console.error("Failed to copy wallet address");
        showNotification("Failed to copy wallet address", "error");
      }
    }
  }, [storedData.wallet, showNotification]);

  const truncateWallet = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex flex-col w-full h-full pl-4">
      {/* Fixed Header */}
      <div className="bg-[#f3f3f3] pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center bg-white w-full p-3 rounded-lg">
              <div className="flex flex-col gap-3 w-1/2 text-text">
                <h1 className="text-xs font-semibold md:text-sm text-[#727272]">
                  Hello {userData.name}
                </h1>
                <h1 className="text-sm md:text-lg font-bold md:w-[80%] text-[#575757]">
                  Create and manage your advertising campaigns
                </h1>
                <button
                  className="md:flex items-center w-32 md:w-[184px] p-1 md:p-2 bg-side text-white rounded-lg transition-colors duration-200 whitespace-nowrap hover:opacity-90"
                  onClick={() => router.push("/create_campaign")}
                >
                  <Plus className="hidden md:flex w-4 h-4 mr-2" />
                  <span className="text-xs md:text-sm">Create a Campaign</span>
                </button>
              </div>
              <div className="w-32 md:w-0">
                <Image
                  src="/ink-layer.svg"
                  width={200}
                  height={200}
                  quality={85}
                  priority
                  alt="Campaign Illustration"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 bg-[#f3f3f3] overflow-auto scrollbar-hide">
        <div className="max-w-7xl w-full mx-auto py-3">
          <div className="flex flex-col md:flex-row w-full gap-3 mb-6">
            {/* Top performing ads */}
            <div className="col-span-2 w-full bg-[#FAFAFA] p-4 rounded-3xl">
              <h3 className="font-semibold text-xs md:text-base text-text mb-3">
                Top performing ads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adCards.map((card, index) => (
                  <AdCard card={card} index={index} key={index} />
                ))}
              </div>
            </div>

            {/* Wallet Card */}
            <WalletCard
              wallet={storedData.wallet}
              handleCopyWallet={handleCopyWallet}
              router={router}
              truncateWallet={truncateWallet}
            />
          </div>

          {/* Recent Campaigns Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 text-xs md:text-sm">
                Campaign Analytics
              </h2>
            </div>
            <div className="flex p-8 w-full text-xs md:text-sm justify-center">
              <h1>Coming Soon</h1>
            </div>
          </div>
        </div>

        {/* QuickStart Modal */}
        <QuickStartButton
          showBusinessModal={isModalOpen}
          setShowBusinessModal={setIsModalOpen}
        />
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
    </main>
  );
}
