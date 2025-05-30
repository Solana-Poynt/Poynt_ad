import { useState } from "react";
import {
  Check,
  Settings,
  Info,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

interface PricingConfirmationProps {
  formData: any;
  usdcBalance: number;
  walletNotConnected: boolean;
  onClose: () => void;
}

const PricingConfirmation = ({
  formData,
  usdcBalance,
  walletNotConnected,
  onClose,
}: PricingConfirmationProps) => {
  const [showUsdcGuide, setShowUsdcGuide] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Confirm Your Plan</h3>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Change Plan
        </button>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4 border border-gray-200">
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="text-4xl font-bold text-side mb-2">
            {formData.pricingTier.price} USDC
          </div>
          <div className="text-sm text-gray-600">
            {formData.pricingTier.impressions.toLocaleString()} Impressions
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Included Features:</h4>
          {formData.pricingTier.features.map(
            (feature: string, index: number) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600"
              >
                <Check className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                {feature}
              </div>
            )
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 italic">
            {formData.pricingTier.description}
          </div>
        </div>

        {/* Balance Info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Your USDC Balance:
            </span>
            <span className="text-lg font-bold text-blue-700">
              {usdcBalance.toFixed(2)} USDC
            </span>
          </div>

          {usdcBalance < formData.pricingTier.price ? (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200 mt-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 mb-1">
                    Insufficient Balance
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    You need{" "}
                    <span className="font-semibold">
                      {(formData.pricingTier.price - usdcBalance).toFixed(2)}{" "}
                      USDC
                    </span>{" "}
                    more to proceed with this campaign.
                  </p>
                  <a
                    href="/business/wallet"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <DollarSign className="w-4 h-4" />
                    Add USDC to Wallet
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 mt-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Sufficient balance available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* USDC Guide - Testing Phase Only */}
        {usdcBalance < formData.pricingTier.price && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <button
              onClick={() => setShowUsdcGuide(!showUsdcGuide)}
              className="w-full p-4 flex items-center justify-between hover:bg-blue-100/50 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-blue-900">
                    Need Test USDC?
                  </h4>
                  <p className="text-sm text-blue-700">
                    Click here to learn how to get USDC for testing
                  </p>
                </div>
              </div>
              {showUsdcGuide ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {showUsdcGuide && (
              <div className="px-4 pb-4 border-t border-blue-200">
                <div className="bg-white rounded-lg p-4 mt-3">
                  <h5 className="font-medium text-gray-900 mb-3">
                    Quick USDC Setup:
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        1
                      </span>
                      <div className="text-sm">
                        <span>Visit your </span>
                        <a
                          href="/business/wallet"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Wallet page
                        </a>
                        <span> to check your address</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        2
                      </span>
                      <div className="text-sm">
                        <span>Get test USDC from </span>
                        <a
                          href="https://faucet.circle.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                        >
                          Circle Faucet
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span> (select Solana network)</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                      <p className="text-xs text-amber-800">
                        💡 <span className="font-medium">Testing Phase:</span>{" "}
                        Use testnet USDC only. Gasless transactions mean you
                        only pay campaign costs!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600">
              You can close this modal anytime to select a different pricing
              plan. Click "Change Plan" above or the X button to go back to
              pricing options.
            </p>
          </div>
        </div>

        {walletNotConnected && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-red-800 mb-2">
                  Wallet Connection Required
                </h4>
                <p className="text-red-700 mb-4">
                  To create a campaign, you need to connect or create a wallet
                  first. This is required to pay for your campaign.
                </p>
                <a
                  href="/business/wallet"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Go to Wallet Page
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingConfirmation;
