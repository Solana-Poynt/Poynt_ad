"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image,
  Play,
  NewspaperIcon,
  Target,
  MousePointerClick,
  Eye,
  Info,
  Loader,
} from "lucide-react";
import {
  CampaignFormData,
  CampaignModalProps,
  AdType,
  EngagementType,
} from "@/types/campaign";

const CampaignModal = ({
  isOpen,
  onClose,
  pricingTiers,
}: CampaignModalProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    type: "display",
    engagementType: "awareness",
    pricingTier: pricingTiers,
    cta: {
      text: "",
      url: "",
    },
    geolocation: {
      enabled: false,
      country: "",
      city: "",
    },
  });

  console.log(formData.pricingTier.price);

  const adTypes = [
    {
      id: "display",
      icon: <Image className="w-6 h-6" />,
      title: "Display Ads",
      description: "Static images or animated banners",
    },
    {
      id: "video",
      icon: <Play className="w-6 h-6" />,
      title: "Video Ads",
      description: "Short-form video content",
    },
    {
      id: "native",
      icon: <NewspaperIcon className="w-6 h-6" />,
      title: "Native Ads",
      description: "Seamlessly integrated content",
    },
  ];

  const engagementTypes = [
    {
      id: "awareness",
      icon: <Eye className="w-6 h-6" />,
      title: "Brand Awareness",
      description: "Increase visibility and reach",
    },
    {
      id: "traffic",
      icon: <MousePointerClick className="w-6 h-6" />,
      title: "Website Traffic",
      description: "Drive visitors to your site",
    },
    // {
    //   id: "conversion",
    //   icon: <Target className="w-6 h-6" />,
    //   title: "Conversions",
    //   description: "Generate leads and sales",
    // },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated API call
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step content components
  const AdTypeSelection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Choose Ad Type</h3>
      <div className="grid gap-4">
        {adTypes.map((type) => (
          <button
            key={type.id}
            onClick={() =>
              setFormData({ ...formData, type: type.id as AdType })
            }
            className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
              formData.type === type.id
                ? "border-[#B71C1C] bg-[#B71C1C]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                formData.type === type.id
                  ? "bg-[#B71C1C] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {type.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">{type.title}</div>
              <div className="text-sm text-gray-500">{type.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const CampaignDetails = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Campaign Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev: CampaignFormData) => {
                return { ...prev, name: e.target.value };
              })
            }
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
            placeholder="Enter campaign name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Goal
          </label>
          <div className="grid gap-4">
            {engagementTypes.map((type) => (
              <button
                key={type.id}
                onClick={() =>
                  setFormData({
                    ...formData,
                    engagementType: type.id as EngagementType,
                  })
                }
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                  formData.engagementType === type.id
                    ? "border-[#B71C1C] bg-[#B71C1C]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    formData.engagementType === type.id
                      ? "bg-[#B71C1C] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {type.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{type.title}</div>
                  <div className="text-sm text-gray-500">
                    {type.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call to Action
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.cta.text}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cta: { ...formData.cta, text: e.target.value },
                })
              }
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
              placeholder="CTA Text (e.g., Learn More)"
            />
            <input
              type="url"
              value={formData.cta.url}
              onChange={(e) =>
                setFormData((prev: CampaignFormData) => {
                  return {
                    ...prev,
                    cta: { ...formData.cta, url: e.target.value },
                  };
                })
              }
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
              placeholder="Destination URL"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const LocationTargeting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Location Targeting
        </h3>
        <div className="relative group">
          <Info className="w-5 h-5 text-gray-400 cursor-help" />
          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            Enable location targeting to show your ads only in specific
            geographic areas
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.geolocation?.enabled}
            onChange={(e) =>
              setFormData({
                ...formData,
                geolocation: {
                  ...formData.geolocation,
                  enabled: e.target.checked,
                },
              })
            }
            className="w-4 h-4 text-[#B71C1C] border-gray-300 rounded focus:ring-[#B71C1C]"
          />
          <span className="ml-2 text-gray-700">Enable location targeting</span>
        </label>

        {formData.geolocation?.enabled && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.geolocation.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    geolocation: {
                      ...formData.geolocation,
                      country: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.geolocation.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    geolocation: {
                      ...formData.geolocation,
                      city: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C]"
                placeholder="Enter city"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const Checkout = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Review & Checkout</h3>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Campaign Name</span>
          <span className="font-medium">{formData.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Ad Type</span>
          <span className="font-medium capitalize">{formData.type}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Impressions</span>
          <span className="font-medium">
            {formData.pricingTier.impressions.toLocaleString()}
          </span>
        </div>
        {formData.geolocation?.enabled && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Location</span>
            <span className="font-medium">
              {formData.geolocation.city}, {formData.geolocation.country}
            </span>
          </div>
        )}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-medium">Total Amount</span>
            <span className="text-xl font-bold text-[#B71C1C]">
              ${formData.pricingTier.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl bg-white rounded-xl shadow-xl flex flex-col  max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="py-6 px-6 border-b border-gray-200 flex-shrink-0">
              {" "}
              {/* Added flex-shrink-0 */}
              <div className="flex justify-end pt-6 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-1/4 h-1 rounded-full ${
                      i <= step ? "bg-[#B71C1C]" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {" "}
              {/* Added overflow-y-auto */}
              <div className="space-y-6">
                {/* Step content */}
                {step === 1 && <AdTypeSelection />}
                {step === 2 && <CampaignDetails />}
                {step === 3 && <LocationTargeting />}
                {step === 4 && <Checkout />}

                {/* Success state */}
                {success && (
                  <div className="text-center space-y-4 py-8">
                    {/* ... success content ... */}
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="sticky top-0 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                    {/* ... error content ... */}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between flex-shrink-0">
              {" "}
              {/* Added flex-shrink-0 */}
              {!success && (
                <>
                  <button
                    onClick={handleBack}
                    className={`px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
                      step === 1 ? "invisible" : ""
                    }`}
                  >
                    Back
                  </button>

                  <button
                    onClick={step === 4 ? handleSubmit : handleNext}
                    // disabled={isSubmitting || !formData.name}
                    className="flex items-center px-6 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Creating Campaign...
                      </>
                    ) : step === 4 ? (
                      "Create Campaign"
                    ) : (
                      "Continue"
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CampaignModal;
