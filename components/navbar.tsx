"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "react-responsive";
import { Menu, X, ChevronDown, ChevronUp, Plus, LogOut } from "lucide-react";

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
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  const [showDropDown, setShowDropDown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [businessMenu, setBusinessMenu] = useState<MenuItem[]>([
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

  useEffect(() => {
    updateSelectedMenuItem(pathname);
  }, [pathname]);

  // Handle clicking outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        overlayRef.current &&
        !(overlayRef.current as any).contains(event.target)
      ) {
        setShowDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [overlayRef]);

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } fixed inset-y-0 left-0 lg:relative h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        
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

      {/* Account Selector */}
      {isSidebarOpen && (
        <div className="px-4 py-4 border-b border-gray-200" ref={overlayRef}>
          <button
            onClick={() => setShowDropDown(!showDropDown)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors relative group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-[#B71C1C] rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">P</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                Business Account
              </p>
              <p className="text-xs text-gray-500 truncate">
                sol_poynt@gmail.com
              </p>
            </div>
            <div className="flex-shrink-0">
              {showDropDown ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropDown && (
            <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-2 space-y-1">
                {["Business Account 1", "Business Account 2"].map(
                  (account, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#B71C1C] bg-opacity-90 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {account[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {account}
                          </p>
                          <p className="text-xs text-gray-500">
                            account{index + 1}@example.com
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                )}

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-[#B71C1C] hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#B71C1C] border-dashed flex items-center justify-center">
                      <Plus size={16} className="text-[#B71C1C]" />
                    </div>
                    <span>Add Another Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="w-full flex flex-col gap-1">
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
              /* Add logout handling */
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
