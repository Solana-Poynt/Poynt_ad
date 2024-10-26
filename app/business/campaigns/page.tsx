"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Page() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start gap-1 md:items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <h1 className="hidden md:block font-poppins font-bold text-[18px]">
            Ads
          </h1>
          <div className="relative flex items-center justify-start gap-5  border border-gray-300 rounded p-2">
            <div className="w-[20px] h-[20px] bg-gradient-to-l from-main to-main opacity-90 rounded font-poppins font-bold flex justify-center items-center border border-blacc">
              P
            </div>
            <h2 className="font-poppins font-normal text-secondary text-[12px]">
              sol_poynt@gmail.com
            </h2>
            <div
              onClick={() => {
                setShowDropDown((prev: any) => !prev);
              }}
            >
              {showDropDown ? (
                <i className="bx bx-caret-up text-secondary text-[16px] cursor-pointer"></i>
              ) : (
                <i className="bx bx-caret-down text-secondary text-[16px] cursor-pointer"></i>
              )}
            </div>

            {showDropDown && (
              <div
                className={`absolute flex flex-col items-start justify-start gap-3 w-full h-fit top-full left-0 py-2 bg-main z-50 shadow-customhover`}
              >
                <div className="w-full flex flex-col justify-start items-start cursor-pointer py-2 px-4 hover:bg-primary">
                  <h3 className="font-poppins font-semibold text-[14px] text-blacc">
                    Business Name
                  </h3>
                  <p className="font-poppins font-normal text-[12px] text-gray-400">
                    poynt@gmail.com <br></br>
                  </p>
                </div>
                <div className="w-full flex flex-col justify-start items-start cursor-pointer py-2 px-4 hover:bg-primary">
                  <h3 className="font-poppins font-semibold text-[14px] text-blacc">
                    Business Name
                  </h3>
                  <p className="font-poppins font-normal text-[12px] text-gray-400">
                    sol_poynt@gmail.com <br></br>
                  </p>
                </div>
              </div>
            )}
          </div>
          <a
            onClick={() => {
              if (overlayRef.current) {
                overlayRef.current.style.display = "flex";
              }
            }}
            className="h-9 md:h-11 flex items-center justify-between gap-1 px-2 py-1 rounded-full md:rounded-md md:border border-secondary font-poppins font-normal bg-secondary text-white text-xs md:text-sm  cursor-pointer hover:bg-blacc hover:border-blacc"
          >
            <i className="bx bx-plus text-[20px] text-main"></i>
            <span className="hidden md:block">New Business</span>
          </a>
        </div>
        <div className="relative flex items-center justify-start gap-3 border border-gray-300 rounded p-2">
          <i className="bx bx-wallet text-[20px] text-blacc"></i>
          <h2 className="font-poppins font-normal text-secondary text-[12px]">
            1FfmbHfnpaZjKFvyi1okTjJJusN455paPH
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between bg-warmwhite gap-3 rounded p-2 w-full h-[45px] md:w-3/5 md:h-[45px] md:px-5 border-[1px] border-gray-300 mt-5">
        <i className="bx bx-search text-lg md:text-xl"></i>
        <input
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for Campaigns"
          className="text-gray-500 text-sm font-normal outline-none border-none w-full bg-transparent"
        />
      </div>

      <div className="w-full flex justify-start items-center gap-5 mt-5">
        <a className="h-9 md:h-11 flex items-center justify-between gap-1 px-2 py-1 rounded-md border border-secondary font-poppins font-normal bg-secondary text-white text-xs md:text-sm cursor-pointer hover:bg-blacc hover:border-blacc">
          <i className="bx bx-plus text-[20px] text-main"></i>
          <span>Create</span>
        </a>
        <a className="h-9 md:h-11 flex items-center justify-between gap-2 px-2 md:px-4 py-1 rounded-md border border-secondary font-poppins font-normal text-blacc text-xs md:text-sm cursor-pointer hover:border-blacc">
          <i className="bx bxs-pencil text-[20px] text-blacc"></i>
          <span>Edit</span>
        </a>
      </div>

      <div className="w-full border border-gray-300 overflow-x-auto mt-2">
        {/* TOP SECTION */}
        <div className="w-full flex items-start justify-start border-gray-300 border-l">
          <div className="min-w-20 h-9 flex justify-center items-center p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            <input
              className="border-2 outline-none border-blue-500 w-[22px] h-[22px] rounded-md cursor-pointer hover:bg-blue-100 checked:bg-transparent checked:border-blue-500"
              type="checkbox"
            />
          </div>
          <div className="min-w-20 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            On/Off
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Campaign
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Status
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Budget
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Reach
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Impressions
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Cost per reach
          </div>
          <div className="min-w-40 h-9 flex justify-start items-start p-1 border-r border-b border-gray-300 font-poppins font-semibold text-blacc text-[15px]">
            Funds spent
          </div>
        </div>

        {/* CONTENT */}
        <div className="w-full flex items-start justify-start border-gray-300 hover:bg-main">
          <div className="min-w-20 min-h-14 flex justify-center items-center p-1 bg-warmwhite border-r border-b border-gray-300">
            <input
              className="border-2 outline-none border-blue-500 w-[22px] h-[22px] rounded-md cursor-pointer hover:bg-blue-100 checked:bg-transparent checked:border-blue-500"
              type="checkbox"
            />
          </div>
          <div className="min-w-20 min-h-14 flex justify-center items-center p-1 bg-warmwhite border-r border-b border-gray-300">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 rounded-full peer-checked:bg-blue-100 peer-focus:ring-1 dark:bg-white dark:peer-focus:ring-secondary border-[1px] border-gray-300"></div>
              <div className="absolute left-1 top bg-blacc w-5 h-5 rounded-full transition-all border-[1px] border-gray-300 peer-checked:translate-x-[80%] peer-checked:bg-secondary peer-checked:w-6 peer-checked:h-6"></div>
            </label>
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            My campaign
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            Active
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            20 000
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            5k
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            2.5k
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            500
          </div>
          <div className="min-w-40 min-h-14 flex justify-start items-start p-1 border-r border-b border-gray-300 bg-warmwhite font-poppins font-normal text-blacc text-[14px]">
            13 000
          </div>
        </div>
      </div>

      {/* POP UP CREATE BUSINESS */}
      <div
        className="absolute top-0 right-0 w-full h-full hidden justify-center items-center bg-overlay"
        id="overlay"
        ref={overlayRef}
      >
        <div className="w-[95%] lg:w-[40%] flex flex-col gap-9 bg-white rounded-lg p-5">
          <h1 className="font-poppins font-medium text-blacc text-[16px] lg:text-[20px]">
            Create a New Business Ad Account
          </h1>

          <p className="font-poppins font-normal text-blacc text-[16px]">
            You are about to create a new business ad account.
          </p>

          <div className="w-full flex justify-end items-center gap-3">
            <button
              onClick={() => {
                if (overlayRef.current) {
                  overlayRef.current.style.display = "none";
                }
              }}
              className="h-9 md:h-11 flex items-center justify-between gap-1 px-3 py-1 rounded-md border border-secondary font-poppins font-normal bg-transparent text-blacc text-xs md:text-sm cursor-pointer "
            >
              Cancel
            </button>
            <button className="h-9 md:h-11 flex items-center justify-between gap-1 px-3 py-1 rounded-md border border-secondary font-poppins font-normal bg-secondary text-white text-xs md:text-sm cursor-pointer hover:bg-blacc hover:border-blacc">
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
