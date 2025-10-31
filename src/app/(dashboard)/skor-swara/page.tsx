"use client";

import React from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/app/components/skor-swara/HeroSection";
import ScoreCards from "@/app/components/skor-swara/ScoreCards";
import TipsSection from "@/app/components/skor-swara/TipsSection";
import HistorySection from "@/app/components/skor-swara/HistorySection";
import { useState, useEffect } from "react";
import SkorSwaraIntroModal from "@/app/components/skor-swara/SkorSwaraIntroModal";

interface ScoreCard {
  title: string;
  icon: string;
  description: string;
}

interface HistoryItem {
  id: number;
  title: string;
  date: string;
  score: string;
  status: string;
}

export default function SkorSwaraPage() {
  const router = useRouter();

  const scoreCards: ScoreCard[] = [
    {
      title: "Kelancaran & Pengucapan",
      icon: "🎯",
      description:
        "Swara akan menilai kelancaran penyampaianmu, termasuk mendeteksi jeda yang terlalu lama. Pastikan setiap kata diucapkan dengan jelas.",
    },
    {
      title: "Kontak Mata & Ekspresi",
      icon: "😄",
      description:
        "Swara akan menganalisis kontak mata dan ekspresi wajah. Pertahankan kontak mata dan tunjukkan ekspresi yang percaya diri.",
    },
    {
      title: "Penggunaan Bahasa",
      icon: "💬",
      description:
        'Swara akan menganalisis pilihan kata, termasuk mendeteksi penggunaan kata pengisi yang tidak perlu (seperti "emmm") dan pengulangan kata.',
    },
  ];

  const tips: string[] = [
    "Pastikan pencahayaan ruangan cukup terang agar kamera dapat menangkap ekspresi wajah dengan baik",
    "Posisikan kamera sejajar dengan mata Anda untuk simulasi kontak mata yang optimal",
    "Berlatih di ruangan yang tenang untuk hasil analisis suara yang lebih akurat",
    "Gunakan mikrofon eksternal jika memungkinkan untuk kualitas rekaman yang lebih baik",
    "Berlatih secara rutin untuk melihat peningkatan skor dari waktu ke waktu",
  ];

  const historyItems: HistoryItem[] = [
    {
      id: 1,
      title: "Presentasi Bisnis",
      date: "28 Agustus 2025",
      score: "70/100",
      status: "Cukup baik",
    },
    {
      id: 2,
      title: "Presentasi Bisnis",
      date: "10 Agustus 2025",
      score: "85/100",
      status: "Baik",
    },
    {
      id: 3,
      title: "Presentasi Bisnis",
      date: "28 Agustus 2025",
      score: "70/100",
      status: "Cukup baik",
    },
  ];

  const handleStartTraining = () => {
    router.push("/skor-swara/sesi-latihan");
  };

  const [showModal, setShowModal] = useState(false);
  // const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // const alreadyShown = sessionStorage.getItem("swaraModalShown");
    setShowModal(true);
    // if (!alreadyShown) {
    //   setShowModal(true);
    //   sessionStorage.setItem("swaraModalShown", "true");
    // }
  }, []);

  return (
    <div className="space-y-8">
      <SkorSwaraIntroModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      <div className="min-h-screen bg-white rounded-3xl p-3 md:p-6 lg:p-8">
        <div className="w-full">
          <HeroSection onStartTraining={handleStartTraining} />
          <ScoreCards scoreCards={scoreCards} />
          <TipsSection tips={tips} />
        </div>
      </div>
      <HistorySection historyItems={historyItems} />
    </div>
  );
}
