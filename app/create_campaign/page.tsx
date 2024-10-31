"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  TrendingUp,
  Coins,
  Globe2,
  HandshakeIcon,
  ChevronRight,
} from "lucide-react";
import CampaignModal from "@/components/campaignmodal";
import { DEFAULT_PRICING_TIERS } from "@/types/campaign";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer";
import Header from "@/components/campaignheader";

interface CampaignBenefit {
  icon: JSX.Element;
  title: string;
  description: string;
}

const CampaignPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const benefits: CampaignBenefit[] = [
    {
      icon: <Target className="w-8 h-8 text-[#B71C1C]" />,
      title: "Precise Targeting",
      description:
        "Reach your exact audience with advanced targeting options including demographics, interests, and location.",
    },
    {
      icon: <Users className="w-8 h-8 text-[#B71C1C]" />,
      title: "Massive Reach",
      description:
        "Our new approach unlocks new numbers in views, ad performance and quality",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#B71C1C]" />,
      title: "Real-Time Analytics",
      description:
        "Monitor your campaign performance in real-time with detailed analytics and insights.",
    },
    {
      icon: <Coins className="w-8 h-8 text-[#B71C1C]" />,
      title: "Cost-Effective",
      description:
        "Pay only for actual impressions with our transparent CPM pricing model.",
    },
    {
      icon: <Globe2 className="w-8 h-8 text-[#B71C1C]" />,
      title: "Global Reach",
      description:
        "Target audiences worldwide or focus on specific geographic locations.",
    },
    {
      icon: <HandshakeIcon className="w-8 h-8 text-[#B71C1C]" />,
      title: "Value",
      description:
        "Drive results through targeted advertising that benefits both your business and your audience, all while reaching premium placement across our network.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-white border-b mt-12 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Advertise on Poynt
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Reach millions of potential customers with targeted advertising
              that delivers results.
            </p>
            <div className="flex justify-center gap-5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 inline-flex items-center px-6 py-3 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-all"
              >
                Create Campaign
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Advertise with Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm font-semibold text-gray-600">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DEFAULT_PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-6 rounded-xl ${
                  tier.recommended
                    ? "ring-2 ring-[#B71C1C] shadow-lg"
                    : "border border-gray-200"
                }`}
              >
                {tier.recommended && (
                  <span className="inline-block px-3 py-1 text-xs font-medium text-[#B71C1C] bg-[#B71C1C]/10 rounded-full mb-4">
                    Recommended
                  </span>
                )}
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.impressions.toLocaleString()} Impressions
                </div>
                <div className="text-4xl font-bold text-[#B71C1C]">
                  ${tier.price}
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`mt-6 w-full py-2 px-4 rounded-lg transition-colors ${
                    tier.recommended
                      ? "bg-[#B71C1C] text-white hover:bg-[#B71C1C]/90"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Select Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm px-6 font-semibold text-gray-600">
          {[
            {
              step: 1,
              title: "Create Your Campaign",
              description:
                "Choose your target audience, set your budget, and design your ad.",
            },
            {
              step: 2,
              title: "Launch & Monitor",
              description:
                "Your campaign goes live and you can track performance in real-time.",
            },
            {
              step: 3,
              title: "Optimize & Scale",
              description:
                "Use insights to optimize your campaign and scale your success.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#B71C1C] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Campaign Creation Modal */}
      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pricingTiers={DEFAULT_PRICING_TIERS}
      />
    </div>
  );
};

export default CampaignPage;
