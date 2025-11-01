"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  CameraOff,
  Smile,
  TrendingUp,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Trophy,
  ArrowRight,
  Home,
  Video,
  Award,
  Clock,
  Target,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { createPortal } from "react-dom";

interface ExpressionData {
  happiness: number;
  confidence: number;
  feedback: string;
  timestamp: number;
}

interface SessionResult {
  avgHappiness: number;
  maxHappiness: number;
  duration: number;
  attempts: number;
  isSuccess: boolean;
}

export default function Ekspresi() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentHappiness, setCurrentHappiness] = useState(0);
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [feedback, setFeedback] = useState(
    "Mulai latihan untuk mendapat feedback"
  );
  const [sessionData, setSessionData] = useState<ExpressionData[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(
    null
  );
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const TARGET_HAPPINESS = 85; // Target minimal 85% happiness
  const SESSION_DURATION = 10; // 10 detik per sesi

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan."
      );
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Simulate face expression detection
  const detectExpression = () => {
    // Simulate happiness detection (60-100%)
    // In real implementation, use face-api.js or TensorFlow.js
    const baseHappiness = Math.random() * 40 + 60; // 60-100
    const confidence = Math.random() * 30 + 70; // 70-100

    // Add some variation
    const happiness = Math.min(
      100,
      Math.max(0, baseHappiness + (Math.random() - 0.5) * 20)
    );

    setCurrentHappiness(Math.round(happiness));
    setCurrentConfidence(Math.round(confidence));

    // Generate feedback
    let newFeedback = "";
    if (happiness >= 90) {
      newFeedback = "Sempurna! Senyum Anda sangat natural!";
    } else if (happiness >= 80) {
      newFeedback = "Bagus! Pertahankan ekspresi ini!";
    } else if (happiness >= 70) {
      newFeedback = "Coba senyum lebih lebar!";
    } else if (happiness >= 60) {
      newFeedback = "Kurang bahagia. Tunjukkan senyum Anda!";
    } else {
      newFeedback = "Tidak terdeteksi ekspresi bahagia. Coba lagi!";
    }

    setFeedback(newFeedback);

    // Record data
    const dataPoint: ExpressionData = {
      happiness: Math.round(happiness),
      confidence: Math.round(confidence),
      feedback: newFeedback,
      timestamp: Date.now(),
    };

    setSessionData((prev) => [...prev, dataPoint]);

    // Draw face overlay
    drawFaceOverlay(happiness);
  };

  // Draw face detection overlay
  const drawFaceOverlay = (happiness: number) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw face box (simulated center position)
    const boxWidth = 300;
    const boxHeight = 400;
    const x = (canvas.width - boxWidth) / 2;
    const y = (canvas.height - boxHeight) / 2;

    // Color based on happiness level
    const color =
      happiness >= 85 ? "#10b981" : happiness >= 70 ? "#f59e0b" : "#ef4444";

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, boxWidth, boxHeight);

    // Draw corners
    const cornerLength = 30;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(x, y + cornerLength);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerLength, y);
    // Top-right
    ctx.moveTo(x + boxWidth - cornerLength, y);
    ctx.lineTo(x + boxWidth, y);
    ctx.lineTo(x + boxWidth, y + cornerLength);
    // Bottom-right
    ctx.moveTo(x + boxWidth, y + boxHeight - cornerLength);
    ctx.lineTo(x + boxWidth, y + boxHeight);
    ctx.lineTo(x + boxWidth - cornerLength, y + boxHeight);
    // Bottom-left
    ctx.moveTo(x + cornerLength, y + boxHeight);
    ctx.lineTo(x, y + boxHeight);
    ctx.lineTo(x, y + boxHeight - cornerLength);
    ctx.stroke();

    // Draw happiness percentage
    ctx.fillStyle = color;
    ctx.font = "bold 24px Arial";
    ctx.fillText(`${Math.round(happiness)}%`, x + boxWidth / 2 - 30, y - 20);
  };

  // Start detection session
  const startDetection = () => {
    if (!isCameraActive) {
      alert("Aktifkan kamera terlebih dahulu!");
      return;
    }

    setIsDetecting(true);
    setIsTimerRunning(true);
    setTimer(0);
    setSessionData([]);
    setAttempts((prev) => prev + 1);

    // Start detection loop (every 500ms)
    detectionIntervalRef.current = setInterval(() => {
      detectExpression();
    }, 500);

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= SESSION_DURATION - 1) {
          stopDetection();
          return SESSION_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Stop detection session
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setIsDetecting(false);
    setIsTimerRunning(false);

    // Calculate results
    if (sessionData.length > 0) {
      const avgHappiness =
        sessionData.reduce((sum, d) => sum + d.happiness, 0) /
        sessionData.length;
      const maxHappiness = Math.max(...sessionData.map((d) => d.happiness));
      const isSuccess = avgHappiness >= TARGET_HAPPINESS;

      const result: SessionResult = {
        avgHappiness: Math.round(avgHappiness),
        maxHappiness: Math.round(maxHappiness),
        duration: timer,
        attempts,
        isSuccess,
      };

      setSessionResult(result);
      setShowResult(true);
    }
  };

  // Reset session
  const resetSession = () => {
    setShowResult(false);
    setSessionResult(null);
    setSessionData([]);
    setTimer(0);
    setCurrentHappiness(0);
    setCurrentConfidence(0);
    setFeedback("Mulai latihan untuk mendapat feedback");

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Complete level
  const completeLevel = () => {
    alert("Level 1 Selesai! Menuju Level 2...");
    // Navigate to next level
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (detectionIntervalRef.current)
        clearInterval(detectionIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const getHappinessColor = (happiness: number) => {
    if (happiness >= 85) return "from-green-500 to-emerald-600";
    if (happiness >= 70) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getHappinessLabel = (happiness: number) => {
    if (happiness >= 90) return "Sangat Bahagia";
    if (happiness >= 80) return "Bahagia";
    if (happiness >= 70) return "Cukup Bahagia";
    if (happiness >= 60) return "Kurang Bahagia";
    return "Tidak Bahagia";
  };

  return (
    <div>
      <div className="min-h-screen bg-white rounded-xl mb-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Level 1: Ekspresi Bahagia
              </h1>
              <p className="text-gray-600 font-medium">
                Latihan Dasar Ekspresi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
              <p className="text-sm text-gray-600 mb-1">Percobaan</p>
              <p className="text-2xl font-black text-orange-600">{attempts}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Camera Header */}
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Live Camera Detection
                      </h2>
                      <p className="text-orange-100 text-sm">
                        Tunjukkan ekspresi bahagia Anda
                      </p>
                    </div>
                  </div>
                  {isTimerRunning && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold text-lg">
                          {timer}s / {SESSION_DURATION}s
                        </span>
                      </div>
                    </div>
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
                  className="w-full h-full  [transform:scaleX(-1)] object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />

                {/* Camera Overlay Info */}
                {isCameraActive && isDetecting && (
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    {/* Happiness Indicator */}
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <p className="text-white/80 text-sm mb-1">
                        Tingkat Kebahagiaan
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-black text-white">
                          {currentHappiness}%
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-24 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getHappinessColor(
                                currentHappiness
                              )} transition-all duration-300`}
                              style={{ width: `${currentHappiness}%` }}
                            />
                          </div>
                          <p className="text-white/80 text-xs mt-1">
                            {getHappinessLabel(currentHappiness)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <p className="text-white/80 text-sm mb-1">Confidence</p>
                      <div className="text-2xl font-black text-white">
                        {currentConfidence}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Banner */}
                {isCameraActive && isDetecting && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div
                      className={`bg-gradient-to-r ${getHappinessColor(
                        currentHappiness
                      )} rounded-2xl px-6 py-4 text-white shadow-2xl`}
                    >
                      <div className="flex items-center gap-3">
                        {currentHappiness >= 85 ? (
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
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Aktifkan Kamera
                    </button>
                  ) : !isDetecting ? (
                    <>
                      <button
                        onClick={startDetection}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Smile className="w-5 h-5" />
                        Mulai Latihan
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
                      onClick={stopDetection}
                      className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Target className="w-5 h-5" />
                      Hentikan Latihan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Target Info */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Target</h3>
                  <p className="text-gray-600 text-sm">Level 1</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Durasi Latihan</span>
                  <span className="font-bold text-gray-900">
                    {SESSION_DURATION} detik
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target Minimal</span>
                  <span className="font-bold text-orange-600">
                    {TARGET_HAPPINESS}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Poin Reward</span>
                  <span className="font-bold text-green-600">+10</span>
                </div>
              </div>
            </div>

            {/* Current Progress */}
            {isDetecting && (
              <div className="bg-white rounded-3xl shadow-lg p-6 animate-fadeIn">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Progress Real-time
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Kebahagiaan</span>
                      <span className="font-bold text-orange-600">
                        {currentHappiness}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getHappinessColor(
                          currentHappiness
                        )} transition-all duration-300`}
                        style={{ width: `${currentHappiness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="font-bold text-blue-600">
                        {currentConfidence}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                        style={{ width: `${currentConfidence}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Waktu</span>
                      <span className="font-bold text-purple-600">
                        {timer}s / {SESSION_DURATION}s
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                        style={{
                          width: `${(timer / SESSION_DURATION) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6">
              <div className="flex gap-3">
                <Smile className="w-8 h-8 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-orange-900 mb-2 text-lg">
                    Cara Latihan:
                  </h3>
                  <ul className="space-y-2 text-orange-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">1.</span>
                      <span>Aktifkan kamera dan izinkan akses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">2.</span>
                      <span>Posisikan wajah di dalam frame</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">3.</span>
                      <span>Klik "Mulai Latihan"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">4.</span>
                      <span>Tunjukkan senyum bahagia Anda!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">5.</span>
                      <span>
                        Pertahankan ekspresi selama {SESSION_DURATION} detik
                      </span>
                    </li>
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
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Tersenyum natural, tidak dipaksakan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Tunjukkan gigi saat tersenyum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Pastikan pencahayaan cukup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Pikirkan hal yang menyenangkan!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {mounted && showResult && sessionResult
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${
                    sessionResult.isSuccess
                      ? "from-green-500 to-emerald-600"
                      : "from-orange-500 to-pink-600"
                  } p-8 text-center text-white rounded-t-3xl`}
                >
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    {sessionResult.isSuccess ? (
                      <Award className="w-12 h-12" />
                    ) : (
                      <Smile className="w-12 h-12" />
                    )}
                  </div>
                  <h2 className="text-3xl font-black mb-2">
                    {sessionResult.isSuccess ? "Berhasil!" : "Coba Lagi!"}
                  </h2>
                  <p className="text-white/90 text-lg">
                    {sessionResult.isSuccess
                      ? "Ekspresi bahagia Anda sangat natural!"
                      : "Terus berlatih untuk hasil yang lebih baik"}
                  </p>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-orange-50 rounded-2xl p-4 text-center">
                      <Trophy className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Rata-rata</p>
                      <p className="text-3xl font-black text-orange-600">
                        {sessionResult.avgHappiness}%
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Maksimal</p>
                      <p className="text-3xl font-black text-green-600">
                        {sessionResult.maxHappiness}%
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Durasi</p>
                      <p className="text-3xl font-black text-blue-600">
                        {sessionResult.duration}s
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700">
                        Pencapaian Target
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {sessionResult.avgHappiness}% / {TARGET_HAPPINESS}%
                      </span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getHappinessColor(
                          sessionResult.avgHappiness
                        )} transition-all duration-500`}
                        style={{
                          width: `${Math.min(
                            100,
                            (sessionResult.avgHappiness / TARGET_HAPPINESS) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Feedback */}
                  <div
                    className={`rounded-2xl p-6 mb-8 ${
                      sessionResult.isSuccess
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-orange-50 border-2 border-orange-200"
                    }`}
                  >
                    <h4
                      className={`font-bold mb-2 flex items-center gap-2 ${
                        sessionResult.isSuccess
                          ? "text-green-900"
                          : "text-orange-900"
                      }`}
                    >
                      {sessionResult.isSuccess ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      Feedback
                    </h4>
                    <p
                      className={`leading-relaxed ${
                        sessionResult.isSuccess
                          ? "text-green-800"
                          : "text-orange-800"
                      }`}
                    >
                      {sessionResult.isSuccess
                        ? "Luar biasa! Ekspresi bahagia Anda sangat natural dan konsisten. Anda berhasil mempertahankan tingkat kebahagiaan di atas target. Anda siap melanjutkan ke level berikutnya!"
                        : sessionResult.avgHappiness >= 75
                        ? "Hampir sempurna! Ekspresi Anda sudah baik, namun perlu sedikit peningkatan untuk mencapai target. Coba senyum lebih lebar dan pertahankan konsistensi!"
                        : "Terus berlatih! Cobalah untuk tersenyum lebih natural dan ekspresif. Pikirkan hal-hal yang menyenangkan untuk membantu ekspresi Anda lebih genuine."}
                    </p>
                  </div>

                  {/* Detailed Stats */}
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-4">
                      Detail Statistik:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                        <span className="text-gray-600">Total Percobaan</span>
                        <span className="font-bold text-gray-900">
                          {sessionResult.attempts}x
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                        <span className="text-gray-600">
                          Data Points Collected
                        </span>
                        <span className="font-bold text-gray-900">
                          {sessionData.length}
                        </span>
                      </div>
                      {sessionResult.isSuccess && (
                        <div className="flex items-center justify-between bg-green-50 rounded-2xl p-4">
                          <span className="text-gray-600">Poin Didapat</span>
                          <span className="font-bold text-green-600">+10</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={resetSession}
                      className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Ulangi Latihan
                    </button>
                    {sessionResult.isSuccess && (
                      <button
                        onClick={completeLevel}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        Selesai & Lanjut
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

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
