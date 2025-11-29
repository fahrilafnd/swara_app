"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Mapping home per role */
type Role = "admin" | "user" | "mentor";
const HOME_BY_ROLE: Record<Role, string> = {
  admin: "/admin",
  user: "/dashboard",
  mentor: "/mentor",
};

/** Pastikan "next" adalah path internal */
function sanitizeNext(next: string | null): string | null {
  if (!next) return null;
  try {
    // Hanya izinkan path lokal yang diawali "/"
    if (next.startsWith("/") && !next.startsWith("//")) return next;
    return null;
  } catch {
    return null;
  }
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = sanitizeNext(searchParams.get("next"));

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
        cache: "no-store",
      });

      // Jika response bukan JSON valid, amanin
      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || `Gagal masuk (HTTP ${res.status})`
        );
      }

      // Ambil role dari payload (sesuaikan dengan struktur backend-mu)
      const rawRole: string | undefined =
        data?.data?.user?.role?.role_name ?? data?.data?.user?.role_name;
      const role = (rawRole || "user").toLowerCase() as Role;

      setMessage({
        type: "success",
        text: data?.message || "Login berhasil. Mengalihkan...",
      });

      // After successful login
      console.log("🔐 Saving token:", data.data.accessToken);
      localStorage.setItem("accessToken", data.data.accessToken);
      console.log("✅ Token saved, verify:", localStorage.getItem("accessToken"));

      // Redirect prioritas:
      // 1) next=?  2) home by role  3) fallback /dashboard
      const dest = nextParam || HOME_BY_ROLE[role] || "/dashboard";
      // cookie HttpOnly sudah di-set oleh API route → cukup redirect
      router.replace(dest);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Login gagal.",
      });
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
            <img src="/logo.svg" alt="Logo" className="w-36" />
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
          href="/daftar"
          className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
        >
          Daftar
        </Link>
      </header>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="flex justify-center gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="bg-white w-[35rem] max-w-full rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    Welcome to{" "}
                    <span className="text-orange-500 font-bold">SPEAKUP</span>
                  </p>
                  <h1 className="text-5xl font-bold text-gray-900">Masuk</h1>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm mb-1">
                    Belum punya akun?
                  </p>
                  <Link
                    href="/daftar"
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              </div>

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

              <form onSubmit={handleSubmit} className="text-gray-600 space-y-6">
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
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

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
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Memproses…" : "Masuk"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center py-6">
        <p className="text-gray-700 text-sm">Copyright ©SpeakUp 2025</p>
      </footer>
    </div>
  );
}
