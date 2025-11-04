"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  LogOut,
} from "lucide-react";

export default function ProfilMentor() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showBioForm, setShowBioForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  return (
    <div className="pr-8">
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-6xl font-bold">U</span>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Udin Budiawan
              </h1>
              <p className="text-gray-600 mb-4">swaradmin@gmail.com</p>

              {/* Rating & Stats */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-gray-600 text-sm">(127 ulasan)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-600 text-sm">
                    248 Sesi Selesai
                  </span>
                </div>
              </div>

              {/* Specialization Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Public Speaking
                </span>
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Presentasi Bisnis
                </span>
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Story Telling
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                // Hapus cookie login (Next.js App Router)
                await fetch("/api/auth/logout", { method: "POST" });

                // Atau kalau belum punya route logout, bisa hapus manual:
                document.cookie =
                  "swara_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

                // Redirect ke halaman login
                window.location.href = "/masuk";
              } catch (err) {
                console.error("Gagal logout:", err);
              }
            }}
            className="flex w-fit items-center justify-center gap-3 py-3 px-6 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Information Account */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Informasi Akun
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              NAMA LENGKAP
            </p>
            <p className="text-gray-900 font-semibold">Udin Budiawan</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">EMAIL</p>
            <p className="text-gray-900 font-semibold">swaradmin@gmail.com</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              NOMOR TELEPON
            </p>
            <p className="text-gray-900 font-semibold">+62 812-3456-7890</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">LOKASI</p>
            <p className="text-gray-900 font-semibold">Jakarta, Indonesia</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              BERGABUNG SEJAK
            </p>
            <p className="text-gray-900 font-semibold">15 Januari 2024</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">
              TARIF PER SESI
            </p>
            <p className="text-gray-900 font-semibold">Rp 100.000 / jam</p>
          </div>
        </div>
      </div>

      {/* Edit Account Form */}
      <div className="bg-white rounded-3xl shadow-md mb-6 overflow-hidden">
        <button
          onClick={() => setShowEditForm(!showEditForm)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-xl font-bold text-orange-600">Perubahan Akun</h3>
          {showEditForm ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {showEditForm && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Udin Budiawan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Nomor telepon
                </label>
                <input
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="swaradmin@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Jakarta, Indonesia"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition-colors">
                BATAL
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl shadow-md mb-6 overflow-hidden">
        <button
          onClick={() => setShowEditForm(!showEditForm)}
          className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-xl font-bold text-orange-600">
            Pergantian Password
          </h3>
          {showEditForm ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {showEditForm && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Password Baru
                </label>
                <input
                  type="text"
                  placeholder="Udin Budiawan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div></div>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition-colors">
                BATAL
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
