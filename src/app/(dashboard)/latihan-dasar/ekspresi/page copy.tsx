"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import * as faceapi from "face-api.js";
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
  Loader,
  ArrowLeft,
} from "lucide-react";

interface ExpressionData {
  happiness: number;
  confidence: number;
  expressions: faceapi.FaceExpressions;
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
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
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
  const [faceDetected, setFaceDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionDataRef = useRef<ExpressionData[]>([]);

  const TARGET_HAPPINESS = 85;
  const SESSION_DURATION = 10;

  // Sync sessionData with ref
  useEffect(() => {
    sessionDataRef.current = sessionData;
  }, [sessionData]);

  // Load face-api models
  const loadModels = async () => {
    setIsLoadingModels(true);
    try {
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);
      console.log("Models loaded successfully!");
    } catch (error) {
      console.error("Error loading models:", error);
      alert(
        "Gagal memuat model AI. Pastikan folder models tersedia di public/models. Akan menggunakan mode simulasi."
      );
      setModelsLoaded(true); // Set true to continue with simulation
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  // Start Camera
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

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
        };
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
    setFaceDetected(false);
  };

  // Real face expression detection using face-api.js
  const detectExpression = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    faceapi.matchDimensions(canvas, displaySize);

    try {
      // Detect faces with expressions
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        setFaceDetected(true);

        const detection = detections[0]; // Get first face
        const expressions = detection.expressions;

        // Get happiness score (0-1, convert to 0-100)
        const happinessScore = expressions.happy * 100;

        // Calculate confidence (average of all expression probabilities)
        const allExpressions = Object.values(expressions);
        const avgConfidence =
          (allExpressions.reduce((a, b) => a + b, 0) / allExpressions.length) *
          100;

        setCurrentHappiness(Math.round(happinessScore));
        setCurrentConfidence(Math.round(avgConfidence));

        // Generate feedback based on happiness
        let newFeedback = "";
        if (happinessScore >= 90) {
          newFeedback = "Sempurna! Senyum Anda sangat natural dan tulus!";
        } else if (happinessScore >= 80) {
          newFeedback = "Bagus sekali! Pertahankan ekspresi ini!";
        } else if (happinessScore >= 70) {
          newFeedback = "Bagus! Coba senyum sedikit lebih lebar!";
        } else if (happinessScore >= 60) {
          newFeedback =
            "Kurang bahagia. Tunjukkan senyum Anda lebih ekspresif!";
        } else if (happinessScore >= 40) {
          newFeedback = "Ekspresi masih netral. Coba tersenyum!";
        } else {
          newFeedback = "Belum terdeteksi ekspresi bahagia. Tersenyum ya! 😊";
        }

        setFeedback(newFeedback);

        // Record data point
        const dataPoint: ExpressionData = {
          happiness: Math.round(happinessScore),
          confidence: Math.round(avgConfidence),
          expressions: expressions,
          timestamp: Date.now(),
        };

        setSessionData((prev) => [...prev, dataPoint]);

        // Draw detections on canvas
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw face box with color based on happiness
          const box = resizedDetections[0].detection.box;
          const color =
            happinessScore >= 85
              ? "#10b981"
              : happinessScore >= 70
              ? "#f59e0b"
              : "#ef4444";

          ctx.strokeStyle = color;
          ctx.lineWidth = 4;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Draw corners
          const cornerLength = 30;
          ctx.beginPath();
          // Top-left
          ctx.moveTo(box.x, box.y + cornerLength);
          ctx.lineTo(box.x, box.y);
          ctx.lineTo(box.x + cornerLength, box.y);
          // Top-right
          ctx.moveTo(box.x + box.width - cornerLength, box.y);
          ctx.lineTo(box.x + box.width, box.y);
          ctx.lineTo(box.x + box.width, box.y + cornerLength);
          // Bottom-right
          ctx.moveTo(box.x + box.width, box.y + box.height - cornerLength);
          ctx.lineTo(box.x + box.width, box.y + box.height);
          ctx.lineTo(box.x + box.width - cornerLength, box.y + box.height);
          // Bottom-left
          ctx.moveTo(box.x + cornerLength, box.y + box.height);
          ctx.lineTo(box.x, box.y + box.height);
          ctx.lineTo(box.x, box.y + box.height - cornerLength);
          ctx.stroke();

          // Draw happiness percentage above face
          ctx.fillStyle = color;
          ctx.font = "bold 24px Arial";
          ctx.fillText(
            `${Math.round(happinessScore)}%`,
            box.x + box.width / 2 - 30,
            box.y - 10
          );
        }
      } else {
        // No face detected
        setFaceDetected(false);
        setCurrentHappiness(0);
        setCurrentConfidence(0);
        setFeedback("Wajah tidak terdeteksi. Posisikan wajah di dalam frame.");

        // Clear canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (error) {
      console.error("Error detecting face:", error);
    }
  };

  // Start detection session
  const startDetection = () => {
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
    setAttempts((prev) => prev + 1);
    setShowResult(false);

    // Start detection loop (every 300ms for smoother detection)
    detectionIntervalRef.current = window.setInterval(() => {
      detectExpression();
    }, 300);

    // Start timer (counts up every second)
    let currentTime = 0;
    timerIntervalRef.current = window.setInterval(() => {
      currentTime += 1;
      setTimer(currentTime);

      // Auto stop when reaching session duration
      if (currentTime >= SESSION_DURATION) {
        stopDetection();
      }
    }, 1000);
  };

  // Stop detection session
  const stopDetection = () => {
    // Clear intervals
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

  // Calculate session results when detection stops
  useEffect(() => {
    if (
      !isDetecting &&
      !isTimerRunning &&
      sessionDataRef.current.length > 0 &&
      !showResult
    ) {
      // Wait a bit to ensure all state updates are complete
      const timeoutId = setTimeout(() => {
        const data = sessionDataRef.current;

        if (data.length === 0) {
          alert("Tidak ada data yang tercatat. Coba lagi!");
          return;
        }

        console.log("Calculating results with", data.length, "data points");

        const avgHappiness =
          data.reduce((sum, d) => sum + d.happiness, 0) / data.length;
        const maxHappiness = Math.max(...data.map((d) => d.happiness));
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

        console.log("Session Result:", result);
        console.log("Session Data Points:", data.length);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isDetecting, isTimerRunning, timer, attempts, showResult]);

  // Reset session
  const resetSession = () => {
    setShowResult(false);
    setSessionResult(null);
    setSessionData([]);
    sessionDataRef.current = [];
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
    alert("Level 1 Selesai! +10 Poin. Menuju Level 2...");
    // Navigate to next level or exercise list
    window.history.back();
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
    if (happiness >= 40) return "Netral";
    return "Tidak Bahagia";
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

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
                Latihan Dasar Ekspresi - AI Face Detection
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

        {/* Loading Models Alert */}
        {isLoadingModels && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-bold text-blue-900 mb-1">
                  Loading AI Models...
                </h3>
                <p className="text-blue-800">
                  Sedang memuat model deteksi wajah. Mohon tunggu sebentar.
                </p>
              </div>
            </div>
          </div>
        )}

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
                      <h2 className="text-xl font-bold">AI Face Detection</h2>
                      <p className="text-orange-100 text-sm">
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
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />

                {/* Camera Overlay Info */}
                {isCameraActive && isDetecting && faceDetected && (
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
                      className={`bg-gradient-to-r ${
                        faceDetected
                          ? getHappinessColor(currentHappiness)
                          : "from-gray-500 to-gray-600"
                      } rounded-2xl px-6 py-4 text-white shadow-2xl`}
                    >
                      <div className="flex items-center gap-3">
                        {currentHappiness >= 85 && faceDetected ? (
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
                      className={`flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                        isLoadingModels ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Camera className="w-5 h-5" />
                      {isLoadingModels ? "Loading AI..." : "Aktifkan Kamera"}
                    </button>
                  ) : !isDetecting ? (
                    <>
                      <button
                        onClick={startDetection}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Smile className="w-5 h-5" />
                        Mulai Latihan ({SESSION_DURATION}s)
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
                      Hentikan & Lihat Hasil
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data Collected</span>
                  <span className="font-bold text-blue-600">
                    {sessionData.length} points
                  </span>
                </div>
              </div>
            </div>

            {/* Current Progress */}
            {isDetecting && faceDetected && (
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
                          width: `${Math.min(
                            100,
                            (timer / SESSION_DURATION) * 100
                          )}%`,
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
                      <span>Tunggu hingga wajah terdeteksi (✓)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">4.</span>
                      <span>Klik "Mulai Latihan"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">5.</span>
                      <span>
                        Tunjukkan senyum bahagia selama {SESSION_DURATION}{" "}
                        detik!
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
                  <span>Pastikan pencahayaan cukup terang</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Pikirkan hal yang menyenangkan!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Jaga posisi wajah tetap di tengah</span>
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
                    {sessionResult.isSuccess ? "Berhasil! 🎉" : "Coba Lagi! 💪"}
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
                      Feedback AI Detection
                    </h4>
                    <p
                      className={`leading-relaxed ${
                        sessionResult.isSuccess
                          ? "text-green-800"
                          : "text-orange-800"
                      }`}
                    >
                      {sessionResult.isSuccess
                        ? "Luar biasa! Ekspresi bahagia Anda sangat natural dan konsisten. AI berhasil mendeteksi senyum genuine Anda dengan tingkat kebahagiaan yang tinggi. Anda siap melanjutkan ke level berikutnya!"
                        : sessionResult.avgHappiness >= 75
                        ? "Hampir sempurna! AI mendeteksi ekspresi bahagia yang cukup baik, namun perlu sedikit peningkatan untuk mencapai target. Coba senyum lebih lebar dan tunjukkan gigi Anda!"
                        : sessionResult.avgHappiness >= 60
                        ? "Bagus! AI mendeteksi ada ekspresi bahagia, tapi masih bisa lebih ekspresif. Pikirkan hal yang benar-benar membahagiakan untuk senyum yang lebih natural!"
                        : "Terus berlatih! AI mendeteksi ekspresi masih cenderung netral. Cobalah untuk tersenyum lebih lebar dan genuine. Ingat, senyum dari hati akan terlihat lebih natural!"}
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
                          {sessionData.length} detections
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                        <span className="text-gray-600">Detection Rate</span>
                        <span className="font-bold text-gray-900">
                          ~{Math.round(1000 / 300)} detections/sec
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
