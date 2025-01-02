import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useOkto, type OktoContextType } from "okto-sdk-react";
import {
  setIsWalletGen,
  setLoading,
  setError,
} from "@/store/slices/isWalletSlice";

// Core Types
interface WalletData {
  address: string;
  network_name: string;
  success: boolean;
}

interface TokenData {
  amount_in_inr: string;
  network_name: string;
  quantity: string;
  token_address: string;
  token_image: string;
  token_name: string;
}

interface PortfolioData {
  total: number;
  tokens: TokenData[];
}

export const useWalletManagement = (
  onNotification: (message: string, status: "success" | "error") => void
) => {
  const dispatch = useDispatch();
  const { getWallets, createWallet, getPortfolio } = useOkto() as OktoContextType;

  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [tokensHeld, setTokensHeld] = useState<TokenData[]>([]);

  const fetchPortfolio = useCallback(
    async (currentWallet: WalletData) => {
      try {
        dispatch(setLoading(true));
        const portfolioData = await getPortfolio();

        if (portfolioData) {
          const formattedPortfolio: PortfolioData = {
            total: portfolioData.total,
            tokens: portfolioData.tokens || [],
          };

          setPortfolio(formattedPortfolio);
          setTokensHeld(portfolioData.tokens);

          if (portfolioData.tokens.length === 0) {
            onNotification("No tokens found in the wallet", "error");
            return null;
          }

          dispatch(
            setIsWalletGen({
              isAuth: true,
              isWalletGenerated: true,
              user: {
                walletAddress: currentWallet.address,
                balance: portfolioData.total.toString(),
              },
            })
          );

          return formattedPortfolio;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch portfolio data";
        dispatch(setError(message));
        onNotification(message, "error");
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, getPortfolio, onNotification]
  );

  const initializeWallet = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const existingWallets = await getWallets();
      let currentWallet: WalletData | null = null;

      if (existingWallets.wallets.length > 0) {
        currentWallet = existingWallets.wallets[0];
      } else {
        const newWalletResponse = await createWallet();
        currentWallet = newWalletResponse.wallets[0];
      }

      if (currentWallet) {
        setWallet(currentWallet);
        await fetchPortfolio(currentWallet);
        return currentWallet;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initialize wallet";
      dispatch(setError(message));
      onNotification(message, "error");
    } finally {
      dispatch(setLoading(false));
    }
  }, [createWallet, dispatch, fetchPortfolio, getWallets, onNotification]);

  const refreshBalance = useCallback(async () => {
    if (!wallet) return;
    try {
      dispatch(setLoading(true));
      await fetchPortfolio(wallet);
      onNotification("Balance updated successfully", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to refresh balance";
      onNotification(message, "error");
    } finally {
      dispatch(setLoading(false));
    }
  }, [wallet, fetchPortfolio, dispatch, onNotification]);

  const handleCopyAddress = useCallback(
    async (address: string) => {
      try {
        await navigator.clipboard.writeText(address);
        onNotification("Wallet Address Copied Successfully", "success");
      } catch {
        onNotification("Failed to copy address", "error");
      }
    },
    [onNotification]
  );

  return {
    wallet,
    portfolio,
    tokensHeld,
    initializeWallet,
    refreshBalance,
    handleCopyAddress,
    fetchPortfolio,
  };
};