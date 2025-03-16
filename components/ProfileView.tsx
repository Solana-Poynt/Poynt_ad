"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Building2, Briefcase } from "lucide-react";
import BusinessModal from "./businessmodal";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";
import { useGetUserQuery } from "@/store/api/api";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "./ui/loading";
import { useRouter } from "next/navigation";
// import { BusinessFormData } from "@/types/general";

interface Account {
  id: string;
  name: string;
  email: string;
  industry?: string;
  category?: any;
  campaigns?: any;
}

const ProfileDropdown: React.FC = () => {
  // State management
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [currentBusiness, setCurrentBusiness] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name: string | null;
    email: string | null;
  }>({
    name: null,
    email: null,
  });

  // Refs
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all User business
  const userId = getDataFromLocalStorage("id");
  const {
    data: usersServerData,
    isLoading: userIsLoading,
    error: userError,
  } = useGetUserQuery({ id: userId });
  const accounts: Account[] = usersServerData?.data?.businesses;
  const currentSelectedAccount =
    accounts &&
    accounts.filter((item) => {
      return item.id === getDataFromLocalStorage("businessId");
    });

  // Effect to handle hydration and initial data loading
  useEffect(() => {
    setMounted(true);
    const name = getDataFromLocalStorage("name");
    const email = getDataFromLocalStorage("email");
    setUserData({ name, email });
  }, []);

  // Effect to handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard event handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && showDropDown) {
      setShowDropDown(false);
    }
  };

  // Don't render until after hydration
  if (!mounted) return null;

  const userInitial = userData.name?.charAt(0) || "?";

  return (
    <div className="relative" ref={dropdownRef}>
      <AnimatePresence>
        {isLoading && <LoadingOverlay loaderText="Switching accounts..." />}
      </AnimatePresence>
      <button
        ref={buttonRef}
        onClick={() => setShowDropDown(!showDropDown)}
        onKeyDown={handleKeyDown}
        className={`
          flex items-center gap-2 px-4 py-[5px] mr-6 rounded-lg
          border border-gray-200 shadow-sm
          hover:shadow-md hover:border-gray-300 
          bg-white
          transform transition-all duration-300 ease-in-out w-[87%]  md:w-full
          ${showDropDown ? "scale-[1.02] border-[#B71C1C]/20" : "scale-100"}
          hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-[#B71C1C] focus:ring-opacity-50
        `}
        aria-expanded={showDropDown}
        aria-haspopup="true"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div
            className={`
              flex-shrink-0 w-7 h-7 bg-[#B71C1C] rounded-full 
              flex items-center justify-center shadow-sm
              transform transition-all duration-300
              ${showDropDown ? "scale-110 rotate-3" : "scale-100 rotate-0"}
            `}
          >
            <span className="text-white font-medium text-xs md:text-sm">
              {userInitial}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs md:text-sm font-medium text-gray-900">
              {currentBusiness
                ? currentBusiness.name
                : accounts && accounts.length > 0
                ? (currentSelectedAccount[0] &&
                    currentSelectedAccount[0].name) ||
                  "***"
                : "---"}
            </span>
            <p className="text-xs text-gray-500">
              {currentBusiness
                ? currentBusiness.email
                : accounts && accounts.length > 0
                ? (currentSelectedAccount[0] &&
                    currentSelectedAccount[0].email) ||
                  "***"
                : "---"}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`
              text-gray-500 ml-2 
              transition-transform duration-300 ease-in-out
              ${showDropDown ? "rotate-180" : "rotate-0"}
            `}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50
          transition-all duration-300 ease-in-out origin-top-right
          ${
            showDropDown
              ? "opacity-100 transform scale-100 translate-y-0 "
              : "opacity-0 transform scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* User Info Section */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {userData.name || "User"}
          </p>
          <p className="text-xs text-gray-500">
            {userData.email || "No email"}
          </p>
        </div>

        {/* Business Accounts */}
        <div className="p-2">
          {accounts && accounts.length > 0
            ? accounts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsLoading(true);
                    setShowDropDown(!showDropDown);
                    setTimeout(() => {
                      setCurrentBusiness(item);
                      saveDataToLocalStorage("businessId", item.id);
                      setIsLoading(false);
                      router.push("/business");
                    }, 3000);
                  }}
                  className={`
                w-full text-left px-3 py-2 flex items-center gap-3 
                hover:bg-gray-50 rounded-md 
                transition-all duration-200 
                focus:outline-none focus:bg-gray-50
                transform hover:translate-x-1
              `}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                  role="menuitem"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                transform transition-transform duration-300 hover:rotate-12"
                  >
                    <Briefcase size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.email}</p>
                  </div>
                </button>
              ))
            : ""}

          {/* Create Business Button */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setShowDropDown(false);
              }}
              className="flex items-center gap-2 justify-center w-full py-2 px-4
                bg-[#B71C1C] text-white rounded-lg 
                hover:bg-[#B71C1C]/90 transition-all duration-200
                transform hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-[#B71C1C] focus:ring-opacity-50
              "
            >
              <Building2 className="w-4 h-4" />
              <span>Create Business</span>
            </button>
          </div>
        </div>
      </div>

      {/* Business Creation Modal */}
      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProfileDropdown;
