"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";
import Notification from "@/components/notification";
import { NotificationState } from "@/types/general";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useWalletManagement } from "@/utils/hooks/useWallet";
import { AnimatePresence } from "framer-motion";

// Types
interface TokenData {
  amount_in_inr: string;
  network_name: string;
  quantity: string;
  token_address: string;
  token_image: string;
  token_name: string;
}

interface TransactionData {
  id: string;
  type: "received" | "sent";
  amount: string;
  date: string;
  status: "Successful" | "Failed" | "Pending";
  description: string;
}

interface BalanceCardProps {
  totalBalance: number;
  address: string;
  networkName: string;
  onCopyAddress: (address: string) => void;
  onRefresh: () => void;
}

// Mock Data - Move to separate file in production
const mockTransactions: TransactionData[] = [
  {
    id: "1",
    type: "sent",
    amount: "000",
    date: "2024-01-23T10:32:00",
    status: "Successful",
    description: "Wallet transfer",
  },
];

// Component: TokenList
const TokenList = ({ tokens }: { tokens: TokenData[] }) => (
  <Card className="bg-white shadow-sm sticky top-0">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Your Tokens</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {tokens.map((token, index) => (
          <div
            key={`${token.token_address}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              {token.token_image ? (
                <img
                  src={token.token_image}
                  alt={token.token_name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {token.token_name.slice(0, 2)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">{token.token_name}</p>
                <p className="text-sm text-gray-500">{token.network_name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${token.amount_in_inr}</p>
              <p className="text-sm text-gray-500">Qty: {token.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Component: LoadingSpinner
const LoadingSpinner = () => (
  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin" />
    </div>
    <div className="mt-6 flex flex-col items-center gap-2">
      <h3 className="text-xl font-semibold text-gray-800">
        Loading your wallet
      </h3>
      <p className="text-sm text-gray-500">
        Please wait while we fetch your wallet details
      </p>
    </div>
  </div>
);

// Component: BalanceCard
const BalanceCard = ({
  totalBalance,
  address,
  networkName,
  onCopyAddress,
  onRefresh,
}: BalanceCardProps) => (
  <Card className="bg-gradient-to-br from-side to-side/65 text-white">
    <CardContent className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-200">Total Balance</p>
          <h2 className="text-3xl font-bold mt-1">
            {totalBalance || "0.00"} SOL
          </h2>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-200">Wallet Address</p>
        <div className="flex items-center space-x-2 bg-white/10 p-2 rounded">
          <code className="text-xs flex-1 truncate">{address}</code>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => onCopyAddress(address)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-300">Network: {networkName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4">
        <Button
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Receive
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Component: TransactionHistory
const TransactionHistory = ({
  transactions,
  activeTab,
  setActiveTab,
}: {
  transactions: TransactionData[];
  activeTab: "all" | "received" | "sent";
  setActiveTab: (tab: "all" | "received" | "sent") => void;
}) => {
  const filteredTransactions = transactions.filter((transaction) =>
    activeTab === "all" ? true : transaction.type === activeTab
  );

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="sticky top-0 bg-white z-10 pb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <div className="flex space-x-2">
              {["all", "received", "sent"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setActiveTab(tab as "all" | "received" | "sent")
                  }
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "received"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "received" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.type === "sent"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.type === "sent" ? "-" : "+"}₹
                    {transaction.amount}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Wallet className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function WalletDashboard() {
  const walletState = useSelector((state: RootState) => state.wallet);

  const isMounted = useRef(true);
  const initAttempted = useRef(false);

  // Component state
  const [activeTab, setActiveTab] = useState<"all" | "received" | "sent">(
    "all"
  );
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState = useCallback(
    (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
      if (isMounted.current) {
        setter(value);
      }
    },
    []
  );

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      if (isMounted.current) {
        safeSetState(setNotification, { message, status, show: true });
      }
    },
    [safeSetState]
  );

  const {
    wallet,
    portfolio,
    initializeWallet,
    refreshBalance,
    tokensHeld,
    handleCopyAddress,
  } = useWalletManagement(showNotification);

  useEffect(() => {
    const init = async () => {
      if (!isMounted.current || initAttempted.current) return;
      initAttempted.current = true;

      try {
        await initializeWallet();
      } catch (error) {
        if (isMounted.current) {
          showNotification(
            error instanceof Error
              ? error.message
              : "Failed to initialize wallet",
            "error"
          );
        }
      }
    };

    init();
  }, [initializeWallet, showNotification]);

  {
    /* // Safe handlers */
  }
  const handleRefresh = useCallback(async () => {
    if (!isMounted.current) return;
    await refreshBalance();
  }, [refreshBalance]);

  const handleAddressCopy = useCallback(
    async (address: string) => {
      if (!isMounted.current) return;
      await handleCopyAddress(address);
    },
    [handleCopyAddress]
  );

  const handleTabChange = useCallback(
    (tab: "all" | "received" | "sent") => {
      safeSetState(setActiveTab, tab);
    },
    [safeSetState]
  );

  if (walletState.loading || (!wallet && !walletState.error)) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">My Wallet</h1>
      </div>

      {walletState.error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mx-4 mt-4">
          {walletState.error}
        </div>
      )}

      {wallet && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 min-h-0">
          <div className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start">
            <BalanceCard
              totalBalance={portfolio?.total || 0}
              address={wallet.address}
              networkName={wallet.network_name}
              onCopyAddress={handleAddressCopy}
              onRefresh={handleRefresh}
            />
          </div>

          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {portfolio?.tokens && <TokenList tokens={tokensHeld} />}
            <TransactionHistory
              transactions={mockTransactions}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
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
              safeSetState(setNotification, (prev: any) => ({
                ...prev,
                show: false,
              }))
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
