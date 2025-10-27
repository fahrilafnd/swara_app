"use client";

import React from 'react';

interface StatsCardsProps {
  stats: {
    completedTraining: number;
    minutesPracticed: number;
    successRate: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow text-center">
        <div className="text-orange-500 text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">{stats.completedTraining}</div>
        <div className="text-gray-400 text-xs sm:text-sm">Latihan selesai</div>
      </div>
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow text-center">
        <div className="text-orange-500 text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">{stats.minutesPracticed}</div>
        <div className="text-gray-400 text-xs sm:text-sm">Menit berlatih</div>
      </div>
      <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow text-center md:col-span-2 lg:col-span-1">
        <div className="text-orange-500 text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">{stats.successRate}%</div>
        <div className="text-gray-400 text-xs sm:text-sm">Tingkat keberhasilan</div>
      </div>
    </div>
  );
}
