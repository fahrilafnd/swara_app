// src/app/components/dashboard/StatsCards.tsx
"use client";

import React from "react";
import { Mic, Flame, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

interface StatsCardsProps {
  stats: {
    completedTraining: number;
    minutesPracticed: number;
    successRate: number;
    micBalance: number;
    dailyStreak: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div
      data-tour="stats-cards"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
    >
      {/* Mic Balance Card - Prominent */}
      <div className="sm:col-span-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden hover:shadow-2xl transition-all">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">
                  Stock Mic Kamu
                </p>
                <p className="text-xs text-white/60">
                  Reset setiap hari (00:00 WIB)
                </p>
              </div>
            </div>
            <Link href={"/dashboard/beli-mic"} className="flex items-center gap-1">Beli Mic <ArrowRight /></Link>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-5xl sm:text-6xl font-black">
              {stats.micBalance}
            </p>
            <p className="text-xl sm:text-2xl font-semibold text-white/80">
              / 6
            </p>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.micBalance / 6) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/70 mt-3">
            💡 Selesaikan Daily Mission untuk mendapat mic tambahan!
          </p>
        </div>
      </div>

      {/* Daily Streak */}
      <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">
              {stats.dailyStreak}
            </p>
            <p className="text-xs text-gray-500 font-medium">Hari</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 font-semibold">Streak Harian</p>
        <p className="text-xs text-gray-500 mt-1">Pertahankan streak-mu!</p>
      </div>

      {/* Latihan Selesai */}
      <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">
              {stats.completedTraining}
            </p>
            <p className="text-xs text-gray-500 font-medium">Selesai</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 font-semibold">Latihan Selesai</p>
        <p className="text-xs text-gray-500 mt-1">Total bulan ini</p>
      </div>
    </div>
  );
}
