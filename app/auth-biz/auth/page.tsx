"use client";

import Image from "next/image";
import React, { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/ui/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setIsAuth } from "@/store/slices/isAuthSlice";
import Notification from "@/components/notification";
import { baseURL } from "@/utils/config/baseUrl";
import { NotificationState } from "@/types/general";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "@/components/ui/loading";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.6, delay: 0.2 }
};

const slideInRight = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.6, delay: 0.4 }
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};


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


const Logo = memo(() => (
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
));

Logo.displayName = 'Logo';

function Signup() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const handleAuth = useCallback(async (credential: GoogleCredentialResponse) => {
    if (!credential?.credential) {
      showNotification("Invalid credentials provided", "error");
      return;
    }

    try {
      setIsLoading(true);

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

      router.push("/business");
    } catch (error) {
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
  }, [dispatch, router, showNotification]);

  return (
    <motion.div
      className="flex w-full h-screen"
      {...fadeIn}
    >
      <motion.div
        className="hidden lg:block relative w-2/5 h-full"
        {...slideInLeft}
      >
    
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src="/pexel3.jpg" 
            alt="Background" 
            fill 
            sizes="40vw"
            priority
            quality={85}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-side to-main opacity-60" />
        </div>
      </motion.div>

      <motion.div
        className="w-full lg:w-3/5 h-full bg-white flex flex-col items-center justify-center gap-6 py-10 overflow-y-auto"
        {...slideInRight}
      >
        <Logo />

        <motion.h2
          className="w-full font-poppins font-semibold text-center text-xl md:text-2xl text-blacc"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Get Started
        </motion.h2>

        <AnimatePresence>
          {notification.show && (
            <Notification
              message={notification.message}
              status={notification.status}
              switchShowOff={hideNotification}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="flex flex-col gap-6"
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <GoogleLoginButton isLoading={isLoading} onSuccess={handleAuth} />
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && <LoadingOverlay loaderText="Signing you in..." />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default Signup;