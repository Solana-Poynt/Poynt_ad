"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { motion, AnimatePresence } from "framer-motion";

export default function LoyaltyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const checkAuth = () => {
      const email = getDataFromLocalStorage("email");
      const accessToken = getDataFromLocalStorage("accessToken");

      if (!accessToken) {
        router.push("/unauthorized");
      } else if (email !== "danielfrancis32610@gmail.com") {
        router.push("/unauthorized");
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  if (!mounted || !isAuthorized) return null;

  return (
    <motion.div
      className="min-h-screen w-full bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.main
        className="w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </motion.main>
    </motion.div>
  );
}
