// app/(dashboard)/latihan-dasar/ekspresi/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import * as faceapi from "face-api.js";
import {
  Camera,
  CameraOff,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Trophy,
  ArrowRight,
  Video,
  Award,
  Clock,
  Target,
  Zap,
  Loader,
  ArrowLeft,
  Play,
  Heart,
  Focus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// ============ TYPES ============
type EmotionType =
  | "happy"
  | "sad"
  | "neutral"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised";

interface ExpressionData {
  emotions: Record<EmotionType, number>;
  targetScore: number;
  timestamp: number;
  isSuccess: boolean;
}

interface SessionResult {
  sessionNumber: number;
  avgScore: number;
  maxScore: number;
  minScore: number;
  isSuccess: boolean;
  dataPoints: number;
}

interface LevelResult {
  completedSessions: number;
  avgScore: number;
  isLevelComplete: boolean;
  sessionResults: SessionResult[];
}

// ============ LEVEL CONFIGURATION ============
interface LevelConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  targetEmotions: EmotionType[];
  minScore: number;
  sessionCount: number;
  sessionDuration: number;
  instructions: string[];
  tips: string[];
  sessionInstructions: (session: number) => string;
}

const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    title: "Ekspresi Happy/Ceria",
    description: "Tampilkan senyum dan kegembiraan yang natural",
    icon: <Smile className="w-8 h-8" />,
    color: "text-yellow-600",
    bgGradient: "from-yellow-500 to-orange-600",
    targetEmotions: ["happy"],
    minScore: 85,
    sessionCount: 4,
    sessionDuration: 10,
    instructions: [
      "Tunjukkan senyum yang natural dan tulus",
      "Senyum dengan menunjukkan gigi",
      "Pertahankan ekspresi selama 10 detik per sesi",
      "Selesaikan 4 sesi dengan skor minimal 85%",
    ],
    tips: [
      "Pikirkan hal yang menyenangkan",
      "Senyum dari hati, bukan dipaksakan",
      "Tunjukkan gigi saat tersenyum",
      "Mata ikut tersenyum (crow's feet)",
      "Pastikan pencahayaan cukup terang",
    ],
    sessionInstructions: (session) =>
      `Sesi ${session}/4: Tunjukkan senyum bahagia yang natural`,
  },
  2: {
    id: 2,
    title: "Ekspresi Empati/Sedih",
    description: "Tunjukkan empati dan kesedihan dengan tepat",
    icon: <Heart className="w-8 h-8" />,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-indigo-600",
    targetEmotions: ["sad", "neutral"],
    minScore: 80,
    sessionCount: 4,
    sessionDuration: 10,
    instructions: [
      "Tunjukkan ekspresi empati atau kesedihan",
      "Mimik wajah lembut dan penuh perhatian",
      "Mata menunjukkan kepedulian",
      "Selesaikan 4 sesi dengan skor minimal 80%",
    ],
    tips: [
      "Pikirkan situasi yang menyentuh hati",
      "Alis sedikit terangkat dan menyatu",
      "Mata menatap dengan penuh empati",
      "Sudut bibir sedikit turun",
      "Ekspresi lembut, tidak berlebihan",
    ],
    sessionInstructions: (session) =>
      `Sesi ${session}/4: Tunjukkan ekspresi empati dan kesedihan`,
  },
  3: {
    id: 3,
    title: "Kombinasi Happy + Empati",
    description: "Gabungkan ekspresi ceria dan empati",
    icon: <Sparkles className="w-8 h-8" />,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-blue-600",
    targetEmotions: ["happy", "sad", "neutral"],
    minScore: 80,
    sessionCount: 4,
    sessionDuration: 10,
    instructions: [
      "Sesi 1 & 3: Tunjukkan ekspresi Happy",
      "Sesi 2 & 4: Tunjukkan ekspresi Empati",
      "Transisi yang smooth antar ekspresi",
      "Selesaikan 4 sesi dengan skor minimal 80%",
    ],
    tips: [
      "Latih transisi antar ekspresi",
      "Jeda sejenak sebelum berganti ekspresi",
      "Perhatikan konteks yang berbeda",
      "Balance antara dua emosi",
      "Jangan terburu-buru dalam transisi",
    ],
    sessionInstructions: (session) => {
      const isHappy = session === 1 || session === 3;
      return `Sesi ${session}/4: ${isHappy ? "Happy 😊" : "Empati 💙"}`;
    },
  },
  4: {
    id: 4,
    title: "Ekspresi Fokus/Serius",
    description: "Tunjukkan keseriusan dan fokus profesional",
    icon: <Focus className="w-8 h-8" />,
    color: "text-gray-600",
    bgGradient: "from-gray-600 to-gray-800",
    targetEmotions: ["neutral", "angry"],
    minScore: 80,
    sessionCount: 4,
    sessionDuration: 10,
    instructions: [
      "Tunjukkan ekspresi serius dan fokus",
      "Mimik wajah tegas dan profesional",
      "Tatapan mata yang intens",
      "Selesaikan 4 sesi dengan skor minimal 80%",
    ],
    tips: [
      "Postur tegap dan percaya diri",
      "Alis sedikit turun (fokus)",
      "Tatapan mata tajam dan stabil",
      "Mulut dalam posisi netral atau tertutup rapat",
      "Hindari senyum atau ekspresi lembut",
    ],
    sessionInstructions: (session) =>
      `Sesi ${session}/4: Tunjukkan ekspresi serius dan fokus`,
  },
  5: {
    id: 5,
    title: "All Emotions Mastery",
    description: "Menguasai semua ekspresi: Happy, Empati, dan Fokus",
    icon: <Trophy className="w-8 h-8" />,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-600",
    targetEmotions: ["happy", "sad", "neutral"],
    minScore: 75,
    sessionCount: 4,
    sessionDuration: 10,
    instructions: [
      "Sesi 1: Happy - Tunjukkan kegembiraan",
      "Sesi 2: Empati - Tunjukkan kepedulian",
      "Sesi 3: Fokus - Tunjukkan keseriusan",
      "Sesi 4: Kombinasi - Semua ekspresi dalam 1 sesi",
    ],
    tips: [
      "Master level - kombinasi semua skill",
      "Fleksibilitas ekspresi wajah",
      "Adaptasi cepat antar emosi",
      "Natural dan autentik",
      "Demonstrasikan emotional intelligence",
    ],
    sessionInstructions: (session) => {
      if (session === 1) return "Sesi 1/4: Happy 😊";
      if (session === 2) return "Sesi 2/4: Empati 💙";
      if (session === 3) return "Sesi 3/4: Fokus 🎯";
      return "Sesi 4/4: Kombinasi Semua 🌟";
    },
  },
};

