"use client";

import React from 'react';

interface Stats {
  completedTraining: number;
  minutesPracticed: number;
  successRate: number;
  badgesEarned: number;
}

interface StatsGridProps {
  stats: Stats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      <div className="text-center p-3 sm:p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border-2 border-orange-200 hover:scale-105 transition-all duration-300 cursor-pointer">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">{stats.completedTraining}</div>
        <div className="text-xs sm:text-sm text-gray-600 leading-tight">Latihan selesai</div>
      </div>
      <div className="text-center p-3 sm:p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border-2 border-orange-200 hover:scale-105 transition-all duration-300 cursor-pointer">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">{stats.minutesPracticed}</div>
        <div className="text-xs sm:text-sm text-gray-600 leading-tight">Menit berlatih</div>
      </div>
      <div className="text-center p-3 sm:p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border-2 border-orange-200 hover:scale-105 transition-all duration-300 cursor-pointer">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">{stats.successRate}%</div>
        <div className="text-xs sm:text-sm text-gray-600 leading-tight">Tingkat keberhasilan</div>
      </div>
      <div className="text-center p-3 sm:p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border-2 border-orange-200 hover:scale-105 transition-all duration-300 cursor-pointer">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">{stats.badgesEarned}</div>
        <div className="text-xs sm:text-sm text-gray-600 leading-tight">Badge diraih</div>
      </div>
    </div>
  );
}
