"use client";
import { useState, useEffect } from "react";
import useSolanaTokenBalances from "@/utils/hooks/useBalance";
import { useCampaignTransactionHistory } from "@/utils/hooks/useTransactions";
import ActionButtons from "@/components/WalletActions";
import {
  useEmbeddedWallet,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { saveDataToLocalStorage } from "@/utils/localStorage";
import { NotificationState } from "@/types/general";
import Notification from "@/components/Notification";
import { AnimatePresence, motion } from "framer-motion";

import {
  Copy,
  ExternalLink,
  Wallet,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Smartphone,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus,
  RefreshCw,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Main component that determines which card to show
const WalletDashboard = () => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const { solBalance, usdcBalance, totalValue, refreshBalances, isLoading } =
    useSolanaTokenBalances({
      network: "devnet",
    });

  const {
    transactions: campaignTransactions,
    isLoading: isTransactionsLoading,
    error: transactionError,
  } = useCampaignTransactionHistory();

  console.log("Campaign Transactions:", campaignTransactions);

  const [showFullAddress, setShowFullAddress] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isLoggedIn = useIsLoggedIn();
  const { userHasEmbeddedWallet } = useEmbeddedWallet();
  const { primaryWallet } = useDynamicContext();

  const router = useRouter();

  useEffect(() => {
    if (primaryWallet?.address) {
      saveDataToLocalStorage("wallet", primaryWallet.address);
    }
  }, [primaryWallet?.address]);

  const formatAddress = (address: string) => {
    if (!address) return "No address available";
    if (showFullAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const copyToClipboard = async (text: string) => {
    if (!text) {
      setNotification({
        message: "No address to copy",
        status: "error",
        show: true,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setNotification({
        message: "Address copied to clipboard!",
        status: "success",
        show: true,
      });
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      setNotification({
        message: "Failed to copy address",
        status: "error",
        show: true,
      });
    }
  };

  const openExplorer = () => {
    if (!primaryWallet?.address) {
      setNotification({
        message: "No wallet address available",
        status: "error",
        show: true,
      });
      return;
    }

    const baseUrl = "https://explorer.solana.com/address/";
    const cluster = primaryWallet.chain === "SOL" ? "?cluster=devnet" : "";
    window.open(`${baseUrl}${primaryWallet.address}${cluster}`, "_blank");
  };

  const openTransactionExplorer = (transactionHash: string) => {
    if (!transactionHash) {
      setNotification({
        message: "No transaction hash available",
        status: "error",
        show: true,
      });
      return;
    }

    const baseUrl = "https://explorer.solana.com/tx/";
    const cluster = "?cluster=devnet";
    window.open(`${baseUrl}${transactionHash}${cluster}`, "_blank");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalances();
      // Note: Campaign transactions will auto-refresh when the API data updates
      setNotification({
        message: "Data refreshed successfully!",
        status: "success",
        show: true,
      });
    } catch (error) {
      setNotification({
        message: "Failed to refresh data",
        status: "error",
        show: true,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatBalance = (balance: number, decimals = 4) => {
    return balance.toFixed(decimals);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="px-3 sm:px-6 max-w-[1600px] rounded-xl mx-auto min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Poynt Wallet
            </h1>
            <p className="text-gray-600">Monitor and manage your wallet here</p>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading || isTransactionsLoading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              onClick={() => router.push("/create_campaign")}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors text-sm sm:text-base"
            >
              <Plus size={16} />
              <span>Place a Campaign</span>
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="flex p-3 sm:p-5 border-b border-gray-100">
            {["overview", "transactions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 whitespace-nowrap font-medium text-xs sm:text-sm capitalize ${
                  activeTab === tab
                    ? "text-[#8B1212] border-b-2 border-[#8B1212]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "transactions" ? "Campaign Payments" : tab}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Wallet Connection Status */}
              {(!primaryWallet || !userHasEmbeddedWallet || !isLoggedIn) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">
                      No wallet connected
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please try logging in again to view details
                  </p>
                </div>
              )}

              {/* Main Wallet Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  {/* Wallet Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-[#8B1212] to-[#6F0E0E] rounded-xl flex items-center justify-center shadow-lg">
                          <Wallet className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                        </div>
                        {primaryWallet?.isAuthenticated && (
                          <div className="absolute -bottom-1 -right-1 w-5 sm:w-6 h-5 sm:h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                            <CheckCircle className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                          Smart Wallet
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1 sm:gap-0">
                          <span className="text-sm font-bold text-gray-500">
                            {primaryWallet?.chain === "SOL"
                              ? "Solana Devnet"
                              : primaryWallet?.chain || "Unknown Network"}
                          </span>
                          <div className="flex items-center space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                primaryWallet?.isAuthenticated
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <span
                              className={`text-xs font-medium ${
                                primaryWallet?.isAuthenticated
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {primaryWallet?.isAuthenticated
                                ? "ACTIVE"
                                : "INACTIVE"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-2xl font-bold text-gray-600 mb-1">
                        ${formatBalance(totalValue, 2)}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        wallet value
                      </div>
                    </div>
                  </div>

                  {/* Wallet Section */}
                  {primaryWallet?.address && (
                    <>
                      <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-6">
                        {/* Balance Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Wallet className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-600">
                              Wallet Balances
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last Updated: {new Date().toLocaleTimeString()}
                          </div>
                        </div>

                        {/* Balance Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* SOL Balance Card */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                Solana (SOL)
                              </span>
                              {isLoading && (
                                <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {formatBalance(solBalance)} SOL
                            </div>
                          </div>

                          {/* USDC Balance Card */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                USD Coin (USDC)
                              </span>
                              {isLoading && (
                                <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {formatBalance(usdcBalance, 2)} USDC
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Address Section */}
                      <div className="bg-gray-100 rounded-xl p-4 sm:p-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Lock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-600">
                              Wallet Address
                            </span>
                          </div>
                          <button
                            onClick={() => setShowFullAddress(!showFullAddress)}
                            className="flex items-center space-x-1 text-xs text-[#8B1212] hover:text-[#6F0E0E] transition-colors"
                          >
                            {showFullAddress ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                            <span>
                              {showFullAddress ? "Hide Full" : "Show Full"}
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <code className="flex-1 text-sm font-mono bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 text-gray-800 break-all">
                            {formatAddress(primaryWallet.address)}
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(primaryWallet.address)
                            }
                            className="p-2 sm:p-3 text-gray-600 hover:text-[#8B1212] hover:bg-gray-100 rounded-lg transition-all"
                            title="Copy address"
                          >
                            <Copy
                              className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                copiedAddress ? "text-green-600" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={openExplorer}
                            className="p-2 sm:p-3 text-gray-600 hover:text-[#8B1212] hover:bg-gray-100 rounded-lg transition-all"
                            title="View on explorer"
                          >
                            <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Quick Actions - Only Send and Receive */}
                  <div className="flex flex-row w-full gap-4">
                    {primaryWallet && (
                      <ActionButtons
                        walletAddress={primaryWallet.address}
                        onCopyAddress={copyToClipboard}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Network Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-5 h-5 text-[#8B1212]" />
                    <h3 className="font-semibold text-gray-900">Network</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Chain</span>
                      <span className="text-sm font-medium text-gray-900">
                        {primaryWallet?.chain || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Network</span>
                      <span className="text-sm font-medium text-gray-900">
                        {primaryWallet?.chain === "SOL"
                          ? "Solana Devnet"
                          : primaryWallet?.chain || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            primaryWallet ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            primaryWallet ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {primaryWallet ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Environment</span>
                      <span className="text-sm font-medium text-yellow-600">
                        Devnet
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Security</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {primaryWallet?.isAuthenticated
                            ? "Verified"
                            : "Not Verified"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Type</span>
                      <div className="flex items-center space-x-1">
                        <Smartphone className="w-3 h-3 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          Embedded
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Provider</span>
                      <span className="text-sm font-medium text-gray-900">
                        Dynamic Labs
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Connection</span>
                      <span className="text-sm font-medium text-green-600">
                        google-oauth
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Layers className="w-5 h-5 text-[#8B1212]" />
                    <h3 className="font-semibold text-gray-900">Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Powered by</span>
                      <span className="text-sm font-mono text-gray-900">
                        Dynamic
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Key</span>
                      <span className="text-sm font-mono text-gray-900">
                        {primaryWallet?.key || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Setup</span>
                      <span className="text-sm font-medium text-green-600">
                        {primaryWallet ? "Complete" : "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Authenticated
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          primaryWallet?.isAuthenticated
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {primaryWallet?.isAuthenticated ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "transactions" && (
            <motion.div
              key="transactions"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-[#8B1212]" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Campaign Payment History
                    </h3>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing || isTransactionsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B1212] hover:bg-[#6F0E0E] text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isRefreshing || isTransactionsLoading
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    <span>
                      {isRefreshing || isTransactionsLoading
                        ? "Loading..."
                        : "Refresh"}
                    </span>
                  </button>
                </div>

                {/* Loading State */}
                {isTransactionsLoading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B1212]"></div>
                    <span className="ml-3 text-gray-600">
                      Loading campaign payments...
                    </span>
                  </div>
                )}

                {/* Transaction List */}
                {!isTransactionsLoading && campaignTransactions.length > 0 && (
                  <div className="space-y-4">
                    {campaignTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                          <div className="w-10 h-10 rounded-full bg-[#8B1212]/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-[#8B1212]" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {tx.campaignName}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  tx.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {tx.status === "completed"
                                  ? "Paid"
                                  : tx.status === "pending"
                                  ? "Pending"
                                  : "Failed"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Campaign ID: {tx.id.substring(0, 8)}...
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(tx.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end space-y-2">
                          <div className="font-semibold text-[#8B1212]">
                            {tx.budget} USDC
                          </div>
                          <div className="flex items-center space-x-2">
                            {tx.transactionHash ? (
                              <button
                                onClick={() =>
                                  openTransactionExplorer(tx.transactionHash!)
                                }
                                className="flex items-center space-x-1 text-xs text-[#8B1212] hover:text-[#6F0E0E] transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View Transaction</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex items-center space-x-1 text-xs text-gray-400 cursor-not-allowed"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>No Transaction</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error State */}
                {transactionError && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Failed to Load Transactions
                    </h3>
                    <p className="text-gray-500 mb-6">
                      There was an error loading your campaign payment history.
                    </p>
                    <button
                      onClick={handleRefresh}
                      className="px-4 py-2 bg-[#8B1212] hover:bg-[#6F0E0E] text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty State for no transactions */}
                {!isTransactionsLoading &&
                  !transactionError &&
                  campaignTransactions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Campaign Payments Found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        You haven't made any campaign payments yet. Create your
                        first campaign to see payment history here.
                      </p>
                      <button
                        onClick={() => router.push("/create_campaign")}
                        className="px-4 py-2 bg-[#8B1212] hover:bg-[#6F0E0E] text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Create Your First Campaign
                      </button>
                    </div>
                  )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
