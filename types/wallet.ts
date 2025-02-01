// types.ts
export interface TokenData {
  amount_in_inr: string;
  network_name: string;
  quantity: string;
  token_address: string;
  token_image: string;
  token_name: string;
}

export interface TransactionData {
  id: string;
  type: "received" | "sent";
  amount: string;
  date: string;
  status: "Successful" | "Failed" | "Pending";
  description: string;
}

export interface WalletData {
  address: string;
  network_name: string;
}

export interface PortfolioData {
  total: number;
  tokens: TokenData[];
}

export interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}
