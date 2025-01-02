"use client";
import SideNavigation from "../../components/businessUI/sidebar";
import BusinessHeader from "@/components/businessUI/header";
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
      className="flex flex-col h-screen w-full overflow-y-hidden bg-main px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full">
        <BusinessHeader />
      </div>

      <div className="flex flex-1 z-10 ">
        <div className="flex-none">
          <SideNavigation role="business" />
        </div>

        <motion.main
          className="flex-1 h-[80vh]"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
}
