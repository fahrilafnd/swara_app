"use client";

import React from "react";
import { ArrowUp, MapPin, Users, Calendar, Star, Clock } from "lucide-react";

export default function Mentor() {
  const stats = [
    {
      label: "Total Peserta Bimbingan",
      value: "24",
      trend: "↑ 3 peserta baru bulan ini",
      trendColor: "text-green-600",
    },
    {
      label: "Sesi Mentoring",
      value: "156",
      trend: "↑ 12 sesi minggu ini",
      trendColor: "text-green-600",
    },
    {
      label: "Rating Rata-rata",
      value: "4.8",
      trend: (
        <span className="flex items-center gap-1 text-sm text-green-600">
          <Star className="w-4 h-4 text-yellow-400" /> dari 98 ulasan
        </span>
      ),
      trendColor: "text-green-600",
    },
    {
      label: "Total Peserta Bimbingan",
      value: "24",
      trend: "↑ 3 peserta baru bulan ini",
      trendColor: "text-green-600",
    },
  ];

  const upcomingSessions = [
    {
      name: "Ahmad Rizki Pramono",
      topic: "Presentasi Bisnis",
      platform: "Zoom/Google Meeting",
      time: "14:00 - 15:00",
    },
    {
      name: "Sarah Melinda Putri",
      topic: "Public Speaking Dasar",
      platform: "Zoom/Google Meeting",
      time: "14:00 - 15:00",
    },
    {
      name: "Daffa Arif Setyawan",
      topic: "Teknik Story Telling",
      platform: "Zoom/Google Meeting",
      time: "14:00 - 15:00",
    },
    {
      name: "Ahmad Rizki Pramono",
      topic: "Presentasi Bisnis",
      platform: "Zoom/Google Meeting",
      time: "14:00 - 15:00",
    },
  ];

  return (
    <div className="pr-8 mb-8">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl p-8 mb-8 shadow-lg">
        <h1 className="text-white text-3xl font-bold mb-2 flex items-center gap-2">
          Selamat Datang, Mentor! 👋
        </h1>
        <p className="text-white text-lg opacity-95">
          Mari berdayakan para pelajar Indonesia untuk menjadi public speaker
          yang percaya diri dan inspiratif.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-orange-500 text-5xl font-bold mb-3">
              {stat.value}
            </p>
            <div className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <p className={`text-sm ${stat.trendColor}`}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Jam Mengajar */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8 hover:shadow-lg transition-shadow">
        <p className="text-gray-600 text-sm mb-2">Total Jam Mengajar</p>
        <p className="text-orange-500 text-5xl font-bold mb-3">248</p>
        <div className="flex items-center gap-1">
          <ArrowUp className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-600">↑ 18 jam bulan ini</p>
        </div>
      </div>

      {/* Sesi Mentoring Mendatang */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Sesi Mentoring Mendatang
        </h2>
        <div className="space-y-4 bg-white rounded-xl shadow-md p-6">
          {upcomingSessions.map((session, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-lg mb-1">
                  {session.name}
                </h3>
                <p className="text-teal-600 text-sm font-medium">
                  {session.topic}
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm">{session.platform}</span>
                </div>

                <div className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold">
                  {session.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
