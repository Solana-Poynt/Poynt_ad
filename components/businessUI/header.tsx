import React, { useState } from "react";
import ProfileDropdown from "@/components/ProfileView";
import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import ReModal from "./Reusablemodal";

const BusinessHeader = ({ onMenuToggle }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-2 sm:pt-3 pb-3 ml-3 md:ml-0 sm:pb-5">
      <header className="rounded-lg sm:rounded-xl bg-white shadow-sm">
        <div className="mx-auto py-2 sm:py-3 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-8">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo Section */}
          <div className="flex items-center min-w-[80px] sm:min-w-[100px]">
            <div className="relative w-16 sm:w-24 h-10 sm:h-12">
              <Image
                src="/home-logo.svg"
                fill
                quality={100}
                priority
                alt="Poynt Logo"
                className="object-contain"
              />
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="relative p-2 sm:p-2.5 rounded-lg border border-gray-200 bg-white
                       hover:bg-gray-50 hover:border-gray-300 
                       transition-all duration-200 ease-in-out"
              onClick={() => setIsOpen(true)}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              {/* Notification indicator dot - uncomment when needed */}
              {/* <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full" /> */}
            </button>
            <div className="pl-2 border-l border-gray-200">
              <ProfileDropdown />
            </div>
          </div>
        </div>

        <ReModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Notifications and Messages"
        >
          <div className="py-4">
            <p className="text-zinc-800 text-center">No Messages Found</p>
          </div>
        </ReModal>
      </header>
    </div>
  );
};

export default BusinessHeader;
