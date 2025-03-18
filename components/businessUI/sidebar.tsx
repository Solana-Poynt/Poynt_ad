"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "react-responsive";
import { LogOut, Menu, X } from "lucide-react";
import { logout } from "@/store/slices/isAuthSlice";
import { clearWallet } from "@/store/slices/isWalletSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { googleLogout } from "@react-oauth/google";
// import { useOkto, type OktoContextType } from "okto-sdk-react";

interface NavProps {
  role: string;
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

interface MenuItem {
  id: number;
  isSelected: boolean;
  icon: string;
  iconfilled: string;
  title: string;
  link: string;
}

export default function SideNavigation({
  role,
  isOpen,
  toggleSidebar,
}: NavProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1000px)" });

  // Use the prop if provided, otherwise use local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isTablet);
  // const { logOut } = useOkto() as OktoContextType;

  // Update sidebar state based on props or screen size changes
  useEffect(() => {
    if (isOpen !== undefined) {
      setIsSidebarOpen(isOpen);
    } else {
      setIsSidebarOpen(!isTablet);
    }
  }, [isTablet, isOpen]);

  const toggleSidebarState = () => {
    if (toggleSidebar) {
      toggleSidebar();
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const [businessMenu, setBusinessMenu] = useState<MenuItem[]>([
    {
      id: 1,
      isSelected: true,
      icon: "heroicons:home",
      iconfilled: "heroicons:home-solid",
      title: "Dashboard",
      link: "/business",
    },
    {
      id: 2,
      isSelected: false,
      icon: "heroicons:presentation-chart-bar",
      iconfilled: "heroicons:presentation-chart-bar-16-solid",
      title: "Campaign",
      link: "/business/campaigns",
    },
    {
      id: 3,
      isSelected: false,
      icon: "solar:wallet-outline",
      iconfilled: "solar:wallet-bold",
      title: "Wallet",
      link: "/business/wallet",
    },
  ]);

  const [adminMenu, setAdminMenu] = useState<MenuItem[]>([
    {
      id: 1,
      isSelected: true,
      icon: "material-symbols-light:team-dashboard-outline",
      iconfilled: "material-symbols-light:team-dashboard",
      title: "Dashboard",
      link: "/admin",
    },
    {
      id: 2,
      isSelected: false,
      icon: "icon-park:ad",
      iconfilled: "icon-park-solid:ad",
      title: "Campaigns",
      link: "/admin/campaigns",
    },
    {
      id: 3,
      isSelected: false,
      icon: "heroicons:user-group",
      iconfilled: "heroicons:user-group-solid",
      title: "Users",
      link: "/admin/users",
    },
    {
      id: 4,
      isSelected: false,
      icon: "octicon:person-24",
      iconfilled: "octicon:person-fill-24",
      title: "Profile",
      link: "/admin/profile",
    },
  ]);

  function switchMenuItem(id: number) {
    if (role === "business") {
      setBusinessMenu((prev) =>
        prev.map((item) => ({
          ...item,
          isSelected: item.id === id,
        }))
      );
    } else {
      setAdminMenu((prev) =>
        prev.map((item) => ({
          ...item,
          isSelected: item.id === id,
        }))
      );
    }
  }

  const logUserout = async () => {
    try {
      googleLogout();
      dispatch(logout());
      dispatch(clearWallet());
      // logOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateSelectedMenuItem = (path: string) => {
    const updateMenu = (menu: MenuItem[]) =>
      menu.map((item) => ({
        ...item,
        isSelected: item.link === path,
      }));

    if (role === "business") {
      setBusinessMenu(updateMenu(businessMenu));
    } else {
      setAdminMenu(updateMenu(adminMenu));
    }
  };

  const handleNavigation = (id: number, link: string) => {
    switchMenuItem(id);
    router.push(link);

    // Close sidebar on mobile after navigation
    if (isMobile) {
      if (toggleSidebar) {
        toggleSidebar();
      } else {
        setIsSidebarOpen(false);
      }
    }
  };

  const renderMenuItems = (menu: MenuItem[]) =>
    menu.map((item) => (
      <div
        key={item.id}
        onClick={() => handleNavigation(item.id, item.link)}
        className={`flex items-center ${
          isSidebarOpen ? "px-4" : "justify-center"
        } py-2 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          item.isSelected
            ? "bg-main text-side"
            : "text-[#575757] hover:bg-gray-50"
        }`}
      >
        {item.isSelected ? (
          <Icon
            className="text-side"
            icon={item.iconfilled}
            width={isMobile ? "20" : "24"}
            height={isMobile ? "20" : "24"}
          />
        ) : (
          <Icon
            className="text-[#575757]"
            icon={item.icon}
            width={isMobile ? "20" : "24"}
            height={isMobile ? "20" : "24"}
          />
        )}
        {isSidebarOpen && (
          <span
            className={`ml-3 font-medium ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {item.title}
          </span>
        )}
      </div>
    ));

  useEffect(() => {
    updateSelectedMenuItem(pathname);
  }, [pathname]);

  return (
    <>
      {/* Overlay for mobile - appears when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebarState}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 lg:relative h-screen lg:h-[80vh] mb-4 py-5 rounded-0 lg:rounded-lg bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50 shadow-lg 
          ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-16 -translate-x-full lg:translate-x-0"
          }
          ${isMobile && !isSidebarOpen ? "hidden" : ""}
        `}
      >
        {/* Close button - only on mobile */}
        {isMobile && isSidebarOpen && (
          <button
            onClick={toggleSidebarState}
            className="absolute top-3 right-4 p-1 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 mt-4 md:mt-0 overflow-y-auto">
          <div className="w-full flex flex-col gap-2">
            {role === "business"
              ? renderMenuItems(businessMenu)
              : renderMenuItems(adminMenu)}
          </div>
        </nav>

        {/* Profile & Logout Section */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={logUserout}
            className={`w-full flex ${
              !isSidebarOpen ? "justify-center" : ""
            } items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors`}
          >
            <LogOut size={isMobile ? 18 : 20} />
            {isSidebarOpen && (
              <span
                className={`${isMobile ? "text-xs" : "text-sm"} font-medium`}
              >
                Log Out
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// Default props
SideNavigation.defaultProps = {
  isOpen: undefined,
  toggleSidebar: undefined,
};
