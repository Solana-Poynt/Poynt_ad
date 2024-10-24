"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../../components/notification";

export default function Signup() {
  const router = useRouter();
  const [notification, setNotification] = useState({
    message: "",
    status: "",
    show: false,
  });

  return (
    <>
      <div className="flex w-full h-screen">
        <div className="hidden lg:block relative bg-[url('/frame.png')] bg-no-repeat bg-cover bg-center w-2/5 h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-secondary to-main opacity-60"></div>
        </div>
        <div className="w-full lg:w-3/5 h-full bg-white flex flex-col items-center justify-center gap-10 py-10 overflow-y-scroll">
          <a href="/">
            <Image
              className="w-24 h-auto md:w-[150px] md:h-[150px] rounded-lg"
              src="/logo.png"
              width={150}
              height={50}
              quality={100}
              alt="Poynt Logo"
            />
          </a>

          <h2 className="w-full font-poppins font-semibold text-center text-xl md:text-2xl text-blacc">
            Create Account
          </h2>

          <form className="w-3/4 flex flex-col gap-6">
            {/* DISPLAY NOTIFICATION TO USER IF IT EXISTS */}
            {notification.show ? (
              <Notification
                status={notification.status}
                message={notification.message}
                switchShowOff={() => {
                  setNotification((prev) => {
                    return { ...prev, show: false };
                  });
                }}
              />
            ) : (
              ""
            )}

            <a
              onClick={() => {
                router.push("/business");
              }}
              className="flex items-center justify-center px-6 py-3 rounded-full border-[2px] gap-3 md:gap-5 border-secondary font-poppins font-normal bg-secondary text-white text-sm md:text-base cursor-pointer hover:bg-transparent hover:border-secondary hover:text-secondary"
            >
              <i className="bx bxl-google text-[32px]"></i>{" "}
              <span>Sign in with Google</span>
            </a>
          </form>
        </div>
      </div>
    </>
  );
}
