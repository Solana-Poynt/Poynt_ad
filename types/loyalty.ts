// Base tier interface for business loyalty programs
interface BusinessLoyaltyTier {
  name: string;
  campaignsRequired: number;
  rewards: string[];
}

// Generated tier interface (includes calculated XP)
interface GeneratedLoyaltyTier extends BusinessLoyaltyTier {
  xpRequired: number; // Calculated as campaignsRequired * 40
}

// // Points per action interface for business programs
// interface BusinessPointsPerAction {
//   campaign_completion: number; // Fixed at 40 points
// }

// Main business loyalty template interface
interface BusinessLoyaltyTemplate {
  baseTiers: BusinessLoyaltyTier[];
  pointsPerAction: Record<string, number>;
  generateTiers?: (customRequirements?: number[]) => GeneratedLoyaltyTier[];
}

// Protocol tier interface (more comprehensive)
interface ProtocolLoyaltyTier {
  name: string;
  xpRequired: number;
  rewards: string[];
}

// Protocol points per action interface (multiple actions)
// interface ProtocolPointsPerAction {
//   // Campaign Activities
//   campaign_completion: number;
//   campaign_streak_3: number;
//   campaign_streak_7: number;
//   daily_ad_view: number;
//   daily_task_completion: number;

//   // Social Activities
//   social_share: number;
//   app_review: number;
//   feedback_submission: number;

//   // Milestone Bonuses
//   weekly_active: number;
//   monthly_active: number;
//   campaign_master_10: number;
//   campaign_master_50: number;
//   campaign_master_100: number;
// }

// Protocol loyalty template interface
interface ProtocolLoyaltyTemplate {
  tiers: ProtocolLoyaltyTier[];
  pointsPerAction: Record<string, number>;
}

// Loyalty templates collection interface
interface LoyaltyTemplates {
  BUSINESS_DEFAULT: BusinessLoyaltyTemplate;
  PROTOCOL_DEFAULT: ProtocolLoyaltyTemplate;
}

// Hook parameters interfaces
interface CreateBusinessProgramParams {
  loyaltyProgramName: string;
  organizationName: string;
  brandColor?: string;
  metadataUri?: string;
  customTierRequirements?: number[];
}

interface CreateProtocolProgramParams {
  loyaltyProgramName: string;
  organizationName: string;
  brandColor?: string;
  metadataUri?: string;
}

// Update loyalty program parameters interface
interface UpdateLoyaltyProgramParams {
  collectionAddress: string;
  newPointsPerAction?: Record<string, number>;
  newTiers?: BusinessLoyaltyTier[] | ProtocolLoyaltyTier[];
}

// Issue loyalty pass parameters interface
interface IssueLoyaltyPassParams {
  collectionAddress: string;
  recipient: string;
  passName: string;
  passMetadataUri: string;
}

// Points transaction parameters interface (for revoke/gift operations)
interface PointsTransactionParams {
  passAddress: string;
  points: number;
  reason?: string;
}

// Batch pass recipient interface (for batch operations)
interface BatchPassRecipient {
  address: string;
  passName: string;
  passMetadataUri: string;
}

// Program data interfaces
interface BusinessProgramData extends CreateBusinessProgramParams {
  tiers: GeneratedLoyaltyTier[];
  pointsPerAction: Record<string, number>;
  collectionAddress?: string;
  isActive?: boolean;
  id?: string;
}

interface ProtocolProgramData extends CreateProtocolProgramParams {
  tiers: ProtocolLoyaltyTier[];
  pointsPerAction: Record<string, number>;
  collectionAddress?: string;
  isActive?: boolean;
  id?: string;
}

// API request interfaces
interface LoyaltyProgramData {
  loyaltyProgramName: string;
  organizationName: string;
  brandColor?: string;
  metadataUri?: string;
  customTierRequirements?: number[];
  tiers?: ProtocolLoyaltyTier[];
  pointsPerAction?: Record<string, number>;
}

interface LoyaltyRequest {
  type: string;
  programData?: LoyaltyProgramData;
  collectionAddress?: string;
  passAddress?: string;
  recipient?: string;
  passName?: string;
  passMetadataUri?: string;
  passAddresses?: string[];
  recipients?: BatchPassRecipient[];
  points?: number;
  action?: string;
  multiplier?: number;
  reason?: string;
  newPointsPerAction?: Record<string, number>;
  newTiers?: BusinessLoyaltyTier[] | ProtocolLoyaltyTier[];
  loyaltyProgram?: string;
  signer: string;
}

// Hook return type interface
interface UseLoyaltyReturn {
  // State
  isLoading: boolean;
  error: string | null;

  // Business Functions
  createBusinessProgram: (params: CreateBusinessProgramParams) => Promise<any>;
  awardBusinessCampaignPoints: (passAddress: string) => Promise<any>;

  // Protocol Functions
  createProtocolProgram: (params: CreateProtocolProgramParams) => Promise<any>;
  awardProtocolPoints: (
    passAddress: string,
    action: keyof Record<string, number>,
    multiplier?: number
  ) => Promise<any>;

