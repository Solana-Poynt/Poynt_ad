"use client";
import { useState, useEffect } from "react";
import {
  DynamicEmbeddedWidget,
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { saveDataToLocalStorage } from "@/utils/localStorage";
import { NotificationState } from "@/types/general";
import Notification from "@/components/notification";
import { AnimatePresence } from "framer-motion";

// Main component that determines which card to show
const WalletDashboard = () => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const WalletStatusView = () => {
    const { primaryWallet, sdkHasLoaded } = useDynamicContext();
    const wallets: any = useUserWallets();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (sdkHasLoaded) {
        setLoading(false);
      }
    }, [sdkHasLoaded]);

    // Save wallet addresses when they change
    useEffect(() => {
      if (wallets && wallets.length > 0) {
        try {
          const addresses = wallets.map((wallet: any) => wallet.address);
          saveDataToLocalStorage("wallets", addresses);

          // If there's a primary wallet, ensure it's saved directly too
          if (primaryWallet?.address) {
            saveDataToLocalStorage("wallet", primaryWallet.address);
          }
        } catch (error) {
          console.error("Error saving wallet data:", error);
        }
      }
    }, [wallets, primaryWallet]);

    if (loading) {
      // Loading state
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto p-6">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md mb-4 mx-auto"></div>
          <div className="h-4 w-full bg-gray-100 animate-pulse rounded-md mb-4"></div>
          <div className="h-24 w-full bg-gray-100 animate-pulse rounded-md"></div>
        </div>
      );
    }

    // Connected state info (optional)
    if (primaryWallet?.address) {
      return (
        <div className="bg-green-50 p-4 rounded-lg my-4 text-center">
          <p className="text-green-800">
            Wallet connected: {primaryWallet.address.substring(0, 6)}...
            {primaryWallet.address.substring(primaryWallet.address.length - 4)}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-2xl font-bold mb-6">Poynt Wallet</h1>

      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {/* Dynamic Embedded Widget */}
          <div className="widget-container w-full mb-4">
            <DynamicEmbeddedWidget background="default" />
          </div>

          {/* Show wallet status with additional details when connected */}
          <WalletStatusView />
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
};

export default WalletDashboard;
