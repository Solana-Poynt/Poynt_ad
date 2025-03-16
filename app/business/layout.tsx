"use client";
import SideNavigation from "../../components/businessUI/sidebar";
import BusinessHeader from "@/components/businessUI/header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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

  // Set initial sidebar visibility based on screen size
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Handle toggling the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthorized) return null;

  return (
    <motion.div
      className="flex flex-col h-screen w-full overflow-y-hidden overflow-x-hidden bg-main  sm:px-3 md:px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full">
        <BusinessHeader onMenuToggle={toggleSidebar} />
      </div>

      <div className="flex flex-1 z-10 relative">
        {/* Sidebar wrapper with responsive classes */}
        <div
          className={`
          ${isMobile ? "absolute inset-y-0 left-0 z-40" : "flex-none"}
          ${isMobile && !isSidebarOpen ? "hidden" : ""}
          transition-all duration-300
        `}
        >
          <SideNavigation
            role="business"
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={toggleSidebar}
          />
        )}

        <motion.main
          className={`
            flex-1 h-[80vh] overflow-y-auto px-2 sm:px-4 
            ${isMobile && isSidebarOpen ? "opacity-95" : "opacity-100"}
          `}
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
