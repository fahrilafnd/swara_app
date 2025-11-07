// src/app/components/dashboard/DailyMissionSection.tsx
"use client";

import React, { useMemo } from "react";
import {
  Gift,
  CheckCircle,
  Mic,
  BookOpen,
  Target,
  Trophy,
  Users,
  Clock,
  XCircle,
} from "lucide-react";

interface DailyMission {
  id: number;
  title: string;
  fitur: string;
  reward: number;
  icon: React.ReactNode;
  color: string;
  target: number;
  current: number;
  unit: string;
}

interface DailyMissionSectionProps {
  completedMissions: number[];
  onCompleteMission: (missionId: number) => void;
}

// Semua misi yang tersedia
const ALL_MISSIONS = [
  {
    id: 1,
    title: "Latihan dasar ekspresi selama 20 menit hari ini",
    fitur: "Latihan Dasar",
    reward: 1,
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-blue-500 to-blue-600",
    target: 20,
    unit: "menit",
  },
  {
    id: 2,
    title: "Dapatkan skor sempurna pada indikator artikulasi Skor Swara",
    fitur: "Skor Swara",
    reward: 1,
    icon: <Target className="w-5 h-5" />,
    color: "from-green-500 to-green-600",
    target: 1,
    unit: "kali",
  },
  {
    id: 3,
    title: "Gunakan Adu Swara 2 kali hari ini",
    fitur: "Adu Swara",
    reward: 1,
    icon: <Trophy className="w-5 h-5" />,
    color: "from-yellow-500 to-orange-500",
    target: 2,
    unit: "kali",
  },
  {
    id: 4,
    title: "Lakukan simulasi wawancara 2 kali hari ini",
    fitur: "Podium Swara",
    reward: 1,
    icon: <Users className="w-5 h-5" />,
    color: "from-purple-500 to-purple-600",
    target: 2,
    unit: "kali",
  },
  {
    id: 5,
    title: "Dapatkan feedback positif dari 15 audiens pada skenario Pidato",
    fitur: "Podium Swara",
    reward: 1,
    icon: <Users className="w-5 h-5" />,
    color: "from-indigo-500 to-indigo-600",
    target: 15,
    unit: "audiens",
  },
  {
    id: 6,
    title: "Dapatkan skor 5 pada indikator kesesuaian topik AduSwara",
    fitur: "Adu Swara",
    reward: 1,
    icon: <Trophy className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
    target: 5,
    unit: "poin",
  },
  {
    id: 7,
    title: "Tonton 5 video inspiratif hari ini",
    fitur: "Inspira Swara",
    reward: 1,
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500",
    target: 5,
    unit: "video",
  },
  {
    id: 8,
    title: "Tonton video dan catat 3 hal penting dari analisis indikatornya",
    fitur: "Inspira Swara",
    reward: 1,
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-rose-500 to-pink-500",
    target: 3,
    unit: "catatan",
  },
  {
    id: 9,
    title: "Gunakan Skor Swara, Podium Swara, dan Adu Swara dalam 1 hari",
    fitur: "Gabungan",
    reward: 1,
    icon: <Target className="w-5 h-5" />,
    color: "from-cyan-500 to-blue-500",
    target: 3,
    unit: "fitur",
  },
  {
    id: 10,
    title: "Latihan dasar tempo selama 10 menit hari ini",
    fitur: "Latihan Dasar",
    reward: 1,
    icon: <Clock className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-500",
    target: 10,
    unit: "menit",
  },
  {
    id: 11,
    title: "Latihan dasar artikulasi selama 15 menit hari ini",
    fitur: "Latihan Dasar",
    reward: 1,
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-blue-600 to-indigo-600",
    target: 15,
    unit: "menit",
  },
  {
    id: 12,
    title: "Dapatkan 50 poin hari ini",
    fitur: "Gabungan",
    reward: 1,
    icon: <Trophy className="w-5 h-5" />,
    color: "from-amber-500 to-yellow-500",
    target: 50,
    unit: "poin",
  },
  {
    id: 13,
    title: "Gunakan Podium Swara 2 kali hari ini",
    fitur: "Podium Swara",
    reward: 1,
    icon: <Users className="w-5 h-5" />,
    color: "from-violet-500 to-purple-500",
    target: 2,
    unit: "kali",
  },
  {
    id: 14,
    title: "Gunakan Skor Swara 3 kali hari ini",
    fitur: "Skor Swara",
    reward: 1,
    icon: <Target className="w-5 h-5" />,
    color: "from-emerald-500 to-green-500",
    target: 3,
    unit: "kali",
  },
];

