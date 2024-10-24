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
    <>
      <Navigation role="business" />
      <section className="">{children}</section>
    </>
  );
}
