"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "react-responsive";
import { Menu, X, ChevronDown, ChevronUp, Plus, LogOut } from "lucide-react";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { logOut } from "@/store/slices/isAuthSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { googleLogout } from "@react-oauth/google";

interface NavProps {
  role: string;
}

interface MenuItem {
  id: number;
  isSelected: boolean;
  icon: string;
  iconfilled: string;
  title: string;
  link: string;
}

export default function Navigation({ role }: NavProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();
  const overlayRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    {
      id: 4,
      isSelected: false,
      icon: "octicon:person-24",
      iconfilled: "octicon:person-fill-24",
      title: "Profile",
      link: "/business/profile",
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

  const logout = async () => {
    try {
      googleLogout();
      // Clear auth state in Redux
      dispatch(logOut());

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
    event?.preventDefault();
    switchMenuItem(id);
    router.push(link);
    if (isMobile) {
      setIsSidebarOpen(false);
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
            ? "bg-[#821414] text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        {item.isSelected ? (
          <Icon
            className="text-white"
            icon={item.iconfilled}
            width="24"
            height="24"
          />
        ) : (
          <Icon
            className="text-gray-600"
            icon={item.icon}
            width="24"
            height="24"
          />
        )}
        {isSidebarOpen && (
          <span className="ml-3 text-sm font-medium">{item.title}</span>
        )}
      </div>
    ));

  useEffect(() => {
    updateSelectedMenuItem(pathname);
  }, [pathname]);

  

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } fixed inset-y-0 left-0 lg:relative h-screen bg-[#F0F0F0] border-r border-gray-200 flex flex-col transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4  border-gray-200">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="w-full flex flex-col gap-2">
          {role === "business"
            ? renderMenuItems(businessMenu)
            : renderMenuItems(adminMenu)}
        </div>
      </nav>

      {/* Profile & Logout Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {isSidebarOpen && (
          <button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
