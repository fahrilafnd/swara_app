// app/(dashboard)/latihan-dasar/page.tsx
"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Mic,
  Smile,
  Clock,
  Lock,
  CheckCircle,
  Play,
  Star,
  Trophy,
  Info,
  ChevronRight,
  X,
  Zap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Level {
  id: number;
  title: string;
  description: string;
  content: string[];
  isCompleted: boolean;
  isUnlocked: boolean;
  link: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  levels: Level[];
  totalProgress: number;
}

export default function LatihanDasar() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "artikulasi",
      title: "Latihan Dasar Artikulasi",
      description: "Tingkatkan kejelasan pengucapan dan diksi Anda",
      icon: <Mic className="w-8 h-8" />,
      color: "text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      totalProgress: 0,
      levels: [
        {
          id: 1,
          title: "Pengenalan Vokal",
          description: "Pelajari cara mengucapkan huruf vokal dengan jelas",
          content: ["A - I - U - E - O - A - I - U - E - O"],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/artikulasi?level=1",
        },
        {
          id: 2,
          title: "Konsonan Dasar",
          description: "Latihan pengucapan konsonan yang tepat",
          content: [
            "BA - PA - DA - TA - GA - KA - FA - VA - SA - ZA",
            "MA - NA - NGA - NYA - RA - LA",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/artikulasi?level=2",
        },
        {
          id: 3,
          title: "Kombinasi Suku Kata",
          description: "Gabungkan vokal dan konsonan menjadi suku kata",
          content: [
            "BA - BE - BI - BU - BO - TA - TI - TU - TE - TO",
            "KA - KI - KU - KE - KO",
            "RA - RI - RU - RE - RO - LA - LI - LU - LE - LO",
            "CHA - CHI - CHU - CHE - CHO",
            "STRA - STRI - STRU - STRE - STRO",
            "AK - IK - UK - EK - OK",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/artikulasi?level=3",
        },
        {
          id: 4,
          title: "Kata Sulit",
          description: "Ucapkan kata-kata yang menantang dengan jelas",
          content: [
            "PSIKOLOGI - STRATEGI - IMPLEMENTASI - INFRASTRUKTUR",
            "KHARISMATIK - TRANSKRIPSI - OTORITER - PROBABILITAS",
            "KUALITAS - SPESIFIKASI",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/artikulasi?level=4",
        },
        {
          id: 5,
          title: "Kalimat Kompleks",
          description: "Master artikulasi dengan kalimat panjang",
          content: [
            "ULAR LARI LURUS DI ATAS REL LURUS",
            "KUKU KAKI KAKEK KAKAKKU KAKU DAN KOTOR",
            "SATU SATE TUJUH TUSUK, DUA SATE EMPAT BELAS TUSUK",
            "KEPALA DIPARUT, KELAPA DIGARUK, JANGAN SAMPAI TERTUKAR",
            "PSIKOLOGI MEMPELAJARI PROSES-PROSES PSIKIS SECARA SPESIFIK",
            "STRATEGI IMPLEMENTASI INFRASTRUKTUR TRANSISIONAL HARUS JELAS",
            "KLAIM-KLAIM KLIMAKS KLASIK KELOMPOK KITA KIAN KRITIS",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/artikulasi?level=5",
        },
      ],
    },
    {
      id: "ekspresi",
      title: "Latihan Dasar Ekspresi",
      description: "Kuasai ekspresi wajah dan bahasa tubuh",
      icon: <Smile className="w-8 h-8" />,
      color: "text-orange-600",
      bgGradient: "from-orange-500 to-orange-600",
      totalProgress: 0,
      levels: [
        {
          id: 1,
          title: "Ekspresi Happy/Ceria",
          description: "Tampilkan senyum dan kegembiraan yang natural",
          content: [
            "Fokus: Ekspresi wajah positif dan ceria",
            "Latihan senyum natural",
            "Kontak mata yang ramah",
            "Energi positif dalam berbicara",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/ekspresi?level=1",
        },
        {
          id: 2,
          title: "Ekspresi Empati/Sedih",
          description: "Tunjukkan empati dan kesedihan dengan tepat",
          content: [
            "Fokus: Ekspresi empati dan kesedihan sesuai konteks",
            "Mimik wajah empati",
            "Tone suara yang lembut",
            "Gestur yang menunjukkan kepedulian",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/ekspresi?level=2",
        },
        {
          id: 3,
          title: "Kombinasi Happy + Empati",
          description: "Gabungkan ekspresi ceria dan empati",
          content: [
            "Fokus: Kombinasi ekspresi ceria dan empati",
            "Transisi ekspresi yang smooth",
            "Menyesuaikan ekspresi dengan konteks",
            "Balance antara positif dan empati",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/ekspresi?level=3",
        },
        {
          id: 4,
          title: "Ekspresi Fokus/Serius",
          description: "Tunjukkan keseriusan dan fokus profesional",
          content: [
            "Fokus: Ekspresi fokus dan serius untuk topik profesional",
            "Mimik wajah serius",
            "Postur tubuh tegap",
            "Tatapan mata yang intens",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/ekspresi?level=4",
        },
        {
          id: 5,
          title: "All Emotions Mastery",
          description: "Gabungkan semua ekspresi dengan sempurna",
          content: [
            "Fokus: Menguasai semua ekspresi (Happy, Empati, Fokus)",
            "Fleksibilitas ekspresi wajah",
            "Adaptasi sesuai audiens dan situasi",
            "Ekspresi natural dan autentik",
            "Master level emotional intelligence",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/ekspresi?level=5",
        },
      ],
    },
    {
      id: "tempo",
      title: "Latihan Dasar Tempo",
      description: "Kendalikan kecepatan dan ritme bicara Anda",
      icon: <Clock className="w-8 h-8" />,
      color: "text-red-600",
      bgGradient: "from-red-500 to-red-600",
      totalProgress: 0,
      levels: [
        {
          id: 1,
          title: "Tempo Lambat & Jelas",
          description: "Berbicara dengan tempo yang sangat pelan dan jelas",
          content: [
            "Tujuan: Membiasakan diri berbicara dengan tempo yang sangat pelan dan artikulasi yang ekstra jelas",
            "Tips:",
            "• Jeda adalah alat yang kuat. Gunakan jeda sebentar untuk memberikan penekanan",
            "• Terburu-buru saat berbicara dapat membuat audiens bingung. Ambil napas dalam-dalam",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/tempo?level=1",
        },
        {
          id: 2,
          title: "Tempo Sedang & Berirama",
          description: "Berbicara dengan kecepatan yang nyaman dan alami",
          content: [
            "Tujuan: Berlatih berbicara dengan kecepatan yang nyaman, alami, dan berirama",
            "Tips:",
            "• Tempo sedang membuat pidato terasa alami dan nyaman didengar",
            "• Saat menyampaikan banyak informasi, keseimbangan tempo sangat penting",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/tempo?level=2",
        },
        {
          id: 3,
          title: "Variasi Tempo",
          description: "Ubah kecepatan untuk menekankan poin kunci",
          content: [
            "Tujuan: Memperkenalkan perubahan tempo dalam satu teks untuk menekankan poin kunci",
            "Tips:",
            "• Mengatur napas adalah kunci kontrol tempo",
            "• Ambil napas saat jeda yang alam, bukan di tengah kalimat",
            "• Perhatikan reaksi audiens",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/tempo?level=3",
        },
        {
          id: 4,
          title: "Tempo Cepat & Lincah",
          description: "Berbicara dengan tempo cepat namun tetap jelas",
          content: [
            "Tujuan: Memperkenalkan perubahan tempo dari pelan ke sedang untuk menekankan poin kunci",
            "Tips:",
            "• Beberapa topik cocok dibawakan dengan tempo yang lebih cepat",
            "• Kemampuan beradaptasi ini sangat berharga",
            "• Berlatih mengubah kecepatan bicara sesuai materi",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/tempo?level=4",
        },
        {
          id: 5,
          title: "Kontrol Tempo & Penekanan",
          description: "Menguasai kontrol penuh atas tempo",
          content: [
            "Tujuan: Menguasai kontrol penuh atas tempo untuk penekanan dan dinamika",
            "Tips:",
            "• Membangun koneksi dengan audiens membutuhkan lebih dari sekedar kata-kata",
            "• Saat ingin berbagi cerita pribadi, perlambat tempo",
            "• Saat menginspirasi tindakan, percepat tempo",
            "• Tempo adalah jembatan emosi antara Anda dan pendengar",
            "• Kuasai tempo, kuasai panggung 🎯",
          ],
          isCompleted: false,
          isUnlocked: true,
          link: "/latihan-dasar/tempo?level=5",
        },
      ],
    },
  ]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [showLevelModal, setShowLevelModal] = useState(false);

  const groupLevelCount = Math.max(...exercises.map((ex) => ex.levels.length));
  const overallCompleted = Array.from(
    { length: groupLevelCount },
    (_, i) => i + 1
  ).filter((levelId) =>
    exercises.every((ex) =>
      ex.levels.some((l) => l.id === levelId && l.isCompleted)
    )
  ).length;

  const overallProgress = Math.round(
    (overallCompleted / groupLevelCount) * 100
  );

  const openLevelModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowLevelModal(true);
  };

  const startLevel = (exerciseId: string, levelId: number) => {
    console.log(`Starting ${exerciseId} - Level ${levelId}`);
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-white mb-10 rounded-xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">Latihan Dasar</h1>
            <p className="text-gray-600 font-medium">
              Kuasai fundamental public speaking sebelum ke level berikutnya
            </p>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Progress Keseluruhan
              </h3>
              <p className="text-gray-600 text-sm">
                {overallCompleted} dari {groupLevelCount} level selesai
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-orange-600">
                {overallProgress}%
              </div>
              <p className="text-sm text-gray-600 font-semibold">Completed</p>
            </div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-8">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">
              Mengapa Latihan Dasar Penting?
            </h3>
            <p className="text-blue-800 leading-relaxed">
              Latihan dasar adalah fondasi untuk menguasai public speaking.
              Dengan menyelesaikan ketiga kategori latihan ini, Anda akan
              membangun skill fundamental yang kuat sebelum mengakses
              fitur-fitur advanced seperti Skor Swara, Podium Swara, dan Adu
              Swara. Selesaikan semua 15 level untuk membuka akses penuh!
            </p>
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => {
          const completedCount = exercise.levels.filter(
            (l) => l.isCompleted
          ).length;
          const progressPercent = Math.round(
            (completedCount / exercise.levels.length) * 100
          );

          return (
            <div
              key={exercise.id}
              className="relative bg-white rounded-3xl p-6 shadow-xl border-2 transition-all border-orange-200 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Header */}
              <div className="mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${exercise.bgGradient} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}
                >
                  {exercise.icon}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  {exercise.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {exercise.description}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-black text-orange-600">
                    {completedCount}/5 Level
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${exercise.bgGradient} rounded-full transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Level Badges */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {exercise.levels.map((level) => (
                  <div
                    key={level.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      level.isCompleted
                        ? `bg-gradient-to-br ${exercise.bgGradient} border-transparent`
                        : level.isUnlocked
                        ? "bg-white border-gray-300"
                        : "bg-gray-100 border-gray-200"
                    }`}
                    title={level.title}
                  >
                    {level.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : level.isUnlocked ? (
                      <span className="text-sm font-bold text-gray-600">
                        {level.id}
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => openLevelModal(exercise)}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${exercise.bgGradient} hover:shadow-lg hover:scale-105`}
              >
                {completedCount === 5 ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Selesai
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Mulai Latihan
                  </>
                )}
              </button>

              {/* Completion Badge */}
              {completedCount === 5 && (
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                  <Star className="w-8 h-8 text-white fill-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievement Preview */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <h3 className="text-2xl font-black mb-2">
          Buka fitur evaluasi untuk menerapkan hasil latihanmu!
        </h3>
        <p className="text-white/90 text-lg mb-4">
          Selesaikan masing-masing 1 latihan untuk membuka akses ke:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
            💯 Skor Swara
          </span>
          <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
            🎤 Podium Swara
          </span>
          <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
            🎯 Adu Swara
          </span>
        </div>
      </div>

      {/* Level Selection Modal */}
      {mounted && showLevelModal && selectedExercise
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div
                  className={`bg-gradient-to-r ${selectedExercise.bgGradient} p-6 text-white sticky top-0 z-[999999]`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        {selectedExercise.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black">
                          {selectedExercise.title}
                        </h2>
                        <p className="text-white/90 text-sm">
                          {selectedExercise.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLevelModal(false)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all"
                          style={{
                            width: `${
                              (selectedExercise.levels.filter(
                                (l) => l.isCompleted
                              ).length /
                                selectedExercise.levels.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-bold text-sm">
                      {
                        selectedExercise.levels.filter((l) => l.isCompleted)
                          .length
                      }
                      /{selectedExercise.levels.length}
                    </span>
                  </div>
                </div>

                {/* Level List */}
                <div className="p-6 space-y-4">
                  {selectedExercise.levels.map((level) => (
                    <div
                      key={level.id}
                      className={`relative border-2 rounded-2xl p-5 transition-all ${
                        level.isCompleted
                          ? "border-green-300 bg-green-50"
                          : level.isUnlocked
                          ? "border-orange-300 bg-white hover:shadow-lg"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {/* Lock Overlay */}
                      {!level.isUnlocked && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                          <div className="text-center">
                            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-gray-600">
                              Selesaikan Level {level.id - 1}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Level Number */}
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            level.isCompleted
                              ? "bg-green-500"
                              : level.isUnlocked
                              ? `bg-gradient-to-br ${selectedExercise.bgGradient}`
                              : "bg-gray-300"
                          }`}
                        >
                          {level.isCompleted ? (
                            <CheckCircle className="w-7 h-7 text-white" />
                          ) : (
                            <span className="text-2xl font-black text-white">
                              {level.id}
                            </span>
                          )}
                        </div>

                        {/* Level Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1">
                                {level.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3">
                                {level.description}
                              </p>

                              {/* Content Preview */}
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <BookOpen className="w-4 h-4 text-gray-600" />
                                  <span className="text-xs font-bold text-gray-700">
                                    Materi Latihan:
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 space-y-1">
                                  {level.content.slice(0, 3).map((item, i) => (
                                    <p key={i} className="leading-relaxed">
                                      {item}
                                    </p>
                                  ))}
                                  {level.content.length > 3 && (
                                    <p className="text-orange-600 font-semibold">
                                      +{level.content.length - 3} materi lagi...
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            {level.isCompleted && (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                ✓ Selesai
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {level.isUnlocked && !level.isCompleted && (
                            <Link
                              href={level.link || "#"}
                              className={`inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r ${selectedExercise.bgGradient} text-white rounded-xl font-bold hover:shadow-lg transition-all`}
                            >
                              <Play className="w-4 h-4" />
                              Mulai Level
                            </Link>
                          )}

                          {level.isCompleted && (
                            <Link
                              href={level.link || "#"}
                              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                            >
                              <Play className="w-4 h-4" />
                              Ulangi
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
