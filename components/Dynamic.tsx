"use client";
import React from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { saveDataToLocalStorage } from "@/utils/localStorage";

export default function ClientDynamicWrapper({ children }: any) {
  const dynamicId = process.env.NEXT_PUBLIC_DYNAMIC_ID;

  if (!dynamicId) {
    throw new Error(
      "Missing DYNAMIC ID. Please add it to your .env.local file"
    );
  }

  const settings: any = {
    environmentId: dynamicId,
    walletConnectors: [SolanaWalletConnectors],
    events: {
      onWalletConnected: (args: any) => {
        if (args?.address) {
          saveDataToLocalStorage("wallet", args.address);
        }
      },
    },
  };

  return (
    <DynamicContextProvider settings={settings}>
      {children}
    </DynamicContextProvider>
  );
}