// Function untuk generate 2 random missions berdasarkan tanggal
const getDailyMissions = (date: Date): typeof ALL_MISSIONS => {
  // Create seed dari tanggal
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

  // Simple seeded random
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Shuffle array dengan seed
  const shuffled = [...ALL_MISSIONS].sort(() => seededRandom(seed) - 0.5);

  // Ambil 2 misi pertama
  return shuffled.slice(0, 2);
};

export default function DailyMissionSection({
  completedMissions,
}: DailyMissionSectionProps) {
  // Get daily missions (akan konsisten untuk hari yang sama)
  const dailyMissions = useMemo(() => {
    const today = new Date();
    return getDailyMissions(today);
  }, []);

  // Simulasi progress (ini akan diganti dengan data dari backend)
  const getMissionProgress = (missionId: number) => {
    // TODO: Ganti dengan data real dari API/backend
    // Untuk sekarang, random progress sebagai demo
    const isCompleted = completedMissions.includes(missionId);
    const mission = dailyMissions.find((m) => m.id === missionId);
    if (!mission) return { current: 0, target: 0 };

    if (isCompleted) {
      return { current: mission.target, target: mission.target };
    }

    // Simulasi progress random untuk demo
    const randomProgress = Math.floor(Math.random() * mission.target);
    return { current: randomProgress, target: mission.target };
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-orange-100 mb-6 sm:mb-8"
      data-tour="daily-mission"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Daily Mission
            </h2>
            <p className="text-sm text-gray-500">
              Selesaikan misi dan dapatkan{" "}
              <span className="font-semibold text-orange-600">1 Mic bonus</span>
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-600">Progress Hari Ini</p>
          <p className="text-2xl font-bold text-orange-600">
            {
              completedMissions.filter((id) =>
                dailyMissions.some((m) => m.id === id)
              ).length
            }
            /{dailyMissions.length}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 mb-4">
        <p className="text-xs text-blue-900 flex items-center gap-2">
          <span className="text-base">ℹ️</span>
          <span>
            Misi akan berubah setiap hari. Progress akan diakumulasi otomatis
            saat kamu menggunakan fitur SWARA.
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {dailyMissions.map((mission) => {
          const progress = getMissionProgress(mission.id);
          const isCompleted = progress.current >= progress.target;
          const progressPercentage = (progress.current / progress.target) * 100;

          return (
            <div
              key={mission.id}
              className={`relative group p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                isCompleted
                  ? "bg-green-50 border-green-300 shadow-md"
                  : "bg-gradient-to-r from-gray-50 to-white border-gray-200 hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${mission.color} text-white flex-shrink-0 shadow-md`}
                >
                  {mission.icon}
                </div>

                {/* Content */}
                <div className="flex-1 w-full">
                  <p
                    className={`font-semibold mb-2 text-sm sm:text-base ${
                      isCompleted
                        ? "text-green-700 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {mission.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                      {mission.fitur}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      Reward: +{mission.reward} Mic
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">
                        Progress:
                      </span>
                      <span
                        className={`font-bold ${
                          isCompleted ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {progress.current}/{progress.target} {mission.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-orange-400 to-red-500"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
                  {isCompleted ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-bold text-green-700">
                        Selesai
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 bg-orange-100 border-2 border-orange-300 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <span className="text-xs font-bold text-orange-700">
                        Berlangsung
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🔄 Misi akan direset setiap hari pukul 00:00 WIB
        </p>
      </div>
    </div>
  );
}
