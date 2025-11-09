// app/skor-swara/pilih-mode/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Edit3,
  Lock,
  ChevronRight,
  Trophy,
  ArrowLeft,
  Mic, // ⬅️ mic icon
} from "lucide-react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";
import {
  getUserLevel,
  isModeLocked,
  getLevelInfo,
  type TrainingMode,
} from "../config/levels";
import Link from "next/link";

interface ModeCard {
  id: TrainingMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: string;
  minLevel: number;
  features: string[];
  color: string; // tailwind gradient classes
  micCost: number; // ⬅️ token mic yang dibutuhkan
}

export default function PilihModePage() {
  const router = useRouter();
  const [userLevel, setUserLevel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const level = getUserLevel();
    setUserLevel(level);
    setIsLoading(false);
    console.log("🎯 Current User Level:", level);
  }, []);

  const currentLevelConfig = userLevel ? getLevelInfo(userLevel) : null;

  const modes: ModeCard[] = [
    {
      id: "full-text",
      title: "Latihan dengan Teks Lengkap",
      description:
        "Baca teks yang sudah disediakan dengan teleprompter otomatis",
      icon: <FileText className="w-8 h-8" />,
      difficulty: "Pemula - Menengah",
      minLevel: 1,
      features: [
        "Teks lengkap disediakan sistem",
        "Teleprompter auto-scroll",
        "Cocok untuk latihan dasar",
        "Fokus pada intonasi & tempo",
      ],
      color: "from-green-500 to-emerald-600",
      micCost: 1, // ⬅️
    },
    {
      id: "topic-image",
      title: "Topik + Gambar Visual",
      description: "Berbicara bebas berdasarkan topik dan gambar pendukung",
      icon: <ImageIcon className="w-8 h-8" />,
      difficulty: "Menengah - Mahir",
      minLevel: 3,
      features: [
        "Hanya topik & gambar visual",
        "Bebas improvisasi",
        "Keyword hints tersedia",
        "Melatih spontanitas",
      ],
      color: "from-blue-500 to-indigo-600",
      micCost: 2, // ⬅️
    },
    {
      id: "custom-topic",
      title: "Topik Kustom Sendiri",
      description: "Buat topik sendiri dan presentasikan dengan gayamu",
      icon: <Edit3 className="w-8 h-8" />,
      difficulty: "Mahir - Expert",
      minLevel: 3,
      features: [
        "Input topik sesuai keinginan",
        "Batasan kata fleksibel",
        "Total kebebasan berkreasi",
        "Challenge maksimal",
      ],
      color: "from-orange-500 to-orange-600",
      micCost: 3, // ⬅️
    },
  ];

  const handleSelectMode = (mode: TrainingMode) => {
    if (isModeLocked(mode)) {
      alert(
        `Mode ini terkunci! Capai Level ${
          modes.find((m) => m.id === mode)?.minLevel
        } untuk membuka.`
      );
      return;
    }
    sessionStorage.setItem("skor-swara:selectedMode", mode);
    router.push(`/skor-swara/pilih-topik?mode=${mode}`);
  };

  const renderMicTokens = (count: number, dimmed?: boolean) => (
    <div
      className="flex items-center gap-1"
      aria-label={`${count} mic diperlukan`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow ${
            dimmed ? "opacity-70" : ""
          }`}
          title="Mic token"
        >
          <Mic className="w-3.5 h-3.5 text-orange-600" />
        </div>
      ))}
    </div>
  );

  if (isLoading || userLevel === null) {
    return (
      <>
        <SkorSwaraHeader />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-8 mb-10">
        <Link
          href={"/skor-swara"}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Kembali</span>
        </Link>

        {/* User Level Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-4xl">
              {currentLevelConfig?.badge}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Level {userLevel}: {currentLevelConfig?.title}
              </h2>
              <p className="text-gray-600 font-medium">
                {currentLevelConfig?.description}
              </p>
            </div>
          </div>

          {/* Debug info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              🔍 Debug: Level {userLevel} | Unlocked modes:{" "}
              {currentLevelConfig?.unlockedModes.join(", ")}
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Pilih Mode Latihan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tingkatkan skill public speaking dengan berbagai mode latihan yang
            disesuaikan dengan level kemampuanmu
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {modes.map((mode) => {
            const locked = isModeLocked(mode.id);

            return (
              <div
                key={mode.id}
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ${
                  locked
                    ? "opacity-60"
                    : "hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                }`}
                onClick={() => !locked && handleSelectMode(mode.id)}
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${mode.color} p-6 text-white relative`}
                >
                  {/* Mic token pill (selalu tampil) */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                      {renderMicTokens(mode.micCost, locked)}
                      <span className="text-xs font-bold">
                        {mode.micCost} Mic
                      </span>
                    </div>
                  </div>

                  {locked && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        Level {mode.minLevel}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">{mode.icon}</div>
                  <h3 className="text-2xl font-black mb-2">{mode.title}</h3>
                  <p className="text-white/90 text-sm">{mode.description}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Difficulty & min level */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{mode.difficulty}</span>
                    </div>
                    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                      Level {mode.minLevel}+
                    </div>
                  </div>

                  {/* Fitur */}
                  <div className="space-y-2 mb-6">
                    {mode.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={locked}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      locked
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${mode.color} text-white hover:shadow-lg`
                    }`}
                  >
                    {locked ? (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Terkunci
                      </span>
                    ) : (
                      "Pilih Mode Ini"
                    )}
                  </button>
                </div>

                {/* Lock Overlay */}
                {locked && (
                  <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-xs mx-4">
                      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-900 font-bold mb-2">
                        Capai Level {mode.minLevel}
                      </p>
                      <p className="text-sm text-gray-600">
                        untuk membuka mode ini
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Tips Menggunakan Mode
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Full Text:</strong> Ideal untuk pemula yang ingin
                    melatih reading & pacing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Topic + Image:</strong> Tingkatkan improvisasi dan
                    thinking on your feet
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    <strong>Custom Topic:</strong> Perfect untuk latihan
                    presentasi personal atau professional
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
