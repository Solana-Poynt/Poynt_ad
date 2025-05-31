import { useState } from "react";
import {
  Trophy,
  Check,
  Info,
  Plus,
  Award,
  Loader,
  X,
  HelpCircle,
  Users,
  Target,
  Gift,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessLoyaltyTier } from "@/types/loyalty";
import useLoyalty from "@/utils/hooks/useLoyalty";
import { saveDataToLocalStorage } from "@/utils/localStorage";
import { CreateLoyaltyProgramInstructionResult } from "@verxioprotocol/core";

interface LoyaltyProgramStepProps {
  formData: any;
  setFormData: (data: any) => void;
  showNotification: (message: string, status: "success" | "error") => void;
  existingLoyaltyProgram: any;
  setExistingLoyaltyProgram: (program: any) => void;
  hasLoyaltyProgram: boolean;
  setHasLoyaltyProgram: (hasProgram: boolean) => void;
}

const LoyaltyProgramStep = ({
  formData,
  setFormData,
  showNotification,
  existingLoyaltyProgram,
  setExistingLoyaltyProgram,
  hasLoyaltyProgram,
  setHasLoyaltyProgram,
}: LoyaltyProgramStepProps) => {
  const [isCreatingLoyalty, setIsCreatingLoyalty] = useState(false);
  const [showCustomTiers, setShowCustomTiers] = useState(true);
  const [loyaltyFormData, setLoyaltyFormData] = useState({
    loyaltyProgramName: "",
    organizationName: "",
    brandColor: "#8B1212",
    useCustomTiers: false,
    customTierRequirements: [40, 200, 400, 700],
  });
  const {
    createBusinessProgram,
    error: loyaltyError,
    getDefaultBusinessTierRequirements,
    previewBusinessTiers,
    businessTemplate,
  } = useLoyalty();

  // Generate campaign options (0 to 1000)
  const campaignOptions = Array.from({ length: 201 }, (_, i) => i * 5).filter(
    (n) => n <= 1000
  );

  const handleTierRequirementChange = (
    tierIndex: number,
    campaigns: number
  ) => {
    const newRequirements = [...loyaltyFormData.customTierRequirements];
    newRequirements[tierIndex] = campaigns;

    // Ensure requirements are in ascending order
    for (let i = tierIndex + 1; i < newRequirements.length; i++) {
      if (newRequirements[i] < campaigns) {
        newRequirements[i] = campaigns;
      }
    }

    setLoyaltyFormData((prev) => ({
      ...prev,
      customTierRequirements: newRequirements,
    }));
  };

  const resetToDefaults = () => {
    setLoyaltyFormData((prev) => ({
      ...prev,
      customTierRequirements: getDefaultBusinessTierRequirements(),
      useCustomTiers: false,
    }));
    setShowCustomTiers(false);
  };

  const handleCreateLoyaltyProgram = async () => {
    if (
      !loyaltyFormData.loyaltyProgramName ||
      !loyaltyFormData.organizationName
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // Validate tier requirements if using custom tiers
    if (loyaltyFormData.useCustomTiers) {
      for (let i = 1; i < loyaltyFormData.customTierRequirements.length; i++) {
        if (
          loyaltyFormData.customTierRequirements[i] <
          loyaltyFormData.customTierRequirements[i - 1]
        ) {
          showNotification(
            "Tier requirements must be in ascending order",
            "error"
          );
          return;
        }
      }
    }

    setIsCreatingLoyalty(true);
    try {
      const programData = {
        loyaltyProgramName: loyaltyFormData.loyaltyProgramName,
        organizationName: loyaltyFormData.organizationName,
        brandColor: loyaltyFormData.brandColor,
        ...(loyaltyFormData.useCustomTiers && {
          customTierRequirements: loyaltyFormData.customTierRequirements,
        }),
      };

      const result: CreateLoyaltyProgramInstructionResult =
        await createBusinessProgram(programData);

      if (result) {
        // console.log("Loyalty program created:", result);
        const tierRequirements = loyaltyFormData.useCustomTiers
          ? loyaltyFormData.customTierRequirements
          : getDefaultBusinessTierRequirements();

        const generatedTiers = previewBusinessTiers(tierRequirements);

        saveDataToLocalStorage("loyaltyProgramId", result.collection.publicKey);

        const newProgram = {
          id: result.collection.publicKey || "temp-id",
          name: loyaltyFormData.loyaltyProgramName,
          organizationName: loyaltyFormData.organizationName,
          brandColor: loyaltyFormData.brandColor,
          tiers: generatedTiers,
          pointsPerAction: businessTemplate.pointsPerAction,
          collectionAddress: result.collection.publicKey,
          isActive: true,
          customTierRequirements: tierRequirements,
        };

        setExistingLoyaltyProgram(newProgram);
        setFormData((prev: any) => ({
          ...prev,
          selectedLoyaltyProgram: newProgram,
        }));
        setHasLoyaltyProgram(true);

        showNotification("Loyalty program created successfully!", "success");
      }
    } catch (error) {
      showNotification(
        loyaltyError || "Failed to create loyalty program",
        "error"
      );
    } finally {
      setIsCreatingLoyalty(false);
    }
  };

  const InfoTooltip = ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: string;
  }) => (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 text-center">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Loyalty Program</h3>
        <div className="text-sm text-gray-500">Step 3 of 8</div>
      </div>

      {hasLoyaltyProgram && existingLoyaltyProgram ? (
        // Show existing loyalty program
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                Loyalty Program Found
              </span>
            </div>
            <p className="text-sm text-green-700">
              We found your existing loyalty program. Select it to integrate
              with your campaign.
            </p>
          </div>

          <div
            onClick={() =>
              setFormData((prev: any) => ({
                ...prev,
                selectedLoyaltyProgram: existingLoyaltyProgram,
              }))
            }
            className={`
              bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6
              cursor-pointer transition-all duration-200 border
              ${
                formData.selectedLoyaltyProgram?.id ===
                existingLoyaltyProgram.id
                  ? "border-side ring-1 ring-side shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${existingLoyaltyProgram.brandColor}20`,
                  }}
                >
                  <Trophy
                    className="w-6 h-6"
                    style={{ color: existingLoyaltyProgram.brandColor }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {existingLoyaltyProgram.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {existingLoyaltyProgram.organizationName}
                  </p>
                </div>
              </div>
              {formData.selectedLoyaltyProgram?.id ===
                existingLoyaltyProgram.id && (
                <div className="h-6 w-6 bg-side/10 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-side" />
                </div>
              )}
            </div>

            {formData.selectedLoyaltyProgram?.id ===
              existingLoyaltyProgram.id && (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Loyalty Tiers:
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {existingLoyaltyProgram.tiers
                      .slice(0, 4)
                      .map((tier: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Award className="w-4 h-4 text-yellow-500 mr-2" />
                          {tier.name} (
                          {tier.campaignsRequired ||
                            Math.floor(tier.xpRequired / 40)}{" "}
                          campaigns)
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Points System:
                  </h5>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Campaign Completion:</span>
                      <span className="text-blue-700">40 points each</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Create new loyalty program
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                Create Your First Loyalty Program
              </span>
            </div>
            <p className="text-sm text-blue-700">
              You need a loyalty program to run campaigns. Create one now to
              reward users who complete your tasks.
            </p>
          </div>

          {/* Program Details Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name *
                <InfoTooltip content="This is the name users will see for your loyalty program. Make it catchy and related to your brand!">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                </InfoTooltip>
              </label>
              <input
                type="text"
                value={loyaltyFormData.loyaltyProgramName}
                onChange={(e) =>
                  setLoyaltyFormData((prev) => ({
                    ...prev,
                    loyaltyProgramName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                placeholder="e.g., Uncle Obi's VIP Club, Coffee Lovers Rewards"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
                <InfoTooltip content="Your business or organization name. This helps users identify who's running the loyalty program.">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                </InfoTooltip>
              </label>
              <input
                type="text"
                value={loyaltyFormData.organizationName}
                onChange={(e) =>
                  setLoyaltyFormData((prev) => ({
                    ...prev,
                    organizationName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                placeholder="e.g., Uncle Obi's Restaurant, Joe's Coffee Shop"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Color
                <InfoTooltip content="Choose a color that represents your brand. This will be used in your loyalty program's visual elements.">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                </InfoTooltip>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={loyaltyFormData.brandColor}
                  onChange={(e) =>
                    setLoyaltyFormData((prev) => ({
                      ...prev,
                      brandColor: e.target.value,
                    }))
                  }
                  className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={loyaltyFormData.brandColor}
                  onChange={(e) =>
                    setLoyaltyFormData((prev) => ({
                      ...prev,
                      brandColor: e.target.value,
                    }))
                  }
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                  placeholder="#8B1212"
                />
              </div>
            </div>
          </div>

          {/* Tier Customization Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Tier Requirements</h4>
                <InfoTooltip content="Customize how many campaigns users need to complete to reach each tier. Higher tiers should require more campaigns to maintain progression.">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </InfoTooltip>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoyaltyFormData((prev) => ({
                      ...prev,
                      useCustomTiers: !prev.useCustomTiers,
                    }));
                    setShowCustomTiers(!showCustomTiers);
                  }}
                  className="text-sm text-side hover:text-side/80 font-medium"
                >
                  {showCustomTiers ? "Use Defaults" : "Customize Tiers"}
                </button>
              </div>
            </div>

            {!showCustomTiers && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Using Default Requirements
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {businessTemplate.baseTiers.map(
                    (tier: BusinessLoyaltyTier, index: number) => (
                      <div
                        key={index}
                        className="text-center p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {tier.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {tier.campaignsRequired} campaigns
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {showCustomTiers && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      How It Works
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Each campaign completion gives users{" "}
                    <strong>40 points</strong>. Set how many campaigns users
                    need to complete to reach each tier. For example, if you set
                    "5 campaigns" for Explorer tier, users need 200 points (5 ×
                    40) to reach it.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {businessTemplate.baseTiers.map(
                    (tier: BusinessLoyaltyTier, index: number) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-gray-900">
                              {tier.name}
                            </span>
                          </div>
                          <InfoTooltip
                            content={`Benefits: ${tier.rewards.join(", ")}`}
                          >
                            <Gift className="w-4 h-4 text-gray-400 cursor-help" />
                          </InfoTooltip>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-600">
                            Campaigns Required:
                          </label>
                          <select
                            value={
                              loyaltyFormData.customTierRequirements[index]
                            }
                            onChange={(e) =>
                              handleTierRequirementChange(
                                index,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                            disabled={index === 0} // Starter tier is always 0
                          >
                            {index === 0 ? (
                              <option value={0}>0 (Starting tier)</option>
                            ) : (
                              campaignOptions
                                .filter(
                                  (option) =>
                                    option >=
                                    loyaltyFormData.customTierRequirements[
                                      index - 1
                                    ]
                                )
                                .map((option) => (
                                  <option key={option} value={option}>
                                    {option} campaigns ({option * 40} points)
                                  </option>
                                ))
                            )}
                          </select>
                        </div>

                        {loyaltyFormData.customTierRequirements[index] > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            ={" "}
                            {loyaltyFormData.customTierRequirements[index] * 40}{" "}
                            total points needed
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={resetToDefaults}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Program Preview
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Points System:
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>
                    Campaign Completion: <strong>40 points</strong>
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Tier Structure:
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {(showCustomTiers
                    ? previewBusinessTiers(
                        loyaltyFormData.customTierRequirements
                      )
                    : previewBusinessTiers(getDefaultBusinessTierRequirements())
                  )
                    .slice(0, 4)
                    .map((tier: BusinessLoyaltyTier, index: number) => (
                      <div
                        key={index}
                        className="text-center p-2 bg-gray-50 rounded border"
                      >
                        <div className="text-xs font-medium text-gray-900">
                          {tier.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {tier.campaignsRequired} campaigns
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCreateLoyaltyProgram}
              disabled={
                isCreatingLoyalty ||
                !loyaltyFormData.loyaltyProgramName ||
                !loyaltyFormData.organizationName
              }
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors",
                isCreatingLoyalty ||
                  !loyaltyFormData.loyaltyProgramName ||
                  !loyaltyFormData.organizationName
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-side text-white hover:bg-side/90"
              )}
            >
              {isCreatingLoyalty ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creating Program...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Loyalty Program
                </>
              )}
            </button>
          </div>

          {loyaltyError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">{loyaltyError}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgramStep;
