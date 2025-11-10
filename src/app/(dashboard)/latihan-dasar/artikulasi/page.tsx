// app/(dashboard)/latihan-dasar/artikulasi/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Volume2,
  ArrowRight,
  Award,
  TrendingUp,
  X,
  Home,
  ArrowLeft,
  BookOpen,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";

// ============ LEVEL CONFIGURATION ============
interface LevelConfig {
  id: number;
  title: string;
  description: string;
  instructions: string[];
  items: string[];
  minAccuracy: number;
  tips: string[];
}

const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    title: "Pengenalan Vokal",
    description: "Pelajari cara mengucapkan huruf vokal dengan jelas",
    instructions: [
      "Ucapkan setiap huruf vokal dengan jelas dan tegas",
      "Pastikan mikrofon Anda berfungsi dengan baik",
      "Ucapkan saat tombol 'Mulai Rekam' ditekan",
      "Target akurasi minimal 85% untuk melanjutkan",
    ],
    items: ["A", "I", "U", "E", "O"],
    minAccuracy: 85,
    tips: [
      "Buka mulut lebar untuk vokal A",
      "Senyum tipis untuk vokal I",
      "Bentuk bibir melingkar untuk vokal U",
      "Posisi mulut antara I dan A untuk vokal E",
      "Bentuk bibir bulat untuk vokal O",
    ],
  },
  2: {
    id: 2,
    title: "Konsonan Dasar",
    description: "Latihan pengucapan konsonan yang tepat",
    instructions: [
      "Ucapkan setiap kombinasi konsonan dengan jelas",
      "Perhatikan perbedaan antara konsonan bersuara dan tak bersuara",
      "Jeda sebentar antar suku kata",
      "Target akurasi minimal 85%",
    ],
    items: [
      "BA",
      "PA",
      "DA",
      "TA",
      "GA",
      "KA",
      "FA",
      "VA",
      "SA",
      "ZA",
      "MA",
      "NA",
      "NGA",
      "NYA",
      "RA",
      "LA",
    ],
    minAccuracy: 85,
    tips: [
      "BA vs PA: BA bersuara, PA tidak bersuara",
      "DA vs TA: Perhatikan getaran pita suara",
      "NGA: Suara dari hidung",
      "NYA: Lidah menempel langit-langit",
      "RA: Getarkan ujung lidah",
    ],
  },
  3: {
    id: 3,
    title: "Kombinasi Suku Kata",
    description: "Gabungkan vokal dan konsonan menjadi suku kata",
    instructions: [
      "Ucapkan kombinasi suku kata dengan lancar",
      "Perhatikan transisi antar suku kata",
      "Jaga tempo yang konsisten",
      "Target akurasi minimal 85%",
    ],
    items: [
      "BA-BE-BI-BU-BO",
      "TA-TI-TU-TE-TO",
      "KA-KI-KU-KE-KO",
      "RA-RI-RU-RE-RO",
      "LA-LI-LU-LE-LO",
      "CHA-CHI-CHU",
      "CHE-CHO",
      "STRA-STRI-STRU",
      "STRE-STRO",
      "AK-IK-UK-EK-OK",
    ],
    minAccuracy: 85,
    tips: [
      "Ucapkan dengan ritme yang konsisten",
      "Jangan terburu-buru pada suku kata kompleks",
      "STRA: Latih pelan dulu, lalu percepat",
      "Perhatikan transisi konsonan ganda",
    ],
  },
  4: {
    id: 4,
    title: "Kata Sulit",
    description: "Ucapkan kata-kata yang menantang dengan jelas",
    instructions: [
      "Ucapkan setiap kata dengan artikulasi yang jelas",
      "Jangan terburu-buru, fokus pada kejelasan",
      "Perhatikan setiap suku kata",
      "Target akurasi minimal 80%",
    ],
    items: [
      "PSIKOLOGI",
      "STRATEGI",
      "IMPLEMENTASI",
      "INFRASTRUKTUR",
      "KHARISMATIK",
      "TRANSKRIPSI",
      "OTORITER",
      "PROBABILITAS",
      "KUALITAS",
      "SPESIFIKASI",
    ],
    minAccuracy: 80,
    tips: [
      "PSIKOLOGI: PSI-KO-LO-GI (4 suku kata)",
      "IMPLEMENTASI: IM-PLE-MEN-TA-SI (5 suku kata)",
      "INFRASTRUKTUR: IN-FRA-STRUK-TUR (4 suku kata)",
      "Latih suku kata yang sulit secara terpisah dulu",
    ],
  },
  5: {
    id: 5,
    title: "Kalimat Kompleks",
    description: "Master artikulasi dengan kalimat panjang",
    instructions: [
      "Ucapkan setiap kalimat dengan jelas dan lengkap",
      "Perhatikan jeda natural antar kata",
      "Jaga kecepatan yang konsisten",
      "Target akurasi minimal 75%",
    ],
    items: [
      "ULAR LARI LURUS DI ATAS REL LURUS",
      "KUKU KAKI KAKEK KAKAKKU KAKU DAN KOTOR",
      "SATU SATE TUJUH TUSUK DUA SATE EMPAT BELAS TUSUK",
      "KEPALA DIPARUT KELAPA DIGARUK JANGAN SAMPAI TERTUKAR",
      "PSIKOLOGI MEMPELAJARI PROSES-PROSES PSIKIS SECARA SPESIFIK",
      "STRATEGI IMPLEMENTASI INFRASTRUKTUR TRANSISIONAL HARUS JELAS",
      "KLAIM-KLAIM KLIMAKS KLASIK KELOMPOK KITA KIAN KRITIS",
    ],
    minAccuracy: 75,
    tips: [
      "Baca kalimat dulu sebelum merekam",
      "Fokus pada kata-kata yang berulang (tongue twister)",
      "Ambil napas sebelum memulai",
      "Kecepatan tidak penting, kejelasan yang utama",
    ],
  },
};

