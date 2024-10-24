"use client";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [navItems, setNavItems] = useState([
    { id: 1, title: "Home", link: "/", isSelected: true },
    { id: 2, title: "FAQ", link: "#", isSelected: false },
  ]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navElement = navItems.map((item) => {
    return (
      <a
        key={item.id}
        href={item.link}
        className={`hover:text-secondary cursor-pointer font-poppins font-normal text-base ${
          item.isSelected ? "text-secondary" : "text-blacc"
        }`}
      >
        {item.title}
      </a>
    );
  });
  const navElementSmallScreen = navItems.map((item) => {
    return (
      <a
        key={item.id}
        href={item.link}
        className={`hover:text-blacc cursor-pointer font-poppins font-medium text-base ${
          item.isSelected ? "text-blacc" : "text-white"
        }`}
      >
        {item.title}
      </a>
    );
  });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 flex flex-row items-center justify-between z-50 bg-white w-full h-fit px-8 py-4 md:px-20 md:py-4">
        <a href="/">
          <Image
            className="w-[50px] h-auto md:w-[70px] md:h-[70px] rounded"
            src="/logo.png"
            width={100}
            height={50}
            quality={100}
            alt="Poynt Logo"
          />
        </a>

        {/* MENU ITEMS AT LARGE SCREEN */}
        <div className="hidden items-center justify-between w-fit gap-8 lg:flex">
          {navElement}
        </div>
        {/* CTAS AT LARGE SCREEN */}
        <div className="hidden items-center justify-between gap-3 lg:flex">
          <a
            href="/auth"
            className="flex items-center justify-center px-6 py-3 rounded-md border border-secondary font-poppins font-normal bg-secondary text-white text-base cursor-pointer hover:bg-blacc hover:border-blacc"
          >
            Create Account
          </a>
        </div>

        {/* MENU ITEMS AT SMALL SCREEN */}
        {showMenu && (
          <div
            className={`absolute flex flex-col items-start justify-start gap-3 w-full h-fit top-full left-0 py-4 px-8 md:px-20 bg-secondary z-50 lg:hidden`}
          >
            {navElementSmallScreen}
            {/* CTAS AT SMALL SCREEN */}
            <div className="flex flex-col items-start justify-between gap-3">
              <a
                href="/auth"
                className="flex items-center justify-center px-6 py-3 rounded-md border border-blacc font-poppins font-normal bg-blacc text-white text-base cursor-pointer"
              >
                Create Account
              </a>
            </div>
          </div>
        )}

        {/* MENU BUTTONS */}
        <div onClick={toggleMenu} className="lg:hidden">
          {!showMenu && <i className="bx bx-menu text-3xl text-secondary"></i>}
          {showMenu && <i className="bx bx-x text-3xl text-secondary"></i>}
        </div>
      </nav>
    </>
  );
}
