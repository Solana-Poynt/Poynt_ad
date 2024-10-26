"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="rounded font-poppins font-bold flex justify-center items-center p-3">
        Campaign Overview
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 mt-5">
        <div className="w-full md:flex-1 bg-gradient-to-l from-main to-main rounded font-poppins font-bold flex justify-start gap-1 items-center p-3">
          <i className="bx bxs-data text-[25px] md:text-[30px] text-secondary"></i>
          <h4 className="font-poppins font-bold text-[12px] md:text-[14px] text-secondary flex justify-start items-center gap-5">
            <span>All Ads</span>
            <span className="font-light text-[25px] text-blacc">0</span>
          </h4>
        </div>
        <div className="w-full md:flex-1 bg-gradient-to-l from-main to-main rounded font-poppins font-bold flex justify-start gap-1 items-center p-3">
          <i className="bx bx-file text-[25px] md:text-[30px] text-secondary"></i>
          <h4 className="font-poppins font-bold text-[12px] md:text-[14px] text-secondary flex justify-start items-center gap-5">
            <span>Ads in Draft</span>
            <span className="font-light text-[25px] text-blacc">0</span>
          </h4>
        </div>
        <div className="w-full md:flex-1 bg-gradient-to-l from-main to-main rounded font-poppins font-bold flex justify-start gap-1 items-center p-3">
          <i className="bx bx-play-circle text-[25px] md:text-[30px] text-secondary"></i>
          <h4 className="font-poppins font-bold text-[12px] md:text-[14px] text-secondary flex justify-start items-center gap-5">
            <span>Active Ads</span>
            <span className="font-light text-[25px] text-blacc">0</span>
          </h4>
        </div>
        <div className="w-full md:flex-1 bg-gradient-to-l from-main to-main rounded font-poppins font-bold flex justify-start gap-1 items-center p-3">
          <i className="bx bx-send text-[25px] md:text-[30px] text-secondary"></i>
          <h4 className="font-poppins font-bold text-[12px] md:text-[14px] text-secondary flex justify-start items-center gap-5">
            <span>Published Ads</span>
            <span className="font-light text-[25px] text-blacc">0</span>
          </h4>
        </div>
      </div>
    </>
  );
}
