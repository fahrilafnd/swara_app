"use client";

import React from "react";

interface HeroSectionProps {
  onStartTraining: () => void;
}

export default function HeroSection({ onStartTraining }: HeroSectionProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 h-80 md:h-96">
      {/* Background with outdoor scene simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-green-100 to-blue-200">
        {/* Simulated outdoor environment with trees and buildings */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-300/30 via-transparent to-sky-200/40"></div>

        <div className="absolute -top-60">
          <img src="/skor-swara/hero.jpg" alt="" />
        </div>

        {/* Simulated background elements (trees, buildings) */}
        <div className="absolute top-4 right-8 w-12 h-16 bg-green-300/40 rounded-full blur-sm"></div>
        <div className="absolute top-8 right-12 w-8 h-12 bg-green-400/40 rounded-full blur-sm"></div>
        <div className="absolute top-12 right-16 w-6 h-8 bg-green-500/40 rounded-full blur-sm"></div>
      </div>

      {/* Orange gradient overlay covering bottom 2/3 */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3  bg-gradient-to-t from-orange-500  via-orange-400/80 to-transparent"></div>

      {/* Content positioned on the orange overlay */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-tight flex-1">
          Tingkatkan Kemampuan
          <br />
          Public Speaking Anda
        </h1>
        <button
          onClick={onStartTraining}
          className="bg-white text-orange-500 px-6 py-3 rounded-lg font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 whitespace-nowrap"
        >
          Mulai Latihan
        </button>
      </div>
    </div>
  );
}
