"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-100"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-2 -right-2"
            >
              <Lock className="h-8 w-8 text-gray-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center mt-4 text-gray-900"
        >
          Unauthorized
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-600 mt-4"
        >
          If you believe this is an error not from you, please contact support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 mt-8"
        >
          <button
            onClick={() => router.push("/auth")}
            className="w-full bg-side text-white py-3 px-4 rounded-lg hover:bg-side/80 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all hover:shadow-md transform hover:-translate-y-0.5"
          >
            Return Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UnauthorizedPage;
