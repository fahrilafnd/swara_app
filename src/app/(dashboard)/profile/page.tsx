// src/app/(dashboard)/profile/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  Calendar,
  Star,
  Award,
  Target,
  Flame,
  Bell,
  ChevronRight,
  LogOut,
  Settings,
  X,
  Plus,
} from "lucide-react";

/** ===== Helpers ===== */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
const getCookie = (name: string) => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : "";
};

/** ===== Types (sesuai respons) ===== */
type ApiProfile = {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    full_name: string | null;
    email: string | null;
    phone_number: string | null;
    birth_date: string | null;
    address: string | null;
    created_at: string; // ISO
    role_id: number;
    gender_id: number | null;
    refreshTokenExpiresAt?: string;
    status?: string;
    role?: { role_id: number; role_name: string };
    gender?: unknown;
    mentee?: Array<{
      point: number;
      exercise_count: number;
      minute_count: number;
    }>;
  };
};

export default function SwaraProfilePage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  /** ===== Default (fallback) content ===== */
  const fallbackForm = useMemo(
    () => ({
      name: "Talitha",
      email: "talitha@example.com",
      phone: "+62 812-3456-7890",
      birthDate: "2006-12-12",
      bio: "",
    }),
    []
  );

  const fallbackUser = useMemo(
    () => ({
      name: "Fabyan Yastika Permana",
      level: 2,
      xp: 650,
      maxXp: 1000,
      location: "Jakarta, Indonesia",
      joinDate: "Bergabung 31 Agustus 2025",
      totalPoints: 2340,
      stats: {
        completedTraining: 24,
        minutesPracticed: 256,
        successRate: 60,
        badgesEarned: 12,
      },
    }),
    []
  );

  /** ===== Local states yang akan diisi dari API / fallback ===== */
  const [formData, setFormData] = useState(fallbackForm);
  const [userCard, setUserCard] = useState(fallbackUser);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  /** ===== Minat (statis di sisi klien) ===== */
  const [interests, setInterests] = useState([
    { id: 1, name: "Presentasi", color: "bg-orange-500" },
    { id: 2, name: "Wawancara", color: "bg-teal-500" },
    { id: 3, name: "Storytelling", color: "bg-blue-500" },
  ]);
  const [newInterest, setNewInterest] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);

  /** ===== Ambil profil dari API ===== */
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setApiError(null);  

        // panggil lewat proxy server (route.ts kamu)
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        // bentuk respons sama dengan API upstream
        const json = await res.json(); // { success, message, data: {...} }
        const d = json?.data;
        if (!d) throw new Error("Format API tidak sesuai");

        if (cancelled) return;

        const mentee = Array.isArray(d.mentee) ? d.mentee[0] : undefined;

        // tanggal bergabung dari created_at
        const created = d.created_at ? new Date(d.created_at) : new Date();
        const joinDate = `Bergabung ${created.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}`;

        // KARTU PROFIL (pakai nilai API; 0 tetap dihormati)
        setUserCard({
          name: d.full_name ?? "Pengguna Swara",
          level: 2, // jika backend nanti kirim level, map di sini
          xp: Math.max(0, Math.min(1000, Number(mentee?.point ?? 0))),
          maxXp: 1000,
          location: d.address ?? "Indonesia",
          joinDate,
          totalPoints: Number(mentee?.point ?? 0),
          stats: {
            completedTraining: Number(mentee?.exercise_count ?? 0),
            minutesPracticed: Number(mentee?.minute_count ?? 0),
            successRate: 60,
            badgesEarned: 12,
          },
        });

        // FORM EDIT
        setFormData({
          name: d.full_name ?? "",
          email: d.email ?? "",
          phone: d.phone_number ?? "",
          birthDate: d.birth_date ? d.birth_date.slice(0, 10) : "",
          bio: "",
        });
      } catch (e: any) {
        console.error("Gagal memuat profil:", e);
        if (!cancelled) setApiError(e?.message || "Gagal memuat profil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, fallbackForm, fallbackUser]);

  /** ===== Badge dummy (tetap) ===== */
  const badges = [
    {
      id: "langkah-pertama",
      name: "Langkah Pertama",
      description: "Menyelesaikan sesi latihan pertama.",
      icon: "/badge/Langkah Pertama.png",
      unlocked: true,
    },
    {
      id: "rajin-berlatih",
      name: "Rajin Berlatih",
      description: "Latihan beruntun selama 3 hari.",
      icon: "/badge/Rajin Berlatih.png",
      unlocked: true,
    },
    {
      id: "dedikasi-tinggi",
      name: "Dedikasi Tinggi",
      description: "Latiihan beruntun selama 7 hari.",
      icon: "/badge/Dedikasi Tinggi.png",
      unlocked: true,
    },
    {
      id: "komitmen",
      name: "Komitmen",
      description: "Latihan beruntun selama 1 bulan.",
      icon: "/badge/Komitmen.png",
      unlocked: true,
    },
    {
      id: "presenter-hebat",
      name: "Presenter Hebat",
      description: "Mendapatkan skor sempurna di satu latihan.",
      icon: "/badge/Presenter Hebat.png",
      unlocked: true,
    },
    {
      id: "master-waktu",
      name: "Master Waktu",
      description:
        "Mencapai total waktu latihan sebanyak 20 menit (20 kali latihan).",
      icon: "/badge/Master Waktu.png",
      unlocked: true,
    },
    {
      id: "penakluk-panggung",
      name: "Penakluk Panggung",
      description:
        "Mendapat skor sempurna pada indikator Kontak Mata & Gestur.",
      icon: "/badge/Penakluk Panggung.png",
      unlocked: true,
    },
    {
      id: "sang-penjelajah",
      name: "Sang Penjelajah",
      description: "Mencoba semua fitur latihan SWARA.",
      icon: "/badge/Sang Penjelajah.png",
      unlocked: true,
    },
    {
      id: "Kolektor-Topik",
      name: "Kolektor Topik",
      description:
        "Menyelesaikan latihan dengan 10 topik teks yang berbeda di Skor Swara dan Adu Swara",
      icon: "/badge/Kolektor Topik.png",
      unlocked: true,
    },
    {
      id: "Kritikus-Andal",
      name: "Kritikus Handal",
      description: "Menambahkan catatan pada 5 video di Inspira Swara.",
      icon: "/badge/Kritikus Handal.png",
      unlocked: true,
    },
  ];

  /** ===== Interest handlers ===== */
  const addInterest = () => {
    if (!newInterest.trim()) return;
    const colors = [
      "bg-orange-500",
      "bg-teal-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-pink-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setInterests((prev) => [
      ...prev,
      { id: prev.length + 1, name: newInterest.trim(), color: randomColor },
    ]);
    setNewInterest("");
    setShowAddInterest(false);
  };
  const removeInterest = (id: number) =>
    setInterests((prev) => prev.filter((x) => x.id !== id));

  /** ===== Save / Cancel ===== */
  const saveChanges = () => {
    // TODO: panggil API update profil bila sudah tersedia
    setShowSettingsModal(false);
  };
  const cancelChanges = () => {
    // Kembalikan ke data terakhir (API ataupun fallback)
    setShowSettingsModal(false);
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen bg-white rounded-xl">
      <div className="flex flex-col flex-1 ">
        {/* Modal Pengaturan Profil */}
        {mounted && showSettingsModal
          ? createPortal(
              <div
                className="fixed inset-0 text-black z-50 flex items-center justify-center bg-black/50"
                onClick={() => setShowSettingsModal(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                      <Settings className="w-6 h-6 text-gray-600" />
                      <h2 className="text-xl font-bold text-gray-800">
                        Pengaturan Profil
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowSettingsModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nomor telepon
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal lahir
                          </label>
                          <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                birthDate: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio / Deskripsi
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, bio: e.target.value }))
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                          placeholder="Ceritakan tentang dirimu..."
                        />
                      </div>

                      {/* Minat */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Minat dan Preferensi
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {interests.map((interest) => (
                            <span
                              key={interest.id}
                              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${interest.color} flex items-center gap-2`}
                            >
                              {interest.name}
                              <button
                                onClick={() => removeInterest(interest.id)}
                                className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {!showAddInterest ? (
                            <button
                              onClick={() => setShowAddInterest(true)}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              Tambah
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && addInterest()
                                }
                                placeholder="Minat baru..."
                                className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                autoFocus
                              />
                              <button
                                onClick={addInterest}
                                className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setShowAddInterest(false);
                                  setNewInterest("");
                                }}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <button
                        onClick={saveChanges}
                        className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        SIMPAN PERUBAHAN
                      </button>
                      <button
                        onClick={cancelChanges}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        BATAL
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Info level */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📚</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">
                  Penjelajah Suara - Level {userCard.level}
                </h3>
                <p className="text-indigo-100">
                  Kamu sudah mulai menguasai dasar-dasar public speaking!
                  Teruskan latihan untuk mencapai level berikutnya.
                </p>
                <p className="text-sm mt-2 text-indigo-200">
                  ➡️ Level selanjutnya: Pembicara Percaya Diri (Level{" "}
                  {userCard.level + 1}) - Butuh{" "}
                  {Math.max(0, userCard.maxXp - userCard.xp)} XP lagi!
                </p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <img
                    src="./Profil.jpg"
                    alt=""
                    className="w-24 h-24 object-cover rounded-full shadow-lg"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {userCard.name}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Level {userCard.level}
                      </span>
                      <span className="text-orange-600 font-bold">
                        {userCard.xp}/{userCard.maxXp} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userCard.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{userCard.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span>
                          Total Poin: {userCard.totalPoints.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="bg-primary px-4 py-2 rounded-xl flex items-center justify-center text-white"
                >
                  Edit
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {userCard.stats.completedTraining}
                  </div>
                  <div className="text-sm text-gray-600">Latihan selesai</div>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="text-4xl font-bold text-gray-700 mb-2">
                    {userCard.stats.badgesEarned}
                  </div>
                  <div className="text-sm text-gray-600">Badge diraih</div>
                </div>
              </div>

              {/* Logout */}
              <div className="mt-6 pt-6 border-t border-gray-200">
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
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Achievements & Badges */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Pencapaian & Badge
              </h2>
            </div>

            {apiError && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                Tidak bisa memuat profil dari server: {apiError}. Menampilkan
                data sementara.
              </div>
            )}

            {loading ? (
              <div className="text-center text-gray-500">Memuat data…</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      badge.unlocked
                        ? "bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 hover:scale-105"
                        : "bg-gray-100 opacity-60"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-center">
                      <img
                        src={badge.icon}
                        alt={badge.name}
                        className="w-16 h-16"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    {!badge.unlocked && (
                      <div className="mt-2 text-xs text-gray-500 italic">
                        Belum terbuka
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
