import {
  createLoyaltyProgram,
  updateLoyaltyProgram,
  issueLoyaltyPass,
  awardLoyaltyPoints,
  revokeLoyaltyPoints,
  giftLoyaltyPoints,
  initializeVerxio,
} from "@verxioprotocol/core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";

import { LOYALTY_TEMPLATES } from "@/types/loyalty";

const { BUSINESS_DEFAULT, PROTOCOL_DEFAULT } = LOYALTY_TEMPLATES;

export const dynamic = "force-dynamic";

// Security - keep this safe
const RPC_URL =
  process.env.NEXT_PUBLIC_DEVNET_RPC || "https://api.devnet.solana.com";
const PRIVATE_KEY = process.env.FEE_PAYER_PRIVATE_KEY || "";

// Business loyalty template - Base structure that businesses can customize

// Business loyalty template. Note: Since each business have different loyalty programs, we help them keep track of their loyal customers. For example, a business can have a loyalty program that rewards customers for completing campaigns, and the business can set the tiers and rewards based on their needs. This is different from the protocol loyalty program, which is more comprehensive and includes various activities like social sharing, app reviews, etc. Mr Obi of Uncle Obi's Resturant will keep track of his loyal customers solving retention.

interface LoyaltyRequest {
  type: string;
  programData?: any;
  collectionAddress?: string;
  passAddress?: string;
  recipient?: string;
  passName?: string;
  passAddresses?: string[];
  recipients?: {
    address: string;
    passMetadataUri?: string;
    passName?: string;
  };
  passMetadataUri?: string;
  points?: number;
  action?: string;
  multiplier?: number;
  reason?: string;
  newPointsPerAction?: any;
  newTiers?: any;
  loyaltyProgram?: string;
  signer: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoyaltyRequest = await request.json();
    const { type, signer } = body;

