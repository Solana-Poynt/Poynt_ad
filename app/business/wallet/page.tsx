"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
  useDynamicContext,
  useUserWallets,
  Wallet,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { saveDataToLocalStorage } from "@/utils/localStorage";
import { NotificationState } from "@/types/general";
import Notification from "@/components/notification";

// Simplified wallet button without icon
const SimpleWalletButton = () => {
  return (
    <DynamicWidget
      buttonClassName="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      buttonContainerClassName="w-full"
      innerButtonComponent={
        <div className="flex items-center justify-center">Get Wallet</div>
      }
      variant="modal"
    />
  );
};

// Connected Wallet Card - Shown when user has wallet connected
const ConnectedWalletCard = ({ primaryWallet }: any) => {
  const [isCopied, setIsCopied] = useState(false);

  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });
  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const copyAddress = () => {
    if (primaryWallet?.address) {
      navigator.clipboard.writeText(primaryWallet.address);
      showNotification(" copied wallet address", "success");

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Format the wallet address for display (first 6 chars...last 4 chars)
  const formatAddress = (address: any) => {
    if (!address) return "";
    saveDataToLocalStorage("wallet", address);
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Your Poynt Wallet
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Your wallet is here and ready for you!
          </p>
        </div>

        {/* Wallet Address Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Wallet Address</span>
            <button
              onClick={copyAddress}
              className="text-blue-600 text-xs hover:text-blue-800 flex items-center"
            >
              {isCopied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="font-mono text-sm bg-white p-2 rounded border border-gray-200 break-all">
            {primaryWallet?.address
              ? formatAddress(primaryWallet.address)
              : "Loading..."}
          </div>
        </div>

        {/* Wallet Actions Section */}
        <div className="space-y-3 mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            Access wallet fully from Dynamic with the button below
          </h3>
          <DynamicWidget />
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure, encrypted, and non-custodial powered by Dynamic
        </p>
      </div>
    </div>
  );
};

// Simplified and more compact wallet card for non-connected state
const CompactWalletCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto">
      {/* Content container with reduced padding */}
      <div className="p-6">
        <div className="text-center">
          {/* Title with better typography */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Get your Poynt Wallet Ready
          </h2>

          {/* Subtitle with shorter description */}
          <p className="text-gray-600 mb-5">
            Create your digital wallet that helps you navigate Poynt easily!
          </p>

          {/* Feature points - more compact */}
          <div className="mb-5 text-left space-y-2">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm text-gray-700">
                Fast setup in seconds
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm text-gray-700">
                Full ownership of assets
              </span>
            </div>
          </div>

          {/* Simple wallet button */}
          <SimpleWalletButton />

          {/* Trust indicator - more compact */}
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center">
            Secure, encrypted, and non-custodial powered by Dynamic
          </p>
        </div>
      </div>
    </div>
  );
};

// Main component that determines which card to show
const WalletDashboard = () => {
  const WalletView = () => {
    const { primaryWallet, user, sdkHasLoaded } = useDynamicContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (sdkHasLoaded) {
        setLoading(false);
      }
    }, [sdkHasLoaded]);

    if (loading) {
      // Loading state
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto p-6">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-md mb-4 mx-auto"></div>
          <div className="h-4 w-full bg-gray-100 animate-pulse rounded-md mb-4"></div>
          <div className="h-24 w-full bg-gray-100 animate-pulse rounded-md"></div>
        </div>
      );
    }

    // Show connected wallet view if user has a wallet
    if (user && primaryWallet) {
      return <ConnectedWalletCard primaryWallet={primaryWallet} />;
    }

    // Show default wallet card for non-connected users
    return <CompactWalletCard />;
  };

  const envId = process.env.NEXT_PUBLIC_DYNAMIC;

  return (
    <DynamicContextProvider
      settings={{
        // Using the environment ID
        environmentId: `${envId}`,
        walletConnectors: [SolanaWalletConnectors],

        // Optional event handlers
        events: {
          onEmbeddedWalletCreated: (args) => {
            console.log("Wallet created successfully", args);
          },
        },
      }}
    >
      <div className="flex flex-row h-[90%] items-center justify-center">
        <WalletView />
      </div>
    </DynamicContextProvider>
  );
};

export default WalletDashboard;
