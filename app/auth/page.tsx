"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setIsAuth } from "@/store/slices/isAuthSlice";
import Notification from "../../components/notification";
import { baseURL } from "@/utils/config/baseUrl";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { NotificationState } from "@/types/general";
import { GoogleUser } from "@/types/campaign";

interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
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

  //CHECK IF USER IS AUTHENTICATED
  const isAuthenticated = useSelector(
    (state: RootState) => state.isAuth.isAuth
  );
  useEffect(() => {
    if (isAuthenticated) {
      const role = getDataFromLocalStorage("role");
      role === "admin" ? router.push(`/admin`) : router.push(`/business`);
    }
  }, [isAuthenticated]);

  // Notification helper
  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({
        message,
        status,
        show: true,
      });
    },
    []
  );

  // Handle backend authentication
  const handleBackendAuth = async (userData: GoogleUser): Promise<void> => {
    try {
      console.log("Sending to backend:", {
        email: userData.email,
        name: userData.name,
        idToken: userData.idtoken,
      });

      const response = await fetch(`${baseURL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
        }),
      });
      if (!response.ok) {
        showNotification("Sign in Failed!", "error");
      }

      const data: LoginResponse = await response.json();
      showNotification("Successfully signed in!", "success");
      // Dispatch auth state
      dispatch(
        setIsAuth({
          isAuth: true,
          accessToken: data.accessToken,
          user: data.user,
        })
      );
      // Redirect after successful login
      setTimeout(() => {
        router.push("/business");
      }, 1000);
    } catch (error) {
      showNotification("Authentication failed", "error");
    }
  };

  // Google login implementation and idtoken accessing.
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);

        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error("Failed to get user info from Google");
        }

        const userData: GoogleUser = await userInfoResponse.json();
        if (!userData.email_verified) {
          throw new Error("Email not verified with Google");
        }
        await handleBackendAuth(userData);
      } catch (error) {
        showNotification("Cannot Connect to Google", "error");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      showNotification("Failed to sign in with Google", "error");
      setIsLoading(false);
    },
  });

  return (
    <div className="flex w-full h-screen">
      {/* Background Image Section */}
      <div className="hidden lg:block relative bg-[url('/pexel3.jpg')] bg-no-repeat bg-cover bg-center w-2/5 h-full">
        <div className="absolute inset-0 bg-gradient-to-l from-secondary to-main opacity-60" />
      </div>

      {/* Sign Up Form Section */}
      <div className="w-full lg:w-3/5 h-full bg-white flex flex-col items-center justify-center gap-10 py-10 overflow-y-auto">
        {/* Logo */}
        <a
          href="/"
          className="transition-transform hover:scale-105"
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
        </a>

        {/* Title */}
        <h2 className="w-full font-poppins font-semibold text-center text-xl md:text-2xl text-blacc">
          Get Started
        </h2>

        {/* Notification Component */}
        {notification.show && (
          <Notification
            message={notification.message}
            status={notification.status}
            switchShowOff={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }
          />
        )}

        {/* Sign in Button Section */}
        <div className="w-3/4 flex flex-col gap-6">
          <button
            onClick={() => !isLoading && handleGoogleSignIn()}
            disabled={isLoading}
            className={`
              flex items-center justify-center px-6 py-3 rounded-full border-2 gap-3 md:gap-5 
              transition-all duration-300 ease-in-out
              ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed border-gray-300"
                  : "border-secondary bg-secondary text-white hover:bg-transparent hover:text-secondary"
              }
            `}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span className="font-poppins">Signing in...</span>
              </div>
            ) : (
              <>
                <i className="bx bxl-google text-3xl" aria-hidden="true" />
                <span className="font-poppins">Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
