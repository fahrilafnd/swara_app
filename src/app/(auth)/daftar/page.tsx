"use client";

import React, { useState } from "react";
import { Mic, ArrowLeft } from "lucide-react";
import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://40d78b4d17e2.ngrok-free.app/api/swara";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    nama: "",
    nomorHP: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      // siapkan payload sesuai API kamu
      const payload = {
        name: formData.nama,
        email: formData.email,
        phone: formData.nomorHP,
        password: formData.password,
      };

      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || `Gagal daftar (HTTP ${res.status})`
        );
      }

      setMessage({
        type: "success",
        text: data?.message || "Registrasi berhasil. Silakan masuk.",
      });
      // reset form jika perlu
      setFormData({ email: "", nama: "", nomorHP: "", password: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Registrasi gagal." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-lexend bg-[#F5F0E8] relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(#D4C4B0 1px, transparent 1px), linear-gradient(90deg, #D4C4B0 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="./logo.svg" alt="Logo" className="w-36" />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors text-sm border-b border-gray-400 pb-1 w-fit"
          >
            Kembali ke beranda
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <Link
          href="/masuk"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Masuk
        </Link>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="flex justify-center gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    Welcome to{" "}
                    <span className="text-orange-500 font-bold">SPEAKUP</span>
                  </p>
                  <h1 className="text-5xl font-bold text-gray-900">Daftar</h1>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm mb-1">
                    Sudah punya akun?
                  </p>
                  <Link
                    href="/masuk"
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Masuk
                  </Link>
                </div>
              </div>

              {/* Alert */}
              {message && (
                <div
                  className={`mb-6 rounded-xl border p-4 text-sm ${
                    message.type === "success"
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="text-gray-600 space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Masukkan email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email kamu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Nama dan Nomor HP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Masukkan nama
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Nama kamu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Masukkan nomor HP
                    </label>
                    <input
                      type="tel"
                      name="nomorHP"
                      value={formData.nomorHP}
                      onChange={handleChange}
                      placeholder="Nomor kamu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Masukkan password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password kamu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {loading ? "Memproses…" : "Daftar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-gray-700 text-sm">Copyright ©SpeakUp 2025</p>
      </footer>
    </div>
  );
}
