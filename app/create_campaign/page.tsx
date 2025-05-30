"use client";
import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronRight } from "lucide-react";
import CampaignModal from "@/components/CampaignModal";

import { DEFAULT_PRICING_TIERS } from "@/types/campaign";
import Footer from "../../components/Footer";
import Header from "@/components/CampaignHeader";
import { cn } from "@/lib/utils";

// Pre-defined animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Helper components
const Stat = memo(({ number, label, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
  >
    <div className="text-3xl md:text-4xl font-bold text-side mb-2">
      {number}
    </div>
    <div className="text-sm md:text-base text-gray-600 font-medium">
      {label}
    </div>
  </motion.div>
));
Stat.displayName = "Stat";

const PricingTier = memo(({ tier, index, isSelected, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    onClick={onClick}
    className={cn(
      "bg-white rounded-xl cursor-pointer transition-all duration-300 flex flex-col h-full",
      isSelected
        ? "ring-2 ring-side shadow-xl scale-105"
        : "border border-gray-200 hover:border-side/50 hover:shadow-lg hover:scale-102",
      tier.recommended && "relative"
    )}
  >
    {tier.recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 bg-side text-white text-xs md:text-sm font-medium rounded-full shadow-lg">
        Recommended
      </div>
    )}

    <div
      className={cn(
        "flex flex-col h-full p-4 md:p-6",
        tier.recommended && "pt-6 md:pt-8"
      )}
    >
      {/* Header Section */}
      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-xs md:text-sm mx-2 md:mx-4 font-semibold text-gray-900 mb-2">
          {tier.description}
        </h3>
        <div className="text-2xl md:text-3xl font-bold text-side mb-1">
          ${tier.price} USDC
        </div>
        <div className="text-xs text-gray-500">
          {/* ${tier.pricePerThousand}/1k impressions */}
        </div>
      </div>

      {/* Impressions Badge */}
      <div className="bg-gray-50 rounded-lg py-2 md:py-3 px-3 md:px-4 text-center mb-4 md:mb-6">
        <div className="text-xl md:text-2xl font-bold text-gray-900">
          {tier.impressions.toLocaleString()}
        </div>
        <div className="text-xs md:text-sm text-gray-600">Impressions</div>
      </div>

      {/* Features */}
      <div className="flex-grow">
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {tier.features.map((feature: string, featureIndex: string) => (
            <li
              key={featureIndex}
              className="flex items-start text-xs md:text-sm text-gray-600"
            >
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        className={cn(
          "w-full py-2 md:py-3 px-3 md:px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 mt-auto text-sm md:text-base",
          tier.recommended
            ? "bg-side text-white hover:bg-side/90 shadow-md hover:shadow-lg"
            : "bg-gray-50 text-gray-900 hover:bg-gray-100"
        )}
      >
        Get Started <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
      </button>
    </div>
  </motion.div>
));
PricingTier.displayName = "PricingTier";

const Step = memo(({ step, index, totalSteps }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2 }}
    viewport={{ once: true }}
    className="relative"
  >
    {/* Mobile step connector - only visible on small screens */}
    {index > 0 && (
      <div className="md:hidden absolute -top-4 left-1/2 transform -translate-x-1/2 h-8 w-0.5 bg-side/30" />
    )}

    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      {/* Step Number Badge */}
      <div className="absolute -top-4 left-8 w-7 h-7 md:w-8 md:h-8 bg-side text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg">
        {step.step}
      </div>

      {/* Icon */}
      <div className="text-3xl md:text-4xl mb-4 md:mb-6">{step.icon}</div>

      {/* Content */}
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-side transition-colors">
        {step.title}
      </h3>
      <p className="text-sm md:text-base text-gray-600">{step.description}</p>

      {/* Connection Arrow - only visible on md and larger screens */}
      {index < totalSteps - 1 && (
        <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-side" />
          </div>
        </div>
      )}
    </div>
  </motion.div>
));
Step.displayName = "Step";

// Main component
export default function CampaignPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedPricing, setSelectedPricing] = useState<number>(0);

  // Memoized content data
  const stats = [
    { number: "100%", label: "More Target Audience" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "24/7", label: "Premium Support" },
  ];

  const stepsData = [
    {
      step: 1,
      title: "Choose Your Plan",
      description:
        "Select the impression package that matches your goals and budget.",
      icon: "💎",
    },
    {
      step: 2,
      title: "Create Your Campaign",
      description:
        "Set up your campaign with our easy-to-use campaign builder.",
      icon: "🚀",
    },
    {
      step: 3,
      title: "Track Performance",
      description:
        "Monitor your campaign's performance with real-time analytics.",
      icon: "📊",
    },
  ];

  // Callbacks
  const handlePricingSelect = useCallback((index: number) => {
    setSelectedPricing(index);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, [router]);

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="pt-10 md:pt-16 pb-6 md:pb-8 px-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <motion.h1
              {...fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-side to-side/80 mb-4"
            >
              Transform Your Advertising Game
            </motion.h1>
            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2 mb-6"
            >
              Unlock the power of targeted advertising with our premium ad
              network. Reach millions of engaged users and scale your business
              effectively.
            </motion.p>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-side hover:bg-side/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Create Campaign Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Stat
                key={index}
                number={stat.number}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-10 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Choose Your Plan
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Select the perfect advertising package for your needs. All plans
              include our complete suite of targeting and analytics features.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 md:p-6 max-w-2xl mx-auto mt-6 md:mt-8 border border-blue-200">
              <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-2">
                Payment Information
              </h3>
              <p className="text-sm md:text-base text-gray-700 mb-4">
                All campaigns are paid in USDC (USD Coin) for stable pricing and
                fast transactions.
              </p>

              <div className="bg-white rounded-lg p-3 md:p-4 border border-blue-200">
                <h4 className="font-bold text-sm md:text-base text-gray-800 mb-2">
                  How to Get USDC:
                </h4>
                <ol className="text-left space-y-2 md:space-y-3 text-xs md:text-sm">
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                      1
                    </span>
                    <span>
                      Go to your{" "}
                      <a
                        href="/business/wallet"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Wallet page
                      </a>{" "}
                      and ensure you have sufficient USDC balance
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                      2
                    </span>
                    <span>
                      For testnet: Use the
                      <a
                        href="https://faucet.circle.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mx-2 font-medium"
                      >
                        USDC Faucet,
                      </a>
                      select Solana from the network dropdown, paste your poynt
                      wallet address, to get test USDC
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                      3
                    </span>
                    <span>
                      For mainnet: Purchase USDC from any exchange and transfer
                      to your wallet
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                      4
                    </span>
                    <span>
                      Transaction fees are covered by our gasless system - you
                      only pay the campaign cost
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {DEFAULT_PRICING_TIERS.map((tier, index) => (
              <PricingTier
                key={tier.id}
                tier={tier}
                index={index}
                isSelected={selectedPricing === index}
                onClick={() => handlePricingSelect(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Get started with your advertising campaign in three simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line - visible only on md and larger screens */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-side/20 via-side/40 to-side/20 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {stepsData.map((step, index) => (
                <Step
                  key={index}
                  step={step}
                  index={index}
                  totalSteps={stepsData.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AnimatePresence mode="wait">
        {isModalOpen && (
          <CampaignModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            pricingTiers={DEFAULT_PRICING_TIERS[selectedPricing]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
