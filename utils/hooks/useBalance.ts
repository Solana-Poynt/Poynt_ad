"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  useTokenBalances,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { ChainEnum } from "@dynamic-labs/sdk-api";
import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { saveDataToLocalStorage } from "../localStorage";

// Common token addresses for easy reference
export const SOLANA_TOKENS = {
  USDC_DEVNET: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  USDC_MAINNET: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  SOL: "So11111111111111111111111111111111111111112",
};

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  marketValue?: number;
  logoURI?: string;
  mint?: string;
  tokenAccount?: string;
}

interface UseSolanaTokenBalancesOptions {
  includeFiat?: boolean;
  includeZeroBalances?: boolean;
  sortByValue?: boolean;
  network?: "devnet" | "mainnet";
  fetchAllTokens?: boolean;
}

interface UseSolanaTokenBalancesReturn {
  // Specific balances
  solBalance: number;
  usdcBalance: number;

  // Balance objects with full details
  solBalanceDetails: TokenBalance | null;
  usdcBalanceDetails: TokenBalance | null;

  // General wallet data
  tokenBalances: TokenBalance[];
  allTokenBalances: TokenBalance[];
  allUserTokens: TokenBalance[]; 
  sendableTokens: TokenBalance[]; // Tokens with positive balance for sending
  totalValue: number;
  totalTokenCount: number;

  // Loading states
  isLoading: boolean;
  isLoadingSol: boolean;
  isLoadingUsdc: boolean;
  isLoadingAllTokens: boolean;

  // Error states
  isError: boolean;
  error: any;
  solError: any;
  usdcError: any;

  // Utility functions
  refreshBalances: () => Promise<void>;
  refreshAllTokens: () => Promise<void>;
  getTokenByAddress: (address: string) => TokenBalance | null;
  getTokenBySymbol: (symbol: string) => TokenBalance | null;
  formatTokenAmount: (amount: any, decimals?: number) => string;
  getSolBalance: () => TokenBalance | null;
  getUsdcBalance: () => TokenBalance | null;

  // Status helpers
  hasTokens: boolean;
  hasPositiveBalance: boolean;
}

