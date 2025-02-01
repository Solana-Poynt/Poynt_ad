import React, { useState } from "react";
import ProfileDropdown from "@/components/ProfileView";
import Image from "next/image";
import { Bell } from "lucide-react";
import ReModal from "./reusablemodal";

const BusinessHeader = () => {
  // const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className=" pt-3 pb-5">
      <header className="rounded-xl bg-white shadow-sm">
        <div className="mx-auto py-3 px-6 flex items-center justify-between gap-8">
          {/* Logo Section */}
          <div className="flex items-center min-w-[100px]">
            <div className="relative w-24 h-12">
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

          {/* Search Section */}
          {/* <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                          group-focus-within:text-side transition-colors duration-200"
                size={20}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 
                         rounded-lg outline-none transition-all duration-200
                         focus:ring-2 focus:ring-side/20 focus:border-side
                         focus:bg-white hover:border-gray-300"
              />
            </div>
          </div> */}

          {/* Actions Section */}
          <div className="flex items-center gap-4">
            <button
              className="relative p-2.5 rounded-lg border border-gray-200 bg-white
                       hover:bg-gray-50 hover:border-gray-300 
                       transition-all duration-200 ease-in-out"
              onClick={() => setIsOpen(true)}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {/* <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" /> */}
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
          <div className="">
            <p className="text-zinc-800">No Message Found</p>
          </div>
        </ReModal>
      </header>
    </div>
  );
};

export default BusinessHeader;
