"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";

import {
  User,
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

export default function SwaraProfilePage() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    name: "Talitha",
    email: "Talitha",
    phone: "+62 812-3456-7890",
    birthDate: "12/12/2006",
    bio: "",
  });

  // Interests state
  const [interests, setInterests] = useState([
    { id: 1, name: "Presentasi", color: "bg-orange-500" },
    { id: 2, name: "Wawancara", color: "bg-teal-500" },
    { id: 3, name: "Storytelling", color: "bg-blue-500" },
  ]);
  const [newInterest, setNewInterest] = useState("");
  const [showAddInterest, setShowAddInterest] = useState(false);

  // Function to add new interest
  const addInterest = () => {
    if (newInterest.trim()) {
      const colors = [
        "bg-orange-500",
        "bg-teal-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-pink-500",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      setInterests([
        ...interests,
        {
          id: interests.length + 1,
          name: newInterest.trim(),
          color: randomColor,
        },
      ]);
      setNewInterest("");
      setShowAddInterest(false);
    }
  };

  // Function to remove interest
  const removeInterest = (id: number) => {
    setInterests(interests.filter((interest) => interest.id !== id));
  };

  // Function to save changes
  const saveChanges = () => {
    // Here you would typically save to a backend or update global state
    console.log("Saving profile changes:", { formData, interests });
    // For now, just close the modal
    setShowSettingsModal(false);
    // You could add a success toast notification here
  };

  // Function to cancel changes
  const cancelChanges = () => {
    // Reset form data to original values
    setFormData({
      name: "Talitha",
      email: "Talitha",
      phone: "+62 812-3456-7890",
      birthDate: "12/12/2006",
      bio: "",
    });
    setInterests([
      { id: 1, name: "Presentasi", color: "bg-orange-500" },
      { id: 2, name: "Wawancara", color: "bg-teal-500" },
      { id: 3, name: "Storytelling", color: "bg-blue-500" },
    ]);
    setShowSettingsModal(false);
  };

  const userData = {
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
    badges: [
      {
        id: 1,
        name: "Langkah Pertama",
        description: "Menyelesaikan latihan pertama",
        icon: "🎯",
        unlocked: true,
      },
      {
        id: 2,
        name: "Rajin Berlatih",
        description: "Berlatih 7 hari berturut-turut",
        icon: "🔥",
        unlocked: true,
      },
      {
        id: 3,
        name: "Presenter Hebat",
        description: "Mendapat rating 5 bintang",
        icon: "⭐",
        unlocked: true,
      },
      {
        id: 4,
        name: "Eksplorasi",
        description: "10 latihan berbeda",
        icon: "🎪",
        unlocked: true,
      },
      {
        id: 5,
        name: "Dedikasi Tinggi",
        description: "Streak 7 hari (2/7)",
        icon: "🏆",
        unlocked: false,
      },
      {
        id: 6,
        name: "Pagi Produktif",
        description: "Latihan sebelum jam 9 pagi",
        icon: "⏰",
        unlocked: false,
      },
    ],
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const badges = [
    {
      id: "dedikasi-tinggi",
      name: "Dedikasi Tinggi",
      description: "Konsisten hadir & menyelesaikan latihan.",
      icon: "/badge/Dedikasi Tinggi.svg",
      unlocked: true,
    },
    {
      id: "komitmen",
      name: "Komitmen",
      description: "Menjaga komitmen belajar public speaking.",
      icon: "/badge/Komitmen.svg",
      unlocked: true,
    },
    {
      id: "langkah-pertama",
      name: "Langkah Pertama",
      description: "Menyelesaikan sesi latihan perdana.",
      icon: "/badge/Langkah Pertama.svg",
      unlocked: true,
    },
    {
      id: "master-waktu",
      name: "Master Waktu",
      description: "Latihan tepat waktu & disiplin.",
      icon: "/badge/Master Waktu.svg",
      unlocked: true,
    },
    {
      id: "penakluk-panggung",
      name: "Penakluk Panggung",
      description: "Berani tampil di depan audiens.",
      icon: "/badge/Penakluk Panggung.svg",
      unlocked: true,
    },
    {
      id: "penakluk-panggung-2",
      name: "Penakluk Panggung 2",
      description: "Level lanjut: kontrol panggung makin mantap.",
      icon: "/badge/Penakluk Panggung 2.svg",
      unlocked: true,
    },
    {
      id: "penakluk-panggung-3",
      name: "Penakluk Panggung 3",
      description: "Level mahir: gestur & ekspresi efektif.",
      icon: "/badge/Penakluk Panggung 3.svg",
      unlocked: true,
    },
    {
      id: "penakluk-panggung-4",
      name: "Penakluk Panggung 4",
      description: "Level expert: aura panggung konsisten.",
      icon: "/badge/Penakluk Panggung 4.svg",
      unlocked: true,
    },
    {
      id: "presenter-hebat",
      name: "Presenter Hebat",
      description: "Struktur materi jelas & meyakinkan.",
      icon: "/badge/Presenter Hebat.svg",
      unlocked: true,
    },
    {
      id: "rajin-berlatih",
      name: "Rajin Berlatih",
      description: "Rutin berlatih setiap minggu.",
      icon: "/badge/Rajin Berlatih.svg",
      unlocked: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-white rounded-xl">
      {/* Sidebar */}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ">
        {/* Profile Settings Modal */}
        {mounted && showSettingsModal
          ? createPortal(
              <div
                className="fixed inset-0 text-black z-50 flex items-center justify-center bg-black bg-opacity-50"
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

                  {/* Form Content */}
                  <div className="p-6">
                    {/* Form Fields */}
                    <div className="space-y-6">
                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
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
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone and Birth Date Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nomor telepon
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal lahir
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={formData.birthDate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  birthDate: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bio Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio / Deskripsi
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                          placeholder="Ceritakan tentang dirimu..."
                        />
                      </div>

                      {/* Interests and Preferences */}
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
                                onKeyPress={(e) =>
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

                    {/* Action Buttons */}
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
          {/* Level Alert */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-3xl">📚</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">
                  Orator Pemula - Level 2
                </h3>
                <p className="text-indigo-100">
                  Kamu sudah mulai menguasai dasar-dasar public speaking!
                  Teruskan latihan untuk mencapai level berikutnya.
                </p>
                <p className="text-sm mt-2 text-indigo-200">
                  ➡️ Level selanjutnya: Pembicara Percaya Diri (Level 3) - Butuh
                  350 XP lagi!
                </p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-5xl font-bold text-white">F</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {userData.name}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Level {userData.level}
                      </span>
                      <span className="text-orange-600 font-bold">
                        {userData.xp}/{userData.maxXp} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userData.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{userData.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span>
                          Total Poin: {userData.totalPoints.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {userData.stats.completedTraining}
                  </div>
                  <div className="text-sm text-gray-600">Latihan selesai</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="text-4xl font-bold text-gray-700 mb-2">
                    {userData.stats.minutesPracticed}
                  </div>
                  <div className="text-sm text-gray-600">Menit berlatih</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="text-4xl font-bold text-gray-700 mb-2">
                    {userData.stats.successRate}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Tingkat keberhasilan
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="text-4xl font-bold text-gray-700 mb-2">
                    {userData.stats.badgesEarned}
                  </div>
                  <div className="text-sm text-gray-600">Badge diraih</div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Add logout functionality here
                    console.log("Logging out...");
                    // You can add actual logout logic like clearing tokens, redirecting to login, etc.
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
                  <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                  {!badge.unlocked && (
                    <div className="mt-2 text-xs text-gray-500 italic">
                      Belum terbuka
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
