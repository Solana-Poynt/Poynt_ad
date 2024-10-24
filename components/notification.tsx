"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Define prop types
interface NotificationProps {
  message: string;
  status: string;
  switchShowOff: () => void; // Function to hide the notification
}

const Notification: React.FC<NotificationProps> = ({
  message,
  status,
  switchShowOff,
}) => {
  const router = useRouter();

  // Tailwind color based on status
  const color =
    status === "error"
      ? "bg-red-600"
      : status === "success"
      ? "bg-green-600"
      : "bg-blue-600";

  // REMOVE NOTIFICATION AFTER 10 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      switchShowOff();
    }, 10000);

    return () => clearTimeout(timer); // Clean up the timer when component unmounts
  }, [switchShowOff]);

  return (
    <div
      className={`flex gap-2 justify-center items-center py-2 px-4 w-full h-auto rounded-md mx-auto my-2 ${color}`}
    >
      <div className="text-white">
        {status === "error" ? (
          <i className="bx bxs-error text-lg"></i>
        ) : status === "success" ? (
          <i className="bx bx-check-circle text-lg"></i>
        ) : (
          <i className="bx bx-info-circle text-lg"></i>
        )}
      </div>
      <p className="text-sm font-normal text-white">{message}</p>
    </div>
  );
};

export default Notification;
