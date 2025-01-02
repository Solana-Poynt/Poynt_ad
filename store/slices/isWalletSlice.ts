import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
  deleteDataFromLocalStorage,
} from "@/utils/localStorage";

// define structure
interface WalletUser {
  walletAddress: string | null;
  balance: string | null;
}

interface WalletState {
  isAuth: boolean;
  isWalletGenerated: boolean;
  user: WalletUser;
  loading: boolean;
  error: string | null;
}

// define the struct of the payload for the action
interface WalletPayload {
  isAuth: boolean;
  isWalletGenerated: boolean;
  user: {
    walletAddress: string;
    balance: string;
  };
}

// Function to check authentication status based on the presence of access token
const checkAuthStatus = (): boolean => {
  return !!getDataFromLocalStorage("accessToken");
};

const checkWalletStatus = (): boolean => {
  return !!getDataFromLocalStorage("wallet");
};

// Define the initial state based on the AuthState interface//// This checks if there's any saved login information in the browser's storage when the app starts.

const initialState: WalletState = {
  isAuth: checkAuthStatus(),
  isWalletGenerated: checkWalletStatus(),
  user: {
    walletAddress: getDataFromLocalStorage("wallet"),
    balance: getDataFromLocalStorage("walletbalance"),
  },
  loading: false,
  error: null,
};


export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setIsWalletGen: (state, action: PayloadAction<WalletPayload>) => {
      const { user } = action.payload;
      
      state.isAuth = true;
      state.isWalletGenerated = true;
      state.user = {
        walletAddress: user.walletAddress,
        balance: user.balance,
      };
      state.error = null;
      state.loading =false;

      // Save to local storage
      saveDataToLocalStorage("wallet", user.walletAddress);
      saveDataToLocalStorage("walletbalance", user.balance);
    },
    clearWallet: (state) => {
      state.isAuth = false;
      state.isWalletGenerated = false;
      state.user = {
        walletAddress: null,
        balance: null,
      };
      state.error = null;
      state.loading = false;

      // Clear local storage
      deleteDataFromLocalStorage("wallet");
      deleteDataFromLocalStorage("walletbalance");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setIsWalletGen, clearWallet, setLoading, setError } = walletSlice.actions;

export default walletSlice.reducer;