"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useCallback, memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setIsAuth } from "@/store/slices/isAuthSlice";
import Notification from "@/components/Notification";
import { baseURL } from "@/utils/config/baseUrl";
import { NotificationState } from "@/types/general";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "@/components/ui/Loading";
import {
  useDynamicContext,
  useSocialAccounts,
  getAuthToken,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { ProviderEnum } from "@dynamic-labs/types";
import { GoogleIcon } from "@dynamic-labs/iconic";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.6, delay: 0.2 },
};

const slideInRight = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.6, delay: 0.4 },
  transition: { duration: 0.6, delay: 0.4 },
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6 },
};

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  businesses: Array<{ id: string }>;
  createdAt: string;
  phoneNumber: string | null;
  updatedAt: string;
}

interface LoginResponse {
  status: number;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
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
      onError={(e) => {
        e.currentTarget.src = "/fallback-logo.png";
      }}
    />
  </motion.a>
));

Logo.displayName = "Logo";

const Signup: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useDynamicContext();
  const { error, isProcessing, signInWithSocialAccount } = useSocialAccounts();
  const isLoggedIn = useIsLoggedIn();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authenticationAttempted, setAuthenticationAttempted] =
    useState<boolean>(false);
  const [waitingForToken, setWaitingForToken] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({ message, status, show: true });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const authenticateWithBackend = useCallback(async (idToken: string) => {
    const apiResponse = await fetch(`${baseURL}/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
      throw new Error(responseData.message || "Authentication request failed");
    }

    return responseData;
  }, []);

  const processAuthentication = useCallback(async () => {
    try {
      // Keep loading state active during backend authentication
      setIsLoading(true);

      const idToken = getAuthToken();

      if (!idToken) {
        throw new Error("No authentication token available");
      }

      const data: LoginResponse = await authenticateWithBackend(idToken);

      dispatch(
        setIsAuth({
          isAuth: true,
          accessToken: data.data.accessToken,
          user: {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            role: data.data.user.role,
            businessId: data.data.user.businesses[0]?.id || "",
          },
        })
      );

      showNotification("Successfully signed in!", "success");

      // Small delay to show the success message before navigation
      setTimeout(() => {
        router.push("/business");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during authentication";

      showNotification(errorMessage, "error");
      throw error;
    } finally {
      // Always stop loading when backend authentication completes (success or error)
      setIsLoading(false);
      setAuthenticationAttempted(false);
      setWaitingForToken(false);
    }
  }, [dispatch, router, showNotification, authenticateWithBackend]);

  // Handle hydration and OAuth detection after client-side mount
  useEffect(() => {
    setIsHydrated(true);

    // Check for OAuth redirect only after hydration
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams =
      urlParams.has("dynamicOauthCode") || urlParams.has("dynamicOauthState");

    if (hasOAuthParams) {
      // We're returning from OAuth redirect, set states to continue auth flow
      setIsLoading(true);
      setWaitingForToken(true);
      setAuthenticationAttempted(true);
    }
  }, []);
  // Effect to handle post-authentication flow with token polling
  useEffect(() => {
    // Only run after hydration to avoid SSR/client mismatch
    if (!isHydrated) return;

    let tokenCheckInterval: NodeJS.Timeout;

    const handlePostAuthentication = async () => {
      // Check if user is logged in and we're waiting for token (either from button click or OAuth redirect)
      if (user && isLoggedIn && waitingForToken) {
        // Poll for token availability since it might not be immediately available
        const pollForToken = () => {
          const idToken = getAuthToken();

          if (idToken) {
            clearInterval(tokenCheckInterval);
            processAuthentication().catch((error) => {
              console.error("Post-authentication error:", error);
            });
          }
        };

        // Check immediately and then every 100ms for up to 10 seconds (increased timeout for OAuth flow)
        pollForToken();
        tokenCheckInterval = setInterval(pollForToken, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(tokenCheckInterval);
          if (waitingForToken) {
            showNotification(
              "Authentication timeout. Please try again.",
              "error"
            );
            setIsLoading(false);
            setAuthenticationAttempted(false);
            setWaitingForToken(false);
          }
        }, 10000);
      }
      // If user is logged in but we're not actively waiting, and we have OAuth params in URL, start the flow
      else if (user && isLoggedIn && !waitingForToken) {
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthParams =
          urlParams.has("dynamicOauthCode") ||
          urlParams.has("dynamicOauthState");

        if (hasOAuthParams) {
          setIsLoading(true);
          setWaitingForToken(true);
          setAuthenticationAttempted(true);
        }
      }
    };

    handlePostAuthentication();

    // Cleanup interval on unmount
    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
      }
    };
  }, [
    user,
    isLoggedIn,
    waitingForToken,
    processAuthentication,
    showNotification,
    isHydrated,
  ]);

  // Clean up URL when authentication is complete or fails
  useEffect(() => {
    // Only run after hydration
    if (!isHydrated) return;

    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams =
      urlParams.has("dynamicOauthCode") || urlParams.has("dynamicOauthState");

    if (hasOAuthParams && !isLoading && !waitingForToken) {
      // Clean up URL without refreshing the page
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [isLoading, waitingForToken, isHydrated]);

  const handleAuth = useCallback(async () => {
    try {
      // Start loading immediately when user clicks
      setIsLoading(true);

      // If user is already logged in, process authentication directly
      if (user && isLoggedIn) {
        await processAuthentication();
        return;
      }

      // If not logged in, initiate Google sign-in
      setAuthenticationAttempted(true);
      setWaitingForToken(true);

      await signInWithSocialAccount(ProviderEnum.Google);

      // Note: We don't stop loading here because we need to wait for the token
      // and backend authentication. The loading will be stopped in processAuthentication.
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during authentication";

      showNotification(errorMessage, "error");

      // Reset all states on error
      setIsLoading(false);
      setAuthenticationAttempted(false);
      setWaitingForToken(false);
    }
  }, [
    user,
    isLoggedIn,
    signInWithSocialAccount,
    processAuthentication,
    showNotification,
  ]);

  // Handle authentication errors from Dynamic
  useEffect(() => {
    if (error && (authenticationAttempted || waitingForToken)) {
      showNotification(error.message || "Authentication failed", "error");
      setIsLoading(false);
      setAuthenticationAttempted(false);
      setWaitingForToken(false);
    }
  }, [error, authenticationAttempted, waitingForToken, showNotification]);

  return (
    <motion.div className="flex w-full h-screen bg-gray-50" {...fadeIn}>
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
            onError={(e) => {
              e.currentTarget.src = "/fallback-background.jpg";
            }}
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
          className="w-full font-poppins font-semibold text-center text-xl md:text-2xl text-gray-900"
          {...fadeInUp}
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
          className="flex flex-col items-center gap-6 w-full max-w-md px-4"
          {...fadeInUp}
        >
          <button
            onClick={handleAuth}
            disabled={isProcessing || isLoading}
            className="flex items-center justify-center gap-3 px-6 py-2 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full"
            aria-label="Sign in with Google"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="font-medium text-[14px] text-gray-700">
              {(isProcessing || isLoading) && isHydrated
                ? waitingForToken
                  ? "Completing sign in..."
                  : "Signing in..."
                : "Sign in with Google"}
            </span>
          </button>

          <p className="text-sm text-gray-600 text-center">
            By signing in, you agree to our{" "}
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              terms and privacy policy
            </Link>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {(isLoading || isProcessing) && isHydrated && (
            <LoadingOverlay
              loaderText={
                waitingForToken
                  ? "Completing authentication..."
                  : "Authenticating..."
              }
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
