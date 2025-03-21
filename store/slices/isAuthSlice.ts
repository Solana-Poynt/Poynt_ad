import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
  deleteDataFromLocalStorage,
} from "@/utils/localStorage";

// Define the structure of the authentication state
interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
    role: string | null;
    businessId: string | null;
  };
}

// Define the structure of the payload for setIsAuth
interface AuthPayload {
  isAuth: boolean;
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    businessId: string;
  };
}

// Define the initial state based on the AuthState interface//// This checks if there's any saved login information in the browser's storage when the app starts.

const initialState: AuthState = {
  isAuth: checkAuthStatus(),
  accessToken: getDataFromLocalStorage("accessToken"),
  user: {
    id: getDataFromLocalStorage("id"),
    email: getDataFromLocalStorage("email"),
    name: getDataFromLocalStorage("name"),
    role: getDataFromLocalStorage("role"),
    businessId: getDataFromLocalStorage("businessId"),
  },
};

// Function to check authentication status based on the presence of access token
function checkAuthStatus(): boolean {
  return !!getDataFromLocalStorage("accessToken");
}

// Create the slice with TypeScript support
export const isAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<AuthPayload>) => {
      const { accessToken, user } = action.payload;
      state.isAuth = true;
      state.accessToken = accessToken;
      state.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
      };

      // Save data in local storage if it exists
      saveDataToLocalStorage("accessToken", accessToken);
      saveDataToLocalStorage("id", user.id);
      saveDataToLocalStorage("email", user.email);
      saveDataToLocalStorage("name", user.name);
      saveDataToLocalStorage("role", user.role);
      saveDataToLocalStorage("businessId", user.businessId);
    },
    logout: (state) => {
      state.isAuth = false;
      state.accessToken = null;
      state.user = {
        id: null,
        email: null,
        name: null,
        role: null,
        businessId: null,
      };

      // Clear local storage
      deleteDataFromLocalStorage("accessToken");
      deleteDataFromLocalStorage("id");
      deleteDataFromLocalStorage("email");
      deleteDataFromLocalStorage("name");
      deleteDataFromLocalStorage("role");
      deleteDataFromLocalStorage("businessId");
      // deleteDataFromLocalStorage("wallet");
      // deleteDataFromLocalStorage("walletbalance");
    },
  },
});

// Export the actions for use in components
export const { setIsAuth, logout } = isAuthSlice.actions;

export default isAuthSlice.reducer;
