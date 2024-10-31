"use client";
// #B71C1C #FDF6E6
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoMenu, IoClose } from "react-icons/io5";
import { File } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

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
                <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                  <Image
                    src="/trans.png"
                    fill
                    sizes="(max-width: 768px) 48px, 56px"
                    priority
                    alt="Poynt Adblock Logo"
                    className="rounded object-contain"
                  />
                </div>
              </Link>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap">
                Poynt
              </h2>
            </div>
            <Link
              href="/business"
              className="ml-8 inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#B71C1C] hover:bg-[#805c02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#805c02] transition-all duration-200 transform hover:scale-105"
            >
              Go to Dashboard
              <File className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
