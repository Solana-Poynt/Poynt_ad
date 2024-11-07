"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import { ReactNode } from "react";

// Define the type for the `children` prop
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};
