"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useTokenBalances,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { ChainEnum } from "@dynamic-labs/sdk-api";
import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { saveDataToLocalStorage } from "../localStorage";

/**
 * Custom hook to fetch and manage Solana token balances
 * With additional direct USDC balance checking functionality
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeFiat - Whether to include fiat values (default: true)
 * @param {boolean} options.includeZeroBalances - Whether to include tokens with zero balance (default: false)
 * @param {boolean} options.sortByValue - Whether to sort tokens by their market value (default: true)
 *
 * @returns {Object} The token balances data and helper functions
 */
export const useSolanaTokenBalances = ({
  includeFiat = true,
  includeZeroBalances = false,
  sortByValue = true,
} = {}) => {
  const { primaryWallet } = useDynamicContext();
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(false);
  const [usdcError, setUsdcError] = useState<any>(null);

  // Use the Dynamic SDK hook for fetching token balances
  const {
    tokenBalances: allTokenBalances,
    isLoading,
    isError,
    error,
  } = useTokenBalances({
    chainName: ChainEnum.Sol,
    includeFiat,
    includeNativeBalance: true,
  });

  // Total portfolio value in USD
  const [totalValue, setTotalValue] = useState(0);

  // Filtered and processed token balances
  const [processedBalances, setProcessedBalances] = useState<any>();

  // Process the token balances whenever they change
  useEffect(() => {
    if (allTokenBalances) {
      // First filter out zero balances if needed
      let filteredBalances = includeZeroBalances
        ? allTokenBalances
        : allTokenBalances.filter((token) => token.balance > 0);

      // Sort tokens by market value if requested
      if (sortByValue) {
        filteredBalances = [...filteredBalances].sort(
          (a, b) => (b.marketValue || 0) - (a.marketValue || 0)
        );
      }

      // Calculate total portfolio value
      const total = filteredBalances.reduce(
        (sum, token) => sum + (token.marketValue || 0),
        0
      );

      setTotalValue(total);
      setProcessedBalances(filteredBalances);
    }
  }, [allTokenBalances, includeZeroBalances, sortByValue]);

  // Function to get USDC balance directly from the blockchain
  const getUsdcBalance = useCallback(async (walletAddress: string) => {
    if (!walletAddress) {
      return null;
    }

    setIsLoadingUsdc(true);
    setUsdcError(null);

    try {
      // USDC token address (this is for mainnet, you may need to change for devnet)
      const usdcMint = new web3.PublicKey(
        "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
      );

      // Create a connection to the Solana cluster
      const connection = new web3.Connection(
        // Use this for devnet
        web3.clusterApiUrl("devnet"),
        // Use this for mainnet: "https://api.mainnet-beta.solana.com"
        "confirmed"
      );

      // Get the user's wallet public key
      const walletPublicKey = new web3.PublicKey(walletAddress);

      // Get all token accounts owned by this wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Find the USDC token account
      const usdcAccount = tokenAccounts.value.find(
        (account) =>
          account.account.data.parsed.info.mint === usdcMint.toString()
      );

      if (usdcAccount) {
        const balance =
          usdcAccount.account.data.parsed.info.tokenAmount.uiAmount;
        setUsdcBalance(balance);
        return balance;
      } else {
        // No USDC account found, balance is 0
        setUsdcBalance(0);
        return 0;
      }
    } catch (err) {
      console.error("Error fetching USDC balance:", err);
      setUsdcError(err);
      return null;
    } finally {
      setIsLoadingUsdc(false);
    }
  }, []);

  // Automatically fetch USDC balance when wallet changes
  useEffect(() => {
    if (primaryWallet?.address) {
      getUsdcBalance(primaryWallet.address);
    }
  }, [primaryWallet, getUsdcBalance]);

  // Get a specific token by its address
  const getTokenByAddress = (address: string) => {
    if (!address || !allTokenBalances) return null;

    // Special case for USDC
    if (
      address.toLowerCase() ===
      "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU".toLowerCase()
    ) {
      // If we have direct USDC balance, return a constructed token object
      if (usdcBalance !== null) {
        return {
          address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          symbol: "USDC",
          name: "USD Coin",
          balance: usdcBalance,
          decimals: 6,
          marketValue: usdcBalance,
          logoURI:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        };
      }
    }

    // Default behavior for other tokens
    return allTokenBalances.find(
      (token) => token.address.toLowerCase() === address.toLowerCase()
    );
  };

  // Get native SOL balance
  const getSolBalance = () => {
    return allTokenBalances?.find((token) => token.symbol === "SOL");
  };

  // Format a token amount with proper decimal places
  const formatTokenAmount = (amount: any, decimals = 6) => {
    if (amount === undefined || amount === null) return "0";
    return parseFloat(amount).toFixed(decimals);
  };

  saveDataToLocalStorage("walletbalance", usdcBalance.toString());

  return {
    // Raw data
    tokenBalances: processedBalances,
    allTokenBalances: allTokenBalances || [],
    isLoading: isLoading || isLoadingUsdc,
    isError: isError || !!usdcError,
    error: error || usdcError,

    // USDC specific data
    usdcBalance,
    isLoadingUsdc,
    usdcError,

    // Processed data
    totalValue,

    // Utility functions
    getUsdcBalance,
    getTokenByAddress,
    getSolBalance,
    formatTokenAmount,

    // Status helpers
    hasTokens: (processedBalances?.length || 0) > 0 || usdcBalance > 0,
  };
};

export default useSolanaTokenBalances;
