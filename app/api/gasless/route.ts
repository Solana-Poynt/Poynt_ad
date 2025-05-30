import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";

export const dynamic = "force-dynamic";

const RPC_URL = process.env.NEXT_PUBLIC_DEVNET_RPC || "https://api.devnet.solana.com";
const PRIVATE_KEY = process.env.FEE_PAYER_PRIVATE_KEY || "";

// SOL native token identifier
const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

interface TransferRequest {
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  tokenAddress?: string; // Optional: for SPL tokens, undefined for SOL
  decimals?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Get data from the request
    const body: TransferRequest = await request.json();
    const { senderAddress, recipientAddress, amount, tokenAddress, decimals = 9 } = body;

    // Basic validation
    if (!senderAddress || !recipientAddress || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
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

    // Convert addresses to PublicKey objects
    let sender: PublicKey;
    let recipient: PublicKey;
    try {
      sender = new PublicKey(senderAddress);
      recipient = new PublicKey(recipientAddress);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid Solana address" },
        { status: 400 }
      );
    }

    const instructions = [];

    // Check if this is a SOL transfer or SPL token transfer
    if (!tokenAddress || tokenAddress === SOL_ADDRESS) {
      // Native SOL transfer
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
      
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipient,
          lamports: lamports,
        })
      );
    } else {
      // SPL Token transfer
      try {
        const tokenMint = new PublicKey(tokenAddress);
        
        // Get token accounts for sender and recipient
        const senderTokenAccount = await getAssociatedTokenAddress(
          tokenMint,
          sender
        );
        const recipientTokenAccount = await getAssociatedTokenAddress(
          tokenMint,
          recipient
        );

        // Check if recipient token account exists
        const recipientTokenInfo = await connection.getAccountInfo(
          recipientTokenAccount
        );

        // Create recipient token account if it doesn't exist
        if (!recipientTokenInfo) {
          instructions.push(
            createAssociatedTokenAccountInstruction(
              feePayer.publicKey, // Fee payer creates the account
              recipientTokenAccount,
              recipient,
              tokenMint
            )
          );
        }

        // Calculate amount in token's smallest unit
        const tokenAmount = BigInt(Math.floor(amount * Math.pow(10, decimals)));

        // Add transfer instruction
        instructions.push(
          createTransferCheckedInstruction(
            senderTokenAccount,
            tokenMint,
            recipientTokenAccount,
            sender,
            tokenAmount,
            decimals
          )
        );
      } catch (error) {
        return NextResponse.json(
          { success: false, message: `Invalid token address: ${error}` },
          { status: 400 }
        );
      }
    }

    // Create and partially sign transaction
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = feePayer.publicKey;
    
    instructions.forEach((instruction) => transaction.add(instruction));
    
    // Partially sign with fee payer
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
      transactionType: tokenAddress && tokenAddress !== SOL_ADDRESS ? "spl" : "sol",
      estimatedFee: 5000,
    });
  } catch (error) {
    console.error("Gasless transaction error:", error);
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