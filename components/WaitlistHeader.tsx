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
      router.push("/auth-biz/auth");
    }
  };

  const navItems = [{ id: 1, title: "Join Waitlist", href: "/waitlist" }];

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
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-200 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        ></div>
      </nav>
    </header>
  );
}
