"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SkorSwaraHeader() {
  const pathname = usePathname();

  const getBackButton = () => {
    if (pathname.includes("/hasil-skor")) {
      return (
        <Link
          href="/skor-swara/sesi-latihan"
          className="flex items-center gap-2 text-orange-600 transition-colors rounded-full p-2 bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </Link>
      );
    }

    if (pathname.includes("/sesi-latihan")) {
      return (
        <Link
          href="/skor-swara"
          className="flex items-center gap-2 text-orange-600  transition-colors rounded-full p-2 bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </Link>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-30 flex w-full pl-4 sm:pl-8 lg:pl-1 pr-8 py-5">
      <div className="flex w-full rounded-3xl">
        <div className="flex grow items-center justify-between">
          <div className="w-full pl-14 sm:gap-4 lg:pl-0 flex items-center">
            <div className="flex w-[160px] md:w-[300px] relative">
              {getBackButton()}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4 ml-4">
            <div className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                width="25"
                height="26"
                viewBox="0 0 25 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.8896 11.9583C19.4948 17.5573 21.875 19.25 21.875 19.25H3.125C3.125 19.25 6.25 17.0281 6.25 9.24999C6.25 7.48229 6.90833 5.78645 8.08021 4.53645C9.25208 3.28645 10.8438 2.58333 12.5 2.58333C12.8521 2.58333 13.1993 2.61458 13.5417 2.67708M14.3021 22.375C14.1189 22.6907 13.8561 22.9528 13.5398 23.1349C13.2236 23.3171 12.865 23.413 12.5 23.413C12.135 23.413 11.7764 23.3171 11.4602 23.1349C11.1439 22.9528 10.8811 22.6907 10.6979 22.375M19.7917 8.83333C20.6205 8.83333 21.4153 8.50409 22.0014 7.91804C22.5874 7.33199 22.9167 6.53713 22.9167 5.70833C22.9167 4.87953 22.5874 4.08467 22.0014 3.49862C21.4153 2.91257 20.6205 2.58333 19.7917 2.58333C18.9629 2.58333 18.168 2.91257 17.582 3.49862C16.9959 4.08467 16.6667 4.87953 16.6667 5.70833C16.6667 6.53713 16.9959 7.33199 17.582 7.91804C18.168 8.50409 18.9629 8.83333 19.7917 8.83333Z"
                  stroke="#39363D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Link
              href="/profile"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                className="w-[48px] h-[48px] rounded-full border-2 border-[#F07122] cursor-pointer"
                alt="pp"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
