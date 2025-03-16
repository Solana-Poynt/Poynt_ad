"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { RootState } from "@/store/store";
import { useWalletManagement } from "@/utils/hooks/useWallet";
import {
  LoadingSpinner,
  Inventory,
  BalanceCard,
} from "@/components/wallet_comps/wallet";
import Notification from "@/components/notification";
import type { NotificationState } from "../../../types/general";

const WalletDashboard = () => {
  // Redux state
  const walletState = useSelector((state: RootState) => state.wallet);

  // Refs for component lifecycle management
  const isMounted = useRef(true);
  const initAttempted = useRef(false);
  const refreshTimeout = useRef<NodeJS.Timeout>();

  // Local state
  const [activeTab, setActiveTab] = useState<
    "all" | "received" | "sent" | "tokens"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  // Custom hook for wallet management
  const {
    wallet,
    portfolio,
    initializeWallet,
    refreshBalance,
    tokensHeld,
    handleCopyAddress,
  } = useWalletManagement((message: string, status: "success" | "error") => {
    if (isMounted.current) {
      setNotification({ message, status, show: true });
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  // Initialize wallet
  useEffect(() => {
    const init = async () => {
      if (!isMounted.current || initAttempted.current) return;
      initAttempted.current = true;

      try {
        await initializeWallet();
      } catch (error) {
        if (isMounted.current) {
          setNotification({
            message:
              error instanceof Error
                ? error.message
                : "Failed to initialize wallet",
            status: "error",
            show: true,
          });
        }
      }
    };

    init();
  }, [initializeWallet]);

  // Handlers
  const handleRefresh = useCallback(async () => {
    if (!isMounted.current || isRefreshing) return;

    try {
      setIsRefreshing(true);
      await refreshBalance();
      setNotification({
        message: "Balance updated successfully",
        status: "success",
        show: true,
      });
    } catch (error) {
      setNotification({
        message: "Failed to refresh balance",
        status: "error",
        show: true,
      });
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
      }
    }
  }, [refreshBalance, isRefreshing]);

  const handleAddressCopy = useCallback(
    async (address: string) => {
      try {
        await handleCopyAddress(address);
        setNotification({
          message: "Address copied to clipboard",
          status: "success",
          show: true,
        });
      } catch (error) {
        setNotification({
          message: "Failed to copy address",
          status: "error",
          show: true,
        });
      }
    },
    [handleCopyAddress]
  );

  // Auto-refresh setup
  useEffect(() => {
    const setupAutoRefresh = () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }

      refreshTimeout.current = setInterval(() => {
        if (wallet && !isRefreshing) {
          handleRefresh();
        }
      }, 30000); // Refresh every 30 seconds
    };

    if (wallet) {
      setupAutoRefresh();
    }

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [wallet, handleRefresh, isRefreshing]);

  // Loading state
  if (walletState.loading || (!wallet && !walletState.error)) {
    return <LoadingSpinner />;
  }

  // Error state
  if (walletState.error && !wallet) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-500 p-6 rounded-lg max-w-lg text-center">
          <h2 className="text-lg font-semibold mb-2">Wallet Error</h2>
          <p>{walletState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden min-h-screen flex flex-col px-3 sm:px-4">
      <header className="mb-4 sm:mb-9">
        <h1 className="text-base md:text-xl sm:text-2xl text-[#575757] font-medium pt-2">
          My Wallet
        </h1>
      </header>

      {wallet && (
        <div className="flex flex-col lg:flex-row w-full items-start gap-4 sm:gap-6">
          <div className="w-full lg:w-auto lg:min-w-[350px]">
            <BalanceCard
              totalBalance={portfolio?.total || 0}
              address={wallet.address}
              networkName={wallet.network_name}
              onCopyAddress={handleAddressCopy}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>

          <div className="w-full mt-4 lg:mt-0">
            <h2 className="text-base md:text-lg mb-3 sm:mb-4 text-[#575757] font-medium">
              Inventory
            </h2>
            <Inventory
              transactions={[]}
              tokens={tokensHeld}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isLoading={false}
            />
          </div>
        </div>
      )}

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
