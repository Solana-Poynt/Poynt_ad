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
  ListChecks,
  FileText,
  Link,
} from "lucide-react";
import { PricingTier } from "@/types/campaign";
import { NotificationState } from "@/types/general";
import Notification from "./notification";
import useSolanaTokenBalances from "@/utils/hooks/useBalance";
// import { useSolanaTokenBalances } from "@/utils/hooks/useSolanaTokenBalances";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cn } from "@/lib/utils";
import { useSendDataMutation } from "@/store/api/api";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { isSolanaWallet } from "@dynamic-labs/solana-core";
import type { ISolana } from "@dynamic-labs/solana-core";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

// Types
interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingTiers: PricingTier;
}

interface CampaignFormData {
  name: string;
  adType: AdType;
  description: string;
  engagementGoal: engagementGoal;
  pricingTier: PricingTier;
  media: File | any;
  tasks: {
    social: string;
    engagement: string;
    websiteLink: string;
  };
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

// Task type definitions
const taskTypes = [
  {
    id: "social",
    name: "Social Media Task",
    description: "Engage with your brand on social platforms",
    icon: <Image className="w-5 h-5" />,
    placeholder: "Follow us on Twitter, Share our post, etc.",
  },
  {
    id: "engagement",
    name: "Product Engagement",
    description: "Drive users to product via specific actions",
    icon: <Link className="w-5 h-5" />,
    placeholder: "Comment on post, retweet post, etc",
  },
  {
    id: "websiteLink",
    name: "Custom Task",
    description:
      "Create your own engagement task that will deliver unique interaction",
    icon: <ListChecks className="w-5 h-5" />,
    placeholder:
      "Download our app, Visit our website, Sign up for newsletter, etc.",
  },
];

const CampaignModal = ({
  isOpen,
  onClose,
  pricingTiers,
}: CampaignModalProps) => {
  // Base state management
  const [step, setStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | any>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false);
  const [paymentSignature, setPaymentSignature] = useState<string>("");

  const [walletNotConnected, setwalletNotConnected] = useState<boolean>(false);

  // Dynamic context and Solana balance hook
  const { primaryWallet } = useDynamicContext();
  const { getSolBalance, isLoading: isBalanceLoading } =
    useSolanaTokenBalances();

  const solToken = getSolBalance();
  const balance: any = solToken?.balance;

  // Form data state
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    adType: "display_ads",
    description: "",
    engagementGoal: "brand_awareness",
    pricingTier: pricingTiers,
    media: "",
    tasks: {
      social: "",
      engagement: "",
      websiteLink: "",
    },
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

  // Refresh the balance when needed
  // const refreshBalance = useCallback(async () => {
  //   try {
  //     await refreshBalances();
  //     showNotification("Balance refreshed", "success");
  //   } catch (error) {
  //     console.error("Error refreshing balance:", error);
  //     showNotification("Failed to refresh balance", "error");
  //   }
  // }, [refreshBalances, showNotification]);

  const serviceFee = 0.4;

  const updatePaymentStatus = (status: boolean, signature: string) => {
    setPaymentConfirmed(status);
    setPaymentSignature(signature);
  };

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (step < steps.length - 1) setStep(step + 1);
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);
  // File handling
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const files: any = e.target.files;
      if (!files || files.length === 0) return;
      const maxSize = type === "video_ads" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (files.size > maxSize) {
        const sizeInMb = maxSize / (1024 * 1024);
        showNotification(
          `File size exceeds ${sizeInMb}MB limit. Please upload smaller files`,
          "error"
        );
        e.target.value = "";
        return;
      }