  // Admin Functions
  updateProgram: (params: UpdateLoyaltyProgramParams) => Promise<any>;
  issuePass: (params: IssueLoyaltyPassParams) => Promise<any>;
  awardPoints: (
    passAddress: string,
    action: string,
    multiplier?: number
  ) => Promise<any>;
  revokePoints: (params: PointsTransactionParams) => Promise<any>;
  giftPoints: (params: PointsTransactionParams) => Promise<any>;

  // Batch Operations
  batchAwardPoints: (
    passAddresses: string[],
    action: string,
    multiplier?: number
  ) => Promise<any>;
  batchIssuePasses: (
    collectionAddress: string,
    recipients: BatchPassRecipient[]
  ) => Promise<any>;

  // Data Retrieval
  getPassData: (passAddress: string) => Promise<any>;
  getProgramData: (collectionAddress?: string) => Promise<any>;

  // Utility Functions
  initializeContext: () => Promise<void>;
  getDefaultBusinessTierRequirements: () => number[];
  previewBusinessTiers: (
    customRequirements: number[]
  ) => GeneratedLoyaltyTier[];
  getAvailableProtocolActions: () => string[];

  // Templates
  businessTemplate: BusinessLoyaltyTemplate;
  protocolTemplate: ProtocolLoyaltyTemplate;
}

// Template implementations with type checking
const BUSINESS_LOYALTY_TEMPLATE: BusinessLoyaltyTemplate = {
  baseTiers: [
    { name: "Explorers", campaignsRequired: 40, rewards: ["T1"] },
    {
      name: "Achievers",
      campaignsRequired: 200,
      rewards: ["T2"],
    },
    { name: "Elites", campaignsRequired: 400, rewards: ["T3"] },
    { name: "Champions", campaignsRequired: 700, rewards: ["T4"] },
  ],
  pointsPerAction: {
    campaign_completion: 40,
  },
  generateTiers: (customRequirements?: number[]) => {
    const requirements =
      customRequirements ||
      BUSINESS_LOYALTY_TEMPLATE.baseTiers.map((t) => t.campaignsRequired);
    return BUSINESS_LOYALTY_TEMPLATE.baseTiers.map((tier, index) => ({
      ...tier,
      campaignsRequired: requirements[index],
      xpRequired: requirements[index] * 40,
    }));
  },
};

const PROTOCOL_LOYALTY_TEMPLATE: ProtocolLoyaltyTemplate = {
  tiers: [
    {
      name: "Newcomer",
      xpRequired: 0,
      rewards: ["Welcome bonus", "Basic features"],
    },
    {
      name: "Explorer",
      xpRequired: 200,
      rewards: ["5% platform discount", "Priority support"],
    },
    {
      name: "Achiever",
      xpRequired: 500,
      rewards: ["10% platform discount", "Exclusive campaigns"],
    },
    {
      name: "Elite",
      xpRequired: 1000,
      rewards: ["15% platform discount", "Early access features"],
    },
    {
      name: "Master",
      xpRequired: 2000,
      rewards: ["20% platform discount", "VIP support", "Beta features"],
    },
    {
      name: "Legend",
      xpRequired: 3500,
      rewards: ["25% platform discount", "Premium support", "Custom features"],
    },
    {
      name: "Titan",
      xpRequired: 5000,
      rewards: [
        "30% platform discount",
        "White-glove support",
        "First access to new products",
      ],
    },
    {
      name: "Apex",
      xpRequired: 7500,
      rewards: [
        "35% platform discount",
        "Direct team access",
        "Co-creation opportunities",
      ],
    },
    {
      name: "Infinity",
      xpRequired: 10000,
      rewards: ["40% platform discount", "Executive access", "Revenue sharing"],
    },
  ],
  pointsPerAction: {
    // Campaign Activities
    campaign_completion: 6,
    campaign_streak_3: 20,
    campaign_streak_7: 50,
    daily_ad_view: 4,
    daily_task_completion: 6,

    // Social Activities
    social_share: 10,
    app_review: 40,
    feedback_submission: 20,

    // Milestone Bonuses
    weekly_active: 20,
    monthly_active: 35,
    campaign_master_10: 50,
    campaign_master_50: 75,
    campaign_master_100: 100,
  },
};

// Loyalty templates collection
const LOYALTY_TEMPLATES: LoyaltyTemplates = {
  BUSINESS_DEFAULT: BUSINESS_LOYALTY_TEMPLATE,
  PROTOCOL_DEFAULT: PROTOCOL_LOYALTY_TEMPLATE,
};

// Export all interfaces and types
export type {
  BusinessLoyaltyTier,
  GeneratedLoyaltyTier,
  BusinessLoyaltyTemplate,
  ProtocolLoyaltyTier,
  ProtocolLoyaltyTemplate,
  LoyaltyTemplates,
  CreateBusinessProgramParams,
  CreateProtocolProgramParams,
  UpdateLoyaltyProgramParams,
  IssueLoyaltyPassParams,
  PointsTransactionParams,
  BatchPassRecipient,
  BusinessProgramData,
  ProtocolProgramData,
  LoyaltyProgramData,
  LoyaltyRequest,
  UseLoyaltyReturn,
};

// Export template implementations
export {
  BUSINESS_LOYALTY_TEMPLATE,
  PROTOCOL_LOYALTY_TEMPLATE,
  LOYALTY_TEMPLATES,
};
