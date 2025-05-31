"use client";
import { useState, useEffect, useCallback } from "react";
import useLoyalty from "@/utils/hooks/useLoyalty";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { VerxioProgramReturn } from "@/types/loyalty";
import {
  Award,
  RefreshCw,
  AlertCircle,
  Trophy,
  Target,
  Layers,
  Copy,
  ExternalLink,
  Star,
  Gift,
  User,
} from "lucide-react";

interface LoyaltySystemTabProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onNotification: (notification: {
    message: string;
    status: "success" | "error";
    show: boolean;
  }) => void;
  formatAddress: (address: string) => string;
  copyToClipboard: (text: string) => void;
}

const LoyaltySystemTab: React.FC<LoyaltySystemTabProps> = ({
  isRefreshing,
  onRefresh,
  onNotification,
  formatAddress,
  copyToClipboard,
}) => {
  const { getProgramData, error: loyaltyError } = useLoyalty();

  // Loyalty program state
  const [loyaltyProgram, setLoyaltyProgram] =
    useState<VerxioProgramReturn | null>(null);
  const [hasLoyaltyProgram, setHasLoyaltyProgram] = useState<boolean>(false);
  const [loyaltyDataLoading, setLoyaltyDataLoading] = useState(false);
  const [programId, setProgramId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [sameWallet, setSameWallet] = useState<boolean>(false);

  const wallet: any = getDataFromLocalStorage("wallet");

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check for existing loyalty program
  const checkExistingLoyaltyProgram = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loyaltyDataLoading) return;

    setLoyaltyDataLoading(true);

    try {
      const storedProgramId = getDataFromLocalStorage("loyaltyProgramId");

      if (!storedProgramId) {
        setHasLoyaltyProgram(false);
        setLoyaltyProgram(null);
        setProgramId(null);
        return;
      }

      // Check if the context is available before making the call
      try {
        const programData = await getProgramData(storedProgramId);
        setProgramId(storedProgramId);
        // console.log("Loyalty Program Data:", programData);

        if (programData) {
          setLoyaltyProgram(programData);
          setHasLoyaltyProgram(true);
        } else {
          setHasLoyaltyProgram(false);
          setLoyaltyProgram(null);
          // Clear invalid program ID from localStorage
          localStorage.removeItem("loyaltyProgramId");
          setProgramId(null);
        }
      } catch (contextError: any) {
        // Handle context not initialized error specifically
        if (contextError?.message?.includes("Context not initialized")) {
          // console.log(
          //   "Verxio context not yet initialized, will retry when context is ready"
          // );
          setHasLoyaltyProgram(false);
          setLoyaltyProgram(null);
          setProgramId(storedProgramId); // Keep the program ID for later retry
          return;
        }
        // Re-throw other errors to be handled by outer catch
        throw contextError;
      }
    } catch (error) {
      console.error("Error checking loyalty program:", error);
      setHasLoyaltyProgram(false);
      setLoyaltyProgram(null);
      setProgramId(null);

      onNotification({
        message: "Failed to load loyalty program",
        status: "error",
        show: true,
      });
    } finally {
      setLoyaltyDataLoading(false);
      setInitialized(true);
    }
  }, [getProgramData, loyaltyDataLoading, onNotification]);

  // Initialize on mount and retry when context becomes available
  useEffect(() => {
    if (!initialized) {
      checkExistingLoyaltyProgram();
    } else if (programId && !loyaltyProgram && !loyaltyDataLoading) {
      // Retry loading if we have a program ID but no data (context might have just initialized)
      checkExistingLoyaltyProgram();
    }
  }, [
    initialized,
    programId,
    loyaltyProgram,
    loyaltyDataLoading,
    checkExistingLoyaltyProgram,
  ]);

  useEffect(() => {
    if (loyaltyProgram?.creator === wallet) {
      setSameWallet(true);
    } else {
      setSameWallet;
    }
  }, [initialized, loyaltyProgram, wallet]);

  // Refresh loyalty data
  const handleRefreshLoyalty = useCallback(async () => {
    if (!programId || loyaltyDataLoading) return;

    setLoyaltyDataLoading(true);

    try {
      const programData = await getProgramData(programId);
      if (programData) {
        setLoyaltyProgram(programData);
        setHasLoyaltyProgram(true);
        onNotification({
          message: "Loyalty data refreshed successfully",
          status: "success",
          show: true,
        });
      } else {
        setHasLoyaltyProgram(false);
        setLoyaltyProgram(null);
        // Clear invalid program ID
        localStorage.removeItem("loyaltyProgramId");
        setProgramId(null);
      }
    } catch (error: any) {
      console.error("Error refreshing loyalty program:", error);

      // Handle context not initialized error gracefully
      if (error?.message?.includes("Context not initialized")) {
        onNotification({
          message: "Please wait for wallet connection to complete",
          status: "error",
          show: true,
        });
      } else {
        onNotification({
          message: "Failed to refresh loyalty data",
          status: "error",
          show: true,
        });
      }
    } finally {
      setLoyaltyDataLoading(false);
    }
  }, [programId, getProgramData, loyaltyDataLoading, onNotification]);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await onRefresh();
      await handleRefreshLoyalty();
    } catch (error) {
      console.error("Error during refresh:", error);
    }
  };

  // Handle copy with feedback
  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    onNotification({
      message: `${label} copied to clipboard`,
      status: "success",
      show: true,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-[#8B1212]" />
            <h3 className="text-xl font-semibold text-gray-900">
              Loyalty System
            </h3>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || loyaltyDataLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B1212] hover:bg-[#6F0E0E] text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefreshing || loyaltyDataLoading ? "animate-spin" : ""
              }`}
            />
            <span>
              {isRefreshing || loyaltyDataLoading ? "Loading..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Loading State */}
        {loyaltyDataLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B1212]"></div>
            <span className="ml-3 text-gray-600">
              Loading loyalty program...
            </span>
          </div>
        )}

        {/* Loyalty Program Display */}
        {!loyaltyDataLoading && hasLoyaltyProgram && loyaltyProgram && (
          <div className="space-y-6">
            {/* Program Overview */}
            <div className="bg-gradient-to-r from-[#8B1212] to-[#6F0E0E] rounded-xl p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-bold mb-2">
                    {loyaltyProgram.name}
                  </h4>
                  <p className="text-white/80 mb-2">
                    {loyaltyProgram.metadata?.organizationName ||
                      "Unknown Organization"}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {loyaltyProgram.numMinted || 0}
                    </div>
                    <div className="text-white/80 text-sm">Total Passes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {loyaltyProgram.tiers?.length || 0}
                    </div>
                    <div className="text-white/80 text-sm">Tiers</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Owner</span>
                  </div>
                  <div className="text-sm text-white/80">
                    {loyaltyProgram.creator} ({sameWallet && "You"})
                  </div>
                </div>
              </div>
            </div>

            {/* Program Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Reward Tiers */}
              {loyaltyProgram.tiers && loyaltyProgram.tiers.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="w-5 h-5 text-[#8B1212]" />
                    <h5 className="font-semibold text-gray-900">
                      Reward Tiers
                    </h5>
                  </div>
                  <div className="space-y-3">
                    {loyaltyProgram.tiers.map((tier, index) => (
                      <div
                        key={tier.name || index}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {tier.name || `Tier ${index + 1}`}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-600">
                              {tier.xpRequired || 0} XP
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Rewards:</strong>{" "}
                          {tier.rewards?.length
                            ? tier.rewards.join(", ")
                            : "No rewards"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Points Per Action */}
              {loyaltyProgram.pointsPerAction &&
                Object.keys(loyaltyProgram.pointsPerAction).length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Target className="w-5 h-5 text-[#8B1212]" />
                      <h5 className="font-semibold text-gray-900">
                        Points Per Action
                      </h5>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(loyaltyProgram.pointsPerAction).map(
                        ([action, points]) => (
                          <div
                            key={action}
                            className="bg-white rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 capitalize">
                                {action.replace(/_/g, " ")}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Gift className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-bold text-green-600">
                                  {points} pts
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Program Technical Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Layers className="w-5 h-5 text-[#8B1212]" />
                <h5 className="font-semibold text-gray-900">
                  Technical Details
                </h5>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loyaltyProgram.collectionAddress && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">
                      Collection Address
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs font-mono text-gray-800 break-all flex-1">
                        {formatAddress(loyaltyProgram.collectionAddress)}
                      </code>
                      <button
                        onClick={() =>
                          handleCopy(
                            loyaltyProgram.collectionAddress,
                            "Collection address"
                          )
                        }
                        className="p-1 text-gray-400 hover:text-[#8B1212] transition-colors flex-shrink-0"
                        title="Copy collection address"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {loyaltyProgram.uri && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">
                      Metadata URI
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs font-mono text-gray-800 break-all flex-1">
                        {loyaltyProgram.uri.length > 30
                          ? `${loyaltyProgram.uri.substring(0, 30)}...`
                          : loyaltyProgram.uri}
                      </code>
                      <button
                        onClick={() =>
                          window.open(loyaltyProgram.uri, "_blank")
                        }
                        className="p-1 text-gray-400 hover:text-[#8B1212] transition-colors flex-shrink-0"
                        title="View metadata"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {programId && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Program ID</div>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs font-mono text-gray-800 break-all flex-1">
                        {formatAddress(programId)}
                      </code>
                      <button
                        onClick={() => handleCopy(programId, "Program ID")}
                        className="p-1 text-gray-400 hover:text-[#8B1212] transition-colors flex-shrink-0"
                        title="Copy program ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {loyaltyError && !loyaltyDataLoading && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Loyalty Program
            </h3>
            <p className="text-gray-500 mb-6">
              There was an error loading your loyalty program details.
            </p>
            <button
              onClick={handleRefresh}
              disabled={loyaltyDataLoading}
              className="px-4 py-2 bg-[#8B1212] hover:bg-[#6F0E0E] text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State - No Loyalty Program */}
        {!loyaltyDataLoading &&
          !loyaltyError &&
          initialized &&
          !hasLoyaltyProgram && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Loyalty Program Found
              </h3>
              <p className="text-gray-500 mb-6">
                You don't have an active loyalty program yet. To create one,
                simply create a campaign and the loyalty program tab will be
                available.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default LoyaltySystemTab;
