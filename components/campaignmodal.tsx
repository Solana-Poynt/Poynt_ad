"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Loader, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { PricingTier } from "@/types/campaign";
import { NotificationState } from "@/types/general";
import Notification from "./Notification";
import useSolanaTokenBalances from "@/utils/hooks/balance";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { cn } from "@/lib/utils";
import { useSendDataMutation } from "@/store/api/api";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import useLoyalty from "@/utils/hooks/useLoyalty";

// Import step components
import PricingConfirmation from "./campaignmodal/PriceConfirmation";
import EngagementSelector from "./campaignmodal/EngagementSelector";
import LoyaltyProgramStep from "./campaignmodal/LoyaltyProgramStep";
import AdTypeSelection from "./campaignmodal/AdTypeSelection";
import CampaignDetails from "./campaignmodal/CampaignDetails";
import TasksComponent from "./campaignmodal/TasksComponent";
import PaymentStep from "./campaignmodal/PaymentStep";
import FinalReview from "./campaignmodal/FinalReview";
import SuccessState from "./campaignmodal/SuccessState";

// Types
interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingTiers: PricingTier;
}

interface LoyaltyTier {
  name: string;
  xpRequired: number;
  rewards: string[];
}

interface PointsPerAction {
  [key: string]: number;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  organizationName: string;
  tiers: LoyaltyTier[];
  pointsPerAction: PointsPerAction;
  collectionAddress?: string;
  isActive: boolean;
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
  selectedLoyaltyProgram?: LoyaltyProgram;
  transactionhash?: string;
}