// ============ MAIN COMPONENT ============
export default function EkspresiLatihan() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get level from query param
  const levelParam = searchParams.get("level");
  const currentLevel = levelParam ? parseInt(levelParam) : 1;

  if (!LEVEL_CONFIGS[currentLevel]) {
    router.push("/latihan-dasar/ekspresi?level=1");
    return null;
  }

  const levelConfig = LEVEL_CONFIGS[currentLevel];

  // ============ STATE ============
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Session tracking
  const [currentSession, setCurrentSession] = useState(1);
  const [sessionData, setSessionData] = useState<ExpressionData[]>([]);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [showSessionResult, setShowSessionResult] = useState(false);
  const [showLevelResult, setShowLevelResult] = useState(false);

  // Current detection
  const [currentEmotions, setCurrentEmotions] = useState<
    Record<EmotionType, number>
  >({
    happy: 0,
    sad: 0,
    neutral: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
    surprised: 0,
  });
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState(
    "Mulai latihan untuk mendapat feedback"
  );

  // Timer
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionDataRef = useRef<ExpressionData[]>([]);

  useEffect(() => {
    setMounted(true);
    sessionDataRef.current = sessionData;
  }, [sessionData]);

  // ============ LOAD MODELS ============
  const loadModels = async () => {
    setIsLoadingModels(true);
    try {
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);
      console.log("✅ Face-api models loaded successfully!");
    } catch (error) {
      console.error("❌ Error loading models:", error);
      alert("Gagal memuat model AI. Menggunakan mode simulasi.");
      setModelsLoaded(true);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  // ============ CAMERA FUNCTIONS ============
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setFaceDetected(false);
  };

  // ============ EXPRESSION DETECTION ============
  const calculateTargetScore = (
    emotions: Record<EmotionType, number>,
    session: number
  ): number => {
    // Get target emotions for current level and session
    let targetEmotions: EmotionType[] = [];

    if (currentLevel === 1) {
      targetEmotions = ["happy"];
    } else if (currentLevel === 2) {
      targetEmotions = ["sad", "neutral"];
    } else if (currentLevel === 3) {
      // Session 1 & 3: Happy, Session 2 & 4: Empati
      targetEmotions =
        session === 1 || session === 3 ? ["happy"] : ["sad", "neutral"];
    } else if (currentLevel === 4) {
      targetEmotions = ["neutral", "angry"];
    } else if (currentLevel === 5) {
      // Session-specific targets
      if (session === 1) targetEmotions = ["happy"];
      else if (session === 2) targetEmotions = ["sad", "neutral"];
      else if (session === 3) targetEmotions = ["neutral", "angry"];
      else targetEmotions = ["happy", "sad", "neutral"]; // Kombinasi
    }

    // Calculate average score for target emotions
    const scores = targetEmotions.map((e) => emotions[e]);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    return Math.round(avgScore * 100);
  };

  const getSessionFeedback = (score: number, session: number): string => {
    const target = levelConfig.minScore;

    if (score >= target + 10) {
      return "🌟 Sempurna! Ekspresi sangat natural dan tepat!";
    } else if (score >= target) {
      return "✅ Bagus! Ekspresi sudah sesuai target!";
    } else if (score >= target - 10) {
      return "⚠️ Hampir! Ekspresi lebih jelas lagi!";
    } else if (score >= target - 20) {
      return "💪 Terus berlatih! Perlu lebih ekspresif!";
    } else {
      return "❌ Ekspresi belum terdeteksi dengan baik. Coba lagi!";
    }
  };

  const detectExpression = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        setFaceDetected(true);

        const detection = detections[0];
        const expressions = detection.expressions;

        // Convert to our emotion type
        const emotions: Record<EmotionType, number> = {
          happy: expressions.happy,
          sad: expressions.sad,
          neutral: expressions.neutral,
          angry: expressions.angry,
          fearful: expressions.fearful,
          disgusted: expressions.disgusted,
          surprised: expressions.surprised,
        };

        setCurrentEmotions(emotions);

        // Calculate score based on target emotions
        const score = calculateTargetScore(emotions, currentSession);
        setCurrentScore(score);

        // Generate feedback
        const newFeedback = getSessionFeedback(score, currentSession);
        setFeedback(newFeedback);

        // Record data point
        const dataPoint: ExpressionData = {
          emotions,
          targetScore: score,
          timestamp: Date.now(),
          isSuccess: score >= levelConfig.minScore,
        };

        setSessionData((prev) => [...prev, dataPoint]);

        // Draw on canvas
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const box = resizedDetections[0].detection.box;
          const color =
            score >= levelConfig.minScore
              ? "#10b981"
              : score >= levelConfig.minScore - 15
              ? "#f59e0b"
              : "#ef4444";

          // Draw box
          ctx.strokeStyle = color;
          ctx.lineWidth = 4;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Draw corners
          const cornerLength = 30;
          ctx.beginPath();
          ctx.moveTo(box.x, box.y + cornerLength);
          ctx.lineTo(box.x, box.y);
          ctx.lineTo(box.x + cornerLength, box.y);
          ctx.moveTo(box.x + box.width - cornerLength, box.y);
          ctx.lineTo(box.x + box.width, box.y);
          ctx.lineTo(box.x + box.width, box.y + cornerLength);
          ctx.moveTo(box.x + box.width, box.y + box.height - cornerLength);
          ctx.lineTo(box.x + box.width, box.y + box.height);
          ctx.lineTo(box.x + box.width - cornerLength, box.y + box.height);
          ctx.moveTo(box.x + cornerLength, box.y + box.height);
          ctx.lineTo(box.x, box.y + box.height);
          ctx.lineTo(box.x, box.y + box.height - cornerLength);
          ctx.stroke();

          // Draw score
          ctx.fillStyle = color;
          ctx.font = "bold 28px Arial";
          ctx.fillText(`${score}%`, box.x + box.width / 2 - 30, box.y - 15);
        }
      } else {
        setFaceDetected(false);
        setCurrentScore(0);
        setFeedback(
          "⚠️ Wajah tidak terdeteksi. Posisikan wajah di dalam frame."
        );

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (error) {
      console.error("Error detecting face:", error);
    }
  };

  // ============ SESSION CONTROL ============
  const startSession = () => {
    if (!isCameraActive) {
      alert("Aktifkan kamera terlebih dahulu!");
      return;
    }

    if (!modelsLoaded) {
      alert("Model AI masih loading. Tunggu sebentar...");
      return;
    }

    // Reset session data
    setSessionData([]);
    sessionDataRef.current = [];
    setTimer(0);
    setIsDetecting(true);
    setIsTimerRunning(true);
    setShowSessionResult(false);

    // Start detection loop
    detectionIntervalRef.current = window.setInterval(() => {
      detectExpression();
    }, 300);

    // Start timer
    let currentTime = 0;
    timerIntervalRef.current = window.setInterval(() => {
      currentTime += 1;
      setTimer(currentTime);

      if (currentTime >= levelConfig.sessionDuration) {
        stopSession();
      }
    }, 1000);
  };

  const stopSession = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsDetecting(false);
    setIsTimerRunning(false);
  };

  // Calculate session result when detection stops
  useEffect(() => {
    if (
      !isDetecting &&
      !isTimerRunning &&
      sessionDataRef.current.length > 0 &&
      !showSessionResult
    ) {
      setTimeout(() => {
        const data = sessionDataRef.current;

        if (data.length === 0) {
          alert("Tidak ada data. Coba lagi!");
          return;
        }

        const scores = data.map((d) => d.targetScore);
        const avgScore = Math.round(
          scores.reduce((a, b) => a + b, 0) / scores.length
        );
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const isSuccess = avgScore >= levelConfig.minScore;

        const result: SessionResult = {
          sessionNumber: currentSession,
          avgScore,
          maxScore,
          minScore,
          isSuccess,
          dataPoints: data.length,
        };

        setSessionResults((prev) => [...prev, result]);
        setShowSessionResult(true);
      }, 500);
    }
  }, [
    isDetecting,
    isTimerRunning,
    currentSession,
    levelConfig.minScore,
    showSessionResult,
  ]);

  const nextSession = () => {
    if (currentSession < levelConfig.sessionCount) {
      setCurrentSession((prev) => prev + 1);
      setShowSessionResult(false);
      setSessionData([]);
      sessionDataRef.current = [];
      setTimer(0);
      setCurrentScore(0);
    } else {
      // Level complete
      setShowLevelResult(true);
    }
  };

  const retrySession = () => {
    setShowSessionResult(false);
    setSessionData([]);
    sessionDataRef.current = [];
    setTimer(0);
    setCurrentScore(0);

    // Remove last session result
    setSessionResults((prev) => prev.slice(0, -1));
  };

  const resetLevel = () => {
    setCurrentSession(1);
    setSessionResults([]);
    setShowSessionResult(false);
    setShowLevelResult(false);
    setSessionData([]);
    sessionDataRef.current = [];
    setTimer(0);
    setCurrentScore(0);
    setFeedback("Mulai latihan untuk mendapat feedback");

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const goToNextLevel = () => {
    if (currentLevel < 5) {
      router.push(`/latihan-dasar/ekspresi?level=${currentLevel + 1}`);
    } else {
      router.push("/latihan-dasar");
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      if (detectionIntervalRef.current)
        clearInterval(detectionIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // ============ HELPER FUNCTIONS ============
  const getScoreColor = (score: number) => {
    if (score >= levelConfig.minScore) return "from-green-500 to-emerald-600";
    if (score >= levelConfig.minScore - 15)
      return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getCurrentSessionTarget = () => {
    return levelConfig.sessionInstructions(currentSession);
  };

  const levelProgress =
    (sessionResults.length / levelConfig.sessionCount) * 100;
  const levelAvgScore =
    sessionResults.length > 0
      ? Math.round(
          sessionResults.reduce((a, b) => a + b.avgScore, 0) /
            sessionResults.length
        )
      : 0;

  // ============ RENDER ============
  return (
    <div>
      <div className="min-h-screen bg-white rounded-xl mb-10 p-8">
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
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  Level {currentLevel}/5
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                  Ekspresi
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  Sesi {currentSession}/{levelConfig.sessionCount}
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
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Progress Level</p>
            <p className="text-2xl font-black text-orange-600">
              {Math.round(levelProgress)}%
            </p>
          </div>
        </div>

        {/* Loading Models */}
        {isLoadingModels && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">
                  Loading AI Models...
                </h3>
                <p className="text-blue-800">
                  Sedang memuat model deteksi ekspresi wajah. Mohon tunggu
                  sebentar.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
              {/* Camera Header */}
              <div
                className={`bg-gradient-to-r ${levelConfig.bgGradient} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      {levelConfig.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {getCurrentSessionTarget()}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {faceDetected
                          ? "✓ Wajah terdeteksi"
                          : "Posisikan wajah di dalam frame"}
                      </p>
                    </div>
                  </div>
                  {isTimerRunning && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold text-lg">
                          {timer}s / {levelConfig.sessionDuration}s
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Session Progress Dots */}
                <div className="flex items-center gap-2 mt-4">
                  {Array.from({ length: levelConfig.sessionCount }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          i < sessionResults.length
                            ? "bg-white"
                            : i === currentSession - 1
                            ? "bg-white/50 animate-pulse"
                            : "bg-white/20"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Camera View */}
              <div className="relative bg-gray-900 aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />

                {/* Current Score Overlay */}
                {isCameraActive && isDetecting && faceDetected && (
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <p className="text-white/80 text-sm mb-1">Target Score</p>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-black text-white">
                          {currentScore}%
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-24 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getScoreColor(
                                currentScore
                              )} transition-all duration-300`}
                              style={{ width: `${currentScore}%` }}
                            />
                          </div>
                          <p className="text-white/80 text-xs mt-1">
                            Min: {levelConfig.minScore}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top Emotions */}
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <p className="text-white/80 text-sm mb-2">Top Emotions</p>
                      <div className="space-y-1">
                        {Object.entries(currentEmotions)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([emotion, value]) => (
                            <div
                              key={emotion}
                              className="flex items-center gap-2"
                            >
                              <span className="text-white text-xs capitalize">
                                {emotion}:
                              </span>
                              <span className="text-white font-bold text-sm">
                                {Math.round(value * 100)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Banner */}
                {isCameraActive && isDetecting && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div
                      className={`bg-gradient-to-r ${
                        faceDetected
                          ? getScoreColor(currentScore)
                          : "from-gray-500 to-gray-600"
                      } rounded-2xl px-6 py-4 text-white shadow-2xl`}
                    >
                      <div className="flex items-center gap-3">
                        {currentScore >= levelConfig.minScore &&
                        faceDetected ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                        <p className="font-bold text-lg">{feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Camera Placeholder */}
                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold mb-2">
                        Kamera Tidak Aktif
                      </p>
                      <p className="text-white/60">
                        Klik tombol "Aktifkan Kamera" untuk memulai
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center gap-4">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      disabled={isLoadingModels}
                      className={`flex-1 px-6 py-4 bg-gradient-to-r ${
                        levelConfig.bgGradient
                      } text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isLoadingModels ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Camera className="w-5 h-5" />
                      {isLoadingModels ? "Loading AI..." : "Aktifkan Kamera"}
                    </button>
                  ) : !isDetecting ? (
                    <>
                      <button
                        onClick={startSession}
                        className={`flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                      >
                        <Play className="w-5 h-5" />
                        Mulai Sesi {currentSession} (
                        {levelConfig.sessionDuration}s)
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <CameraOff className="w-5 h-5" />
                        Matikan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={stopSession}
                      className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Target className="w-5 h-5" />
                      Hentikan & Lihat Hasil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Session Results */}
            {sessionResults.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-600" />
                  Hasil Sesi
                </h3>
                <div className="space-y-2">
                  {sessionResults.map((result) => (
                    <div
                      key={result.sessionNumber}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        result.isSuccess
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-red-50 border-2 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.isSuccess ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-bold text-gray-900">
                          Sesi {result.sessionNumber}
                        </span>
                      </div>
                      <span
                        className={`font-black text-lg ${
                          result.isSuccess ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.avgScore}%
                      </span>
                    </div>
                  ))}
                </div>

                {sessionResults.length === levelConfig.sessionCount && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-semibold">
                        Rata-rata Level
                      </span>
                      <span className="text-2xl font-black text-orange-600">
                        {levelAvgScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div
              className={`bg-orange-50 border-2 border-orange-200 rounded-3xl p-6`}
            >
              <div className="flex gap-3">
                <div className={`w-8 h-8 ${levelConfig.color} flex-shrink-0`}>
                  {levelConfig.icon}
                </div>
                <div>
                  <h3 className="font-bold text-orange-900 mb-2 text-lg">
                    Instruksi:
                  </h3>
                  <ul className="space-y-2 text-orange-800 text-sm">
                    {levelConfig.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">{i + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6">
              <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Tips:
              </h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                {levelConfig.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Level Navigation */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      router.push(`/latihan-dasar/ekspresi?level=${level}`)
                    }
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      level === currentLevel
                        ? "bg-orange-600 text-white scale-110"
                        : level < currentLevel
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium mt-2 text-center">
                Level Ekspresi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Result Modal */}
      {mounted &&
        showSessionResult &&
        !showLevelResult &&
        sessionResults.length > 0 &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-fadeIn">
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${
                  sessionResults[sessionResults.length - 1].isSuccess
                    ? "from-green-500 to-emerald-600"
                    : "from-orange-500 to-pink-600"
                } p-8 text-center text-white rounded-t-3xl`}
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  {sessionResults[sessionResults.length - 1].isSuccess ? (
                    <CheckCircle className="w-10 h-10" />
                  ) : (
                    <AlertCircle className="w-10 h-10" />
                  )}
                </div>
                <h2 className="text-2xl font-black mb-2">
                  Sesi {currentSession}{" "}
                  {sessionResults[sessionResults.length - 1].isSuccess
                    ? "Berhasil! 🎉"
                    : "Selesai"}
                </h2>
                <p className="text-white/90">
                  {sessionResults[sessionResults.length - 1].isSuccess
                    ? "Ekspresi Anda sudah sesuai target!"
                    : "Perlu latihan lebih untuk mencapai target"}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Skor Rata-rata</p>
                    <p className="text-3xl font-black text-blue-600">
                      {sessionResults[sessionResults.length - 1].avgScore}%
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Skor Maksimal</p>
                    <p className="text-3xl font-black text-green-600">
                      {sessionResults[sessionResults.length - 1].maxScore}%
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Data Points</span>
                    <span className="font-bold">
                      {sessionResults[sessionResults.length - 1].dataPoints}{" "}
                      detections
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!sessionResults[sessionResults.length - 1].isSuccess && (
                    <button
                      onClick={retrySession}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Ulangi
                    </button>
                  )}
                  {currentSession < levelConfig.sessionCount ? (
                    <button
                      onClick={nextSession}
                      className={`flex-1 px-4 py-3 bg-gradient-to-r ${levelConfig.bgGradient} text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                      Sesi {currentSession + 1}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowSessionResult(false);
                        setShowLevelResult(true);
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Lihat Hasil Level
                      <Trophy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Level Result Modal */}
      {mounted &&
        showLevelResult &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${levelConfig.bgGradient} p-8 text-center text-white rounded-t-3xl`}
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2">
                  Level {currentLevel} Selesai! 🎉
                </h2>
                <p className="text-white/90 text-lg">
                  Anda telah menyelesaikan {levelConfig.title}
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-orange-50 rounded-2xl p-4 text-center border-2 border-orange-200">
                    <Trophy className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Rata-rata Level
                    </p>
                    <p className="text-3xl font-black text-orange-600">
                      {levelAvgScore}%
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-center border-2 border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Sesi Selesai</p>
                    <p className="text-3xl font-black text-green-600">
                      {sessionResults.filter((r) => r.isSuccess).length}/
                      {levelConfig.sessionCount}
                    </p>
                  </div>
                </div>

                {/* Session Results */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    Detail Hasil Sesi:
                  </h3>
                  <div className="space-y-3">
                    {sessionResults.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-2xl ${
                          result.isSuccess
                            ? "bg-green-50 border-2 border-green-200"
                            : "bg-red-50 border-2 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              result.isSuccess ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <span className="text-white font-black text-lg">
                              {result.sessionNumber}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              Sesi {result.sessionNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {result.dataPoints} detections
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-black ${
                              result.isSuccess
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.avgScore}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Max: {result.maxScore}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Feedback AI Detection
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {levelAvgScore >= 90
                      ? `Luar biasa! Anda telah menguasai ${
                          levelConfig.title
                        } dengan sempurna. Ekspresi wajah Anda sangat natural dan sesuai target. ${
                          currentLevel < 5
                            ? "Siap melanjutkan ke level berikutnya!"
                            : "Anda telah menyelesaikan semua level ekspresi!"
                        }`
                      : levelAvgScore >= levelConfig.minScore
                      ? `Bagus sekali! Ekspresi Anda sudah sesuai target. ${
                          currentLevel < 5
                            ? "Lanjutkan ke level berikutnya untuk tantangan baru!"
                            : "Pertahankan latihan untuk hasil yang lebih sempurna."
                        }`
                      : "Terus berlatih! Perlu lebih banyak latihan untuk menguasai ekspresi ini dengan sempurna."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={resetLevel}
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
