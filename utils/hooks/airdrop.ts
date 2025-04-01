"use client";
import { useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// List of public Solana devnet RPC endpoints to try
const RPC_ENDPOINTS = [
  "https://api.devnet.solana.com",
  "https://devnet.helius-rpc.com/?api-key=4a2f7893-25a4-4014-a367-4f2fac75aa63",
];

const useSolanaAirdrop = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastResult, setLastResult] = useState({ success: false, message: "" });

  const tryAirdropFromEndpoints = async (
    publicKey: PublicKey,
    amount: number,
    endpointIndex = 0
  ) => {
    // If we've tried all endpoints, give up
    if (endpointIndex >= RPC_ENDPOINTS.length) {
      throw new Error("All RPC endpoints failed. Please try again later.");
    }

    try {
      const endpoint = RPC_ENDPOINTS[endpointIndex];
      const connection = new Connection(endpoint, "confirmed");

      // Request the airdrop
      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );

      // Wait for confirmation
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      return { success: true, signature };
    } catch (error: any) {
      console.warn(
        `Airdrop failed on endpoint ${RPC_ENDPOINTS[endpointIndex]}: ${error.message}`
      );
      // Try the next endpoint
      return tryAirdropFromEndpoints(publicKey, amount, endpointIndex + 1);
    }
  };

  const requestAirdrop = async (walletAddress: string, amount = 2) => {
    setIsRequesting(true);
    setLastResult({ success: false, message: "" });

    try {
      const publicKey = new PublicKey(walletAddress);
      const result = await tryAirdropFromEndpoints(publicKey, amount);

      setLastResult({
        success: true,
        message: `Successfully claimed ${amount} SOL!`,
      });

      return result;
    } catch (error: any) {
      console.error("Error requesting airdrop:", error);

      setLastResult({
        success: false,
        message: error.message || "Failed to claim SOL. Please try again.",
      });

      throw error;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    requestAirdrop,
    isRequesting,
    lastResult,
  };
};

export default useSolanaAirdrop;