      setUploadedFile(files);
      setFormData((prev) => ({ ...prev, media: files }));
    },
    [showNotification]
  );

  const removeFile = useCallback(() => {
    setUploadedFile(undefined);

    setFormData((prev: any) => ({
      ...prev,
      media: undefined,
    }));
  }, []);

  // Get users current businessId
  const businessId = getDataFromLocalStorage("businessId");

  // MAKE API CALL TO upload campaign data
  const [createCampaign, { isLoading, reset }] = useSendDataMutation();

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!paymentConfirmed) {
      setError("Please complete payment before creating campaign");
      setIsSubmitting(false);
      return;
    }

    // Validation
    if (!formData.name || !formData.description) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Validate tasks
    if (
      !formData.tasks.social ||
      !formData.tasks.engagement ||
      !formData.tasks.websiteLink
    ) {
      setError("Please fill in all three tasks");
      setIsSubmitting(false);
      return;
    }

    try {
      const newFormData = new FormData();

      const mediaData: any = formData.media[0];

      console.log("Original-image:", mediaData);

      // Add the media file
      if (formData.media) {
        newFormData.append("media", mediaData);
      }

      // Add basic fields
      newFormData.append("name", formData.name);
      newFormData.append("description", formData.description);
      newFormData.append("adType", formData.adType);
      newFormData.append("engagementGoal", formData.engagementGoal);
      newFormData.append("budget", String(formData.budget));
      newFormData.append("costPerReach", formData.costPerReach);

      // Create a properly structured tasks object
      const tasksObject = {
        social: formData.tasks.social,
        interaction: formData.tasks.websiteLink,
        custom: formData.tasks.engagement,
      };

      // Convert to JSON string
      const tasksString = JSON.stringify(tasksObject);

      // Add tasks as JSON string
      newFormData.append("tasks", tasksString);

      // Similarly for other objects
      newFormData.append("cta", JSON.stringify(formData.cta));
      newFormData.append(
        "targetLocation",
        JSON.stringify(formData.targetLocation)
      );

      // Make the request
      const request: any = await createCampaign({
        url: `campaign/${businessId}`,
        data: newFormData,
        type: "POST",
      });

      if (request?.data) {
        const { data, message, status } = request?.data;
        // Reset form and show success
        setFormData({
          name: "",
          adType: "display_ads",
          description: "",
          engagementGoal: "brand_awareness",
          pricingTier: pricingTiers,
          media: undefined,
          tasks: {
            social: "",
            websiteLink: "",
            engagement: "",
          },
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
        });
        setSuccess(true);
        showNotification(message, "success");
        setIsSubmitting(false);
      } else {
        // Improved error logging
        console.error("API Error response:", request?.error);
        if (request?.error?.data) {
          console.error("Error details:", request.error.data);
        }

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
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit campaign");
      setIsSubmitting(false);
      showNotification("Failed to submit campaign", "error");
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

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: // Pricing confirmation
        return true;
      case 1: // Ad engagement selection
        return Boolean(formData.engagementGoal);
      case 2: // Ad type selection
        return Boolean(formData.media);
      case 3: // Campaign details
        return Boolean(
          formData.name &&
            formData.description &&
            formData.cta.text &&
            formData.cta.url
        );
      case 4: // Tasks step
        return Boolean(
          formData.tasks.websiteLink &&
            formData.tasks.engagement &&
            formData.tasks.social
        );
      case 5: // Payment step
        return (
          formData.budget > 0 &&
          formData.budget >= formData.pricingTier.price &&
          formData.budget + serviceFee <= Number(balance)
        );
      case 6:
        return Boolean(paymentConfirmed);
      default:
        return true;
    }
  }, [step, formData, balance, serviceFee, paymentConfirmed]);

  // Disable the modal if wallet is not connected
  useEffect(() => {
    if (!primaryWallet && step > 0) {
      setStep(0);
      setwalletNotConnected(true);
      showNotification("Please connect your wallet to continue", "error");
    }
  }, [primaryWallet, step, showNotification]);

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
        {walletNotConnected && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Wallet Connection Required
            </h3>
            <p className="text-gray-600 mb-6">
              To create a campaign, you need to connect or create a wallet
              first. This is required to pay for your campaign.
            </p>
            <div className="flex flex-col space-y-4 items-center">
              <a
                href="/business/wallet"
                className="px-6 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors"
              >
                Go to Wallet Page
              </a>
            </div>
          </div>
        )}
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
        <div className="text-sm text-gray-500">Step 2 of 7</div>
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
              type="button"
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
                {/* Show specs and upload section when no files are uploaded */}
                {!uploadedFile ? (
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
                ) : (
                  /* Content Preview */
                  <div className="space-y-4">
                    {type.id === "display_ads" &&
                    uploadedFile &&
                    (uploadedFile instanceof File
                      ? uploadedFile.type?.startsWith("image/")
                      : uploadedFile[0] &&
                        uploadedFile[0].type?.startsWith("image/")) ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative group">
                          <img
                            src={URL.createObjectURL(
                              uploadedFile instanceof File
                                ? uploadedFile
                                : uploadedFile[0]
                            )}
                            alt="Ad Preview"
                            className="rounded-lg w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeFile}
                              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : type.id === "video_ads" &&
                      uploadedFile &&
                      (uploadedFile instanceof File
                        ? uploadedFile.type?.startsWith("video/")
                        : uploadedFile[0] &&
                          uploadedFile[0].type?.startsWith("video/")) ? (
                      <div className="relative group">
                        <video
                          controls
                          className="rounded-lg w-full"
                          src={URL.createObjectURL(
                            uploadedFile instanceof File
                              ? uploadedFile
                              : uploadedFile[0]
                          )}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                        <div className="flex items-center">
                          <Info className="w-5 h-5 text-yellow-500 mr-2" />
                          <p className="text-sm text-yellow-700">
                            The uploaded file format doesn't match the selected
                            ad type. Please upload a
                            {type.id === "display_ads" ? "n image" : " video"}{" "}
                            file.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="mt-2 px-3 py-1 bg-white text-yellow-600 text-sm rounded border border-yellow-300 hover:bg-yellow-50"
                        >
                          Remove file and try again
                        </button>
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
      description: formData.description,
      ctaText: formData.cta.text,
      ctaUrl: formData.cta.url,
    });

    // New state to track if form is saved
    const [isSaved, setIsSaved] = useState(false);

    // Check wallet connection status
    const { primaryWallet } = useDynamicContext();
    const [walletNotConnected, setWalletNotConnected] = useState(false);

    // Check wallet connection on component mount and when primaryWallet changes
    useEffect(() => {
      setWalletNotConnected(!primaryWallet);
    }, [primaryWallet]);

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
        description: localInputs.description,
        cta: {
          text: localInputs.ctaText,
          url: localInputs.ctaUrl,
        },
      }));
      setIsSaved(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    };

    // Function to close the wallet modal and redirect
    const handleGoToWallet = () => {
      setWalletNotConnected(false);
      // Navigate to wallet page
      window.location.href = "/business/wallet";
    };

    // Function to close the wallet modal
    const handleCloseModal = () => {
      setWalletNotConnected(false);
    };

    return (
      <>
        {/* Wallet Connection Modal */}
        {walletNotConnected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Wallet Connection Required
                </h3>
                <p className="text-gray-600 mb-6">
                  To create a campaign, you need to connect or create a wallet
                  first. This is required to pay for your campaign.
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleGoToWallet}
                    className="w-full px-6 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors"
                  >
                    Go to Wallet Page
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Regular Campaign Details Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Campaign Details
            </h3>
            <div className="text-sm text-gray-500">Step 3 of 7</div>
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
                maxLength={50}
              />
              <div className="mt-1 text-xs text-gray-500">
                {localInputs.name.length}/50 characters
              </div>
            </div>

            {/* New Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Description
              </label>
              <textarea
                value={localInputs.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent resize-none"
                placeholder="Describe your ad campaign and what you're promoting"
                maxLength={200}
              />
              <div className="mt-1 text-xs text-gray-500">
                {localInputs.description.length}/200 characters
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
                    onChange={(e) =>
                      handleInputChange("ctaText", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                    placeholder="CTA Text (e.g., Learn More)"
                    maxLength={20}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {localInputs.ctaText.length}/20 characters
                  </div>
                </div>
                <div>
                  <input
                    type="url"
                    value={localInputs.ctaUrl}
                    onChange={(e) =>
                      handleInputChange("ctaUrl", e.target.value)
                    }
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
          </div>
        </div>
      </>
    );
  };
  // Tasks Component with improved input handling
  const TasksComponent = () => {
    const [localTasks, setLocalTasks] = useState<{
      social: string;
      engagement: string;
      websiteLink: string;
    }>(formData.tasks);

    // Update both local state and parent state when tasks change
    const handleLocalTaskUpdate = (
      taskType: keyof typeof localTasks,
      value: string
    ) => {
      const updatedTasks = {
        ...localTasks,
        [taskType]: value,
      };

      // Update local state
      setLocalTasks(updatedTasks);

      // Update parent state immediately
      setFormData((prev) => ({
        ...prev,
        tasks: updatedTasks,
      }));
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Configure User Tasks
          </h3>
          <div className="text-sm text-gray-500">Step 4 of 7</div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 shrink-0" />
            <p className="text-sm text-yellow-700">
              Create 3 tasks that users will complete to earn Poynts. Each
              campaign requires all three types of tasks.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {taskTypes.map((taskType) => (
            <div
              key={taskType.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-lg bg-side/10 flex items-center justify-center mr-3">
                  {taskType.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{taskType.name}</h4>
                  <p className="text-xs text-gray-500">
                    {taskType.description}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <input
                  type="text"
                  value={
                    localTasks[taskType.id as keyof typeof localTasks] || ""
                  }
                  onChange={(e) =>
                    handleLocalTaskUpdate(
                      taskType.id as keyof typeof localTasks,
                      e.target.value
                    )
                  }
                  placeholder={taskType.placeholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-side"
                />
                {!localTasks[
                  taskType.id as keyof typeof localTasks
                ]?.trim() && (
                  <p className="mt-1 text-xs text-red-500">
                    This task is required
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Tips for effective tasks:
          </h4>
          <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>Keep tasks simple and achievable</li>
            <li>Make sure tasks align with your campaign objective</li>
            <li>Create a natural progression between tasks</li>
            <li>Use clear, action-oriented language</li>
          </ul>
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

        // Get SOL balance
        const solToken = getSolBalance();
        const solBalance = solToken ? solToken.balance : 0;

        const totalCost = numericValue + serviceFee;
        if (totalCost > Number(solBalance)) {
          const difference = (totalCost - Number(solBalance)).toFixed(2);
          const errorMessage = `Insufficient balance. You need ${difference} SOL more`;
          setError(errorMessage);
          return false;
        }

        setError("");
        return true;
      },
      [getSolBalance, minimumRequired, serviceFee]
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
          <div className="text-sm text-gray-500">Step 5 of 7</div>
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
              {/* <button
                type="button"
                onClick={refreshBalance}
                className="flex items-center gap-1 text-xs text-side hover:text-side/90 transition-colors"
                aria-label="Refresh Balance"
                disabled={isBalanceLoading}
              >
                <RefreshCw
                  className={`w-3 h-3 ${
                    isBalanceLoading ? "animate-spin" : ""
                  }`}
                />
                {isBalanceLoading ? "Refreshing..." : "Refresh Balance"}
              </button> */}
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
              <div className="text-sm font-black text-gray-500">
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
      </div>
    );
  };
  const FinalReview = () => {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<string>("");
    const [localPaymentSignature, setLocalPaymentSignature] =
      useState<string>("");

    // Dynamic context for wallet access
    const { primaryWallet } = useDynamicContext();

    // Calculate estimated impressions
    const estimatedImpressions = Math.round(
      (formData.budget / formData.pricingTier.price) *
        formData.pricingTier.impressions
    );

    // Total payment amount including service fee
    const totalPaymentAmount = formData.budget + serviceFee;
    // Add this function to your FinalReview component

    const handlePayment = async () => {
      if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
        setPaymentError("Solana wallet not connected");
        showNotification("Solana wallet not connected", "error");
        return;
      }

      setIsProcessingPayment(true);
      setPaymentError("");

      try {
        // Get connection from wallet
        const connection = await primaryWallet.getConnection();
        const cluster = connection.rpcEndpoint.includes("devnet")
          ? "devnet"
          : "mainnet";

        // Define addresses
        const fromKey = new PublicKey(primaryWallet.address);
        const toKey = new PublicKey(
          "7LTeiD4Ndao8zaArUdrZmcWYRHa5q2PwMWFodzQx6JfA"
        ); // Your platform wallet

        // Amount in SOL (9 decimals)
        const amountInLamports = Math.floor(totalPaymentAmount * 1_000_000_000);

        console.log(
          `Sending ${totalPaymentAmount} SOL (${amountInLamports} lamports) to ${toKey.toString()}`
        );

        // Create transaction with transfer instruction
        const transferTransaction = new Transaction().add(
          web3.SystemProgram.transfer({
            fromPubkey: fromKey,
            toPubkey: toKey,
            lamports: amountInLamports,
          })
        );

        // Get recent blockhash
        const blockhash = await connection.getLatestBlockhash();
        transferTransaction.recentBlockhash = blockhash.blockhash;
        transferTransaction.feePayer = fromKey;

        // Get signer from wallet
        const signer = await primaryWallet.getSigner();

        console.log("Transaction created, requesting signature...");

        // Sign and send transaction
        await signer
          .signAndSendTransaction(transferTransaction)
          .then((value) => {
            console.log(
              `Transaction successful: https://solscan.io/tx/${value.signature}?cluster=${cluster}`
            );

            // Update local state
            setLocalPaymentSignature(value.signature);
            setPaymentComplete(true);

            // CRITICAL FIX: Update parent component state directly
            setPaymentConfirmed(true);
            setPaymentSignature(value.signature);

            showNotification("Payment successful!", "success");
          })
          .catch((error) => {
            console.error("Payment error:", error);
            setPaymentError(error.message || "Payment failed");
            showNotification(`Payment failed: ${error.message}`, "error");
          });
      } catch (error) {
        console.error("Payment setup error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown payment error";
        setPaymentError(errorMessage);
        showNotification(`Payment setup failed: ${errorMessage}`, "error");
      } finally {
        setIsProcessingPayment(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Campaign Summary</h3>
          <div className="text-sm text-gray-500">Final Step</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          {/* Campaign details as before */}
          <div className="space-y-4">
            {[
              { label: "Campaign Name", value: formData.name },
              { label: "Ad Type", value: formData.adType.replace("_", " ") },
              {
                label: "Engagement Type",
                value: formData.engagementGoal.replace("_", " "),
              },
              {
                label: "Impressions per package",
                value: formData.pricingTier.impressions.toLocaleString(),
              },
              {
                label: "Estimated Impressions",
                value: estimatedImpressions.toLocaleString(),
              },
              { label: "Budget", value: `${formData.budget.toFixed(2)} SOL` },
              { label: "Service Fee", value: `${serviceFee.toFixed(2)} SOL` },
              {
                label: "Total Cost",
                value: `${totalPaymentAmount.toFixed(2)} SOL`,
                isTotal: true,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center pb-4 border-b border-gray-200 last:border-0 ${
                  item.isTotal ? "font-bold" : ""
                }`}
              >
                <span className="text-gray-600 text-sm">{item.label}</span>
                <span className="font-medium capitalize">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Content sections remain the same */}
          {uploadedFile && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Uploaded Content
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative group">
                  {uploadedFile[0].type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(
                        uploadedFile instanceof File
                          ? uploadedFile
                          : uploadedFile[0]
                      )}
                      alt="Campaign content"
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(
                        uploadedFile instanceof File
                          ? uploadedFile
                          : uploadedFile[0]
                      )}
                      className="rounded-lg w-full h-32 object-cover"
                      controls
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                </div>
              </div>
            </div>
          )}

          {/* Ad Description Section */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="font-medium text-gray-900 mb-2">Ad Description</div>
            <p className="text-sm text-gray-600">
              {formData.description || "No description provided"}
            </p>
          </div>

          {/* User Tasks Section */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-4">User Tasks</h4>
            <div className="space-y-2">
              {Object.entries(formData.tasks).map(([key, value], index) => (
                <div
                  key={key}
                  className="p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-side/10 text-side rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm">
                      {value || `No ${key} task defined`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="font-medium text-gray-900 mb-2">Call to Action</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-side text-white rounded-full">
                {formData.cta.text || "Learn More"}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-blue-600">
                {formData.cta.url || "No URL provided"}
              </span>
            </div>
          </div>

          {/* Payment section - New addition */}
          <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Payment</h4>

            {paymentComplete ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <p className="text-green-700 font-medium">Payment Complete</p>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Transaction signature: {paymentSignature?.substring(0, 10)}...
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  To create your campaign, you'll need to pay{" "}
                  {totalPaymentAmount.toFixed(2)} SOL from your connected
                  wallet.
                </p>

                {paymentError && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                    <p className="text-red-600 text-sm">{paymentError}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                    isProcessingPayment
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-side text-white hover:bg-side/90"
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>Pay {totalPaymentAmount.toFixed(2)} SOL</>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Payment will be processed immediately and is non-refundable.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Steps configuration with Tasks step
  const steps = [
    { component: <PricingConfirmation /> },
    { component: <EngagementSelector /> },
    { component: <AdTypeSelection /> },
    { component: <CampaignDetails /> },
    { component: <TasksComponent /> },
    { component: <PaymentStep /> },
    {
      component: <FinalReview/>,
    },
  ];

  // Updated Success component
  const SuccessState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Campaign Created Successfully!
      </h3>
      <p className="text-gray-600 mb-6">
        Your campaign has been submitted and is now being reviewed. Your ad will
        be shown to users who can complete your specified tasks to earn Poynts.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors"
      >
        View My Campaigns
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
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6s">
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
              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-between flex-shrink-0">
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
    </AnimatePresence>
  );
};

export default CampaignModal;