type AdType = "display_ads" | "video_ads";
type engagementGoal = "brand_awareness" | "website_traffic";

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

  // Loyalty system state
  const [existingLoyaltyProgram, setExistingLoyaltyProgram] =
    useState<LoyaltyProgram | null>(null);
  const [hasLoyaltyProgram, setHasLoyaltyProgram] = useState(false);

  // Hooks
  const { primaryWallet } = useDynamicContext();
  const { getUsdcBalance, refreshBalances } = useSolanaTokenBalances();
  const { getProgramData } = useLoyalty();
  const [createCampaign] = useSendDataMutation();

  const usdcToken = getUsdcBalance();
  const usdcBalance: number = usdcToken?.balance || 0;

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
    selectedLoyaltyProgram: undefined,
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

  // Check for existing loyalty program on mount
  useEffect(() => {
    const checkExistingLoyaltyProgram = async () => {
      const programId = getDataFromLocalStorage("loyaltyProgramId");
      try {
        if (!programId) {
          setHasLoyaltyProgram(false);
          return;
        }

        const programData = await getProgramData(programId);
        if (programData) {
          setExistingLoyaltyProgram(programData);
          setHasLoyaltyProgram(true);
          setFormData((prev) => ({
            ...prev,
            selectedLoyaltyProgram: programData,
          }));
        } else {
          setHasLoyaltyProgram(false);
        }
      } catch (error) {
        console.error("Error checking loyalty program:", error);
      }
    };

    if (isOpen) {
      checkExistingLoyaltyProgram();
    }
  }, [isOpen, getProgramData]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (step < steps.length - 1) setStep(step + 1);
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  // File handling
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
      const files: any = e.target.files;
      if (!files || files.length === 0) return;

      const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
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

    if (
      !formData.tasks.social ||
      !formData.tasks.engagement ||
      !formData.tasks.websiteLink
    ) {
      setError("Please fill in all three tasks");
      setIsSubmitting(false);
      return;
    }

    if (!formData.selectedLoyaltyProgram) {
      setError("Please select a loyalty program");
      setIsSubmitting(false);
      return;
    }

    // Ensure paymentSignature is available
    if (!paymentSignature) {
      setError("Payment signature is missing. Please retry payment.");
      setIsSubmitting(false);
      return;
    }

    try {
      const businessId = getDataFromLocalStorage("businessId");

      // First update formData with the transaction hash
      const updatedFormData = {
        ...formData,
        transactionhash: paymentSignature,
      };

      const newFormData = new FormData();
      const mediaData: any = updatedFormData.media[0];

      // Add the media file
      if (updatedFormData.media) {
        newFormData.append("media", mediaData);
      }

      // Add basic fields
      newFormData.append("name", updatedFormData.name);
      newFormData.append("description", updatedFormData.description);
      newFormData.append("adType", updatedFormData.adType);
      newFormData.append("engagementGoal", updatedFormData.engagementGoal);
      newFormData.append("budget", String(updatedFormData.budget));
      newFormData.append("costPerReach", updatedFormData.costPerReach);

      // FIXED: Ensure transaction hash is properly appended
      newFormData.append(
        "transactionhash",
        updatedFormData.transactionhash || ""
      );

      // Add loyalty program information
      newFormData.append(
        "loyaltyProgramId",
        updatedFormData.selectedLoyaltyProgram!.id
      );
      newFormData.append(
        "loyaltyCollectionAddress",
        updatedFormData.selectedLoyaltyProgram!.collectionAddress || ""
      );

      // Create tasks object
      const tasksObject = {
        social: updatedFormData.tasks.social,
        interaction: updatedFormData.tasks.websiteLink,
        custom: updatedFormData.tasks.engagement,
      };

      newFormData.append("tasks", JSON.stringify(tasksObject));
      newFormData.append("cta", JSON.stringify(updatedFormData.cta));
      newFormData.append(
        "targetLocation",
        JSON.stringify(updatedFormData.targetLocation)
      );

      // Debug: Log what we're sending
      console.log("Sending transaction hash:", updatedFormData.transactionhash);
      console.log("Payment signature:", paymentSignature);

      // Make the request
      const request: any = await createCampaign({
        url: `campaign/${businessId}`,
        data: newFormData,
        type: "POST",
      });

      if (request?.data) {
        setSuccess(true);
        showNotification(request.data.message, "success");
        await refreshBalances();

        // Update the form data state with the final values
        setFormData(updatedFormData);
      } else {
        setError(
          request?.error?.data?.message ||
            "Check Internet Connection and try again"
        );
        showNotification(
          request?.error?.data?.message ||
            "Check Internet Connection and try again",
          "error"
        );
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit campaign");
      showNotification("Failed to submit campaign", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.budget <= usdcBalance;
      case 1:
        return Boolean(formData.engagementGoal);
      case 2:
        return Boolean(formData.selectedLoyaltyProgram);
      case 3:
        return Boolean(formData.media);
      case 4:
        return Boolean(
          formData.name &&
            formData.description &&
            formData.cta.text &&
            formData.cta.url
        );
      case 5:
        return Boolean(
          formData.tasks.websiteLink &&
            formData.tasks.engagement &&
            formData.tasks.social
        );
      case 6:
        return (
          formData.budget > 0 &&
          formData.budget >= formData.pricingTier.price &&
          formData.budget <= usdcBalance
        );
      case 7:
        return Boolean(paymentConfirmed && paymentSignature);
      default:
        return true;
    }
  }, [step, formData, usdcBalance, paymentConfirmed, paymentSignature]);

  // Disable the modal if wallet is not connected
  useEffect(() => {
    if (!primaryWallet && step > 0) {
      setStep(0);
      setwalletNotConnected(true);
      showNotification("Please connect your wallet to continue", "error");
    }
  }, [primaryWallet, step, showNotification]);

  // Common props for step components
  const stepProps = {
    formData,
    setFormData,
    showNotification,
    uploadedFile,
    setUploadedFile,
    handleFileUpload,
    removeFile,
    usdcBalance,
    refreshBalances,
    isConfirmed,
    setIsConfirmed,
    paymentConfirmed,
    setPaymentConfirmed,
    paymentSignature,
    setPaymentSignature,
    walletNotConnected,
    existingLoyaltyProgram,
    setExistingLoyaltyProgram,
    hasLoyaltyProgram,
    setHasLoyaltyProgram,
    usdcToken,
    primaryWallet,
    onClose,
  };

  // Steps configuration
  const steps = [
    {
      component: (
        <PricingConfirmation key="pricing-confirmation" {...stepProps} />
      ),
    },
    {
      component: (
        <EngagementSelector key="engagement-selector" {...stepProps} />
      ),
    },
    {
      component: (
        <LoyaltyProgramStep key="loyalty-program-step" {...stepProps} />
      ),
    },
    { component: <AdTypeSelection key="ad-type-selection" {...stepProps} /> },
    { component: <CampaignDetails key="campaign-details" {...stepProps} /> },
    { component: <TasksComponent key="tasks-component" {...stepProps} /> },
    { component: <PaymentStep key="payment-step" {...stepProps} /> },
    { component: <FinalReview key="final-review" {...stepProps} /> },
  ];

  return (
    <>
      {/* ✅ Main modal AnimatePresence */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              key="campaign-modal"
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
                      key={`progress-${index}`}
                      className={`h-1 rounded-full flex-1 transition-colors ${
                        index <= step ? "bg-side" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ✅ Fixed scrollable content - NO nested AnimatePresence */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {success ? (
                  <SuccessState key="success-state" {...stepProps} />
                ) : (
                  <div key={`step-container-${step}`}>
                    {/* ✅ Error message with unique key */}
                    {error && (
                      <div
                        key={`error-${error.substring(0, 10)}`}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center text-red-600">
                          <Info className="w-5 h-5 mr-2" />
                          {error}
                        </div>
                      </div>
                    )}

                    {/* ✅ Step content with unique key */}
                    <div key={`step-content-${step}`}>
                      {steps[step].component}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {!success && (
                <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-between flex-shrink-0">
                  <button
                    onClick={handleBack}
                    className={`flex items-center gap-2 px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
                      step === 0 ? "invisible" : ""
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <button
                    onClick={
                      step === steps.length - 1 ? handleSubmit : handleNext
                    }
                    disabled={isSubmitting || !canProceed()}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors font-medium",
                      isSubmitting || !canProceed()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Creating Campaign...
                      </>
                    ) : step === steps.length - 1 ? (
                      <>
                        <Check className="w-4 h-4" />
                        Create Campaign
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✅ Separate AnimatePresence for notifications */}
      <AnimatePresence mode="wait">
        {notification.show && (
          <Notification
            key={`notification-${notification.message.substring(0, 10)}`}
            message={notification.message}
            status={notification.status}
            switchShowOff={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CampaignModal;
