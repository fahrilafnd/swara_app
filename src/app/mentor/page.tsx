"use client";

import React from "react";
import { ArrowUp, MapPin, Users, Calendar, Star, Clock } from "lucide-react";

export default function Mentor() {
  const stats = [
    {
      label: "Total Peserta Bimbingan",
      value: "24",
      trend: "3 peserta baru bulan ini",
      trendColor: "text-green-600",
    },
    {
      label: "Sesi Mentoring",
      value: "156",
      trend: "12 sesi minggu ini",
      trendColor: "text-green-600",
    },
    {
      label: "Rating Rata-rata",
      value: "4.8",
      trend: "dari 98 ulasan",
      trendColor: "text-green-600",
    },
    {
      label: "Total Jam Mengajar",
      value: "248",
      trend: "18 jam bulan ini",
      trendColor: "text-green-600",
    },
  ];

  const upcomingSessions = [
    {
      name: "Ahmad Rizki Pramono",
      topic: "Presentasi Bisnis",
      time: "14:00 - 15:00",
    },
    {
      name: "Sarah Melinda Putri",
      topic: "Public Speaking Dasar",
      time: "14:00 - 15:00",
    },
    {
      name: "Daffa Arif Setyawan",
      topic: "Teknik Story Telling",
      time: "14:00 - 15:00",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-lg">
        <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
          Selamat Datang, Mentor! 👋
        </h1>
        <p className="text-white text-sm sm:text-base lg:text-lg opacity-95">
          Mari berdayakan para pelajar Indonesia untuk menjadi public speaker
          yang percaya diri dan inspiratif.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-gray-600 text-xs sm:text-sm mb-2 font-medium">
              {stat.label}
            </p>
            <p className="text-orange-500 text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
              {stat.value}
            </p>
            <div className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <p className={`text-xs sm:text-sm ${stat.trendColor}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sesi Mentoring Hari Ini */}
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Sesi Mentoring Hari Ini
        </h2>
        <div className="space-y-4 sm:space-y-5">
          {upcomingSessions.map((session, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left: Avatar + Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                      {session.name.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 truncate">
                      {session.name}
                    </h3>
                    <p className="text-sm sm:text-base text-teal-600 font-medium truncate">
                      {session.topic}
                    </p>
                  </div>
                </div>

                {/* Right: Time Badge */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-center">
                    <p className="text-sm sm:text-base lg:text-lg font-bold whitespace-nowrap">
                      {session.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {upcomingSessions.length === 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-8 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Tidak Ada Jadwal
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Anda tidak memiliki sesi mentoring hari ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
