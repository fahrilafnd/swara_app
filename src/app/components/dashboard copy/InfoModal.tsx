"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  ChevronDown,
  CheckCircle,
  XCircle,
  Users,
  Presentation,
} from "lucide-react";
import Portal from "@/app/components/portal";

type ModalType =
  | "skor-swara"
  | "adu-swara"
  | "inspira-swara"
  | "podium-swara"
  | "latih-swara";

interface ModalContentItem {
  title: string;
  icon: React.ReactNode;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModal: ModalType;
  modalContent: Record<ModalType, ModalContentItem>;
  tips: string[];
  mekanismeLatihan: string[];
  peraturanLatihan: Array<{ Image: string; text: string }>;
}

export default function InfoModal({
  isOpen,
  onClose,
  activeModal,
  modalContent,
  tips,
  mekanismeLatihan,
  peraturanLatihan,
}: InfoModalProps) {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  if (!isOpen) return null;

  // Levels data for Skor Swara and Adu Swara
  const LEVELS_FULL = [
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
    },
  ];

  // Levels data for Podium Swara (without Kesesuaian Topik & Struktur)
  const LEVELS_PODIUM = [
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
    },
    {
      level: 3,
      badge: "🌳",
      title: "Mahir",
      maxScore: 15,
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
    },
    {
      level: 4,
      badge: "⭐",
      title: "Ahli",
      maxScore: 15,
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
    },
    {
      level: 5,
      badge: "🏆",
      title: "Master",
      maxScore: 15,
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
      specialRule: "⚠️ Kata tidak senonoh → -5 skor",
    },
  ];

  const toggleLevel = (level: number) => {
    setActiveLevel(activeLevel === level ? null : level);
  };

  const getLevelsData = () => {
    if (activeModal === "podium-swara") {
      return LEVELS_PODIUM;
    }
    return LEVELS_FULL;
  };

  const shouldShowLevels =
    activeModal === "skor-swara" ||
    activeModal === "adu-swara" ||
    activeModal === "podium-swara";

  return (
    <Portal>
      {/* Overlay untuk blur effect */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999]"
        style={{ backdropFilter: "blur(20px) saturate(180%)" }}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-[9999]">
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide pointer-events-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                {activeModal === "adu-swara" ? (
                  <Users className="w-5 h-5 text-orange-500" />
                ) : activeModal === "podium-swara" ? (
                  <Presentation className="w-5 h-5 text-orange-500" />
                ) : (
                  <span className="text-orange-500 text-xl">
                    {modalContent[activeModal].icon}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {modalContent[activeModal].title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-orange-500 font-bold text-lg mb-3">
                Apa itu{" "}
                {modalContent[activeModal].title.replace("Tentang ", "")}?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {modalContent[activeModal].description}
              </p>
            </div>

            {/* Info Cards */}
            {shouldShowLevels && (
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border-2 border-orange-200">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-orange-600 font-semibold text-sm">
                      ⏱️ Durasi:
                    </span>
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      60 Detik
                    </span>
                  </div>
                </div>
                {activeModal === "adu-swara" && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-blue-600 font-semibold text-sm">
                        🤝 Matching:
                      </span>
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                        Level Serupa
                      </span>
                    </div>
                  </div>
                )}
                {activeModal === "podium-swara" && (
                  <div className="bg-blue-200 rounded-2xl p-4 border-2 border-purple-200">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-purple-600 font-semibold text-sm">
                        🎭 Skenario:
                      </span>
                      <span className="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-bold">
                        Pidato, Wawancara
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Komponen Penilaian - Accordion for Skor, Adu, Podium Swara */}
            {shouldShowLevels && (
              <div>
                <h3 className="text-orange-500 font-bold text-lg mb-4">
                  Komponen Penilaian Per Level
                </h3>

                <div className="space-y-3">
                  {getLevelsData().map((levelData) => (
                    <div
                      key={levelData.level}
                      className="border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-orange-300"
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleLevel(levelData.level)}
                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white hover:from-orange-50 hover:to-pink-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{levelData.badge}</span>
                          <div className="text-left">
                            <h4 className="font-black text-gray-900 text-sm">
                              Level {levelData.level}: {levelData.title}
                            </h4>
                            <p className="text-xs text-gray-600">
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
                            <h5 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              Indikator Utama
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {levelData.indicators
                                .filter((ind) => ind.maxPoints)
                                .map((indicator, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-blue-50 border border-blue-200 rounded-lg p-2"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-bold text-blue-900 text-xs">
                                        {indicator.name}
                                      </span>
                                      <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                                        {indicator.maxPoints} poin
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-blue-700">
                                      {indicator.description}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Bonus & Penalty Indicators */}
                          <div>
                            <h5 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Indikator Tambahan
                            </h5>
                            <div className="grid grid-cols-1 gap-2">
                              {levelData.indicators
                                .filter((ind) => !ind.maxPoints)
                                .map((indicator, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-between"
                                  >
                                    <div className="flex-1">
                                      <span className="font-semibold text-gray-900 text-xs">
                                        {indicator.name}
                                      </span>
                                      <p className="text-[10px] text-gray-600 mt-0.5">
                                        {indicator.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                      {indicator.bonus && (
                                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                          <CheckCircle className="w-2.5 h-2.5" />
                                          {indicator.bonus}
                                        </span>
                                      )}
                                      {indicator.penalty && (
                                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                          <XCircle className="w-2.5 h-2.5" />
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
                            <div className="mt-3 bg-red-50 border-2 border-red-300 rounded-lg p-2">
                              <p className="text-xs font-bold text-red-900">
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
                <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border-2 border-indigo-200">
                  <p className="text-xs text-indigo-900 font-semibold text-center">
                    {activeModal === "adu-swara"
                      ? "💡 Dalam Adu Swara, Anda akan dicocokkan dengan lawan yang levelnya serupa!"
                      : activeModal === "podium-swara"
                      ? "💡 Di Podium Swara, fokus pada performa di atas panggung dengan audiens virtual!"
                      : "💡 Semakin tinggi level, semakin ketat penilaiannya. Latih skill Anda secara bertahap!"}
                  </p>
                </div>
              </div>
            )}

            {/* Peraturan Latihan */}
            {shouldShowLevels && (
              <div className="overflow-hidden">
                <h3 className="text-orange-500 font-bold text-lg mb-4">
                  Peraturan Latihan
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                  {peraturanLatihan.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-3 md:p-4 flex items-center justify-center mb-2">
                        <img
                          src={item.Image}
                          alt={item.text}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-black text-[10px] leading-tight font-medium text-center w-full">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section for Other Modals */}
            {!shouldShowLevels && (
              <div className="bg-gradient-to-br from-orange-100 to-purple-200 rounded-2xl p-6">
                <h3 className="text-orange-800 font-bold text-base mb-4">
                  Fitur Utama
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeModal === "inspira-swara" && (
                    <>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📚</div>
                        <p className="text-orange-900 text-xs font-medium">
                          Artikel Berkualitas
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          Akses artikel terbaik dari para ahli
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🎬</div>
                        <p className="text-orange-900 text-xs font-medium">
                          Video Tutorial
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          Pelajari teknik dari video tutorial interaktif
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">💡</div>
                        <p className="text-orange-900 text-xs font-medium">
                          Tips & Trik
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          Tips praktis untuk meningkatkan kemampuan Anda
                        </p>
                      </div>
                    </>
                  )}
                  {activeModal === "latih-swara" && (
                    <>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">📖</div>
                        <p className="text-orange-900 text-xs font-medium">
                          Kursus Terstruktur
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          Mulai dari dasar hingga tingkat lanjut
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">✅</div>
                        <p className="text-orange-900 text-xs font-medium">
                          Latihan Praktis
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          Praktik langsung dengan panduan step-by-step
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-orange-900 text-xs font-medium">
                          Progress Tracking
                        </p>
                        <p className="text-gray-600 text-[10px] mt-1">
                          Pantau perkembangan belajar Anda
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link href={modalContent[activeModal].buttonLink} onClick={onClose}>
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                {modalContent[activeModal].buttonText}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Portal>
  );
}