// ============ INTERFACES ============
interface ItemProgress {
  item: string;
  attempts: number;
  accuracy: number;
  isCompleted: boolean;
  feedback: string;
}

// ============ MAIN COMPONENT ============
export default function ArtikualasiLatihan() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get level from query param, default to 1
  const levelParam = searchParams.get("level");
  const currentLevel = levelParam ? parseInt(levelParam) : 1;

  // Check if level is valid
  if (!LEVEL_CONFIGS[currentLevel]) {
    // Redirect to level 1 if invalid
    router.push("/latihan-dasar/artikulasi?level=1");
    return null;
  }

  const levelConfig = LEVEL_CONFIGS[currentLevel];

  // ============ STATE ============
  const [isRecording, setIsRecording] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Progress tracking
  const [itemProgress, setItemProgress] = useState<ItemProgress[]>(
    levelConfig.items.map((item) => ({
      item,
      attempts: 0,
      accuracy: 0,
      isCompleted: false,
      feedback: "",
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentItem = levelConfig.items[currentItemIndex];
  const currentProgress = itemProgress[currentItemIndex];

  // ============ SIMULATION ============
  const simulateRecognition = () => {
    // Simulate accuracy between 60-100%
    const accuracy = Math.floor(Math.random() * 40) + 60;

    let feedback = "";
    let isCompleted = false;

    if (accuracy >= levelConfig.minAccuracy) {
      feedback = "Sempurna! Pengucapan sangat jelas!";
      isCompleted = true;
    } else if (accuracy >= levelConfig.minAccuracy - 15) {
      feedback = "Bagus! Coba sekali lagi untuk hasil lebih baik.";
    } else {
      feedback = "Kurang jelas. Ucapkan dengan lebih tegas!";
    }

    return { accuracy, feedback, isCompleted };
  };

  // ============ RECORDING ============
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
      setIsRecording(true);

      // Auto stop based on level complexity
      const recordDuration =
        currentLevel <= 2 ? 2000 : currentLevel === 3 ? 3000 : 5000;
      setTimeout(() => {
        stopRecording();
        provideFeedback();
      }, recordDuration);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan."
      );
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setAudioLevel(0);
  };

  const provideFeedback = () => {
    const { accuracy, feedback, isCompleted } = simulateRecognition();

    const updatedProgress = [...itemProgress];
    updatedProgress[currentItemIndex] = {
      ...updatedProgress[currentItemIndex],
      attempts: updatedProgress[currentItemIndex].attempts + 1,
      accuracy,
      isCompleted,
      feedback,
    };

    setItemProgress(updatedProgress);
    setCurrentFeedback(feedback);
    setShowFeedback(true);

    // Auto hide feedback and move to next
    setTimeout(() => {
      setShowFeedback(false);
      if (isCompleted && currentItemIndex < levelConfig.items.length - 1) {
        setTimeout(() => {
          setCurrentItemIndex(currentItemIndex + 1);
        }, 500);
      } else if (
        isCompleted &&
        currentItemIndex === levelConfig.items.length - 1
      ) {
        setTimeout(() => {
          setShowResult(true);
        }, 500);
      }
    }, 2000);
  };

  const repeatCurrentItem = () => {
    const updatedProgress = [...itemProgress];
    updatedProgress[currentItemIndex].isCompleted = false;
    updatedProgress[currentItemIndex].accuracy = 0;
    setItemProgress(updatedProgress);
    setShowFeedback(false);
  };

  const restartLevel = () => {
    setCurrentItemIndex(0);
    setItemProgress(
      levelConfig.items.map((item) => ({
        item,
        attempts: 0,
        accuracy: 0,
        isCompleted: false,
        feedback: "",
      }))
    );
    setShowResult(false);
    setShowFeedback(false);
  };

  const goToNextLevel = () => {
    if (currentLevel < 5) {
      router.push(`/latihan-dasar/artikulasi?level=${currentLevel + 1}`);
    } else {
      router.push("/latihan-dasar");
    }
  };

  // ============ CALCULATIONS ============
  const totalAccuracy = Math.round(
    itemProgress.reduce((sum, v) => sum + v.accuracy, 0) /
      levelConfig.items.length
  );

  const completedCount = itemProgress.filter((v) => v.isCompleted).length;

  // ============ WAVEFORM ============
  const generateWaveform = () => {
    const bars = [];
    const barCount = 40;
    const normalizedLevel = audioLevel / 255;

    for (let i = 0; i < barCount; i++) {
      const heightPercent = isRecording
        ? Math.random() * normalizedLevel * 100 + 20
        : 5;
      bars.push(
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-full transition-all duration-100"
          style={{
            height: `${heightPercent}%`,
            width: "4px",
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div>
      <div className="min-h-screen bg-white rounded-2xl shadow-md mb-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/latihan-dasar"
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:shadow-lg transition-all border-2 border-gray-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  Level {currentLevel}/5
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  Artikulasi
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900">
                {levelConfig.title}
              </h1>
              <p className="text-gray-600 font-medium">
                {levelConfig.description}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-2xl font-black text-blue-600">
              {completedCount}/{levelConfig.items.length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold">
                Item {currentItemIndex + 1} dari {levelConfig.items.length}
              </span>
              <span className="text-white/90 text-sm">
                {completedCount} selesai
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (completedCount / levelConfig.items.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Current Item Display */}
          <div className="p-8 sm:p-12 text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <p className="text-gray-600 font-semibold text-lg">
                  Ucapkan dengan jelas:
                </p>
              </div>
              <div
                className={`inline-flex items-center justify-center min-w-[200px] px-8 py-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl transition-all ${
                  isRecording ? "animate-pulse scale-105" : ""
                }`}
              >
                <span
                  className={`font-black ${
                    currentLevel === 1
                      ? "text-8xl"
                      : currentLevel <= 3
                      ? "text-5xl"
                      : currentLevel === 4
                      ? "text-4xl"
                      : "text-2xl sm:text-3xl"
                  }`}
                >
                  {currentItem}
                </span>
              </div>

              {/* Accuracy Display */}
              {currentProgress.accuracy > 0 && (
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-2xl border-2 border-blue-200">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600 font-semibold">
                      Akurasi Terakhir:
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      {currentProgress.accuracy}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Waveform Visualization */}
            <div className="mb-8">
              <div className="h-32 bg-gray-50 rounded-3xl flex items-center justify-center gap-1 px-8 border-2 border-gray-100">
                {generateWaveform()}
              </div>
            </div>

            {/* Feedback Display */}
            {showFeedback && (
              <div
                className={`mb-6 p-6 rounded-3xl animate-fadeIn ${
                  currentProgress.isCompleted
                    ? "bg-green-50 border-2 border-green-300"
                    : currentProgress.accuracy >= levelConfig.minAccuracy - 15
                    ? "bg-yellow-50 border-2 border-yellow-300"
                    : "bg-red-50 border-2 border-red-300"
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  {currentProgress.isCompleted ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  )}
                  <p
                    className={`text-xl font-bold ${
                      currentProgress.isCompleted
                        ? "text-green-700"
                        : "text-orange-700"
                    }`}
                  >
                    {currentFeedback}
                  </p>
                </div>
              </div>
            )}

            {/* Recording Button */}
            <div className="flex items-center justify-center gap-4">
              {!isRecording && !currentProgress.isCompleted && (
                <button
                  onClick={startRecording}
                  className="px-8 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 hover:scale-105"
                >
                  <Mic className="w-6 h-6" />
                  Mulai Rekam
                </button>
              )}

              {isRecording && (
                <div className="flex items-center gap-3 bg-red-500 text-white px-8 py-5 rounded-2xl">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                  <span className="font-bold text-lg">Merekam...</span>
                </div>
              )}

              {!isRecording &&
                currentProgress.attempts > 0 &&
                !currentProgress.isCompleted && (
                  <button
                    onClick={repeatCurrentItem}
                    className="px-6 py-5 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Ulangi
                  </button>
                )}
            </div>

            {/* Attempts Counter */}
            {currentProgress.attempts > 0 && (
              <p className="text-gray-500 mt-6 text-sm">
                Percobaan: {currentProgress.attempts}
              </p>
            )}
          </div>
        </div>

        {/* Instructions Card */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
          <div className="flex gap-4">
            <Volume2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                <span>Tips Level {currentLevel}:</span>
              </h3>
              <ul className="space-y-2 text-blue-800">
                {levelConfig.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>

              {levelConfig.tips.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="font-semibold text-blue-900 mb-2">
                    💡 Tips Khusus:
                  </p>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {levelConfig.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Level Navigation */}
        <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() =>
                  router.push(`/latihan-dasar/artikulasi?level=${level}`)
                }
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  level === currentLevel
                    ? "bg-blue-600 text-white scale-110"
                    : level < currentLevel
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 font-medium">Level Artikulasi</p>
        </div>
      </div>

      {/* Result Modal */}
      {mounted &&
        showResult &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white overflow-auto max-h-[90vh] rounded-3xl max-w-2xl w-full shadow-2xl animate-fadeIn">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white rounded-t-3xl">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2">
                  Level {currentLevel} Selesai!
                </h2>
                <p className="text-green-100 text-lg">
                  Selamat! Anda telah menyelesaikan {levelConfig.title}
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-2xl p-4 text-center border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">
                      Total Percobaan
                    </p>
                    <p className="text-3xl font-black text-blue-600">
                      {itemProgress.reduce((sum, v) => sum + v.attempts, 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-center border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">
                      Akurasi Rata-rata
                    </p>
                    <p className="text-3xl font-black text-green-600">
                      {totalAccuracy}%
                    </p>
                  </div>
                </div>

                {/* Item Results */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    Detail Hasil:
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {itemProgress.map((progress, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {progress.item}
                            </p>
                            <p className="text-sm text-gray-600">
                              {progress.attempts} percobaan
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-blue-600">
                            {progress.accuracy}%
                          </p>
                          {progress.accuracy >= levelConfig.minAccuracy && (
                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Summary */}
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Feedback Keseluruhan
                  </h4>
                  <p className="text-green-800 leading-relaxed">
                    {totalAccuracy >= 90
                      ? `Luar biasa! Anda telah menguasai ${
                          levelConfig.title
                        } dengan sempurna. ${
                          currentLevel < 5
                            ? "Siap melanjutkan ke level berikutnya!"
                            : "Anda telah menyelesaikan semua level artikulasi!"
                        }`
                      : totalAccuracy >= 80
                      ? `Bagus sekali! Pengucapan Anda sudah baik. ${
                          currentLevel < 5
                            ? "Lanjutkan ke level berikutnya untuk tantangan baru!"
                            : "Pertahankan latihan untuk hasil yang lebih sempurna."
                        }`
                      : `Cukup baik! Pertahankan latihan ini untuk meningkatkan kejelasan pengucapan Anda.`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={restartLevel}
                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Ulangi Level
                  </button>
                  {currentLevel < 5 ? (
                    <button
                      onClick={goToNextLevel}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Level {currentLevel + 1}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <Link
                      href="/latihan-dasar"
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Selesai
                      <CheckCircle className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
