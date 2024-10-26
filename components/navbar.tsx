"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "react-responsive";

interface Navprops {
  role: string;
}

export default function Navigation({ role }: Navprops) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
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
  // Media query to check if the screen width is less than 1000px
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });

  // Function to switch menu items
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

  // Update selected menu item based on the current path
  const updateSelectedMenuItem = (path: string) => {
    const updateMenu = (menu: any) =>
      menu.map((item: any) => ({
        ...item,
        isSelected: item.link === path,
      }));

    if (role === "business") {
      setBusinessMenu(updateMenu(businessMenu));
    } else {
      setAdminMenu(updateMenu(adminMenu));
    }
  };

  //DISPLAY MENU ITEMS ELEMENTS FOR BOTH BUSINESS, ADMIN
  const renderMenuItems = (menu: any) =>
    menu.map((item: any) => {
      return (
        <div
          key={item.id}
          onClick={() => {
            switchMenuItem(item.id);
            router.push(item.link);
          }}
          className={`w-full flex flex-col lg:flex-row items-center justify-start gap-4 p-2 lg:px-6 lg:py-4 cursor-pointer hover:bg-main ${
            item.isSelected && !isMobile ? "bg-main" : "bg-transparent"
          }`}
        >
          {item.isSelected ? (
            <Icon
              className="text-blacc text-[31px]"
              icon={item.iconfilled}
              width="1.2em"
              height="1.2em"
            />
          ) : (
            <Icon className="text-blacc text-[30px]" icon={item.icon} />
          )}
          <h3 className="font-poppins font-medium text-xs lg:text-base text-blacc">
            {item.title}
          </h3>
        </div>
      );
    });
  const businessMenuElement = renderMenuItems(businessMenu);
  const adminMenuElement = renderMenuItems(adminMenu);

  // Use effect to listen for route changes and update the selected menu item
  useEffect(() => {
    updateSelectedMenuItem(pathname);
  }, [pathname]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 lg:static w-full h-fit lg:w-[300px] lg:h-screen flex flex-col bg-white justify-start items-center lg:gap-[50px] py-2 lg:py-10 rounded-t-xl lg:rounded-none shadow-nav">
        <Image
          className="w-0 h-auto lg:w-[170px] lg:h-[90px] rounded border border-gray-50"
          src="/trans.png"
          width={100}
          height={50}
          quality={100}
          alt="Poynt Logo"
        />

        <div className="w-full h-fit flex flex-row lg:flex-col gap-2 lg:gap-[1px] justify-evenly lg:justify-start items-center lg:items-start">
          {role === "business" ? businessMenuElement : adminMenuElement}
        </div>
      </div>
    </>
  );
}
