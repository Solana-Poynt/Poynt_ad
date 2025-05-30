"use client";
import { useMemo } from "react";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { useGetBusinessQuery } from "@/store/api/api";

// Transaction history item interface
export interface CampaignTransaction {
  id: string;
  campaignName: string;
  budget: string;
  createdAt: string;
  transactionHash: string | null;
  explorerLink: string | null;
  status: "completed" | "pending" | "failed";
}

interface UseCampaignTransactionHistoryReturn {
  transactions: CampaignTransaction[];
  isLoading: boolean;
  error: any;
  hasTransactions: boolean;
}

export const useCampaignTransactionHistory =
  (): UseCampaignTransactionHistoryReturn => {
    const businessId = getDataFromLocalStorage("businessId");
    const {
      data: businessData,
      isLoading: userIsLoading,
      error: userError,
    } = useGetBusinessQuery({ id: businessId });

    // Process campaigns into transaction history
    const transactions = useMemo(() => {
      const allTransactions: CampaignTransaction[] = [];

      if (
        businessData?.data?.campaigns &&
        Array.isArray(businessData.data.campaigns)
      ) {
        businessData.data.campaigns.forEach((campaign: any) => {
          // Only include campaigns with a budget (paid campaigns)
          if (campaign.budget && parseFloat(campaign.budget) > 0) {
            const transaction: CampaignTransaction = {
              id: campaign.id,
              campaignName: campaign.name,
              budget: campaign.budget,
              createdAt: campaign.createdAt,
              transactionHash: campaign.transactionhash || null,
              explorerLink: campaign.transactionhash
                ? `https://solscan.io/tx/${campaign.transactionhash}?cluster=devnet`
                : null,
              status: campaign.transactionhash ? "completed" : "pending",
            };
            allTransactions.push(transaction);
          }
        });
      }

      // Sort by creation date (newest first)
      return allTransactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }, [businessData]);

    return {
      transactions,
      isLoading: userIsLoading,
      error: userError,
      hasTransactions: transactions.length > 0,
    };
  };
