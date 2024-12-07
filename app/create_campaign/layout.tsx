"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = getDataFromLocalStorage("accessToken");
      if (!accessToken) {
        router.push("/unauthorized");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <motion.div
      className="flex flex-col h-full w-full overflow-y-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.main
        className="flex-1 overflow-auto"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </motion.main>
    </motion.div>
  );
}
