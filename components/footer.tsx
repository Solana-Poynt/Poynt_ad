"use client";
import Image from "next/image";

export default function Header() {
  return (
    <>
      <div className="w-full h-fit bg-main px-8 py-4 md:px-20 md:py-14 mt-32 flex flex-col lg:flex-row justify-between items-center gap-6">
        <a href="/">
          <Image
            className="w-24 h-auto md:w-fit"
            src="/logo.png"
            width={150}
            height={50}
            quality={100}
            alt="Logo"
          />
        </a>

        <div className="flex flex-col md:flex-row items-center justify-between gap-7">
          <a
            href={"/"}
            className="cursor-pointer font-poppins font-normal text-base text-blacc hover:text-secondary"
          >
            Home
          </a>
          <a
            href={"#"}
            className="cursor-pointer font-poppins font-normal text-base text-blacc hover:text-secondary"
          >
            FAQ
          </a>
        </div>
      </div>
    </>
  );
}
