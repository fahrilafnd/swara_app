"use client";

import React, { useState } from "react";
import { Users, UserCheck, Calendar, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState("Minggu");
  const stats = [
    {
      icon: Users,
      value: "2,847",
      label: "Pengguna Aktif",
      change: "+12%",
      isPositive: true,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: UserCheck,
      value: "127",
      label: "Mentor Terdaftar",
      change: "+8%",
      isPositive: true,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: Calendar,
      value: "1,524",
      label: "Latihan Minggu Ini",
      change: "+24%",
      isPositive: true,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: Activity,
      value: "34",
      label: "Event Aktif",
      change: "-8%",
      isPositive: false,
      bgColor: "bg-red-100",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden scrollbar-hide">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Hi, Fabyan Yastika Permana
          </h1>
          <p className="text-white text-opacity-90 text-sm sm:text-base">
            Selamat datang di SWARA, rumah belajar public speaking!
          </p>
        </div>

        {/* Decorative microphones */}
        <div className="absolute right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 hidden sm:flex">
          <div className="flex gap-2 sm:gap-4">
            <div className="w-8 h-12 sm:w-12 sm:h-18 md:w-16 md:h-24 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full transform rotate-12 shadow-lg"></div>
            <div className="w-8 h-12 sm:w-12 sm:h-18 md:w-16 md:h-24 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full transform -rotate-12 shadow-lg"></div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute top-4 sm:top-8 right-16 sm:right-32 md:right-64 hidden md:block">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-6 sm:bottom-12 left-1/3 hidden md:block">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full"></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  stat.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Aktivitas Pengguna
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActivePeriod("Minggu")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    activePeriod === "Minggu"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Minggu
                </button>
                <button
                  onClick={() => setActivePeriod("Bulan")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    activePeriod === "Bulan"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Bulan
                </button>
                <button
                  onClick={() => setActivePeriod("Tahun")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    activePeriod === "Tahun"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tahun
                </button>
              </div>
            </div>
          </div>

          {/* Placeholder for chart */}
          <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-xs sm:text-sm">
                GRAFIK PERKEMBANGAN AKTIVITAS
              </p>
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 md:mb-8">
            Tingkat Keberhasilan
          </h2>

          {/* Circular Progress */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 sm:mb-6">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">87%</span>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs sm:text-sm">
              Rata-rata Keberhasilan Pengguna
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
