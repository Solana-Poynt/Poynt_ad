"use client";
import { useState, useEffect, useCallback } from "react";
import { useOkto, type OktoContextType } from "okto-sdk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { saveDataToLocalStorage } from "@/utils/localStorage";
import Notification from "@/components/notification";
import { NotificationState } from "@/types/general";
import { AnimatePresence } from "framer-motion";

// Response types for Okto SDK
interface WalletData {
  address: string;
  network_name: string;
  success: boolean;
}

interface WalletsResponse {
  wallets: WalletData[];
}

interface TokenData {
  amount_in_inr: string;
  network_name: string;
  quantity: string;
  token_address: string;
  token_image: string;
  token_name: string;
}

// Mock transaction data
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

interface PortfolioData {
  total: number;
  tokens: TokenData[];
}

interface PortfolioResponse {
  total: number;
  tokens: TokenData[];
}

interface TransactionData {
  id: string;
  type: "received" | "sent";
  amount: string;
  date: string;
  status: "Successful" | "Failed" | "Pending";
  description: string;
}

// Token List Component
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
            key={index}
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

// Loading Spinner Component
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

// Balance Card Component
const BalanceCard = ({
  totalBalance,
  address,
  networkName,
  onCopyAddress,
}: {
  totalBalance: number;
  address: string;
  networkName: string;
  onCopyAddress: (address: string) => void;
}) => (
  <Card className="bg-gradient-to-br from-side to-side/65 text-white">
    <CardContent className="p-6 space-y-6">
      <div>
        <p className="text-sm text-gray-200">Total Balance</p>
        <h2 className="text-3xl font-bold mt-1">
          {totalBalance || "0.00"} SOL
        </h2>
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
          className="text-gray-900 border-white hover:bg-white/10"
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button
          variant="outline"
          className="text-gray-900 border-white hover:bg-white/10"
        >
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Receive
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Transaction History Component
const TransactionHistory = ({
  transactions,
  activeTab,
  setActiveTab,
}: {
  transactions: TransactionData[];
  activeTab: "all" | "received" | "sent";
  setActiveTab: (tab: "all" | "received" | "sent") => void;
}) => (
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
                onClick={() => setActiveTab(tab as "all" | "received" | "sent")}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
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
                  {transaction.type === "sent" ? "-" : "+"}₹{transaction.amount}
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

// Main Component
export default function WalletDashboard() {
  const { getWallets, createWallet, getPortfolio } =
    useOkto() as OktoContextType;
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "received" | "sent">(
    "all"
  );
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

  const fetchPortfolio = useCallback(async () => {
    // console.log("🔄 Fetching portfolio data...");
    try {
      const portfolioData = (await getPortfolio()) as PortfolioResponse;
      // console.log("📊 Raw portfolio data:", portfolioData);

      if (portfolioData) {
        const formattedPortfolio: PortfolioData = {
          total: portfolioData.total,
          tokens: portfolioData.tokens || [],
        };

        const totalBal: string | any = portfolio?.total;

        saveDataToLocalStorage("balance", totalBal);
        // console.log("✅ Formatted portfolio:", formattedPortfolio);
        setPortfolio(formattedPortfolio);
      }
    } catch (err) {
      console.error("❌ Portfolio error:", err);
      setError("Failed to fetch portfolio data");
    }
  }, [getPortfolio]);

  const handleWallet = useCallback(async () => {
    // console.log("🔄 Starting wallet handling process...");
    setIsLoading(true);
    setError(null);

    try {
      const newWalletResponse = await createWallet();
      console.log("📥 New wallet response:", newWalletResponse);

      setWallet(newWalletResponse.wallets[0]);
      console.log("🔄 Fetching portfolio for existing wallet...");
      await fetchPortfolio();
    } catch (err) {
      console.error("❌ Wallet error:", err);
      setError(err instanceof Error ? err.message : "Failed to handle wallet");
    } finally {
      console.log("✅ Wallet handling process completed");
      setIsLoading(false);
    }
  }, [getWallets, createWallet, fetchPortfolio]);

  const handleCopyAddress = useCallback(async (address: string) => {
    // console.log("📋 Copying address:", address);
    try {
      await navigator.clipboard.writeText(address);
      // console.log("✅ Address copied to clipboard");
      showNotification("Wallet Copied Successfully", "success");
      // You could add a toast notification here
    } catch (err) {
      console.error("❌ Failed to copy address:", err);
    }
  }, []);

  useEffect(() => {
    // console.log("🚀 Component mounted, initializing wallet...");
    handleWallet();
  }, [handleWallet]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">My Wallet</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mx-4 mt-4">
          {error}
        </div>
      )}

      {/* Main Content */}
      {wallet && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 min-h-0">
          {/* Fixed Left Column */}
          <div className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start">
            <BalanceCard
              totalBalance={portfolio?.total || 0}
              address={wallet.address}
              networkName={wallet.network_name}
              onCopyAddress={handleCopyAddress}
            />
          </div>

          {/* Scrollable Right Column */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {portfolio?.tokens && <TokenList tokens={portfolio.tokens} />}
            <TransactionHistory
              transactions={mockTransactions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
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
}
