"use client";

import React from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { saveDataToLocalStorage } from "@/utils/localStorage";

export default function ClientDynamicWrapper({ children }: any) {
  const envId = process.env.NEXT_PUBLIC_DYNAMIC;

  if (!envId) {
    console.error("NEXT_PUBLIC_DYNAMIC environment variable is not set");
    return <>{children}</>;
  }

  const settings = {
    environmentId: envId,
    walletConnectors: [SolanaWalletConnectors],
    events: {
      onWalletConnected: (args: any) => {
        console.log("Wallet connected:", args);
        if (args?.address) {
          saveDataToLocalStorage("wallet", args.address);
        }
      },
      onEmbeddedWalletCreated: (args: any) => {
        console.log("Embedded wallet created:", args);
        if (args?.address) {
          saveDataToLocalStorage("wallet", args.address);
        }
      },
      onLogout: () => {
        console.log("User logged out from wallet");
      },
    },
  };

  return (
    <DynamicContextProvider settings={settings}>
      {children}
    </DynamicContextProvider>
  );
}
