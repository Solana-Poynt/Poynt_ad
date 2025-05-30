import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isSolanaWallet } from "@dynamic-labs/solana-core";
import { PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import {
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Loader,
  ExternalLink,
  ArrowRight,
  Copy,
  Info,
} from "lucide-react";
import useSolanaTokenBalances from "@/utils/hooks/balance";

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  marketValue?: number;
  logoURI?: string;
  mint?: string;
  tokenAccount?: string;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (signature: string) => void;
  onError?: (error: string) => void;
}

interface SendFormData {
  recipient: string;
  amount: string;
  selectedToken: TokenBalance | null;
}

const SendModal = ({ isOpen, onClose, onSuccess, onError }: SendModalProps) => {
  const { primaryWallet } = useDynamicContext();
  const { sendableTokens, refreshBalances } = useSolanaTokenBalances({
    fetchAllTokens: true,
    includeZeroBalances: false,
  });

  // Form state
  const [formData, setFormData] = useState<SendFormData>({
    recipient: "",
    amount: "",
    selectedToken: null,
  });

  // UI state
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "form" | "confirm" | "processing" | "success" | "error"
  >("form");
  const [transactionSignature, setTransactionSignature] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        recipient: "",
        amount: "",
        selectedToken: sendableTokens[0] || null,
      });
      setCurrentStep("form");
      setTransactionSignature("");
      setErrorMessage("");
    }
  }, [isOpen, sendableTokens]);

  // Validation
  const validateForm = useCallback(() => {
    if (!formData.recipient.trim()) return "Recipient address is required";
    if (!formData.amount.trim()) return "Amount is required";
    if (!formData.selectedToken) return "Please select a token";

    try {
      new PublicKey(formData.recipient);
    } catch {
      return "Invalid recipient address";
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return "Invalid amount";
    if (amount > formData.selectedToken.balance) return "Insufficient balance";

    return null;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setCurrentStep("error");
      return;
    }

    setCurrentStep("confirm");
  }, [validateForm]);

  // Handle transaction confirmation
  const handleConfirmTransaction = useCallback(async () => {
    if (
      !primaryWallet ||
      !isSolanaWallet(primaryWallet) ||
      !formData.selectedToken
    ) {
      setErrorMessage("Wallet not connected or invalid token selected");
      setCurrentStep("error");
      return;
    }

    setCurrentStep("processing");
    setIsProcessing(true);

    try {
      // Prepare transaction data
      const transactionData = {
        senderAddress: primaryWallet.address,
        recipientAddress: formData.recipient,
        amount: parseFloat(formData.amount),
        tokenAddress:
          formData.selectedToken.symbol === "SOL"
            ? undefined
            : formData.selectedToken.address,
        decimals: formData.selectedToken.decimals,
      };

      // Call gasless API
      const response = await fetch("/api/gasless", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to prepare transaction"
        );
      }

      // Get signer and send transaction
      const signer = await primaryWallet.getSigner();
      const transaction = Transaction.from(
        bs58.decode(responseData.serializedTransaction)
      );

      const { signature } = await signer.signAndSendTransaction(transaction);

      setTransactionSignature(signature);
      setCurrentStep("success");

      // Refresh balances after successful transaction
      await refreshBalances();

      if (onSuccess) {
        onSuccess(signature);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Transaction failed";
      setErrorMessage(errorMsg);
      setCurrentStep("error");

      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [primaryWallet, formData, refreshBalances, onSuccess, onError]);

  // Handle token selection
  const handleTokenSelect = (token: TokenBalance) => {
    setFormData((prev) => ({ ...prev, selectedToken: token, amount: "" }));
    setShowTokenDropdown(false);
  };

  // Copy transaction signature
  const copySignature = async () => {
    try {
      await navigator.clipboard.writeText(transactionSignature);
    } catch (error) {
      console.error("Failed to copy signature:", error);
    }
  };

  // Format balance display
  const formatBalance = (balance: number, decimals: number = 4) => {
    return balance.toFixed(Math.min(decimals, 6));
  };

  // Handle close
  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Send Crypto</h3>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Form Step */}
            {currentStep === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Token Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Token
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      {formData.selectedToken ? (
                        <div className="flex items-center space-x-3">
                          {formData.selectedToken.logoURI && (
                            <img
                              src={formData.selectedToken.logoURI}
                              alt={formData.selectedToken.symbol}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <div className="text-left">
                            <div className="font-medium">
                              {formData.selectedToken.symbol}
                            </div>
                            <div className="text-sm text-gray-500">
                              Balance:{" "}
                              {formatBalance(formData.selectedToken.balance)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Select a token</span>
                      )}
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Token Dropdown */}
                    {showTokenDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {sendableTokens.map((token) => (
                          <button
                            key={token.address}
                            onClick={() => handleTokenSelect(token)}
                            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors"
                          >
                            {token.logoURI && (
                              <img
                                src={token.logoURI}
                                alt={token.symbol}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <div className="text-left flex-1">
                              <div className="font-medium">{token.symbol}</div>
                              <div className="text-sm text-gray-500">
                                {formatBalance(token.balance)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recipient: e.target.value,
                      }))
                    }
                    placeholder="Enter Solana wallet address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212] focus:border-transparent"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      step="any"
                      min="0"
                      max={formData.selectedToken?.balance}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212] focus:border-transparent pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                      {formData.selectedToken?.symbol}
                    </div>
                  </div>
                  {formData.selectedToken && (
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        Available:{" "}
                        {formatBalance(formData.selectedToken.balance)}
                      </span>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            amount:
                              prev.selectedToken?.balance.toString() || "",
                          }))
                        }
                        className="text-[#8B1212] hover:text-[#6F0E0E] font-medium"
                      >
                        Max
                      </button>
                    </div>
                  )}
                </div>

                {/* Gas Fee Info */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">
                      Gasless Transaction
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Transaction fees are covered by our platform. You only pay
                    the amount you're sending.
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    !formData.recipient ||
                    !formData.amount ||
                    !formData.selectedToken
                  }
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <span>Review Transaction</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Confirmation Step */}
            {currentStep === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Confirm Transaction
                  </h4>
                  <p className="text-sm text-gray-600">
                    Please review the details below
                  </p>
                </div>

                {/* Transaction Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      You're sending
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formData.amount} {formData.selectedToken?.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">To</span>
                    <span className="text-sm font-mono">
                      {formData.recipient.slice(0, 8)}...
                      {formData.recipient.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Network Fee</span>
                    <span className="text-sm text-green-600 font-medium">
                      Free (Gasless)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep("form")}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmTransaction}
                    className="flex-1 px-4 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors font-medium"
                  >
                    Send Now
                  </button>
                </div>
              </motion.div>
            )}

            {/* Processing Step */}
            {currentStep === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing Transaction
                </h4>
                <p className="text-sm text-gray-600">
                  Please wait while we process your transaction...
                </p>
              </motion.div>
            )}

            {/* Success Step */}
            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Transaction Successful!
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Your {formData.amount} {formData.selectedToken?.symbol} has
                  been sent successfully.
                </p>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Transaction ID
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono">
                        {transactionSignature.slice(0, 8)}...
                        {transactionSignature.slice(-8)}
                      </span>
                      <button
                        onClick={copySignature}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      window.open(
                        `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`,
                        "_blank"
                      )
                    }
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Explorer</span>
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-[#8B1212] text-white rounded-lg hover:bg-[#6F0E0E] transition-colors font-medium"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}

            {/* Error Step */}
            {currentStep === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Transaction Failed
                </h4>
                <p className="text-sm text-red-600 mb-4">{errorMessage}</p>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep("form")}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SendModal;
