"use client";
import { useState, useCallback, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isSolanaWallet } from "@dynamic-labs/solana-core";
import {
  initializeVerxio,
  getAssetData,
  getProgramDetails,
  VerxioContext,
} from "@verxioprotocol/core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey, Umi } from "@metaplex-foundation/umi";
import { Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import {
  LOYALTY_TEMPLATES,
  type CreateBusinessProgramParams,
  type CreateProtocolProgramParams,
  type UpdateLoyaltyProgramParams,
  type IssueLoyaltyPassParams,
  type PointsTransactionParams,
  type BatchPassRecipient,
  type UseLoyaltyReturn,
  type GeneratedLoyaltyTier,
} from "@/types/loyalty";

export const useLoyalty = (): UseLoyaltyReturn => {
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<VerxioContext>();

  // Initialize Verxio context (for read operations only)
  const initializeContext = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
        throw new Error("Please connect your Solana wallet");
      }

      const rpcEndpoint =
        process.env.NEXT_PUBLIC_DEVNET_RPC || "https://api.devnet.solana.com";
      const umi = createUmi(rpcEndpoint);

      const walletPublicKey = publicKey(primaryWallet.address);
      const verxioContext: VerxioContext = initializeVerxio(
        umi,
        walletPublicKey
      );

      setContext(verxioContext);
      // console.log("Verxio context initialized successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to initialize Verxio context";
      setError(errorMessage);
      console.error("Error initializing Verxio context:", err);
    } finally {
      setIsLoading(false);
    }
  }, [primaryWallet]);

  // Helper function to execute gasless transaction
  const executeGaslessTransaction = useCallback(
    async (transactionData: any): Promise<any> => {
      if (!primaryWallet || !isSolanaWallet(primaryWallet)) {
        throw new Error("Please connect your Solana wallet");
      }

      try {
        // Get partially signed transaction from backend
        const response = await fetch("/api/loyalty/gasless", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData),
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(
            responseData.message || "Failed to prepare gasless transaction"
          );
        }

        // Handle batch operations (no transaction needed)
        if (!responseData.serializedTransaction) {
          return responseData;
        }

        const { serializedTransaction } = responseData;

        // Deserialize the transaction
        const transaction = Transaction.from(
          bs58.decode(serializedTransaction)
        );

        const signer = await primaryWallet.getSigner();

        // Sign with user's wallet (server already paid fees)
        const { signature } = await signer.signAndSendTransaction(transaction);

        return {
          ...responseData,
          signature,
          transactionConfirmed: true,
        };
      } catch (err) {
        console.error("Error executing gasless transaction:", err);
        throw err;
      }
    },
    [primaryWallet]
  );

  // ===== BUSINESS FUNCTIONS (Simplified for Business Users) =====

  // Create business loyalty program with customizable tier requirements
  const createBusinessProgram = useCallback(
    async (params: CreateBusinessProgramParams): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate custom tier requirements if provided
        if (params.customTierRequirements) {
          if (params.customTierRequirements.length !== 4) {
            throw new Error(
              "Must provide exactly 4 tier requirements (campaigns needed for each tier)"
            );
          }

          // Ensure requirements are in ascending order
          for (let i = 1; i < params.customTierRequirements.length; i++) {
            if (
              params.customTierRequirements[i] <
              params.customTierRequirements[i - 1]
            ) {
              throw new Error("Tier requirements must be in ascending order");
            }
          }
        }

        const transactionData = {
          type: "CREATE_BUSINESS_LOYALTY_PROGRAM",
          programData: {
            loyaltyProgramName: params.loyaltyProgramName,
            organizationName: params.organizationName,
            metadataUri: params.metadataUri,
            customTierRequirements: params.customTierRequirements,
          },
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create business loyalty program";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  // Award business campaign completion points (fixed 40 points)
  const awardBusinessCampaignPoints = useCallback(
    async (passAddress: string): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "AWARD_BUSINESS_CAMPAIGN_POINTS",
          passAddress,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to award business campaign points";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  // ===== PROTOCOL FUNCTIONS (Preset Values for Admins) =====

  // Create protocol loyalty program (uses preset values only)
  const createProtocolProgram = useCallback(
    async (params: CreateProtocolProgramParams): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "CREATE_PROTOCOL_LOYALTY_PROGRAM",
          programData: {
            loyaltyProgramName: params.loyaltyProgramName,
            organizationName: params.organizationName,
            metadataUri: params.metadataUri,
          },
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create protocol loyalty program";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  // Award protocol points (various actions with multipliers)
  const awardProtocolPoints = useCallback(
    async (
      passAddress: string,
      action: string,
      multiplier: number = 1
    ): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "AWARD_PROTOCOL_POINTS",
          passAddress,
          action,
          multiplier,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to award protocol points";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  // ===== ADMIN FUNCTIONS (Full Administrative Control) =====

  const updateProgram = useCallback(
    async (params: UpdateLoyaltyProgramParams): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "UPDATE_LOYALTY_PROGRAM",
          collectionAddress: params.collectionAddress,
          newPointsPerAction: params.newPointsPerAction,
          newTiers: params.newTiers,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update loyalty program";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  const issuePass = useCallback(
    async (params: IssueLoyaltyPassParams): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "ISSUE_LOYALTY_PASS",
          collectionAddress: params.collectionAddress,
          recipient: params.recipient,
          passName: params.passName,
          passMetadataUri: params.passMetadataUri,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to issue loyalty pass";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  const awardPoints = useCallback(
    async (
      passAddress: string,
      action: string,
      multiplier: number = 1
    ): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "AWARD_LOYALTY_POINTS",
          passAddress,
          action,
          multiplier,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to award points";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  const revokePoints = useCallback(
    async (params: PointsTransactionParams): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "REVOKE_LOYALTY_POINTS",
          passAddress: params.passAddress,
          points: params.points,
          reason: params.reason,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to revoke points";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  const giftPoints = useCallback(
    async (params: PointsTransactionParams): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "GIFT_LOYALTY_POINTS",
          passAddress: params.passAddress,
          points: params.points,
          reason: params.reason || "Points gift",
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to gift points";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  // ===== BATCH OPERATIONS (Admin Convenience Functions) =====

  const batchAwardPoints = useCallback(
    async (
      passAddresses: string[],
      action: string,
      multiplier: number = 1
    ): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "BATCH_AWARD_POINTS",
          passAddresses,
          action,
          multiplier,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to batch award points";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  const batchIssuePasses = useCallback(
    async (
      collectionAddress: string,
      recipients: BatchPassRecipient[]
    ): Promise<any> => {
      try {
        setIsLoading(true);
        setError(null);

        const transactionData = {
          type: "BATCH_ISSUE_PASSES",
          collectionAddress,
          recipients,
          signer: primaryWallet?.address,
        };

        const result = await executeGaslessTransaction(transactionData);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to batch issue passes";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, executeGaslessTransaction]
  );

  // ===== DATA RETRIEVAL FUNCTIONS (Direct, no gasless needed) =====

  const getPassData = useCallback(
    async (passAddress: string): Promise<any> => {
      if (!context) {
        throw new Error("Context not initialized");
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await getAssetData(context, publicKey(passAddress));
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get pass data";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  const getProgramData = useCallback(
    async (collectionAddress?: string): Promise<any> => {
      if (!context) {
        throw new Error("Context not initialized");
      }

      try {
        setIsLoading(true);
        setError(null);
        if (!collectionAddress) {
          throw new Error("Collection address is required to get program data");
        }
        const CollectionPublicKey = publicKey(collectionAddress);
        const tempContext: VerxioContext = {
          ...context,
          collectionAddress: CollectionPublicKey,
        };

        const result = await getProgramDetails(tempContext);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get program data";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [context]
  );

  // ===== UTILITY FUNCTIONS =====

  // Get default tier requirements for businesses
  const getDefaultBusinessTierRequirements = useCallback((): number[] => {
    return LOYALTY_TEMPLATES.BUSINESS_DEFAULT.baseTiers.map(
      (tier) => tier.campaignsRequired
    );
  }, []);

  // Generate business tiers preview based on custom requirements
  const previewBusinessTiers = useCallback(
    (customRequirements: number[]): GeneratedLoyaltyTier[] => {
      // Validate that we have the correct number of tier requirements
      if (
        LOYALTY_TEMPLATES.BUSINESS_DEFAULT.baseTiers.length !==
        customRequirements.length
      ) {
        throw new Error(
          `Must provide exactly ${LOYALTY_TEMPLATES.BUSINESS_DEFAULT.baseTiers.length} tier requirements`
        );
      }

      if (!LOYALTY_TEMPLATES.BUSINESS_DEFAULT.generateTiers) {
        throw new Error("generateTiers function not available");
      }

      return LOYALTY_TEMPLATES.BUSINESS_DEFAULT.generateTiers(
        customRequirements
      );
    },
    []
  );

  // Get available actions for protocol
  const getAvailableProtocolActions = useCallback((): string[] => {
    return Object.keys(LOYALTY_TEMPLATES.PROTOCOL_DEFAULT.pointsPerAction);
  }, []);

  // Initialize context when wallet connects
  useEffect(() => {
    if (primaryWallet && isSolanaWallet(primaryWallet)) {
      initializeContext();
    }
  }, [primaryWallet, initializeContext]);

  return {
    // ===== STATE =====
    isLoading,
    error,

    // ===== BUSINESS FUNCTIONS (Simplified for Business Users) =====
    createBusinessProgram,
    awardBusinessCampaignPoints,

    // ===== PROTOCOL FUNCTIONS (Full Control for Admins) =====
    createProtocolProgram,
    awardProtocolPoints,

    // ===== ADMIN FUNCTIONS (Full Administrative Control) =====
    updateProgram,
    issuePass,
    awardPoints,
    revokePoints,
    giftPoints,

    // ===== BATCH OPERATIONS =====
    batchAwardPoints,
    batchIssuePasses,

    // ===== DATA RETRIEVAL =====
    getPassData,
    getProgramData,

    // ===== UTILITY FUNCTIONS =====
    initializeContext,
    getDefaultBusinessTierRequirements,
    previewBusinessTiers,
    getAvailableProtocolActions,

    // ===== TEMPLATES & CONSTANTS =====
    businessTemplate: LOYALTY_TEMPLATES.BUSINESS_DEFAULT,
    protocolTemplate: LOYALTY_TEMPLATES.PROTOCOL_DEFAULT,
  };
};

export default useLoyalty;

// Export templates for external use
export { LOYALTY_TEMPLATES };
