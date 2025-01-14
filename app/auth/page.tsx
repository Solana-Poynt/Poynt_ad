"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/ui/google";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setIsAuth } from "@/store/slices/isAuthSlice";
import Notification from "../../components/notification";
import { baseURL } from "@/utils/config/baseUrl";
import { NotificationState } from "@/types/general";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "@/components/ui/loading";
import { useOkto, type OktoContextType } from "okto-sdk-react";

interface LoginResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      businesses: any[];
      createdAt: string;
      phoneNumber: string | null;
      updatedAt: string;
    };
  };
}

interface GoogleCredentialResponse {
  credential?: string;
  clientId?: string;
  select_by?: string;
}

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const { authenticate } = useOkto() as OktoContextType;

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const handleOktoAuth = async (idToken: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      authenticate(idToken, (result, error) => {
        if (error) {
          // console.error("Okto authentication error:", error);
          reject(error);
          return;
        }
        if (result) {
          // console.log("Okto authentication successful");
          resolve(true);
          return;
        }
        reject(new Error("No authentication result received"));
      });
    });
  };

  const handleAuth = async (credential: GoogleCredentialResponse) => {
    if (!credential?.credential) {
      showNotification("Invalid credentials provided", "error");
      return;
    }

    try {
      setIsLoading(true);
      const idToken = credential.credential;

      // First authenticate with Okto
      // console.log("Starting Okto authentication...");
      await handleOktoAuth(idToken);
      // console.log("Okto authentication successful");
      // /auth/google
      // Then authenticate with your backend
      const response = await fetch(`${baseURL}/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: credential.credential }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data: LoginResponse = await response.json();
      showNotification("Successfully signed in!", "success");

      dispatch(
        setIsAuth({
          isAuth: true,
          accessToken: data.data.accessToken,
          user: {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            role: data.data.user.role,
            businessId:
              data.data.user.businesses.length > 0
                ? data.data.user.businesses[0].id
                : "",
          },
        })
      );

      // saveDataToLocalStorage("onboard", "false");
      router.push("/business");
    } catch (error) {
      // console.error("Authentication error:", error);
      showNotification(
        `Authentication failed: ${
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      className="flex w-full h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="hidden lg:block relative bg-[url('/pexel3.jpg')] bg-no-repeat bg-cover bg-center w-2/5 h-full"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-side to-main opacity-60" />
      </motion.div>

      <motion.div
        className="w-full lg:w-3/5 h-full bg-white flex flex-col items-center justify-center gap-6 py-10 overflow-y-auto"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.a
          href="/"
          className="transition-transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go to homepage"
        >
          <Image
            className="w-10 h-10 md:w-16 md:h-16 lg:w-36 lg:h-36 rounded-lg object-contain"
            src="/trans.png"
            width={80}
            height={80}
            quality={90}
            priority
            alt="Poynt Logo"
          />
        </motion.a>

        <motion.h2
          className="w-full font-poppins font-semibold text-center text-xl md:text-2xl text-blacc"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Get Started
        </motion.h2>

        <AnimatePresence>
          {notification.show && (
            <Notification
              message={notification.message}
              status={notification.status}
              switchShowOff={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
            />
          )}
        </AnimatePresence>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <GoogleLoginButton isLoading={isLoading} onSuccess={handleAuth} />
        </motion.div>

        <AnimatePresence>
          {isLoading && <LoadingOverlay loaderText="Signing you in..." />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
