"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Image,
  Play,
  Info,
  Loader,
  Check,
  Target,
  MousePointer,
  Upload,
  ArrowRight,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { PricingTier } from "@/types/campaign";
import { NotificationState } from "@/types/general";
import Notification from "./notification";
import { useWalletManagement } from "@/utils/hooks/useWallet";
import { cn } from "@/lib/utils";
import { useSendDataMutation } from "@/store/api/api";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { removeEmptyStrings } from "@/utils/util";

// Types
interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingTiers: PricingTier;
}

interface CampaignFormData {
  name: string;
  adType: AdType;
  engagementGoal: engagementGoal;
  pricingTier: PricingTier;
  media: File[];
  headline?: string;
  content?: string;
  cta: {
    text: string;
    url: string;
  };
  targetLocation: {
    enabled: boolean;
    country: string;
    city: string;
  };
  budget: number;
  costPerReach: string;
  paymentMethod: string;
  transactionhash: string;
}

type AdType = "display_ads" | "video_ads";
type engagementGoal = "brand_awareness" | "website_traffic";

const engagementGoals = [
  {
    id: "brand_awareness",
    title: "Brand Awareness",
    description: "Maximize visibility and reach",
    icon: <Target className="w-5 h-5" />,
    metrics: "Measured by impressions",
    features: [
      "Premium ad placement",
      "More reach and Target",
      "Viewability tracking",
    ],
  },
  {
    id: "website_traffic",
    title: "Website Traffic",
    description: "Drive visitors to your site",
    icon: <MousePointer className="w-5 h-5" />,
    metrics: "Measured by clicks and CTR",
    features: [
      "Click optimization",
      "Landing page tracking",
      "Retargeting options",
      "Engagement analytics",
    ],
  },
];

