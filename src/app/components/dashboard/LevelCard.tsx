"use client";

import React from 'react';

interface LevelCardProps {
  level: number;
  xp: number;
  maxXp: number;
}

export default function LevelCard({ level, xp, maxXp }: LevelCardProps) {
  const progressPercentage = (xp / maxXp) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 mb-4 sm:mb-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center mb-3">
        <h3 className="text-gray-600 text-xs sm:text-sm font-medium">Level kamu</h3>
      </div>
      <div className="flex items-center gap-3 mb-4 sm:mb-5 justify-center">
        <div className="text-orange-500 text-5xl sm:text-6xl lg:text-7xl font-bold leading-none">{level}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden mb-2 relative">
        <div 
          className="bg-orange-500 h-2 sm:h-3 rounded-full transition-all duration-500 relative" 
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Progress value label above rocket */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            <div className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
              {xp}
            </div>
          </div>
          {/* Rocket icon on progress bar - using PNG image */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
            <img 
              src="/noto_rocket.png" 
              alt="Rocket" 
              className="w-10 h-10 sm:h-8 object-contain"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 font-medium">
        <span>100</span>
        <span>{maxXp}</span>
      </div>
    </div>
  );
}