    // Basic validation
    if (!type || !signer) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!PRIVATE_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing fee payer private key in environment variables",
        },
        { status: 500 }
      );
    }

    const connection = new Connection(RPC_URL, "confirmed");

    // Set up the fee payer wallet
    const privateKeyBuffer = bs58.decode(PRIVATE_KEY);
    const feePayer = Keypair.fromSecretKey(new Uint8Array(privateKeyBuffer));

    const umi = createUmi(RPC_URL);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(feePayer.secretKey);
    const updateAuth = createSignerFromKeypair(umi, umiKeypair);

    umi.use(signerIdentity(updateAuth));

    const signerPublicKey = publicKey(signer);
    const verxioContext = initializeVerxio(umi, signerPublicKey);

    let transaction: Transaction;
    let result: any;

    switch (type) {
      // BUSINESS FUNCTIONS (Simplified with Customizable Tiers)
      case "CREATE_BUSINESS_LOYALTY_PROGRAM": {
        const { programData } = body;
        if (!programData) {
          return NextResponse.json(
            { success: false, message: "Missing program data" },
            { status: 400 }
          );
        }
        const businessMetadataUri =
          "https://gateway.pinata.cloud/ipfs/bafkreiae5qfjbhznlfixwbnlx5gou7c2jnpteg2zeswvy4k6uv4m6odofe";
        // Generate tiers based on business requirements
        let businessTiers;
        if (
          programData.customTierRequirements &&
          Array.isArray(programData.customTierRequirements)
        ) {
          // Validate we have 4 requirements (one for each tier)
          if (programData.customTierRequirements.length !== 4) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "Must provide exactly 4 tier requirements (campaigns needed for each tier)",
              },
              { status: 400 }
            );
          }

          // Create tiers with custom campaign requirements
          businessTiers = BUSINESS_DEFAULT.baseTiers.map((tier, index) => ({
            name: tier.name,
            xpRequired: programData.customTierRequirements[index] * 40,
            campaignsRequired: programData.customTierRequirements[index],
            rewards: tier.rewards,
          }));
        } else {
          // Use default tier requirements
          businessTiers = BUSINESS_DEFAULT.baseTiers.map((tier) => ({
            name: tier.name,
            xpRequired: tier.campaignsRequired * 40,
            campaignsRequired: tier.campaignsRequired,
            rewards: tier.rewards,
          }));
        }

        const businessProgramData = {
          loyaltyProgramName: programData.loyaltyProgramName,
          metadataUri: businessMetadataUri,
          programAuthority: verxioContext.programAuthority,
          updateAuthority: updateAuth,
          metadata: {
            organizationName: programData.organizationName,
          },
          tiers: businessTiers,
          pointsPerAction: BUSINESS_DEFAULT.pointsPerAction,
        };

        result = await createLoyaltyProgram(verxioContext, businessProgramData);

        console.log(`✅ Loyalty program creation result:`, {
          success: !!result,
          collectionAddress: result?.collectionAddress?.toString(),
          signature: result?.signature,
          metadataUri: businessProgramData.metadataUri,
        });

        break;
      }

      case "AWARD_BUSINESS_CAMPAIGN_POINTS": {
        const { passAddress } = body;
        if (!passAddress) {
          return NextResponse.json(
            { success: false, message: "Missing pass address" },
            { status: 400 }
          );
        }

        result = await awardLoyaltyPoints(verxioContext, {
          passAddress: publicKey(passAddress),
          action: "campaign_completion",
          signer: updateAuth,
          multiplier: 1,
        });
        break;
      }

      // PROTOCOL FUNCTIONS (Full Control for Admins)
      case "CREATE_PROTOCOL_LOYALTY_PROGRAM": {
        const { programData } = body;
        if (!programData) {
          return NextResponse.json(
            { success: false, message: "Missing program data" },
            { status: 400 }
          );
        }

        const protocolMetadataUri =
          "https://gateway.pinata.cloud/ipfs/bafkreihegdqouba7xvqkijrsundwzxzcdosfrq5catpveoqa3l2upjyfy4";

        const protocolProgramData = {
          loyaltyProgramName: programData.loyaltyProgramName,
          metadataUri: protocolMetadataUri,
          programAuthority: verxioContext.programAuthority,
          updateAuthority: updateAuth,
          metadata: {
            organizationName: programData.organizationName,
          },
          tiers: programData.tiers || PROTOCOL_DEFAULT.tiers,
          pointsPerAction:
            programData.pointsPerAction || PROTOCOL_DEFAULT.pointsPerAction,
        };

        result = await createLoyaltyProgram(verxioContext, protocolProgramData);
        break;
      }

      case "AWARD_PROTOCOL_POINTS": {
        const { passAddress, action, multiplier = 1 } = body;
        if (!passAddress || !action) {
          return NextResponse.json(
            { success: false, message: "Missing pass address or action" },
            { status: 400 }
          );
        }

        result = await awardLoyaltyPoints(verxioContext, {
          passAddress: publicKey(passAddress),
          action,
          signer: updateAuth,
          multiplier,
        });
        break;
      }

      // ADMIN FUNCTIONS (Full Administrative Control)
      case "UPDATE_LOYALTY_PROGRAM": {
        const { collectionAddress, newPointsPerAction, newTiers } = body;
        if (!collectionAddress) {
          return NextResponse.json(
            { success: false, message: "Missing collection address" },
            { status: 400 }
          );
        }

        result = await updateLoyaltyProgram(verxioContext, {
          collectionAddress: publicKey(collectionAddress),
          programAuthority: verxioContext.programAuthority,
          updateAuthority: updateAuth,
          newPointsPerAction,
          newTiers,
        });
        break;
      }

      case "ISSUE_LOYALTY_PASS": {
        const { collectionAddress, recipient, passName, passMetadataUri } =
          body;
        if (!collectionAddress || !recipient || !passName || !passMetadataUri) {
          return NextResponse.json(
            { success: false, message: "Missing required pass data" },
            { status: 400 }
          );
        }

        result = await issueLoyaltyPass(verxioContext, {
          collectionAddress: publicKey(collectionAddress),
          recipient: publicKey(recipient),
          passName,
          passMetadataUri,
          assetSigner: updateAuth,
          updateAuthority: updateAuth,
        });
        break;
      }

      case "AWARD_LOYALTY_POINTS": {
        const { passAddress, action, multiplier = 1 } = body;
        if (!passAddress || !action) {
          return NextResponse.json(
            { success: false, message: "Missing pass address or action" },
            { status: 400 }
          );
        }

        result = await awardLoyaltyPoints(verxioContext, {
          passAddress: publicKey(passAddress),
          action,
          signer: updateAuth,
          multiplier,
        });
        break;
      }

      case "REVOKE_LOYALTY_POINTS": {
        const { passAddress, points } = body;
        if (!passAddress || !points) {
          return NextResponse.json(
            { success: false, message: "Missing pass address or points" },
            { status: 400 }
          );
        }

        result = await revokeLoyaltyPoints(verxioContext, {
          passAddress: publicKey(passAddress),
          pointsToRevoke: points,
          signer: updateAuth,
        });
        break;
      }

      case "GIFT_LOYALTY_POINTS": {
        const { passAddress, points, reason } = body;
        if (!passAddress || !points) {
          return NextResponse.json(
            { success: false, message: "Missing pass address or points" },
            { status: 400 }
          );
        }

        result = await giftLoyaltyPoints(verxioContext, {
          passAddress: publicKey(passAddress),
          pointsToGift: points,
          signer: updateAuth,
          action: reason || "Points gift",
        });
        break;
      }

      // BATCH OPERATIONS (Admin convenience functions)
      case "BATCH_AWARD_POINTS": {
        const { passAddresses, action, multiplier = 1 } = body;
        if (!passAddresses || !Array.isArray(passAddresses) || !action) {
          return NextResponse.json(
            {
              success: false,
              message: "Missing pass addresses array or action",
            },
            { status: 400 }
          );
        }

        const results = [];
        for (const passAddress of passAddresses) {
          try {
            const batchResult = await awardLoyaltyPoints(verxioContext, {
              passAddress: publicKey(passAddress),
              action,
              signer: updateAuth,
              multiplier,
            });
            results.push({ passAddress, success: true, result: batchResult });
          } catch (error) {
            results.push({
              passAddress,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        return NextResponse.json({
          success: true,
          results,
          totalProcessed: passAddresses.length,
          successCount: results.filter((r) => r.success).length,
          failureCount: results.filter((r) => !r.success).length,
        });
      }

      case "BATCH_ISSUE_PASSES": {
        const { collectionAddress, recipients } = body;
        if (!collectionAddress || !recipients || !Array.isArray(recipients)) {
          return NextResponse.json(
            {
              success: false,
              message: "Missing collection address or recipients array",
            },
            { status: 400 }
          );
        }

        const results = [];
        for (const recipient of recipients) {
          try {
            const batchResult = await issueLoyaltyPass(verxioContext, {
              collectionAddress: publicKey(collectionAddress),
              recipient: publicKey(recipient.address),
              passName: recipient.passName,
              passMetadataUri: recipient.passMetadataUri,
              assetSigner: updateAuth,
              updateAuthority: updateAuth,
            });
            results.push({
              recipient: recipient.address,
              success: true,
              result: batchResult,
            });
          } catch (error) {
            results.push({
              recipient: recipient.address,
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        return NextResponse.json({
          success: true,
          results,
          totalProcessed: recipients.length,
          successCount: results.filter((r) => r.success).length,
          failureCount: results.filter((r) => !r.success).length,
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid operation type" },
          { status: 400 }
        );
    }

    // If the result contains a transaction, prepare it for gasless execution
    if (result && result.transaction) {
      transaction = result.transaction;

      // Set fee payer (server covers all fees)
      transaction.feePayer = feePayer.publicKey;

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      // Partially sign with fee payer (server signs for fee payment)
      transaction.partialSign(feePayer);

      // Serialize the transaction to send back to client
      const serializedTransaction = bs58.encode(
        transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
      );

      return NextResponse.json({
        success: true,
        serializedTransaction,
        message: transaction.serializeMessage().toString("base64"),
        signature: result.signature || null,
        collectionAddress: result.collectionAddress || null,
        passAddress: result.passAddress || null,
        estimatedFee: 5000, // Server covers this
        gasless: true,
      });
    }

    // If no transaction needed, return direct result
    return NextResponse.json({
      success: true,
      gasless: true,
      ...result,
    });
  } catch (error) {
    console.error("Gasless loyalty operation error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
