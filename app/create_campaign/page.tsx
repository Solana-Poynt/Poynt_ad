"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ChevronRight } from "lucide-react";
import CampaignModal from "@/components/campaignmodal";
import { DEFAULT_PRICING_TIERS } from "@/types/campaign";
import Footer from "../../components/footer";
import Header from "@/components/campaignheader";
import { cn } from "@/lib/utils";

export default function CampaignPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen  mt-16 bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="pt-16 pb-8 px-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-side to-side/80 mb-4"
            >
              Transform Your Advertising Game
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Unlock the power of targeted advertising with our premium ad
              network. Reach millions of engaged users and scale your business
              effectively.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl font-bold text-side mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the perfect advertising package for your needs. All plans
              include our complete suite of targeting and analytics features.
            </p>
            <p className="text-side text-xs italic max-w-2xl py-4  mx-auto">
              For test purposes, all price plans are in SOL to ensure effective testing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEFAULT_PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedPricing(index);
                  setIsModalOpen(true);
                }}
                className={cn(
                  "bg-white rounded-xl cursor-pointer transition-all duration-300 flex flex-col h-full",
                  selectedPricing === index
                    ? "ring-2 ring-side shadow-xl scale-105"
                    : "border border-gray-200 hover:border-side/50 hover:shadow-lg hover:scale-102",
                  tier.recommended && "relative"
                )}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-side text-white text-sm font-medium rounded-full shadow-lg">
                    Recommended
                  </div>
                )}

                <div
                  className={cn(
                    "flex flex-col h-full p-6",
                    tier.recommended && "pt-8"
                  )}
                >
                  {/* Header Section */}
                  <div className="text-center mb-6">
                    <h3 className="text-sm mx-4 font-semibold text-gray-900 mb-2">
                      {tier.description}
                    </h3>
                    <div className="text-3xl font-bold text-side mb-1">
                      {tier.price} SOL
                    </div>
                  </div>

                  {/* Impressions Badge */}
                  <div className="bg-gray-50 rounded-lg py-3 px-4 text-center mb-6">
                    <div className="text-2xl font-bold text-gray-900">
                      {tier.impressions.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Impressions</div>
                  </div>

                  {/* Features */}
                  <div className="flex-grow">
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <Check className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={cn(
                      "w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 mt-auto",
                      tier.recommended
                        ? "bg-side text-white hover:bg-side/90 shadow-md hover:shadow-lg"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with your advertising campaign in three simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-side/20 via-side/40 to-side/20 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {stepsData.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 left-8 w-8 h-8 bg-side text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="text-4xl mb-6">{step.icon}</div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-side transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>

                    {/* Connection Arrow */}
                    {index < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                          <ChevronRight className="w-5 h-5 text-side" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {selectedPricing !== null && isModalOpen && (
          <CampaignModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            pricingTiers={DEFAULT_PRICING_TIERS[selectedPricing]}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
