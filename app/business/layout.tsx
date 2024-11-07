"use client";
import Navigation from "../../components/navbar";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full">
      <Navigation role="business" />
      <section className="">{children}</section>
    </div>
  );
}
