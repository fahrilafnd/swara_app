"use client";

import {
  X,
  User,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ModalPortal from "../ModalPortal";

type Props = {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
};

export default function SkorSwaraIntroModal({ open, onClose }: Props) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  if (!open) return null;

  const RULES = [
    {
      src: "/modal/modal1.png",
      text: "(Dilarang) berkata kasar, menghina, atau bersikap anarkis selama latihan.",
    },
    {
      src: "/modal/modal2.png",
      text: "Gunakan bahasa yang sopan dan komunikatif.",
    },
    {
      src: "/modal/modal3.png",
      text: "Percaya diri saat berbicara, jangan takut membuat kesalahan.",
    },
    { src: "/modal/modal4.png", text: "Tenangkan diri sebelum mulai." },
    {
      src: "/modal/modal5.png",
      text: "Fokus pada penyampaian dan ekspresi wajah.",
    },
    { src: "/modal/modal6.png", text: "Nikmati proses nya!" },
  ];

  const LEVELS = [
    {
      level: 1,
      badge: "🌱",
      title: "Pemula",
      maxScore: 15,
      indicators: [
        {
          name: "Tempo",
          description: "Kecepatan berbicara (140-150 kata dalam 48-60 detik)",
          maxPoints: 5,
        },
        {
          name: "Artikulasi",
          description: "Kejelasan pengucapan kata (81-100% dari total kata)",
          maxPoints: 5,
        },
        {
          name: "Jeda",
          description: "Pause alami saat berbicara (≤3 detik)",
          bonus: "+1 poin",
        },
        {
          name: "First Impression",
          description: "Kesan pertama saat memulai presentasi",
          bonus: "+1 poin",
        },
        {
          name: "Face Expression",
          description: "Ekspresi wajah happy/ceria",
          bonus: "+1 poin",
        },
        {
          name: "Gestur",
          description: "Gerakan tangan yang mendukung",
          bonus: "+1 poin",
        },
        {
          name: "Kata Pengisi",
          description: "Hindari 'emm', 'ehh', 'anu'",
          penalty: "-0.25 poin",
        },
      ],
      specialRule: "⚠️ Kata tidak senonoh → STOP latihan",
    },
    {
      level: 2,
      badge: "🌿",
      title: "Berkembang",
      maxScore: 15,
      indicators: [
        {
          name: "Tempo",
          description: "Kecepatan berbicara (48-60 detik)",
          maxPoints: 5,
        },
        {
          name: "Artikulasi",
          description: "Kejelasan pengucapan (81-100%)",
          maxPoints: 5,
        },
        {
          name: "Kontak Mata",
          description: "Pengalihan mata 0-5 kali",
          maxPoints: 5,
        },
        {
          name: "Jeda",
          description: "Pause ≤3 detik",
          bonus: "+1 poin",
          penalty: "-1 poin",
        },
        {
          name: "First Impression",
          description: "Kesan awal yang baik",
          bonus: "+1 poin",
          penalty: "-1 poin",
        },
        {
          name: "Face Expression",
          description: "Ekspresi empati/sedih sesuai konteks",
          bonus: "+1 poin",
        },
        {
          name: "Gestur",
          description: "Gerakan tubuh yang natural",
          bonus: "+1 poin",
          penalty: "-1 poin",
        },
        {
          name: "Kata Pengisi",
          description: "Minimalisir filler words",
          penalty: "-0.5 poin",
        },
      ],
      specialRule: "⚠️ Kata tidak senonoh → STOP latihan",
    },
    {
      level: 3,
      badge: "🌳",
      title: "Mahir",
      maxScore: 20,
      indicators: [
        {
          name: "Tempo",
          description: "48-60 detik optimal",
          maxPoints: 5,
        },
        {
          name: "Artikulasi",
          description: "81-100% jelas",
          maxPoints: 5,
        },
        {
          name: "Kontak Mata",
          description: "Pengalihan 0-5 kali",
          maxPoints: 5,
        },
        {
          name: "Kesesuaian Topik",
          description: "17-20 kata relevan dengan topik",
          maxPoints: 5,
        },
        {
          name: "Jeda",
          description: "Natural pause",
          bonus: "+1 poin",
          penalty: "-2 poin",
        },
        {
          name: "First Impression",
          description: "Opening yang kuat",
          bonus: "+1 poin",
          penalty: "-2 poin",
        },
        {
          name: "Face Expression",
          description: "Happy + Empati/Sedih",
          bonus: "+2 poin",
          penalty: "-1 poin",
        },
        {
          name: "Gestur",
          description: "Body language efektif",
          penalty: "-2 poin jika tidak ada",
        },
        {
          name: "Kata Pengisi",
          description: "Minimal filler",
          penalty: "-1 poin",
        },
      ],
      specialRule: "⚠️ Kata tidak senonoh → STOP latihan",
    },
    {
      level: 4,
      badge: "⭐",
      title: "Ahli",
      maxScore: 20,
      indicators: [
        {
          name: "Tempo",
          description: "48-60 detik konsisten",
          maxPoints: 5,
        },
        {
          name: "Artikulasi",
          description: "81-100% sempurna",
          maxPoints: 5,
        },
        {
          name: "Kontak Mata",
          description: "0-5 pengalihan",
          maxPoints: 5,
        },
        {
          name: "Kesesuaian Topik",
          description: "17-20 kata on-topic",
          maxPoints: 5,
        },
        {
          name: "Jeda",
          description: "Professional pause",
          bonus: "+1 poin",
          penalty: "-2 poin",
        },
        {
          name: "First Impression",
          description: "Strong opening",
          bonus: "+1 poin",
          penalty: "-3 poin",
        },
        {
          name: "Face Expression",
          description: "Fokus/Serius",
          bonus: "+2 poin",
          penalty: "-2 poin",
        },
        {
          name: "Gestur",
          description: "Purposeful movement",
          penalty: "-2 poin jika kurang",
        },
        {
          name: "Kata Pengisi",
          description: "Almost zero filler",
          penalty: "-1.5 poin",
        },
      ],
      specialRule: "⚠️ Kata tidak senonoh → STOP latihan",
    },
    {
      level: 5,
      badge: "🏆",
      title: "Master",
      maxScore: 25,
      indicators: [
        {
          name: "Tempo",
          description: "48-60 detik perfect",
          maxPoints: 5,
        },
        {
          name: "Artikulasi",
          description: "81-100% flawless",
          maxPoints: 5,
        },
        {
          name: "Kontak Mata",
          description: "0-5 pengalihan minimal",
          maxPoints: 5,
        },
        {
          name: "Kesesuaian Topik",
          description: "17-20 kata highly relevant",
          maxPoints: 5,
        },
        {
          name: "Struktur",
          description: "Pembuka + Isi + Penutup lengkap",
          maxPoints: 5,
        },
        {
          name: "Jeda",
          description: "Master-level pause",
          bonus: "+3 poin",
          penalty: "-5 poin",
        },
        {
          name: "First Impression",
          description: "Captivating start",
          bonus: "+1 poin",
          penalty: "-5 poin",
        },
        {
          name: "Face Expression",
          description: "Fokus/Serius total",
          bonus: "+5 poin",
          penalty: "-5 poin",
        },
        {
          name: "Gestur",
          description: "Professional mastery",
          penalty: "-5 poin jika kurang",
        },
        {
          name: "Kata Pengisi",
          description: "Zero tolerance",
          penalty: "-2 poin",
        },
      ],
      specialRule: "⚠️ Kata tidak senonoh → STOP latihan",
    },
  ];

  const toggleLevel = (level: number) => {
    setActiveLevel(activeLevel === level ? null : level);
  };

  return (
    <ModalPortal>
      <div className="fixed font-lexend inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Tentang Skor Swara
              </h2>
            </div>
            <button
              onClick={() => onClose(dontShowAgain)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tutup"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Apa itu Skor Swara */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-3">
                Apa itu Skor Swara?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Skor Swara adalah sistem penilaian berbasis AI yang menganalisis
                kemampuan public speaking Anda secara real-time dengan sistem
                gamifikasi 5 level. Setiap level memiliki indikator penilaian
                yang berbeda untuk membantu Anda meningkatkan keterampilan
                komunikasi secara bertahap.
              </p>
            </div>

            {/* Info Durasi */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border-2 border-orange-200">
              <div className="flex items-center justify-center gap-3">
                <span className="text-orange-600 font-semibold">
                  ⏱️ Durasi Latihan:
                </span>
                <span className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                  60 Detik (1 Menit)
                </span>
              </div>
            </div>

            {/* Komponen Penilaian - Accordion */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-4">
                Komponen Penilaian Per Level
              </h3>

              <div className="space-y-3">
                {LEVELS.map((levelData) => (
                  <div
                    key={levelData.level}
                    className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-300"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleLevel(levelData.level)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white hover:from-orange-50 hover:to-pink-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{levelData.badge}</span>
                        <div className="text-left">
                          <h4 className="font-black text-gray-900">
                            Level {levelData.level}: {levelData.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Skor Maksimal: {levelData.maxScore} poin
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                          activeLevel === levelData.level ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Accordion Content */}
                    {activeLevel === levelData.level && (
                      <div className="p-4 bg-white border-t-2 border-gray-100">
                        {/* Main Indicators */}
                        <div className="mb-4">
                          <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Indikator Utama
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {levelData.indicators
                              .filter((ind) => ind.maxPoints)
                              .map((indicator, idx) => (
                                <div
                                  key={idx}
                                  className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-blue-900 text-sm">
                                      {indicator.name}
                                    </span>
                                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                      {indicator.maxPoints} poin
                                    </span>
                                  </div>
                                  <p className="text-xs text-blue-700">
                                    {indicator.description}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Bonus & Penalty Indicators */}
                        <div>
                          <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Indikator Tambahan (Bonus & Penalty)
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {levelData.indicators
                              .filter((ind) => !ind.maxPoints)
                              .map((indicator, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                                >
                                  <div className="flex-1">
                                    <span className="font-semibold text-gray-900 text-sm">
                                      {indicator.name}
                                    </span>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                      {indicator.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 ml-3">
                                    {indicator.bonus && (
                                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                        <CheckCircle className="w-3 h-3" />
                                        {indicator.bonus}
                                      </span>
                                    )}
                                    {indicator.penalty && (
                                      <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                        <XCircle className="w-3 h-3" />
                                        {indicator.penalty}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Special Rule */}
                        {levelData.specialRule && (
                          <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-3">
                            <p className="text-sm font-bold text-red-900">
                              {levelData.specialRule}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary Info */}
              <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                <p className="text-sm text-indigo-900 font-semibold text-center">
                  💡 Semakin tinggi level, semakin ketat penilaiannya. Latih
                  skill Anda secara bertahap!
                </p>
              </div>
            </div>

            {/* Peraturan Latihan */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-4">
                Peraturan Latihan
              </h3>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                {RULES.map((rule, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2">
                      <Image
                        src={rule.src}
                        alt={rule.text}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                        priority={i < 3}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkbox + Tombol */}
            <div className="flex flex-col gap-4">
              <label className="inline-flex items-center gap-3 select-none cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  Jangan tampilkan lagi
                </span>
              </label>

              <button
                onClick={() => onClose(dontShowAgain)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Gas Cobain!
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
