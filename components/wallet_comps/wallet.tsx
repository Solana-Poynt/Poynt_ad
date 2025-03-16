"use client";
import { TokenData, TransactionData } from "../../types/wallet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Copy, RefreshCw } from "lucide-react";
import { truncateWallet, formatCurrency, formatDate } from "../../utils/wallet";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  totalBalance: number;
  address: string;
  networkName: string;
  onCopyAddress: (address: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

interface InventoryProps {
  transactions: TransactionData[];
  tokens: TokenData[];
  activeTab: "all" | "received" | "sent" | "tokens";
  setActiveTab: (tab: "all" | "received" | "sent" | "tokens") => void;
  isLoading?: boolean;
}

export const LoadingSpinner = () => (
  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin" />
    </div>
    <div className="mt-6 flex flex-col items-center gap-2">
      <h3 className="text-xl font-semibold text-gray-800">
        Loading your wallet
      </h3>
      <p className="text-sm text-gray-500">
        Please wait while we fetch your wallet details
      </p>
    </div>
  </div>
);

export const BalanceCard = ({
  totalBalance,
  address,
  networkName,
  onCopyAddress,
  onRefresh,
  isRefreshing = false,
}: BalanceCardProps) => {
  const handleCopy = async () => {
    try {
      await onCopyAddress(address);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  return (
    <div className="md:w-[342px] md:h-[272px] p-3 bg-[#FAFAFA] rounded-3xl">
      <div className="relative w-full h-32 md:w-[310px] md:h-[188px]">
        <Image
          src="/wallet-card.svg"
          fill
          quality={100}
          priority
          alt="Wallet Card"
          className="object-cover rounded-2xl"
        />

        <div className="relative">
          {/* Balance Display */}
          <div className="absolute right-4 top-9 md:top-12 flex flex-col items-end">
            <span className="text-xs md:text-lg text-white font-bold tracking-tight">
              {`${totalBalance.toFixed(4)} SOL`}
            </span>
            <span className="text-xs md:text-sm text-white/70">
              {networkName}
            </span>
          </div>

          {/* Address Section */}
          <div className="absolute left-4 top-12 md:top-24 pt-4 w-full md:w-[280px] pr-8">
            <p className="text-xs md:text-sm text-white/70 font-medium">
              Wallet Address
            </p>

            <div className="flex items-center w-full justify-between  py-2">
              <div className="flex items-center">
                <p className="text-xs md:text-sm font-mono text-white/90 truncate max-w-[130px]">
                  {truncateWallet(address)}
                </p>
                <button
                  className="ml-2 p-1.5 rounded-md hover:bg-white/10 
                           transition-colors opacity-60 hover:opacity-100"
                  onClick={handleCopy}
                  aria-label="Copy wallet address"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>

              <button
                className="p-1.5 rounded-md hover:bg-white/10 
                         transition-colors opacity-60 hover:opacity-100"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label="Refresh balance"
              >
                <RefreshCw
                  className={`w-4 h-4 text-white ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex  w-full items-center gap-4 mt-6 bg-[#Fafafa] rounded-lg">
        <button
          disabled
          className="w-[50%] text-[#575757] py-2 px-1 text-xs font-medium hover:bg-gray-200 border border[#575757] 
               transition-colors rounded-lg disabled:opacity-50 
               disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={() => {
            /* Implement view details navigation */
          }}
        >
          Withdraw Fund
        </button>
        <button
          disabled
          className="w-[50%] text-[#575757] py-2 px-1 text-xs font-medium bg-gray-200 
         transition-colors rounded-lg disabled:opacity-50 
         disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={() => {
            /* Implement view details navigation */
          }}
        >
          Add Fund
        </button>
      </div>
    </div>
  );
};

// Token Item Component
const TokenItem = ({ token }: { token: TokenData }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-3">
      {token.token_image ? (
        <img
          src={token.token_image}
          alt={token.token_name}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/placeholder-token.svg`;
          }}
        />
      ) : (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium">
            {token.token_name.slice(0, 2)}
          </span>
        </div>
      )}
      <div>
        <p className="font-medium">{token.token_name}</p>
        <p className="text-sm text-gray-500">{token.network_name}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium">{formatCurrency(token.amount_in_inr)}</p>
      <p className="text-sm text-gray-500">Qty: {token.quantity}</p>
    </div>
  </div>
);

// Transaction Item Component
const TransactionItem = ({ transaction }: { transaction: TransactionData }) => {
  const isReceived = transaction.type === "received";
  const IconComponent = isReceived ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            isReceived ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <IconComponent
            className={`h-5 w-5 ${
              isReceived ? "text-green-600" : "text-red-600"
            }`}
          />
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-medium ${
            isReceived ? "text-green-500" : "text-red-500"
          }`}
        >
          {isReceived ? "+" : "-"}₹{transaction.amount}
        </p>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            transaction.status === "Successful"
              ? "bg-green-100 text-green-700"
              : transaction.status === "Failed"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    variant={isActive ? "default" : "ghost"}
    size="sm"
    onClick={onClick}
    className="capitalize"
  >
    {label}
  </Button>
);

export const Inventory = ({
  transactions,
  tokens,
  activeTab,
  setActiveTab,
  isLoading = false,
}: InventoryProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  if (isLoading) {
    return (
      <div className="mb-2 bg-white rounded-xl">
        <div className="animate-pulse space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((transaction) =>
    activeTab === "all" ? true : transaction.type === activeTab
  );

  const toggleSelectAll = () => {
    if (activeTab === "tokens") {
      setSelectedItems(
        selectedItems.length === tokens.length
          ? []
          : tokens.map((token) => token.token_address)
      );
    } else {
      setSelectedItems(
        selectedItems.length === filteredTransactions.length
          ? []
          : filteredTransactions.map((tx) => tx.id)
      );
    }
  };

  const renderEmptyState = () => (
    <tr>
      <td colSpan={6} className="px-4 py-8 text-center">
        <Wallet className="mx-auto h-12 w-12 text-gray-300 mb-2" />
        <p className="text-gray-500">
          No {activeTab === "tokens" ? "tokens" : "transactions"} found
        </p>
      </td>
    </tr>
  );

  return (
    <div className="bg-white md:w-[500px] max-w-2xl h-56 rounded-xl">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="px-6 pt-4">
          <div className=" flex space-x-8">
            {["all", "received", "sent", "tokens"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "all" | "received" | "sent" | "tokens")
                }
                className={`px-1 pb-4 text-xs md:text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "text-[#8B1212] border-[#8B1212]"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-auto" style={{ maxHeight: "600px" }}>
        {activeTab === "tokens" ? (
          <table className="w-full">
            <tbody>
              {tokens.length > 0
                ? tokens.map((token, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {token.token_image ? (
                            <img
                              src={token.token_image}
                              alt={token.token_name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {token.token_name.slice(0, 2)}
                              </span>
                            </div>
                          )}
                          <span className="font-medium">
                            {token.token_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {token.network_name}
                      </td>
                      <td className="px-4 py-3">${token.amount_in_inr}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {token.quantity}
                      </td>
                    </tr>
                  ))
                : renderEmptyState()}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <tbody>
              {filteredTransactions.length > 0
                ? filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 ${
                            transaction.type === "received"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {transaction.description}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          transaction.type === "received"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "received" ? "+" : "-"}$
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "Successful"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                : renderEmptyState()}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// // Main Inventory Component
// export const Inventory = ({
//   transactions,
//   tokens,
//   activeTab,
//   setActiveTab,
//   isLoading = false,
// }: InventoryProps) => {
//   if (isLoading) {
//     return (
//       <Card className="bg-white shadow-sm">
//         <CardContent className="p-6">
//           <div className="animate-pulse space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-16 bg-gray-100 rounded-lg" />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Filter transactions based on active tab
//   const filteredTransactions = transactions.filter((transaction) =>
//     activeTab === "all" ? true : transaction.type === activeTab
//   );

//   // Determine what content to show based on active tab
//   const renderContent = () => {
//     if (activeTab === "tokens") {
//       return (
//         <div className="space-y-3">
//           {tokens.length > 0 ? (
//             tokens.map((token, index) => (
//               <TokenItem
//                 key={`${token.token_address}-${index}`}
//                 token={token}
//               />
//             ))
//           ) : (
//             <div className="text-center py-8">
//               <Wallet className="mx-auto h-12 w-12 text-gray-300" />
//               <p className="mt-2 text-gray-500">No tokens found</p>
//             </div>
//           )}
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-4">
//         {filteredTransactions.length > 0 ? (
//           filteredTransactions.map((transaction) => (
//             <TransactionItem key={transaction.id} transaction={transaction} />
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <Wallet className="mx-auto h-12 w-12 text-gray-300" />
//             <p className="mt-2 text-gray-500">No transactions found</p>
//             {activeTab !== "all" && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setActiveTab("all")}
//                 className="mt-2"
//               >
//                 View all transactions
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <Card className="bg-white w-full shadow-sm">
//       <CardContent className="p-6">
//         <div className="sticky top-0 bg-white z-10 pb-6">
//           <div className="flex justify-between items-center">
//             {/* <h2 className="text-lg font-semibold">Inventory</h2> */}
//             <div className="flex space-x-2">
//               {["all", "received", "sent", "tokens"].map((tab) => (
//                 <TabButton
//                   key={tab}
//                   label={tab}
//                   isActive={activeTab === tab}
//                   onClick={() =>
//                     setActiveTab(tab as "all" | "received" | "sent" | "tokens")
//                   }
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="max-h-[400px] overflow-y-auto">{renderContent()}</div>
//       </CardContent>
//     </Card>
//   );
// };
