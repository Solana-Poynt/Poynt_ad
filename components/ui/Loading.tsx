import React from "react";
import { motion } from "framer-motion";

const LoadingOverlay = ({ loaderText }: { loaderText: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-overlay backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      className="bg-side p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4"
    >
      <div className="w-12 h-12 border-4 border-[#fca311] border-t-transparent rounded-full animate-spin" />
      <p className="text-white font-medium text-lg">{loaderText}</p>
    </motion.div>
  </motion.div>
);

export default LoadingOverlay;