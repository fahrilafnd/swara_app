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
  Volume2,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Level {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  duration: string;
  points: number;
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
      totalProgress: 40, // 2 dari 5 level completed
      levels: [
        {
          id: 1,
          title: "Pengenalan Vokal",
          description: "Pelajari cara mengucapkan huruf vokal dengan jelas",
          isCompleted: false,
          isUnlocked: true,
          duration: "3 menit",
          points: 10,
          link: "/latihan-dasar/artikulasi",
        },
        {
          id: 2,
          title: "Konsonan Dasar",
          description: "Latihan pengucapan konsonan yang tepat",
          isCompleted: false,
          isUnlocked: false,
          duration: "4 menit",
          points: 15,
          link: "/latihan-dasar/artikulasi",
        },
        {
          id: 3,
          title: "Kombinasi Suku Kata",
          description: "Gabungkan vokal dan konsonan menjadi suku kata",
          isCompleted: false,
          isUnlocked: false,
          duration: "5 menit",
          points: 20,
          link: "/latihan-dasar/artikulasi",
        },
        {
          id: 4,
          title: "Kata Sulit",
          description: "Ucapkan kata-kata yang menantang dengan jelas",
          isCompleted: false,
          isUnlocked: false,
          duration: "6 menit",
          points: 25,
          link: "/latihan-dasar/artikulasi",
        },
        {
          id: 5,
          title: "Kalimat Kompleks",
          description: "Master artikulasi dengan kalimat panjang",
          isCompleted: false,
          isUnlocked: false,
          duration: "7 menit",
          points: 30,
          link: "/latihan-dasar/artikulasi",
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
          title: "Ekspresi Bahagia",
          description: "Tampilkan senyum dan kegembiraan yang natural",
          isCompleted: false,
          isUnlocked: true,
          duration: "3 menit",
          points: 10,
          link: "/latihan-dasar/ekspresi",
        },
        {
          id: 2,
          title: "Ekspresi Serius",
          description: "Tunjukkan keseriusan dengan tepat",
          isCompleted: false,
          isUnlocked: false,
          duration: "4 menit",
          points: 15,
          link: "/latihan-dasar/ekspresi",
        },
        {
          id: 3,
          title: "Kontak Mata",
          description: "Latihan mempertahankan kontak mata",
          isCompleted: false,
          isUnlocked: false,
          duration: "5 menit",
          points: 20,
          link: "/latihan-dasar/ekspresi",
        },
        {
          id: 4,
          title: "Gestur Tangan",
          description: "Gunakan bahasa tubuh yang efektif",
          isCompleted: false,
          isUnlocked: false,
          duration: "6 menit",
          points: 25,
          link: "/latihan-dasar/ekspresi",
        },
        {
          id: 5,
          title: "Kombinasi Ekspresi",
          description: "Gabungkan semua elemen ekspresi",
          isCompleted: false,
          isUnlocked: false,
          duration: "7 menit",
          points: 30,
          link: "/latihan-dasar/ekspresi",
        },
      ],
    },
    {
      id: "tempo",
      title: "Latihan Dasar Tempo",
      description: "Kendalikan kecepatan dan ritme bicara Anda",
      icon: <Clock className="w-8 h-8" />,
      color: "text-purple-600",
      bgGradient: "from-red-500 to-red-600",
      totalProgress: 0,
      levels: [
        {
          id: 1,
          title: "Tempo Lambat",
          description: "Berbicara dengan kecepatan yang terkontrol",
          isCompleted: false,
          isUnlocked: true,
          duration: "3 menit",
          points: 10,
          link: "/latihan-dasar/tempo",
        },
        {
          id: 2,
          title: "Tempo Sedang",
          description: "Temukan kecepatan bicara yang ideal",
          isCompleted: false,
          isUnlocked: false,
          duration: "4 menit",
          points: 15,
          link: "/latihan-dasar/tempo",
        },
        {
          id: 3,
          title: "Variasi Tempo",
          description: "Ubah kecepatan sesuai konteks",
          isCompleted: false,
          isUnlocked: false,
          duration: "5 menit",
          points: 20,
          link: "/latihan-dasar/tempo",
        },
        {
          id: 4,
          title: "Jeda Efektif",
          description: "Gunakan pause untuk penekanan",
          isCompleted: false,
          isUnlocked: false,
          duration: "6 menit",
          points: 25,
          link: "/latihan-dasar/tempo",
        },
        {
          id: 5,
          title: "Ritme Presentasi",
          description: "Master timing dalam presentasi",
          isCompleted: false,
          isUnlocked: false,
          duration: "7 menit",
          points: 30,
          link: "/latihan-dasar/tempo",
        },
      ],
    },
  ]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [showLevelModal, setShowLevelModal] = useState(false);

  const totalLevels = exercises.reduce((sum, ex) => sum + ex.levels.length, 0);
  const completedLevels = exercises.reduce(
    (sum, ex) => sum + ex.levels.filter((l) => l.isCompleted).length,
    0
  );
  const overallProgress = Math.round((completedLevels / totalLevels) * 100);

  const openLevelModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowLevelModal(true);
  };

  const startLevel = (exerciseId: string, levelId: number) => {
    // Navigate to training page
    console.log(`Starting ${exerciseId} - Level ${levelId}`);
    alert(`Memulai ${exerciseId} - Level ${levelId}`);
  };
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-white mb-10 rounded-xl shadow-sm p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Latihan Dasar
              </h1>
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
                  {completedLevels} dari {totalLevels} level selesai
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
                fitur-fitur advanced seperti Podium Swara, Inspira Swara, dan
                Mentoring. Selesaikan semua 15 level untuk membuka akses penuh!
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

            return (
              <div
                key={exercise.id}
                className={`relative bg-white rounded-3xl p-6 shadow-xl border-2 transition-all border-orange-200 hover:shadow-2xl hover:-translate-y-1`}
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
                      style={{ width: `${exercise.totalProgress}%` }}
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
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-black mb-2">Unlock Premium Features!</h3>
          <p className="text-purple-100 text-lg mb-4">
            Selesaikan masing-masing 1 latihan untuk membuka akses ke:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
              🎤 Podium Swara
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
              📚 Inspira Swara
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
              👥 Mentoring
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
              🎯 Adu Swara
            </span>
          </div>
        </div>
      </div>

      {/* Level Selection Modal */}
      {mounted && showLevelModal && selectedExercise
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div
                  className={`bg-gradient-to-r ${selectedExercise.bgGradient} p-6 text-white`}
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
                        <p className="text-white/90">
                          {selectedExercise.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLevelModal(false)}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{
                            width: `${selectedExercise.totalProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-bold">
                      {
                        selectedExercise.levels.filter((l) => l.isCompleted)
                          .length
                      }
                      /5
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
                        <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                          <Lock className="w-8 h-8 text-gray-400" />
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
                              <p className="text-gray-600 text-sm">
                                {level.description}
                              </p>
                            </div>
                            {level.isCompleted && (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                Selesai
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">
                                {level.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-orange-600">
                              <Star className="w-4 h-4" />
                              <span className="font-bold">
                                {level.points} poin
                              </span>
                            </div>
                          </div>

                          {/* Start Button */}
                          {level.isUnlocked && !level.isCompleted && (
                            <Link
                              href={level.link || "#"}
                              className={`mt-3 w-fit px-6 py-2.5 bg-gradient-to-r ${selectedExercise.bgGradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2`}
                            >
                              <Play className="w-4 h-4" />
                              Mulai Level
                            </Link>
                          )}

                          {level.isCompleted && (
                            <button
                              onClick={() =>
                                startLevel(selectedExercise.id, level.id)
                              }
                              className="mt-3 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Ulangi
                            </button>
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
