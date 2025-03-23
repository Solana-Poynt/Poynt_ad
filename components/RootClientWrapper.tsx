"use client";

import React from "react";
import ClientDynamicWrapper from "./Dynamic";

export default function RootClientWrapper({ children }:any) {
  return <ClientDynamicWrapper>{children}</ClientDynamicWrapper>;
}
