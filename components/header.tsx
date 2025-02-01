"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMenu, IoClose } from "react-icons/io5";
import { getDataFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const router = useRouter();

  const isAuthenticated = useSelector(
    (state: RootState) => state.isAuth.isAuth
  );

  const handleAuth = () => {
    if (isAuthenticated) {
      const role = getDataFromLocalStorage("role");
      const route = role === "admin" ? "/admin" : "/business";
      router.push(route);
    } else {
      router.push("/auth");
    }
  };

  const navItems = [
    { id: 1, title: "FAQ", href: "/faq" },
    { id: 2, title: "About", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Get the scroll position relative to the viewport top
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      setHasScrolled(scrolled > 0);
    };

    // Add scroll event listener with requestAnimationFrame for better performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check initial scroll position
    handleScroll();

    // Add event listener
    window.addEventListener("scroll", onScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`transition-all duration-300 ease-in-out backdrop-blur-sm
          ${
            hasScrolled
              ? "bg-white border-b shadow-sm py-2"
              : "bg-transparent py-4"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-1">
              <Link href="/" className="flex items-center">
                <div className="relative w-12 h-12 sm:w-20 sm:h-14">
                  <Image
                    src="/home-logo.svg"
                    fill
                    // sizes="(max-width: 768px) 48px, 56px"
                    priority
                    alt="Poynt Adblock Logo"
                    className="rounded object-contain"
                  />
                </div>
              </Link>
              
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-black hover:text-[#B71C1C] px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.title}
                </Link>
              ))}

              <button
                onClick={handleAuth}
                className="ml-8 inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#B71C1C] hover:bg-[#805c02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#805c02] transition-all duration-200 transform hover:scale-105"
              >
                Create Account
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-[#B71C1C] hover:text-gray-600 hover:bg-[#f8e8e8] focus:outline-none transition-colors duration-200"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <IoClose className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <IoMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-200 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block px-4 py-2.5 text-base font-medium text-black hover:text-[#B71C1C] hover:bg-[#f8e8e8] rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/auth"
              className="block w-full text-center px-4 py-3 text-base font-medium text-white bg-[#B71C1C] hover:bg-[#805c02]/70 rounded-lg transition-all duration-200 transform hover:scale-105 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
