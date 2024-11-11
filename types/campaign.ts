// types/campaign.ts

// Core Types
export type AdType = "display" | "video" | "native";
export type EngagementType = "awareness" | "traffic" | "conversion";
export type CTAType = "button" | "link" | "banner";

// Base Interfaces
export interface PricingTier {
  id: string;
  impressions: number;
  price: number;
  recommended?: boolean;
  features?: string[];
  pricePerThousand: number; // Cost per 1000 impressions (CPM)
  description?: string;
}

export interface GeolocationData {
  enabled: boolean;
  country?: string;
  city?: string;
  radius?: number; // in kilometers
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CTAData {
  text: string;
  url: string;
  type?: CTAType;
  color?: string;
  icon?: string;
}

// Campaign Related Interfaces
export interface CampaignType {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  features?: string[];
  bestFor?: string[];
  restrictions?: string[];
}

export interface CampaignFormData {
  id?: string;
  name: string;
  type: AdType;
  engagementType: EngagementType;
  pricingTier: PricingTier;
  cta: CTAData;
  geolocation: GeolocationData;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  targetAudience?: {
    age?: {
      min: number;
      max: number;
    };
    gender?: string[];
    interests?: string[];
    demographics?: string[];
  };
  status?: "draft" | "pending" | "active" | "paused" | "completed" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
  analytics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number; // Click-through rate
    spent: number;
  };
}

// Component Props Interfaces
export interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingTiers: PricingTier[];
  initialData?: Partial<CampaignFormData>;
  onSubmit?: (data: CampaignFormData) => Promise<void>;
}

// Constants
export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    id: "tier-1",
    impressions: 1000,
    price: 5,
    pricePerThousand: 5,
    features: ["Basic analytics", "Manual bidding"],
    description: "Perfect for testing campaigns",
  },
  {
    id: "tier-2",
    impressions: 3000,
    price: 13.5,
    pricePerThousand: 4.5,
    recommended: true,
    features: ["Advanced analytics", "Auto-optimization", "Priority support"],
    description: "Most popular for small businesses",
  },
  {
    id: "tier-3",
    impressions: 5000,
    price: 20,
    pricePerThousand: 4,
    features: [
      "Advanced analytics",
      "Auto-optimization",
      "Priority support",
      "Custom reporting",
    ],
    description: "Ideal for growing businesses",
  },
  {
    id: "tier-4",
    impressions: 10000,
    price: 35,
    pricePerThousand: 3.5,
    features: [
      "Advanced analytics",
      "Auto-optimization",
      "Priority support",
      "Custom reporting",
      "Dedicated account manager",
    ],
    description: "Best value for scale",
  },
];

// Helper Functions
export const calculateCampaignMetrics = (campaign: CampaignFormData) => {
  const { pricingTier } = campaign;
  return {
    dailyBudget: pricingTier.price / 30, // Assuming 30-day campaign
    estimatedReach: pricingTier.impressions * 0.8, // Conservative estimate
    estimatedClicks: pricingTier.impressions * 0.02, // Assuming 2% CTR
  };
};

export const validateCampaignForm = (
  data: Partial<CampaignFormData>
): string[] => {
  const errors: string[] = [];

  if (!data.name) errors.push("Campaign name is required");
  if (!data.type) errors.push("Ad type is required");
  if (!data.engagementType) errors.push("Engagement type is required");
  if (!data.pricingTier) errors.push("Pricing tier is required");
  if (!data.cta?.url) errors.push("CTA URL is required");

  return errors;
};

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  idtoken: string;
  email_verified: boolean;
  sub: string; // Google's user ID
}
