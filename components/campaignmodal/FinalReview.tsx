import { useState } from "react";
import {
  Check,
  X,
  Info,
  ArrowRight,
  Loader,
  Trophy,
  Award,
} from "lucide-react";
import { Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import { isSolanaWallet } from "@dynamic-labs/solana-core";
import { cn } from "@/lib/utils";
import { BaseStepProps } from "@/types/camapaignmodal";

const FinalReview = ({
  formData,
  showNotification,
  usdcBalance,
  refreshBalances,
  paymentConfirmed,
  setPaymentConfirmed,
  paymentSignature,
  setPaymentSignature,
  uploadedFile,
  usdcToken,
  primaryWallet,
}: BaseStepProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");

  const campaignCost = formData.budget;
  const estimatedImpressions = Math.round(
    (formData.budget / formData.pricingTier.price) *
      formData.pricingTier.impressions
  );

  const handlePayment = async () => {
    if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
      setPaymentError("Solana wallet not connected");
      showNotification("Solana wallet not connected", "error");
      return;
    }

    if (campaignCost > usdcBalance) {
      setPaymentError("Insufficient USDC balance");
      showNotification("Insufficient USDC balance", "error");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      // Prepare transaction data for USDC transfer
      const transactionData = {
        senderAddress: primaryWallet.address,
        recipientAddress: "7LTeiD4Ndao8zaArUdrZmcWYRHa5q2PwMWFodzQx6JfA", // Platform address
        amount: campaignCost,
        tokenAddress: usdcToken?.address,
        decimals: 6,
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

      setPaymentSignature && setPaymentSignature(signature);
      setPaymentConfirmed && setPaymentConfirmed(true);

      showNotification("Payment successful!", "success");

      // Refresh balances after successful payment
      await refreshBalances();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Payment failed";
      setPaymentError(errorMsg);
      showNotification(`Payment failed: ${errorMsg}`, "error");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Review & Pay</h3>
        <div className="text-sm text-gray-500">Final Step</div>
      </div>

      <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
        {/* Campaign Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">
            Campaign Overview
          </h4>
          <div className="space-y-3">
            {[
              { label: "Campaign Name", value: formData.name },
              { label: "Ad Type", value: formData.adType.replace("_", " ") },
              {
                label: "Engagement Goal",
                value: formData.engagementGoal.replace("_", " "),
              },
              {
                label: "Loyalty Program",
                value: formData.selectedLoyaltyProgram?.name || "None selected",
              },
              {
                label: "Selected Package",
                value: formData.pricingTier.description,
              },
              {
                label: "Campaign Budget",
                value: `${formData.budget.toFixed(2)} USDC`,
              },
              {
                label: "Estimated Impressions",
                value: estimatedImpressions.toLocaleString(),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-600 text-sm">{item.label}:</span>
                <span className="font-medium capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Program Summary */}
        {formData.selectedLoyaltyProgram && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Loyalty Program Integration
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {formData.selectedLoyaltyProgram.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.selectedLoyaltyProgram.organizationName}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Users will earn loyalty points for completing campaign tasks
              </div>
            </div>
          </div>
        )}

        {/* Content Preview */}
        {uploadedFile && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">
              Campaign Content
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative group">
                {uploadedFile[0]?.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(
                      uploadedFile instanceof File
                        ? uploadedFile
                        : uploadedFile[0]
                    )}
                    alt="Campaign content"
                    className="rounded-lg w-full h-40 object-cover"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(
                      uploadedFile instanceof File
                        ? uploadedFile
                        : uploadedFile[0]
                    )}
                    className="rounded-lg w-full h-40 object-cover"
                    controls
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campaign Details */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Campaign Details</h4>

          {/* Description */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Description:
            </div>
            <p className="text-sm text-gray-600">
              {formData.description || "No description provided"}
            </p>
          </div>

          {/* Call to Action */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Call to Action:
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#8B1212] text-white rounded-full text-sm">
                {formData.cta.text || "Learn More"}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-blue-600 text-sm">
                {formData.cta.url || "No URL provided"}
              </span>
            </div>
          </div>

          {/* User Tasks */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              User Tasks:
            </div>
            <div className="space-y-2">
              {Object.entries(formData.tasks).map(([key, value], index) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#8B1212]/10 text-[#8B1212] rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-600">
                    {value || `No ${key} task defined`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-gray-900">Payment</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Balance: {usdcBalance.toFixed(2)} USDC
            </div>
          </div>

          {paymentConfirmed ? (
            // Payment Success State
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-green-800 text-lg">
                  Payment Successful!
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Amount Paid:</span>
                  <span className="font-semibold">
                    {campaignCost.toFixed(2)} USDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Transaction:</span>
                  <span className="font-mono text-xs">
                    {paymentSignature?.substring(0, 16)}...
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200">
                <a
                  href={`https://explorer.solana.com/tx/${paymentSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 text-sm font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  View on Solana Explorer
                </a>
              </div>
            </div>
          ) : (
            // Payment Form
            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Campaign Budget:</span>
                    <span className="font-semibold">
                      {campaignCost.toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network Fees:</span>
                    <span className="font-semibold text-green-600">
                      Free (Gasless)
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">
                        Total to Pay:
                      </span>
                      <span className="text-xl font-bold text-[#8B1212]">
                        {campaignCost.toFixed(2)} USDC
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Payment Failed
                    </span>
                  </div>
                  <p className="text-red-700 text-sm">{paymentError}</p>
                </div>
              )}

              {/* Balance Check */}
              {campaignCost > usdcBalance && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Insufficient Balance
                    </span>
                  </div>
                  <p className="text-red-700 text-sm mb-3">
                    You need {(campaignCost - usdcBalance).toFixed(2)} more
                    USDC.
                  </p>
                  <a
                    href="/business/wallet"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Add USDC to Wallet
                  </a>
                </div>
              )}

              {/* Gasless Info */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Gasless Transaction
                  </span>
                </div>
                <p className="text-green-700 text-sm">
                  Network fees are covered by our platform. You only pay your
                  campaign budget.
                </p>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessingPayment || campaignCost > usdcBalance}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-lg transition-all",
                  campaignCost > usdcBalance || isProcessingPayment
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#8B1212] hover:bg-[#6F0E0E] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                )}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Processing Payment...
                  </>
                ) : campaignCost > usdcBalance ? (
                  <>
                    <X className="w-6 h-6" />
                    Insufficient Balance
                  </>
                ) : (
                  <>Pay {campaignCost.toFixed(2)} USDC</>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Payment will be processed securely via gasless transaction
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalReview;
