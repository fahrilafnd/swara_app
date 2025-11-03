"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isPasswordOpen, setIsPasswordOpen] = useState(true);

  const [accountForm, setAccountForm] = useState({
    nama: "Udin Budiawan",
    email: "swaradmin@gmail.com",
    nomor: "+62 812-3456-7890",
    lokasi: "Jakarta, Indonesia",
  });

  const [passwordForm, setPasswordForm] = useState({
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    passwordBaru: false,
    konfirmasiPassword: false,
  });

  const handleAccountChange = (e: { target: { name: any; value: any } }) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field as keyof typeof showPassword],
    });
  };

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-bold">U</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Udin Budiawan
                </h1>
                <p className="text-gray-500">swaradmin@gmail.com</p>
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

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Informasi Akun</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Nama Lengkap
                </p>
                <p className="text-gray-800 font-medium">Udin Budiawan</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-gray-800 font-medium">swaradmin@gmail.com</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Nomor Telepon
                </p>
                <p className="text-gray-800 font-medium">+62 812-3456-7890</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Lokasi
                </p>
                <p className="text-gray-800 font-medium">Jakarta, Indonesia</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Bergabung Sejak
                </p>
                <p className="text-gray-800 font-medium">15 Januari 2024</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  Tarif Per Sesi
                </p>
                <p className="text-gray-800 font-medium">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Account Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="w-full p-6 flex items-center justify-between border-b border-gray-100"
          >
            <h2 className="text-xl font-bold text-orange-500">
              Perubahan Akun
            </h2>
            {isAccountOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {isAccountOpen && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={accountForm.nama}
                    onChange={handleAccountChange}
                    placeholder="Udin Budiawan"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor telepon
                  </label>
                  <input
                    type="text"
                    name="nomor"
                    value={accountForm.nomor}
                    onChange={handleAccountChange}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={accountForm.email}
                    onChange={handleAccountChange}
                    placeholder="swaradmin@gmail.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    name="lokasi"
                    value={accountForm.lokasi}
                    onChange={handleAccountChange}
                    placeholder="Jakarta, Indonesia"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors">
                  BATAL
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-colors">
                  SIMPAN PERUBAHAN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <button
            onClick={() => setIsPasswordOpen(!isPasswordOpen)}
            className="w-full p-6 flex items-center justify-between border-b border-gray-100"
          >
            <h2 className="text-xl font-bold text-orange-500">
              Pergantian Password
            </h2>
            {isPasswordOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {isPasswordOpen && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.passwordBaru ? "text" : "password"}
                      name="passwordBaru"
                      value={passwordForm.passwordBaru}
                      onChange={handlePasswordChange}
                      placeholder="Masukkan password baru"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("passwordBaru")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword.passwordBaru ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showPassword.konfirmasiPassword ? "text" : "password"
                      }
                      name="konfirmasiPassword"
                      value={passwordForm.konfirmasiPassword}
                      onChange={handlePasswordChange}
                      placeholder="Konfirmasi password baru"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("konfirmasiPassword")
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword.konfirmasiPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors">
                  BATAL
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-colors">
                  SIMPAN PERUBAHAN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