const CampaignModal = ({
  isOpen,
  onClose,
  pricingTiers,
}: CampaignModalProps) => {
  // Base state management
  const [step, setStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    adType: "display_ads",
    engagementGoal: "brand_awareness",
    pricingTier: pricingTiers,
    media: [],
    headline: "",
    content: "",
    cta: {
      text: "",
      url: "",
    },
    targetLocation: {
      enabled: false,
      country: "",
      city: "",
    },
    budget: pricingTiers.price,
    costPerReach: `${pricingTiers.pricePerThousand}/1000`,
    paymentMethod: "",
    transactionhash: "",
  });

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  // Wallet management hook
  const { portfolio, initializeWallet, tokensHeld, refreshBalance } =
    useWalletManagement(showNotification);

  // Balance state management
  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const initWallet = async () => {
      try {
        await initializeWallet();
      } catch (err) {
        showNotification("Failed to initialize wallet", "error");
      }
    };

    initWallet();
  }, [initializeWallet, showNotification]);

  useEffect(() => {
    if (tokensHeld?.length > 0) {
      setBalance(tokensHeld[0].quantity);
    }
  }, [tokensHeld]);

  const serviceFee = 0.4;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (step < steps.length - 1) setStep(step + 1);
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  // File handling
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const files = Array.from(e.target.files || []);
      const maxSize = type === "video_ads" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      const invalidFiles = files.filter((file) => file.size > maxSize);

      if (invalidFiles.length > 0) {
        const sizeInMb = maxSize / (1024 * 1024);
        showNotification(
          `File size exceeds ${sizeInMb}MB limit. Please upload smaller files`,
          "error"
        );
        e.target.value = "";
        return;
      }
      setUploadedFiles((prev) => [...prev, ...files]);
      setFormData((prev) => ({ ...prev, media: files }));
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  }, []);

  //Get users current businessId
  const businessId = getDataFromLocalStorage("businessId");

  //MAKE API CALL TO upload campaign data
  const [createCampaign, { isLoading, reset }] = useSendDataMutation();
  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!formData.name || !formData.media.length) {
      throw new Error("Please fill in all required fields");
    }

    // API call simulation
    // Remove Empty Data
    const readyData = removeEmptyStrings(formData);
    const newFormData = new FormData();
    if (formData.media && formData.media.length > 0) {
      newFormData.append("media", formData.media[0]); // Since maxCount: 1
    }

    // Remove media from readyData since we're handling it separately
    const { media, ...bodyData } = readyData;
    // Append all other fields with proper type handling
    Object.entries(bodyData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          newFormData.append(key, JSON.stringify(value));
        } else {
          newFormData.append(key, String(value)); // Convert to string
        }
      }
    });

    const request: any = await createCampaign({
      url: `campaign/${businessId}`,
      data: newFormData,
      type: "POST",
    });

    if (request?.data) {
      const { data, message, status } = request?.data;
      // Reset form
      setFormData({
        name: "",
        adType: "display_ads",
        engagementGoal: "brand_awareness",
        pricingTier: pricingTiers,
        media: [],
        headline: "",
        content: "",
        cta: {
          text: "",
          url: "",
        },
        targetLocation: {
          enabled: false,
          country: "",
          city: "",
        },
        budget: pricingTiers.price,
        costPerReach: `${pricingTiers.pricePerThousand}/1000`,
        paymentMethod: "",
        transactionhash: "",
      });
      setSuccess(true);
      showNotification(message, "success");
      setIsSubmitting(false);
    } else {
      setError(
        request?.error?.data?.message
          ? request?.error?.data?.message
          : "Check Internet Connection and try again"
      );
      setIsSubmitting(false);
      showNotification(
        request?.error?.data?.message
          ? request?.error?.data?.message
          : "Check Internet Connection and try again",
        "error"
      );
    }
  };

  // Engagement type selection
  const handleEngagementSelect = useCallback(
    (type: "brand_awareness" | "website_traffic") => {
      setFormData((prev) => ({
        ...prev,
        engagementGoal: type,
      }));
    },
    []
  );

  // Step validation
  const canProceed = useCallback(() => {
    switch (step) {
      case 0: // Pricing confirmation
        return true;
      case 1: // Ad engagement selection
        return Boolean(formData.engagementGoal);
      case 2: // Ad type selection
        return formData.media.length > 0;
      case 3: // Campaign details
        return Boolean(formData.name && formData.cta.text && formData.cta.url);
      case 4: // Payment step
        return (
          formData.budget > 0 &&
          formData.budget >= formData.pricingTier.price &&
          formData.budget + serviceFee <= Number(balance)
        );
      case 5: // Final review
        return true;
      default:
        return true;
    }
  }, [step, formData, balance, serviceFee]);

  // Disable the modal if wallet is not initialized
  useEffect(() => {
    if (!portfolio && step > 0) {
      setStep(0);
      showNotification("Please wait for wallet initialization", "error");
    }
  }, [portfolio, step, showNotification]);

  // Step Components
  const PricingConfirmation = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Confirm Your Plan</h3>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-4 border border-gray-200">
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="text-4xl font-bold text-side mb-2">
            ${formData.pricingTier.price}
          </div>
          <div className="text-sm text-gray-600">
            {formData.pricingTier.impressions.toLocaleString()} Impressions
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Included Features:</h4>
          {formData.pricingTier.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center text-sm text-gray-600"
            >
              <Check className="w-5 h-5 text-green-500 mr-2 shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 italic">
            {formData.pricingTier.description}
          </div>
        </div>
      </div>
    </div>
  );

  const EngagementSelector = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">
        Choose Campaign Objective
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {engagementGoals.map((type) => (
          <div
            key={type.id}
            onClick={() => handleEngagementSelect(type.id as engagementGoal)}
            className={`
                bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6
                cursor-pointer transition-all duration-200 border
                ${
                  formData.engagementGoal === (type.id as engagementGoal)
                    ? "border-side ring-1 ring-side shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        formData.engagementGoal === (type.id as engagementGoal)
                          ? "bg-side/10 text-side"
                          : "bg-white text-gray-600"
                      }
                    `}
                  >
                    {type.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {type.title}
                    </h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                {formData.engagementGoal === type.id && (
                  <div className="h-6 w-6 bg-side/10 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-side" />
                  </div>
                )}
              </div>

              {/* Details (shown when selected) */}
              {formData.engagementGoal === type.id && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Key Features:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {type.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">
                        Performance Metrics:
                      </div>
                      <div className="text-sm text-gray-600">
                        {type.metrics}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Tips */}
      {formData.engagementGoal && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <h5 className="text-sm font-medium text-gray-900 mb-2">
            Campaign Tips
          </h5>
          <p className="text-sm text-gray-600">
            {formData.engagementGoal === "brand_awareness" &&
              "Brand awareness campaigns are perfect for reaching new audiences and increasing your brand's visibility. Focus on creating memorable, engaging content."}
            {formData.engagementGoal === "website_traffic" &&
              "Traffic campaigns are ideal when you want to drive visitors to your website. Ensure your landing pages are optimized for the best results."}
          </p>
        </div>
      )}
    </div>
  );

  const AdTypeSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Choose Ad Type</h3>
        <div className="text-sm text-gray-500">Step 2 of {steps.length}</div>
      </div>

      <div className="space-y-4">
        {[
          {
            id: "display_ads",
            icon: <Image className="w-6 h-6" />,
            title: "Display Ads",
            description: "Static images or animated banners",
            specs: {
              formats: "PNG, JPG, GIF",
              dimensions: "1200x628px",
              maxSize: "5MB",
            },
          },
          {
            id: "video_ads",
            icon: <Play className="w-6 h-6" />,
            title: "Video Ads",
            description: "Short-form video content",
            specs: {
              formats: "MP4, MOV",
              duration: "30 seconds",
              maxSize: "50MB",
            },
          },
        ].map((type) => (
          <div
            key={type.id}
            className={`p-4 rounded-xl border transition-all ${
              formData.adType === type.id
                ? "border-side bg-side/5"
                : "border-gray-200"
            }`}
          >
            <button
              onClick={() =>
                setFormData({ ...formData, adType: type.id as AdType })
              }
              className="flex items-start gap-4 w-full text-left"
            >
              <div
                className={`p-2 rounded-lg ${
                  formData.adType === type.id
                    ? "bg-side text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {type.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{type.title}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
              <motion.div
                initial={false}
                animate={{ rotate: formData.adType === type.id ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight
                  className={`w-5 h-5 ${
                    formData.adType === type.id ? "text-side" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </button>

            {formData.adType === type.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pl-14"
              >
                {/* Show specs and upload section only when no files are uploaded */}
                {uploadedFiles.length === 0 && (
                  <div className="space-y-4">
                    {/* Specifications */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Specifications:
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {Object.entries(type.specs).map(([key, value]) => (
                          <li key={key} className="flex items-center">
                            <span className="w-24 text-gray-500">{key}:</span>
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-side/50 transition-colors">
                      <input
                        type="file"
                        accept={
                          type.id === "display_ads" ? "image/*" : "video/*"
                        }
                        multiple={type.id === "display_ads"}
                        onChange={(e) => handleFileUpload(e, type.id)}
                        className="hidden"
                        id={`${type.id}-upload`}
                      />
                      <label
                        htmlFor={`${type.id}-upload`}
                        className="cursor-pointer block"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">
                          {type.id === "display_ads" ? (
                            <>
                              Drag and drop or click to upload images
                              <div className="text-xs text-gray-400 mt-1">
                                Accepted formats: PNG, JPG, GIF (max 5MB)
                              </div>
                            </>
                          ) : (
                            <>
                              Upload your video advertisement
                              <div className="text-xs text-gray-400 mt-1">
                                Max duration: 30 seconds, Max size: 50MB
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    {type.id === "display_ads" ? (
                      <div className="grid grid-cols-2 gap-4">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="rounded-lg w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                onClick={() => removeFile(index)}
                                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative group">
                        <video
                          controls
                          className="rounded-lg w-full"
                          src={URL.createObjectURL(uploadedFiles[0])}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => removeFile(0)}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const CampaignDetails = () => {
    // Local state for immediate input updates
    const [localInputs, setLocalInputs] = useState({
      name: formData.name,
      ctaText: formData.cta.text,
      ctaUrl: formData.cta.url,
    });

    // New state to track if form is saved
    const [isSaved, setIsSaved] = useState(false);

    const handleInputChange = (field: string, value: string) => {
      setLocalInputs((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSave = () => {
      // Update parent form state
      setFormData((prevData) => ({
        ...prevData,
        name: localInputs.name,
        cta: {
          text: localInputs.ctaText,
          url: localInputs.ctaUrl,
        },
      }));
      setIsSaved(true);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Campaign Details</h3>
          <div className="text-sm text-gray-500">Step 3 of {steps.length}</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={localInputs.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
              placeholder="Enter campaign name"
            />
            <div className="mt-1 text-xs text-gray-500">
              {localInputs.name.length}/50 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call to Action
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={localInputs.ctaText}
                  onChange={(e) => handleInputChange("ctaText", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                  placeholder="CTA Text (e.g., Learn More)"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {localInputs.ctaText.length}/20 characters
                </div>
              </div>
              <div>
                <input
                  type="url"
                  value={localInputs.ctaUrl}
                  onChange={(e) => handleInputChange("ctaUrl", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                  placeholder="https://your-website.com"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Where should users be directed?
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-2">
            {isSaved && (
              <span className="text-sm text-green-600">
                Changes saved successfully!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors"
            >
              Save Changes
            </button>
          </div>

          {/* Preview Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-lg font-medium text-gray-900 mb-2">
                {localInputs.name || "Campaign Name"}
              </div>
              {localInputs.ctaText && (
                <button className="px-4 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors">
                  {localInputs.ctaText}
                </button>
              )}
              {localInputs.ctaUrl && (
                <div className="mt-2 text-sm text-gray-500 truncate">
                  Links to: {localInputs.ctaUrl}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PaymentStep = () => {
    const [error, setError] = useState<string>("");
    const minimumRequired = formData.pricingTier.price;

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

        if (numericValue < minimumRequired) {
          const errorMessage = `Budget must be at least ${minimumRequired} SOL based on selected package`;
          setError(errorMessage);
          return false;
        }

        const totalCost = numericValue + serviceFee;
        if (totalCost > Number(balance)) {
          const difference = (totalCost - Number(balance)).toFixed(2);
          const errorMessage = `Insufficient balance. You need ${difference} SOL more`;
          setError(errorMessage);
          return false;
        }

        setError("");
        return true;
      },
      [balance, minimumRequired]
    );

    const handleBudgetChange = (value: string) => {
      setIsConfirmed(false);
      setFormData((prev) => ({
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

      if (formData.budget < 0) {
        showNotification("Please enter a valid amount", "error");
        return;
      }

      if (formData.budget < minimumRequired) {
        const errorMsg = `Budget must be at least ${minimumRequired} SOL based on selected package`;
        showNotification(errorMsg, "error");
        return;
      }

      const totalCost = formData.budget + serviceFee;
      if (totalCost > Number(balance)) {
        const difference = (totalCost - Number(balance)).toFixed(2);
        showNotification(
          `Insufficient balance. You need ${difference} SOL more`,
          "error"
        );
        return;
      }

      // we need to visit here again
      setIsConfirmed(true);
      showNotification("Budget confirmed successfully", "success");
    };

    const totalCost = formData.budget + serviceFee;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Begin Payment Process
          </h3>
          <div className="text-sm text-gray-500">Step 4 of {steps.length}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <label
                  htmlFor="campaign-budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Set Campaign Budget
                </label>
                <p
                  id="budget-description"
                  className="text-xs text-gray-500 mt-1"
                >
                  Minimum budget: {minimumRequired} SOL
                </p>
              </div>
              <button
                type="button"
                onClick={refreshBalance}
                className="flex items-center gap-1 text-xs text-side hover:text-side/90 transition-colors"
                aria-label="Refresh Balance"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Balance
              </button>
            </div>

            <div className="relative">
              <input
                id="campaign-budget"
                name="campaign-budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) => handleBudgetChange(e.target.value)}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent",
                  error ? "border-red-300" : "border-gray-200"
                )}
                placeholder={`Enter amount (min. ${minimumRequired})`}
                aria-label="Campaign Budget"
                aria-describedby="budget-description budget-error"
                aria-invalid={!!error}
              />
            </div>

            <div className="mt-1 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Available balance: {balance} SOL
              </div>
              {error && (
                <div
                  id="budget-error"
                  className="text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Selected Budget</span>
              <span className="font-bold text-xl text-side">
                {formData.budget.toFixed(2)} SOL
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Base Package Cost</span>
              <span>{minimumRequired} SOL</span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Service Fee</span>
              <span>{serviceFee.toFixed(2)} SOL</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total Cost</span>
              <span className="font-bold text-gray-900">
                {totalCost.toFixed(2)} SOL
              </span>
            </div>

            {formData.budget > 0 && formData.budget < minimumRequired && (
              <div
                className="mt-2 p-2 bg-amber-50 rounded-lg text-sm text-amber-600"
                role="alert"
              >
                Budget must be at least {minimumRequired} SOL for the selected
                package
              </div>
            )}

            {totalCost > Number(balance) && (
              <div
                className="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-600"
                role="alert"
              >
                Insufficient balance for total cost. Please add funds or reduce
                budget.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={
                !!error || !formData.budget || formData.budget < minimumRequired
              }
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors",
                error || !formData.budget || formData.budget < minimumRequired
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-side hover:bg-side/90"
              )}
              aria-disabled={
                !!error || !formData.budget || formData.budget < minimumRequired
              }
            >
              Confirm Budget
            </button>
          </div>

          {isConfirmed && (
            <div
              className="mt-2 text-center text-sm text-green-600"
              role="status"
            >
              Budget of {formData.budget.toFixed(2)} SOL confirmed
            </div>
          )}
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

  const FinalReview = () => {
    const estimatedImpressions =
      (formData.budget / formData.pricingTier.price) *
      formData.pricingTier.impressions;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Campaign Summary</h3>
          <div className="text-sm text-gray-500">Final Step</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="space-y-4">
            {[
              { label: "Campaign Name", value: formData.name },
              { label: "Ad Type", value: formData.adType },
              { label: "Engagement Type", value: formData.engagementGoal },
              {
                label: "Impressions per package",
                value: formData.pricingTier.impressions.toLocaleString(),
              },
              {
                label: "Estimated Impressions ",
                value: estimatedImpressions.toLocaleString(),
              },
              { label: "Budget", value: `${formData.budget} SOL` },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0"
              >
                <span className="text-gray-600 text-sm">{item.label}</span>
                <span className="font-medium capitalize">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Uploaded Content</h4>
            <div className="grid grid-cols-2 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Content ${index + 1}`}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="font-medium text-gray-900 mb-2">Call to Action</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-side text-white rounded-full">
                {formData.cta.text}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-blue-600">{formData.cta.url}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Steps configuration
  const steps = [
    { component: <PricingConfirmation /> },
    { component: <EngagementSelector /> },
    { component: <AdTypeSelection /> },
    { component: <CampaignDetails /> },
    { component: <PaymentStep /> },
    { component: <FinalReview /> },
  ];

  // Success component
  const SuccessState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Campaign Created Successfully!
      </h3>
      <p className="text-gray-600 mb-6">
        Your campaign has been submitted and is now being reviewed. You'll
        receive a confirmation email shortly.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors"
      >
        Close
      </button>
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
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Progress bar */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium text-gray-600">
                  Step {step + 1} of {steps.length}
                </div>
              </div>
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full flex-1 transition-colors ${
                      index <= step ? "bg-side" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
              {success ? (
                <SuccessState />
              ) : (
                <>
                  {/* Error state */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center text-red-600">
                        <Info className="w-5 h-5 mr-2" />
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Step content */}
                  {steps[step].component}
                </>
              )}
            </div>

            {/* Action buttons */}
            {!success && (
              <div className="p-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={handleBack}
                  className={`px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
                    step === 0 ? "invisible" : ""
                  }`}
                >
                  Back
                </button>

                <button
                  onClick={
                    step === steps.length - 1 ? handleSubmit : handleNext
                  }
                  disabled={isSubmitting || !canProceed()}
                  className={cn(
                    "flex items-center px-6 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors",
                    isSubmitting || !canProceed()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Creating Campaign...
                    </>
                  ) : step === steps.length - 1 ? (
                    "Create Campaign"
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CampaignModal;
