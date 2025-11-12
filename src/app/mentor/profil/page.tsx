"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  LogOut,
} from "lucide-react";

export default function ProfilMentor() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-5 sm:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">U</span>
            </div>

            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Udin Budiawan
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-4">swaradmin@gmail.com</p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900 text-sm sm:text-base">4.9</span>
                  <span className="text-gray-600 text-xs sm:text-sm">(127 ulasan)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-600 text-xs sm:text-sm">248 Sesi Selesai</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Public Speaking", "Presentasi Bisnis", "Story Telling"].map(t => (
                  <span
                    key={t}
                    className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
                document.cookie =
                  "swara_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = "/masuk";
              } catch (err) {
                console.error("Gagal logout:", err);
              }
            }}
            className="flex items-center justify-center gap-2 sm:gap-3 py-2.5 px-5 sm:px-6 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm sm:text-base w-full xs:w-auto"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Informasi Akun */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md p-5 sm:p-8 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">Informasi Akun</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Object.entries({
            "NAMA LENGKAP": "Udin Budiawan",
            "EMAIL": "swaradmin@gmail.com",
            "NOMOR TELEPON": "+62 812-3456-7890",
            "LOKASI": "Jakarta, Indonesia",
            "BERGABUNG SEJAK": "15 Januari 2024",
            "TARIF PER SESI": "Rp 100.000 / jam",
          }).map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-500 text-[11px] sm:text-xs font-semibold mb-1 tracking-wide">
                {label}
              </p>
              <p className="text-gray-900 font-semibold text-sm sm:text-base break-words">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Perubahan Akun */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md mb-6 overflow-hidden">
        <button
          onClick={() => setShowEditForm(v => !v)}
          className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg sm:text-xl font-bold text-orange-600">
            Perubahan Akun
          </h3>
          {showEditForm ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {showEditForm && (
          <div className="px-5 sm:px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
              {Object.entries({
                "Nama": ["Udin Budiawan", "text"],
                "Nomor telepon": ["+62 812-3456-7890", "tel"],
                "Email": ["swaradmin@gmail.com", "email"],
                "Lokasi": ["Jakarta, Indonesia", "text"],
              }).map(([label, [placeholder, type]]) => (
                <div key={label}>
                  <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition-colors text-sm">
                BATAL
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all text-sm">
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pergantian Password */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md mb-6 overflow-hidden">
        <button
          onClick={() => setShowPasswordForm(v => !v)}
          className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg sm:text-xl font-bold text-orange-600">
            Pergantian Password
          </h3>
          {showPasswordForm ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {showPasswordForm && (
          <div className="px-5 sm:px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
                  Password Baru
                </label>
                <input
                  type="password"
                  placeholder="******"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  placeholder="******"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition-colors text-sm">
                BATAL
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all text-sm">
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
