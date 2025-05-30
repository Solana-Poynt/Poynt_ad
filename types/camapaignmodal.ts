// Shared types for Campaign Modal components

export interface LoyaltyTier {
  name: string;
  xpRequired: number;
  rewards: string[];
}

export interface PointsPerAction {
  [key: string]: number;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  organizationName: string;
  tiers: LoyaltyTier[];
  pointsPerAction: PointsPerAction;
  collectionAddress?: string;
  isActive: boolean;
}

export interface CampaignFormData {
  name: string;
  adType: AdType;
  description: string;
  engagementGoal: engagementGoal;
  pricingTier: any; // Replace with actual PricingTier type
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
}

export type AdType = "display_ads" | "video_ads";
export type engagementGoal = "brand_awareness" | "website_traffic";

// Common props interface for step components
export interface BaseStepProps {
  formData: CampaignFormData;
  setFormData: (data: any) => void;
  showNotification: (message: string, status: "success" | "error") => void;
  uploadedFile?: File | any;
  setUploadedFile?: (file: File | any) => void;
  handleFileUpload?: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  removeFile?: () => void;
  usdcBalance: number;
  refreshBalances: () => Promise<void>;
  isConfirmed?: boolean;
  setIsConfirmed?: (confirmed: boolean) => void;
  paymentConfirmed?: boolean;
  setPaymentConfirmed?: (confirmed: boolean) => void;
  paymentSignature?: string;
  setPaymentSignature?: (signature: string) => void;
  walletNotConnected?: boolean;
  existingLoyaltyProgram?: LoyaltyProgram | null;
  setExistingLoyaltyProgram?: (program: LoyaltyProgram | null) => void;
  hasLoyaltyProgram?: boolean;
  setHasLoyaltyProgram?: (hasProgram: boolean) => void;
  loyaltyHook?: any;
  usdcToken?: any;
  primaryWallet?: any;
  onClose: () => void;
}
