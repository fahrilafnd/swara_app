"use client";

import { useState } from "react";

export default function JadwalMentoringPage() {
  const jadwalSesi = [
    {
      id: 1,
      nama: "Ahmad Rizki Pramono",
      topik: "Presentasi Bisnis",
      waktu: "14:00 - 15:00",
      tanggal: "15 Nov 2025",
      avatar: "/avatar1.jpg",
    },
    {
      id: 2,
      nama: "Sarah Melinda Putri",
      topik: "Public Speaking Dasar",
      waktu: "14:00 - 15:00",
      tanggal: "16 Nov 2025",
      avatar: "/avatar2.jpg",
    },
    {
      id: 3,
      nama: "Daffa Arif Setyawan",
      topik: "Teknik Story Telling",
      waktu: "14:00 - 15:00",
      tanggal: "17 Nov 2025",
      avatar: "/avatar3.jpg",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Jadwal Mentoring Hari Ini
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Rabu, 15 November 2025
        </p>
      </div>

      {/* Session List */}
      <div className="space-y-4 sm:space-y-5">
        {jadwalSesi.map((sesi) => (
          <div
            key={sesi.id}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: Avatar + Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                {/* Avatar */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl sm:text-2xl font-bold">
                    {sesi.nama.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
                    {sesi.nama}
                  </h3>
                  <p className="text-sm sm:text-base text-teal-600 font-medium truncate">
                    {sesi.topik}
                  </p>
                </div>
              </div>

              {/* Right: Time Badge */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-center">
                  <p className="text-base sm:text-lg font-bold whitespace-nowrap">
                    {sesi.waktu}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons (Optional) */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
              <button className="flex-1 px-4 py-2.5 bg-teal-50 text-teal-700 rounded-xl font-semibold hover:bg-teal-100 transition-colors text-sm sm:text-base">
                Lihat Detail
              </button>
              <button className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base">
                Mulai Sesi
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {jadwalSesi.length === 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
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
  );
}