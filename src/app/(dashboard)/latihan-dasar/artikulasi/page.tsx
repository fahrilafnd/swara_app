"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
} from "lucide-react";
import Link from "next/link";

interface VokalProgress {
  letter: string;
  attempts: number;
  accuracy: number;
  isCompleted: boolean;
  feedback: string;
}

export default function Artikulasi() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentVokalIndex, setCurrentVokalIndex] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [showResult, setShowResult] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const vokals = ["A", "I", "U", "E", "O"];

  const [vokalProgress, setVokalProgress] = useState<VokalProgress[]>(
    vokals.map((letter) => ({
      letter,
      attempts: 0,
      accuracy: 0,
      isCompleted: false,
      feedback: "",
    }))
  );

  const currentVokal = vokals[currentVokalIndex];
  const currentProgress = vokalProgress[currentVokalIndex];

  // Simulate voice recognition and feedback
  const simulateRecognition = () => {
    // Simulate accuracy between 60-100%
    const accuracy = Math.floor(Math.random() * 40) + 60;

    let feedback = "";
    let isCompleted = false;

    if (accuracy >= 85) {
      feedback = "Sempurna! Pengucapan sangat jelas!";
      isCompleted = true;
    } else if (accuracy >= 70) {
      feedback = "Bagus! Coba sekali lagi untuk hasil lebih baik.";
    } else {
      feedback = "Kurang jelas. Ucapkan dengan lebih tegas!";
    }

    return { accuracy, feedback, isCompleted };
  };

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

      // Auto stop after 2 seconds and give feedback
      setTimeout(() => {
        stopRecording();
        provideFeedback();
      }, 2000);
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

    const updatedProgress = [...vokalProgress];
    updatedProgress[currentVokalIndex] = {
      ...updatedProgress[currentVokalIndex],
      attempts: updatedProgress[currentVokalIndex].attempts + 1,
      accuracy,
      isCompleted,
      feedback,
    };

    setVokalProgress(updatedProgress);
    setCurrentFeedback(feedback);
    setShowFeedback(true);

    // Auto hide feedback and move to next
    setTimeout(() => {
      setShowFeedback(false);
      if (isCompleted && currentVokalIndex < vokals.length - 1) {
        setTimeout(() => {
          setCurrentVokalIndex(currentVokalIndex + 1);
        }, 500);
      } else if (isCompleted && currentVokalIndex === vokals.length - 1) {
        // All completed
        setTimeout(() => {
          setShowResult(true);
        }, 500);
      }
    }, 2000);
  };

  const repeatCurrentVokal = () => {
    const updatedProgress = [...vokalProgress];
    updatedProgress[currentVokalIndex].isCompleted = false;
    updatedProgress[currentVokalIndex].accuracy = 0;
    setVokalProgress(updatedProgress);
    setShowFeedback(false);
  };

  const restartLevel = () => {
    setCurrentVokalIndex(0);
    setVokalProgress(
      vokals.map((letter) => ({
        letter,
        attempts: 0,
        accuracy: 0,
        isCompleted: false,
        feedback: "",
      }))
    );
    setShowResult(false);
    setShowFeedback(false);
  };

  const completeLevel = () => {
    // Navigate to next level or back to exercise list
    alert("Level 1 Selesai! Menuju Level 2...");
  };

  const totalAccuracy = Math.round(
    vokalProgress.reduce((sum, v) => sum + v.accuracy, 0) / vokals.length
  );

  const completedCount = vokalProgress.filter((v) => v.isCompleted).length;

  // Waveform bars
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

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div>
      <div className="min-h-screen bg-white rounded-2xl shadow-md mb-10 p-8">
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
                Level 1: Pengenalan Vokal
              </h1>
              <p className="text-gray-600 font-medium">
                Latihan Dasar Artikulasi
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <p className="text-2xl font-black text-blue-600">
              {completedCount}/{vokals.length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Vokal Progress Bar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center justify-center gap-3">
              {vokals.map((vokal, index) => (
                <div key={vokal} className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${
                      index === currentVokalIndex
                        ? "bg-white text-blue-600 shadow-xl scale-110"
                        : vokalProgress[index].isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    {vokalProgress[index].isCompleted ? (
                      <CheckCircle className="w-7 h-7" />
                    ) : (
                      vokal
                    )}
                  </div>
                  {vokalProgress[index].isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Vokal Display */}
          <div className="p-12 text-center">
            <div className="mb-8">
              <p className="text-gray-600 font-semibold mb-4 text-lg">
                Ucapkan huruf vokal berikut dengan jelas:
              </p>
              <div
                className={`inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl transition-all ${
                  isRecording ? "animate-pulse scale-110" : ""
                }`}
              >
                <span className="text-9xl font-black">{currentVokal}</span>
              </div>

              {/* Accuracy Display */}
              {currentProgress.accuracy > 0 && (
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-2xl">
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
              <div className="h-32 bg-gray-50 rounded-3xl flex items-center justify-center gap-1 px-8">
                {generateWaveform()}
              </div>
            </div>

            {/* Feedback Display */}
            {showFeedback && (
              <div
                className={`mb-6 p-6 rounded-3xl animate-fadeIn ${
                  currentProgress.isCompleted
                    ? "bg-green-50 border-2 border-green-300"
                    : currentProgress.accuracy >= 70
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
                    onClick={repeatCurrentVokal}
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
            <div>
              <h3 className="font-bold text-blue-900 mb-2 text-lg">Tips:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Ucapkan setiap huruf vokal dengan jelas dan tegas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Pastikan mikrofon Anda berfungsi dengan baik</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Ucapkan saat tombol "Mulai Rekam" ditekan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Target akurasi minimal 85% untuk melanjutkan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {mounted && showResult
        ? createPortal(
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white overflow-auto h-[80vh]  rounded-3xl max-w-2xl w-full shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white rounded-t-3xl">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-black mb-2">Level 1 Selesai!</h2>
                  <p className="text-green-100 text-lg">
                    Selamat! Anda telah menyelesaikan latihan vokal dasar
                  </p>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Total Percobaan
                      </p>
                      <p className="text-3xl font-black text-blue-600">
                        {vokalProgress.reduce((sum, v) => sum + v.attempts, 0)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        Akurasi Rata-rata
                      </p>
                      <p className="text-3xl font-black text-green-600">
                        {totalAccuracy}%
                      </p>
                    </div>
                  </div>

                  {/* Vokal Results */}
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">
                      Detail Hasil:
                    </h3>
                    <div className="space-y-3">
                      {vokalProgress.map((progress, index) => (
                        <div
                          key={progress.letter}
                          className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                              {progress.letter}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                Vokal {progress.letter}
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
                            {progress.accuracy >= 85 && (
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
                      <CheckCircle className="w-5 h-5" />
                      Feedback Keseluruhan
                    </h4>
                    <p className="text-green-800 leading-relaxed">
                      {totalAccuracy >= 90
                        ? "Luar biasa! Pengucapan vokal Anda sangat jelas dan tepat. Anda siap melanjutkan ke level berikutnya!"
                        : totalAccuracy >= 80
                        ? "Bagus sekali! Pengucapan vokal Anda sudah baik. Terus latih untuk hasil yang lebih sempurna."
                        : "Cukup baik! Pertahankan latihan ini untuk meningkatkan kejelasan pengucapan Anda."}
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
                    <Link
                      href={"/latihan-dasar"}
                      //   onClick={completeLevel}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Selesai & Lanjut
                      <ArrowRight className="w-5 h-5" />
                    </Link>
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
