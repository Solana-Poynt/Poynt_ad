"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "react-responsive";
import { Menu, X } from "lucide-react";

interface NavProps {
  role: string;
}

export default function Navigation({ role }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  const [showDropDown, setShowDropDown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [businessMenu, setBusinessMenu] = useState([
    {
      id: 1,
      isSelected: true,
      icon: "material-symbols-light:team-dashboard-outline",
      iconfilled: "material-symbols-light:team-dashboard",
      title: "Dashboard",
      link: "/business",
    },
    {
      id: 2,
      isSelected: false,
      icon: "icon-park:ad",
      iconfilled: "icon-park-solid:ad",
      title: "Campaigns",
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

  const [adminMenu, setAdminMenu] = useState([
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

  const updateSelectedMenuItem = (path: string) => {
    const updateMenu = (menu: any[]) =>
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
  };

  const renderMenuItems = (menu: any[]) =>
    menu.map((item) => (
      <div
        key={item.id}
        onClick={() => handleNavigation(item.id, item.link)}
        className={`flex items-center ${
          isSidebarOpen ? "px-4" : "justify-center"
        } py-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          item.isSelected
            ? "bg-[#B71C1C] text-white"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        {item.isSelected ? (
          <Icon
            className="text-white"
            icon={item.iconfilled}
            width="20"
            height="20"
          />
        ) : (
          <Icon
            className="text-gray-600"
            icon={item.icon}
            width="20"
            height="20"
          />
        )}
        {isSidebarOpen && (
          <span className="ml-3 text-sm font-medium">{item.title}</span>
        )}
      </div>
    ));

  // Update selected menu item when path changes
  useEffect(() => {
    updateSelectedMenuItem(pathname);
  }, [pathname]);

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-56" : "w-20"
      } fixed inset-y-0 left-0 lg:relative h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 mt-1">
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
        <div className="w-full flex flex-row lg:flex-col gap-2 lg:gap-1 justify-evenly lg:justify-start items-center lg:items-stretch">
          {role === "business"
            ? renderMenuItems(businessMenu)
            : renderMenuItems(adminMenu)}
        </div>
      </nav>
    </aside>
  );
}