export const useSolanaTokenBalances = ({
  includeFiat = true,
  includeZeroBalances = false,
  sortByValue = true,
  network = "devnet",
  fetchAllTokens = true,
}: UseSolanaTokenBalancesOptions = {}): UseSolanaTokenBalancesReturn => {
  const { primaryWallet } = useDynamicContext();

  // Individual balance states
  const [solBalance, setSolBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);

  // Individual balance details
  const [solBalanceDetails, setSolBalanceDetails] =
    useState<TokenBalance | null>(null);
  const [usdcBalanceDetails, setUsdcBalanceDetails] =
    useState<TokenBalance | null>(null);

  // All user tokens state
  const [allUserTokens, setAllUserTokens] = useState<TokenBalance[]>([]);

  // Loading states
  const [isLoadingSol, setIsLoadingSol] = useState(false);
  const [isLoadingUsdc, setIsLoadingUsdc] = useState(false);
  const [isLoadingAllTokens, setIsLoadingAllTokens] = useState(false);

  // Error states
  const [solError, setSolError] = useState<any>(null);
  const [usdcError, setUsdcError] = useState<any>(null);

  // General token balances from Dynamic SDK
  const {
    tokenBalances: allTokenBalances,
    isLoading: isDynamicLoading,
    isError: isDynamicError,
    error: dynamicError,
  } = useTokenBalances({
    chainName: ChainEnum.Sol,
    includeFiat,
    includeNativeBalance: true,
  });

  // Memoized connection setup
  const connection = useMemo(() => {
    const endpoint =
      network === "mainnet"
        ? process.env.NEXT_PUBLIC_MAINNET_RPC ||
          "https://api.mainnet-beta.solana.com"
        : process.env.NEXT_PUBLIC_DEVNET_RPC || web3.clusterApiUrl("devnet");

    return new web3.Connection(endpoint, "confirmed");
  }, [network]);

  // Token addresses based on network
  const tokenAddresses = useMemo(
    () => ({
      USDC:
        network === "mainnet"
          ? SOLANA_TOKENS.USDC_MAINNET
          : SOLANA_TOKENS.USDC_DEVNET,
    }),
    [network]
  );

  // Get basic token info without external API calls
  const getTokenMetadata = useCallback(
    (mintAddress: string): Partial<TokenBalance> => {
      // Known token mappings for common tokens
      const knownTokens: Record<string, Partial<TokenBalance>> = {
        [SOLANA_TOKENS.USDC_DEVNET]: {
          symbol: "USDC",
          name: "USD Coin",
          logoURI:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        },
        [SOLANA_TOKENS.USDC_MAINNET]: {
          symbol: "USDC",
          name: "USD Coin",
          logoURI:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        },
        // Add more known tokens as needed
      };

      // Return known token info or fallback
      return (
        knownTokens[mintAddress] || {
          symbol: `${mintAddress.substring(0, 4)}...${mintAddress.substring(
            mintAddress.length - 4
          )}`,
          name: "Unknown Token",
          logoURI: undefined,
        }
      );
    },
    []
  );

  // Fetch all tokens in user's wallet
  const fetchAllUserTokens = useCallback(
    async (walletAddress: string): Promise<TokenBalance[]> => {
      if (!walletAddress) return [];

      try {
        const walletPublicKey = new web3.PublicKey(walletAddress);

        // Get all token accounts
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletPublicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const tokens: TokenBalance[] = [];

        // Process each token account
        for (const tokenAccount of tokenAccounts.value) {
          const parsedInfo = tokenAccount.account.data.parsed.info;
          const mintAddress = parsedInfo.mint;
          const balance = parsedInfo.tokenAmount.uiAmount || 0;
          const decimals = parsedInfo.tokenAmount.decimals;

          // Skip tokens with zero balance unless specifically requested
          if (!includeZeroBalances && balance === 0) continue;

          // Get token metadata (synchronously now)
          const metadata = getTokenMetadata(mintAddress);

          tokens.push({
            address: mintAddress,
            symbol: metadata.symbol || "UNKNOWN",
            name: metadata.name || "Unknown Token",
            balance,
            decimals,
            // marketValue: balance, // Market value can be calculated later if needed
            logoURI: metadata.logoURI,
            mint: mintAddress,
            tokenAccount: tokenAccount.pubkey.toString(),
          });
        }

        return tokens;
      } catch (error) {
        console.error("Error fetching all user tokens:", error);
        return [];
      }
    },
    [connection, includeZeroBalances, getTokenMetadata]
  );

  // Generic function to fetch token balance
  const fetchTokenBalance = useCallback(
    async (
      walletAddress: string,
      tokenMintAddress: string,
      tokenSymbol: string
    ): Promise<TokenBalance | null> => {
      if (!walletAddress || !tokenMintAddress) return null;

      try {
        const walletPublicKey = new web3.PublicKey(walletAddress);
        const tokenMint = new web3.PublicKey(tokenMintAddress);

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          walletPublicKey,
          { programId: TOKEN_PROGRAM_ID }
        );

        const tokenAccount = tokenAccounts.value.find(
          (account) =>
            account.account.data.parsed.info.mint === tokenMint.toString()
        );

        if (tokenAccount) {
          const parsedInfo = tokenAccount.account.data.parsed.info;
          const balance = parsedInfo.tokenAmount.uiAmount || 0;
          const decimals = parsedInfo.tokenAmount.decimals;

          return {
            address: tokenMintAddress,
            symbol: tokenSymbol,
            name: tokenSymbol === "USDC" ? "USD Coin" : tokenSymbol,
            balance,
            decimals,
            marketValue: balance,
            mint: tokenMintAddress,
            tokenAccount: tokenAccount.pubkey.toString(),
            logoURI: getTokenLogoURI(tokenSymbol, tokenMintAddress),
          };
        }

        return {
          address: tokenMintAddress,
          symbol: tokenSymbol,
          name: tokenSymbol === "USDC" ? "USD Coin" : tokenSymbol,
          balance: 0,
          decimals: tokenSymbol === "USDC" ? 6 : 9,
          marketValue: 0,
          mint: tokenMintAddress,
          logoURI: getTokenLogoURI(tokenSymbol, tokenMintAddress),
        };
      } catch (err) {
        console.error(`Error fetching ${tokenSymbol} balance:`, err);
        throw err;
      }
    },
    [connection]
  );

  // Fetch SOL balance
  const fetchSolBalance = useCallback(
    async (walletAddress: string): Promise<void> => {
      if (!walletAddress) return;

      setIsLoadingSol(true);
      setSolError(null);

      try {
        const walletPublicKey = new web3.PublicKey(walletAddress);
        const balance = await connection.getBalance(walletPublicKey);
        const solAmount = balance / web3.LAMPORTS_PER_SOL;

        setSolBalance(solAmount);
        setSolBalanceDetails({
          address: SOLANA_TOKENS.SOL,
          symbol: "SOL",
          name: "Solana",
          balance: solAmount,
          decimals: 9,
          logoURI:
            "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        });
      } catch (err) {
        console.error("Error fetching SOL balance:", err);
        setSolError(err);
      } finally {
        setIsLoadingSol(false);
      }
    },
    [connection]
  );

  // Fetch USDC balance
  const fetchUsdcBalance = useCallback(
    async (walletAddress: string): Promise<void> => {
      if (!walletAddress) return;

      setIsLoadingUsdc(true);
      setUsdcError(null);

      try {
        const tokenData = await fetchTokenBalance(
          walletAddress,
          tokenAddresses.USDC,
          "USDC"
        );
        if (tokenData) {
          setUsdcBalance(tokenData.balance);
          setUsdcBalanceDetails(tokenData);
        }
      } catch (err) {
        setUsdcError(err);
      } finally {
        setIsLoadingUsdc(false);
      }
    },
    [fetchTokenBalance, tokenAddresses.USDC]
  );

  // Refresh all user tokens
  const refreshAllTokens = useCallback(async (): Promise<void> => {
    if (!primaryWallet?.address || !fetchAllTokens) return;

    setIsLoadingAllTokens(true);
    try {
      const tokens = await fetchAllUserTokens(primaryWallet.address);
      setAllUserTokens(tokens);
    } catch (error) {
      console.error("Error refreshing all tokens:", error);
    } finally {
      setIsLoadingAllTokens(false);
    }
  }, [primaryWallet?.address, fetchAllTokens, fetchAllUserTokens]);

  // Refresh specific balances
  const refreshBalances = useCallback(async (): Promise<void> => {
    if (!primaryWallet?.address) return;

    await Promise.all([
      fetchSolBalance(primaryWallet.address),
      fetchUsdcBalance(primaryWallet.address),
      fetchAllTokens ? refreshAllTokens() : Promise.resolve(),
    ]);
  }, [
    primaryWallet?.address,
    fetchSolBalance,
    fetchUsdcBalance,
    fetchAllTokens,
    refreshAllTokens,
  ]);

  // Auto-fetch balances when wallet changes
  useEffect(() => {
    if (primaryWallet?.address) {
      refreshBalances();
    }
  }, [primaryWallet?.address, refreshBalances]);

  // Process and filter token balances
  const processedBalances = useMemo(() => {
    if (!allTokenBalances) return [];

    let filtered = includeZeroBalances
      ? allTokenBalances
      : allTokenBalances.filter((token) => token.balance > 0);

    if (sortByValue) {
      filtered = [...filtered].sort(
        (a, b) => (b.marketValue || 0) - (a.marketValue || 0)
      );
    }

    return filtered;
  }, [allTokenBalances, includeZeroBalances, sortByValue]);

  // Create sendable tokens list (tokens with positive balance)
  const sendableTokens = useMemo(() => {
    const tokens: TokenBalance[] = [];

    // Add SOL if balance > 0
    if (solBalanceDetails && solBalanceDetails.balance > 0) {
      tokens.push(solBalanceDetails);
    }

    // Add USDC if balance > 0
    if (usdcBalanceDetails && usdcBalanceDetails.balance > 0) {
      tokens.push(usdcBalanceDetails);
    }

    // Add other tokens with positive balance
    const otherTokens = allUserTokens.filter(
      (token) =>
        token.balance > 0 && token.symbol !== "SOL" && token.symbol !== "USDC"
    );

    tokens.push(...otherTokens);

    // Sort by balance value
    if (sortByValue) {
      return tokens.sort((a, b) => (b.marketValue || 0) - (a.marketValue || 0));
    }

    return tokens;
  }, [solBalanceDetails, usdcBalanceDetails, allUserTokens, sortByValue]);

  // Calculate total portfolio value
  const totalValue = useMemo(() => {
    const dynamicTotal = processedBalances.reduce(
      (sum, token) => sum + (token.marketValue || 0),
      0
    );

    const manualTotal =
      (solBalanceDetails?.marketValue || 0) +
      (usdcBalanceDetails?.marketValue || 0) +
      allUserTokens.reduce((sum, token) => sum + (token.marketValue || 0), 0);

    return Math.max(dynamicTotal, manualTotal);
  }, [processedBalances, solBalanceDetails, usdcBalanceDetails, allUserTokens]);

  // Utility functions
  const getTokenByAddress = useCallback(
    (address: string): TokenBalance | null => {
      if (!address) return null;

      // Check manual fetched tokens first
      if (
        solBalanceDetails &&
        solBalanceDetails.address.toLowerCase() === address.toLowerCase()
      ) {
        return solBalanceDetails;
      }
      if (
        usdcBalanceDetails &&
        usdcBalanceDetails.address.toLowerCase() === address.toLowerCase()
      ) {
        return usdcBalanceDetails;
      }

      // Check user tokens
      const userToken = allUserTokens.find(
        (token) => token.address.toLowerCase() === address.toLowerCase()
      );
      if (userToken) return userToken;

      // Check Dynamic SDK tokens
      return (
        allTokenBalances?.find(
          (token) => token.address.toLowerCase() === address.toLowerCase()
        ) || null
      );
    },
    [allTokenBalances, solBalanceDetails, usdcBalanceDetails, allUserTokens]
  );

  const getTokenBySymbol = useCallback(
    (symbol: string): TokenBalance | null => {
      if (!symbol) return null;

      const upperSymbol = symbol.toUpperCase();

      // Check manual fetched tokens first
      if (solBalanceDetails && solBalanceDetails.symbol === upperSymbol) {
        return solBalanceDetails;
      }
      if (usdcBalanceDetails && usdcBalanceDetails.symbol === upperSymbol) {
        return usdcBalanceDetails;
      }

      // Check user tokens
      const userToken = allUserTokens.find(
        (token) => token.symbol.toUpperCase() === upperSymbol
      );
      if (userToken) return userToken;

      // Check Dynamic SDK tokens
      return (
        allTokenBalances?.find(
          (token) => token.symbol.toUpperCase() === upperSymbol
        ) || null
      );
    },
    [allTokenBalances, solBalanceDetails, usdcBalanceDetails, allUserTokens]
  );

  const formatTokenAmount = useCallback((amount: any, decimals = 6): string => {
    if (amount === undefined || amount === null) return "0";
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return "0";
    return num.toFixed(decimals);
  }, []);

  // Helper functions to get specific token balances
  const getSolBalance = useCallback((): TokenBalance | null => {
    return solBalanceDetails;
  }, [solBalanceDetails]);

  const getUsdcBalance = useCallback((): TokenBalance | null => {
    return usdcBalanceDetails;
  }, [usdcBalanceDetails]);

  // Helper function to get token logo URI
  const getTokenLogoURI = (symbol: string, address: string): string => {
    const logoMap: Record<string, string> = {
      SOL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      USDC: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    };

    return (
      logoMap[symbol] ||
      `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${address}/logo.png`
    );
  };

  // Save important data to localStorage
  useEffect(() => {
    saveDataToLocalStorage("solBalance", solBalance.toString());
    saveDataToLocalStorage("usdcBalance", usdcBalance.toString());
    saveDataToLocalStorage("totalValue", totalValue.toString());
  }, [solBalance, usdcBalance, totalValue]);

  // Combine loading states
  const isLoading =
    isDynamicLoading || isLoadingSol || isLoadingUsdc || isLoadingAllTokens;

  // Combine error states
  const isError = isDynamicError || !!solError || !!usdcError;
  const error = dynamicError || solError || usdcError;

  // Status helpers
  const hasTokens =
    processedBalances.length > 0 ||
    solBalance > 0 ||
    usdcBalance > 0 ||
    allUserTokens.length > 0;
  const hasPositiveBalance = totalValue > 0;
  const totalTokenCount =
    processedBalances.length +
    (solBalance > 0 ? 1 : 0) +
    (usdcBalance > 0 ? 1 : 0) +
    allUserTokens.length;

  return {
    // Specific balances
    solBalance,
    usdcBalance,

    // Balance details
    solBalanceDetails,
    usdcBalanceDetails,

    // General wallet data
    tokenBalances: processedBalances,
    allTokenBalances: allTokenBalances || [],
    allUserTokens,
    sendableTokens,
    totalValue,
    totalTokenCount,

    // Loading states
    isLoading,
    isLoadingSol,
    isLoadingUsdc,
    isLoadingAllTokens,

    // Error states
    isError,
    error,
    solError,
    usdcError,

    // Utility functions
    refreshBalances,
    refreshAllTokens,
    getTokenByAddress,
    getTokenBySymbol,
    formatTokenAmount,
    getSolBalance,
    getUsdcBalance,

    // Status helpers
    hasTokens,
    hasPositiveBalance,
  };
};

export default useSolanaTokenBalances;
