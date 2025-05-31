import { useState, useCallback } from "react";
import { RefreshCw, Info, Check, X, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { BaseStepProps } from "@/types/camapaignmodal";
const PaymentStep = ({
  formData,
  setFormData,
  showNotification,
  usdcBalance,
  refreshBalances,
  isConfirmed,
  setIsConfirmed,
}: BaseStepProps) => {
  const [error, setError] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const basePackagePrice = formData.pricingTier.price;
  const baseImpressions = formData.pricingTier.impressions;
  const pricePerImpression = basePackagePrice / baseImpressions;

  const validateBudget = useCallback(
    (value: string) => {
      const numericValue = parseFloat(value);

      if (value === "") {
        setError("");
        return false;
      }

      if (isNaN(numericValue) || numericValue < 0) {
        setError("Please enter a valid amount");
        return false;
      }

      if (numericValue < basePackagePrice) {
        setError(
          `Budget must be at least ${basePackagePrice} USDC based on selected package`
        );
        return false;
      }

      if (numericValue > usdcBalance) {
        const difference = (numericValue - usdcBalance).toFixed(2);
        setError(`Insufficient balance. You need ${difference} USDC more`);
        return false;
      }

      setError("");
      return true;
    },
    [basePackagePrice, usdcBalance]
  );

  const handleBudgetChange = (value: string) => {
    setIsConfirmed && setIsConfirmed(false);
    setFormData((prev: any) => ({
      ...prev,
      budget: value === "" ? 0 : Number(value),
    }));
    validateBudget(value);
  };

  const handleConfirm = () => {
    if (!formData.budget) {
      showNotification("Please enter a budget amount", "error");
      return;
    }

    if (formData.budget < basePackagePrice) {
      showNotification(
        `Budget must be at least ${basePackagePrice} USDC`,
        "error"
      );
      return;
    }

    if (formData.budget > usdcBalance) {
      const difference = (formData.budget - usdcBalance).toFixed(2);
      showNotification(
        `Insufficient balance. You need ${difference} USDC more`,
        "error"
      );
      return;
    }

    setIsConfirmed && setIsConfirmed(true);
    showNotification("Budget confirmed successfully", "success");
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalances();
      showNotification("Balance refreshed successfully", "success");
    } catch (error) {
      showNotification("Failed to refresh balance", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate estimated impressions based on budget
  const estimatedImpressions = Math.round(formData.budget / pricePerImpression);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Set Campaign Budget</h3>
        <div className="text-sm text-gray-500">Step 7 of 8</div>
      </div>

      <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
        {/* Package Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Selected Package</h4>
            <span className="text-sm px-3 py-1 bg-[#8B1212] text-white rounded-full">
              {formData.pricingTier.description}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Base Package:</span>
              <div className="font-semibold">${basePackagePrice} USDC</div>
            </div>
            <div>
              <span className="text-gray-600">Base Impressions:</span>
              <div className="font-semibold">
                {baseImpressions.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Price per Impression:</span>
              <div className="font-semibold">
                ${(pricePerImpression * 1000).toFixed(2)}/1k
              </div>
            </div>
            <div>
              <span className="text-gray-600">Package Type:</span>
              <div className="font-semibold capitalize">
                {formData.pricingTier.id.replace("tier-", "Tier ")}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Input Section */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label
                htmlFor="campaign-budget"
                className="block text-sm font-medium text-gray-700"
              >
                Campaign Budget (USDC)
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: {basePackagePrice} USDC
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefreshBalance}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="relative mb-2">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </div>
            <input
              id="campaign-budget"
              name="campaign-budget"
              type="number"
              step="0.01"
              min={basePackagePrice}
              max={usdcBalance}
              value={formData.budget || ""}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className={cn(
                "w-full pl-8 pr-16 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1212] focus:border-transparent text-lg font-semibold",
                error ? "border-red-300" : "border-gray-200"
              )}
              placeholder={`${basePackagePrice}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              USDC
            </div>
          </div>

          {/* Balance and Quick Amount Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Available:{" "}
              <span className="font-semibold text-green-600">
                {usdcBalance.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBudgetChange(basePackagePrice.toString())}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
              >
                Min
              </button>
              <button
                type="button"
                onClick={() =>
                  handleBudgetChange((basePackagePrice * 2).toString())
                }
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                disabled={basePackagePrice * 2 > usdcBalance}
              >
                2x
              </button>
              <button
                type="button"
                onClick={() =>
                  handleBudgetChange(
                    Math.min(usdcBalance, basePackagePrice * 5).toString()
                  )
                }
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                disabled={basePackagePrice * 5 > usdcBalance}
              >
                Max
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Estimated Results */}
          {formData.budget > 0 && !error && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">
                Estimated Campaign Results
              </h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Impressions:</span>
                  <div className="font-bold text-[#8B1212] text-lg">
                    {estimatedImpressions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Package Multiplier:</span>
                  <div className="font-bold text-[#8B1212] text-lg">
                    {(formData.budget / basePackagePrice).toFixed(1)}x
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Campaign Budget:</span>
              <span className="font-semibold">
                {formData.budget.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Network Fees:</span>
              <span className="font-semibold text-green-600">
                Free (Gasless)
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total to Pay:
                </span>
                <span className="text-2xl font-bold text-[#8B1212]">
                  {formData.budget.toFixed(2)} USDC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gasless Transaction Info */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              Gasless Transaction Enabled
            </span>
          </div>
          <p className="text-sm text-green-700">
            Our platform covers all network fees. You only pay your campaign
            budget - no hidden costs!
          </p>
        </div>

        {/* Budget Confirmation */}
        <div className="flex items-center justify-end gap-4">
          {isConfirmed && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Budget Confirmed</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              !!error ||
              !formData.budget ||
              formData.budget < basePackagePrice ||
              formData.budget > usdcBalance
            }
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
              error ||
                !formData.budget ||
                formData.budget < basePackagePrice ||
                formData.budget > usdcBalance
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : isConfirmed
                ? "bg-green-600 text-white"
                : "bg-[#8B1212] hover:bg-[#6F0E0E] text-white"
            )}
          >
            {isConfirmed ? "Budget Confirmed" : "Confirm Budget"}
          </button>
        </div>

        {/* Warning for insufficient balance */}
        {formData.budget > usdcBalance && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <X className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">
                Insufficient Balance
              </span>
            </div>
            <p className="text-sm text-red-700 mb-3">
              You need {(formData.budget - usdcBalance).toFixed(2)} more USDC to
              complete this payment.
            </p>
            <a
              href="/business/wallet"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              Add USDC to Wallet
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
