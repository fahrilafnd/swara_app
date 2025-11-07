"use client";

import React from "react";

interface HeaderSectionProps {
  onTakeTour?: () => void;
  userName?: string; // ⬅️ terima prop nama
}

export default function HeaderSection({
  userName,
  onTakeTour,
}: HeaderSectionProps) {
  return (
    <header className="bg-orange-500 rounded-xl py-11 px-0 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 sm:top-6 left-8 sm:left-12 w-12 h-12 sm:w-16 sm:h-16 bg-orange-300 rounded-full opacity-30"></div>
        <div className="absolute top-6 sm:top-10 right-16 sm:right-20 w-8 h-8 sm:w-12 sm:h-12 bg-orange-200 rounded-full opacity-40"></div>
        <div className="absolute bottom-4 sm:bottom-6 right-8 sm:right-12 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 sm:w-32 sm:h-32 bg-orange-300 rounded-full opacity-20"></div>
      </div>

      {/* Decorative microphone icons */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 w-12 h-12 sm:w-16 sm:h-16">
        <div className="w-full h-full bg-purple-600 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
          <div className="w-6 h-8 sm:w-8 sm:h-12 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-1 sm:bottom-2 w-3 h-4 sm:w-4 sm:h-6 bg-purple-400 rounded"></div>
        </div>
      </div>
      <div className="absolute top-6 sm:top-8 right-8 sm:right-12 w-16 h-16 sm:w-20 sm:h-20">
        <div className="w-full h-full bg-purple-600 rounded-3xl -rotate-12 flex items-center justify-center shadow-lg">
          <div className="w-8 h-10 sm:w-10 sm:h-14 bg-purple-400 rounded-full"></div>
        </div>
      </div>
      <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-8 w-10 h-10 sm:w-14 sm:h-14">
        <div className="w-full h-full bg-yellow-400 rounded-2xl rotate-45 flex items-center justify-center shadow-lg">
          <div className="w-4 h-6 sm:w-6 sm:h-10 bg-yellow-300 rounded-full"></div>
        </div>
      </div>

      {/* Content Container - Aligned with main content */}
      <div className="w-full px-4 sm:px-6 relative z-10">
        <div className="text-center">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 px-4">
            Hi, {userName ?? "Pengguna"} 👋
          </h1>
          <p className="text-white text-sm sm:text-base opacity-90 mb-4 px-4">
            Selamat datang di SWARA, rumah belajar public speaking!
          </p>
          <button
            onClick={onTakeTour}
            className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-white/30 transition-all inline-flex items-center gap-2"
          >
            Take Tour
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
