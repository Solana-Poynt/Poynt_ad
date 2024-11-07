import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
  deleteDataFromLocalStorage,
} from "../../utils/localStorage";

// Define the structure of the authentication state
interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
}

// Define the structure of the payload for setIsAuth
interface AuthPayload {
  isAuth: boolean;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Define the initial state based on the AuthState interface
const initialState: AuthState = {
  isAuth: checkAuthStatus(),
  accessToken: null,
};

// Function to check authentication status based on the presence of access and refresh tokens
function checkAuthStatus(): boolean {
  const accessToken = getDataFromLocalStorage("accessToken");
  return accessToken ? true : false;
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

      // Save data in local storage if it exists
      if (accessToken && user) {
        saveDataToLocalStorage("accessToken", accessToken);
        saveDataToLocalStorage("id", user.id);
        saveDataToLocalStorage("name", user.name);
        saveDataToLocalStorage("email", user.email);
      }
    },
    logOut: (state) => {
      state.isAuth = false;
      state.accessToken = null;

      // Clear local storage
      deleteDataFromLocalStorage("accessToken");
      deleteDataFromLocalStorage("id");
      deleteDataFromLocalStorage("name");
      deleteDataFromLocalStorage("email");
    },
  },
});

// Export the actions for use in components
export const { setIsAuth, logOut } = isAuthSlice.actions;

// Export the reducer to be included in the store
export default isAuthSlice.reducer;
