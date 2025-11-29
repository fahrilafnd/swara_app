"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/app/components/skor-swara/HeroSection";
import ScoreCards from "@/app/components/skor-swara/ScoreCards";
import TipsSection from "@/app/components/skor-swara/TipsSection";
import SkorSwaraIntroModal from "@/app/components/skor-swara/SkorSwaraIntroModal";
import { getUserLevel, getLevelInfo } from "./config/levels";

export default function SkorSwaraPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [userLevel, setUserLevel] = useState(3);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const hidden =
      typeof window !== "undefined" &&
      localStorage.getItem("swaraIntroHide") === "1";
    setShowModal(!hidden);

    // Load user level
    setUserLevel(getUserLevel());
  }, []);

  const handleStartTraining = () => {
    // Hanya redirect, TIDAK ada hit API
    router.push("/skor-swara/pilih-mode");
  };

  const levelInfo = getLevelInfo(userLevel);

  const scoreCards = [
    {
      title: "Tempo",
      icon: "⏱️",
      description: "Menilai kecepatan berbicara dalam satu menit.",
    },
    {
      title: "Artikulasi",
      icon: "🗣️",
      description: "Menilai kejelasan pengucapan.",
    },
    {
      title: "Kontak Mata",
      icon: "👀",
      description: "Menilai seberapa lama pengguna mengalihkan pandangan.",
    },
    {
      title: "Kesesuaian Topik",
      icon: "👌🏻",
      description:
        "Menilai relevansi teks sesuai kata kunci yang sudah disediakan setiap topik.",
    },
    {
      title: "Struktur",
      icon: "📑",
      description:
        "Mengidentifikasi frasa yang menandai pembuka, isi, dan penutup pada public speaking.",
    },
  ];

  const tips = [
    "Pastikan pencahayaan ruangan cukup terang agar kamera dapat menangkap ekspresi wajah dengan baik",
    "Posisikan kamera sejajar dengan mata Anda untuk simulasi kontak mata yang optimal",
    "Berlatih di ruangan yang tenang untuk hasil analisis suara yang lebih akurat",
    "Gunakan mikrofon eksternal jika memungkinkan untuk kualitas rekaman yang lebih baik",
    "Berlatih secara rutin untuk melihat peningkatan skor dari waktu ke waktu",
  ];

  return (
    <div className="space-y-8">
      <SkorSwaraIntroModal
        open={showModal}
        onClose={(dontShowAgain) => {
          if (dontShowAgain) localStorage.setItem("swaraIntroHide", "1");
          setShowModal(false);
        }}
      />

      <div className="min-h-screen mb-10 bg-white rounded-3xl p-3 md:p-6 lg:p-8">
        <div className="w-full">
          <HeroSection 
            onStartTraining={handleStartTraining}
            isLoading={isStarting}
          />
          
          <ScoreCards scoreCards={scoreCards} />
          
          <TipsSection tips={tips} />

          {/* Mode Preview Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-purple-50 rounded-3xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">
              3 Mode Latihan Tersedia
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">📝</div>
                <h4 className="font-bold text-gray-900 mb-1">Teks Lengkap</h4>
                <p className="text-xs text-gray-600">
                  Baca teks dengan teleprompter
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">🖼️</div>
                <h4 className="font-bold text-gray-900 mb-1">Topik + Gambar</h4>
                <p className="text-xs text-gray-600">
                  Improvisasi berdasarkan visual
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">✨</div>
                <h4 className="font-bold text-gray-900 mb-1">Topik Kustom</h4>
                <p className="text-xs text-gray-600">Buat topik sendiri</p>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Mode yang tersedia tergantung level Anda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}