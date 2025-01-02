import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { api } from "./api/api";
import isAuthReducer from "./slices/isAuthSlice";
import isWalletReducer from "./slices/isWalletSlice";

// Define the root state type
const rootReducer = combineReducers({
  isAuth: isAuthReducer,
  wallet: isWalletReducer,
  [api.reducerPath]: api.reducer,
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the AppDispatch type from the store itself
export type AppDispatch = typeof store.dispatch;
