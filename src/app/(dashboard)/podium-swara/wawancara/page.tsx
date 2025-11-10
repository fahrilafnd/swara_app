"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Pause,
  Play,
  Check,
  Mic,
  Square,
  Volume2,
  ChevronRight,
  Wind,
  Heart,
  Smile,
  AlarmClock,
  RotateCcw,
  ArrowLeft,
  Radio,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";

type CameraFeedProps = {
  className?: string;
  mirrored?: boolean;
  constraints?: MediaStreamConstraints;
  label?: string;
};

function CameraFeed({
  className = "",
  mirrored = true,
  label,
  constraints,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  const stableConstraints = useMemo<MediaStreamConstraints>(
    () =>
      constraints ?? {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      },
    [constraints]
  );

  useEffect(() => {
    let stream: MediaStream | null = null;
    let stopped = false;

    (async () => {
      try {
        setError(null);
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Browser tidak mendukung getUserMedia.");
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia(stableConstraints);
        if (!stopped && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Gagal mengakses kamera. Pastikan izin kamera diizinkan.";
        setError(msg);
      }
    })();

    return () => {
      stopped = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stableConstraints]);

  return (
    <div className={`relative bg-gray-900 ${className}`}>
      {label && (
        <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/70 text-white px-3 py-1.5 rounded-lg font-medium backdrop-blur-sm">
          {label}
        </span>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${
          mirrored ? "scale-x-[-1]" : ""
        }`}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm p-4 text-center">
          <div>
            <Mic className="w-12 h-12 mx-auto mb-3 text-red-400" />
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Data pertanyaan wawancara
const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    audio: "/voice-wwc/1 bisakah anda memperkenalkan diri.mp3",
    text: "Bisakah Anda memperkenalkan diri secara singkat?",
  },
  {
    id: 2,
    audio: "/voice-wwc/2 arti kesuksesan.mp3",
    text: "Menurut Anda, apa arti kesuksesan yang sebenarnya?",
  },
  {
    id: 3,
    audio: "/voice-wwc/3 5 tahun.mp3",
    text: "Bagaimana Anda melihat diri Anda lima tahun ke depan?",
  },
  {
    id: 4,
    audio: "/voice-wwc/4 sosok.mp3",
    text: "Siapa sosok yang paling menginspirasi Anda dan mengapa?",
  },
  {
    id: 5,
    audio: "/voice-wwc/5 hal.mp3",
    text: "Apa hal yang paling Anda banggakan dalam hidup Anda sejauh ini?",
  },
  {
    id: 6,
    audio: "/voice-wwc/6 bagaimana anda.mp3",
    text: "Bagaimana Anda menghadapi tekanan atau tantangan dalam belajar maupun bekerja?",
  },
  {
    id: 7,
    audio: "/voice-wwc/7 harapan.mp3",
    text: "Bagaimana Anda menyikapi kegagalan atau hasil yang tidak sesuai harapan?",
  },
  {
    id: 8,
    audio: "/voice-wwc/8 disiplin.mp3",
    text: "Apa yang biasanya Anda lakukan untuk tetap produktif dan disiplin setiap hari?",
  },
  {
    id: 9,
    audio: "/voice-wwc/9 pengalaman.mp3",
    text: "Ceritakan pengalaman Anda bekerja dalam sebuah tim dan bagaimana peran Anda di dalamnya",
  },
  {
    id: 10,
    audio: "/voice-wwc/10 kekurangan.mp3",
    text: "Apa kelebihan dan kekurangan diri Anda, dan bagaimana Anda mengatasinya?",
  },
];

// Instruksi relaksasi
const RELAXATION_STEPS = [
  {
    icon: Wind,
    text: "Tarik napas dalam-dalam...",
    subtext: "Hirup udara melalui hidung, tahan sebentar",
  },
  {
    icon: Heart,
    text: "Hembuskan perlahan...",
    subtext: "Keluarkan napas melalui mulut, rasakan relaks",
  },
  {
    icon: Smile,
    text: "Tersenyum dan percaya diri!",
    subtext: "Kamu siap untuk wawancara ini",
  },
];

type InterviewState =
  | "not-started"
  | "preparation"
  | "playing-question"
  | "user-answering"
  | "paused";

export default function Wawancara() {
  const router = useRouter();
  const PREPARATION_TIME = 15;

  const [interviewState, setInterviewState] =
    useState<InterviewState>("not-started");
  const [preparationTimer, setPreparationTimer] = useState(PREPARATION_TIME);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const preparationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1;

  const MAX_TOTAL_TIME = 60;
  const [timeUp, setTimeUp] = useState(false);

  // Current relaxation step
  const currentRelaxationStep = useMemo(() => {
    const elapsed = PREPARATION_TIME - preparationTimer;
    if (elapsed < 5) return 0;
    if (elapsed < 10) return 1;
    return 2;
  }, [preparationTimer]);

  const currentStep = RELAXATION_STEPS[currentRelaxationStep];
  const StepIcon = currentStep.icon;

  // Timer untuk total waktu
  useEffect(() => {
    if (
      !isPaused &&
      interviewState !== "not-started" &&
      interviewState !== "preparation"
    ) {
      const timer = setInterval(() => setTotalTime((t) => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, interviewState]);

  // Otomatis berhenti ketika mencapai 60 detik
  useEffect(() => {
    if (
      totalTime >= MAX_TOTAL_TIME &&
      !timeUp &&
      interviewState !== "not-started" &&
      interviewState !== "preparation"
    ) {
      if (audioRef.current) audioRef.current.pause();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      setIsPaused(true);
      setTimeUp(true);
    }
  }, [totalTime, timeUp, interviewState, isRecording]);

  // Timer untuk waktu jawaban user
  useEffect(() => {
    if (interviewState === "user-answering" && !isPaused) {
      const timer = setInterval(() => setAnswerTime((t) => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [interviewState, isPaused]);

  // Auto play audio pertanyaan
  useEffect(() => {
    if (
      interviewState === "playing-question" &&
      audioRef.current &&
      !isPaused
    ) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((e) => console.error("Audio play error:", e));
    }
  }, [interviewState, currentQuestionIndex, isPaused]);

  // Preparation phase countdown
  useEffect(() => {
    if (interviewState === "preparation") {
      preparationIntervalRef.current = setInterval(() => {
        setPreparationTimer((prev) => {
          if (prev <= 1) {
            if (preparationIntervalRef.current) {
              clearInterval(preparationIntervalRef.current);
              preparationIntervalRef.current = null;
            }
            setInterviewState("playing-question");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (preparationIntervalRef.current) {
          clearInterval(preparationIntervalRef.current);
        }
      };
    }
  }, [interviewState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (preparationIntervalRef.current) {
        clearInterval(preparationIntervalRef.current);
      }
    };
  }, []);

  // Handle mulai wawancara
  const handleStartInterview = () => {
    setInterviewState("preparation");
    setPreparationTimer(PREPARATION_TIME);
    setTotalTime(0);
    setAnswerTime(0);
    setIsPaused(false);
    setTimeUp(false);
  };

  // Handle cancel preparation
  const handleCancelPreparation = () => {
    if (preparationIntervalRef.current) {
      clearInterval(preparationIntervalRef.current);
      preparationIntervalRef.current = null;
    }
    setInterviewState("not-started");
    setPreparationTimer(PREPARATION_TIME);
  };

  // Handle audio selesai diputar
  const handleAudioEnded = () => {
    setInterviewState("user-answering");
    setAnswerTime(0);
    startRecording();
  };

  // Start recording user answer
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        console.log("Recording saved", blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Recording error:", e);
    }
  };

  // Stop recording user answer
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle user selesai menjawab
  const handleFinishAnswer = () => {
    stopRecording();

    if (isLastQuestion) {
      router.push("/podium-swara/selesai");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setInterviewState("playing-question");
    }
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    if (timeUp) return;

    setIsPaused(!isPaused);

    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/podium-swara"
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <span className="font-semibold text-gray-700">Kembali</span>
        </Link>

        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg">
          <p className="font-bold text-lg">Mode: Wawancara</p>
        </div>

        {interviewState !== "not-started" &&
          interviewState !== "preparation" && (
            <div className="bg-white px-6 py-3 rounded-2xl shadow-lg">
              <p className="text-gray-700 font-semibold">
                Pertanyaan {currentQuestionIndex + 1} /{" "}
                {INTERVIEW_QUESTIONS.length}
              </p>
            </div>
          )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Curtain Background */}
        <div className="relative bg-[url(/podium/tirai.png)] bg-cover bg-top min-h-[600px] p-8">
          {/* Camera Feeds Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* User Camera */}
            <div className="relative">
              <CameraFeed
                className="w-full h-96 rounded-2xl overflow-hidden ring-4 ring-orange-300 shadow-2xl"
                label="Anda"
                mirrored
              />
              {interviewState === "user-answering" && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  RECORDING
                </div>
              )}
            </div>

            {/* Interviewer */}
            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden ring-4 ring-orange-400 shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src="/podium/virtual.png"
                  alt="Bu Hilda PT Foodie"
                  className={`h-full w-full object-cover transition-all duration-300 ${
                    interviewState === "playing-question"
                      ? "scale-105"
                      : "scale-100"
                  }`}
                />

                {/* Speaking Animation Overlay */}
                {interviewState === "playing-question" && (
                  <>
                    <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                      <Radio className="w-4 h-4 animate-pulse" />
                      Berbicara
                    </div>
                    {/* Sound Waves Animation */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-green-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 30 + 20}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.6s",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}

                <span className="absolute left-4 bottom-4 z-10 text-sm bg-black/70 text-white px-4 py-2 rounded-xl font-semibold backdrop-blur-sm">
                  Bu Hilda - PT Foodie
                </span>
              </div>
            </div>
          </div>

          {/* Question Bubble - Positioned Above Cameras */}
          {interviewState !== "not-started" &&
            interviewState !== "preparation" && (
              <div className="mb-8">
                <div
                  className={`bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto transition-all duration-300 ${
                    interviewState === "playing-question"
                      ? "ring-4 ring-orange-400 scale-105"
                      : "ring-2 ring-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {interviewState === "playing-question" && (
                      <Volume2 className="w-8 h-8 text-orange-500 animate-bounce" />
                    )}
                    {interviewState === "user-answering" && (
                      <Mic className="w-8 h-8 text-red-500 animate-pulse" />
                    )}
                    <div className="text-center">
                      {interviewState === "playing-question" && (
                        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Mendengarkan Pertanyaan...
                        </span>
                      )}
                      {interviewState === "user-answering" && (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          MEREKAM - {formatTime(answerTime)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 text-center leading-relaxed">
                    {currentQuestion.text}
                  </p>
                </div>
              </div>
            )}

          {/* Controls */}
          {interviewState !== "not-started" &&
            interviewState !== "preparation" && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-center gap-4">
                  {/* Pause/Resume */}
                  <button
                    onClick={handlePauseResume}
                    disabled={timeUp}
                    className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all duration-300 transform hover:scale-105 ${
                      timeUp
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
                    }`}
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Pause className="w-5 h-5" />
                    )}
                    {isPaused ? "Resume" : "Pause"}
                  </button>

                  {/* Total Time */}
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-4 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                    <p className="text-xs text-gray-600 mb-1 text-center font-semibold">
                      Total Waktu
                    </p>
                    <p className="text-4xl font-black text-gray-800 tabular-nums">
                      {formatTime(totalTime)}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${(totalTime / MAX_TOTAL_TIME) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* User Answering Controls */}
                  {interviewState === "user-answering" && (
                    <>
                      <button
                        onClick={handleFinishAnswer}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Square className="w-5 h-5" />
                        Berhenti Bicara
                      </button>

                      <button
                        onClick={handleFinishAnswer}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isLastQuestion ? (
                          <>
                            <Check className="w-5 h-5" />
                            Selesai Wawancara
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-5 h-5" />
                            Pertanyaan Selanjutnya
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

          {/* Progress Bar */}
          {interviewState !== "not-started" &&
            interviewState !== "preparation" && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between text-sm text-gray-600 mb-3 font-semibold">
                  <span>Progress Wawancara</span>
                  <span>
                    {Math.round(
                      ((currentQuestionIndex + 1) /
                        INTERVIEW_QUESTIONS.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) /
                          INTERVIEW_QUESTIONS.length) *
                        100
                      }%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* START INTERVIEW MODAL */}
      {mounted &&
        interviewState === "not-started" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full mx-8 animate-fadeIn">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Mic className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-3">
                  Siap untuk Wawancara?
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Anda akan mendapatkan waktu{" "}
                  <strong className="text-orange-600">15 detik</strong> untuk
                  bersiap-siap dan relaksasi sebelum wawancara dimulai.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
                <p className="text-base text-blue-900 font-bold mb-4 flex items-center gap-2">
                  💡 Tips Wawancara:
                </p>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Dengarkan pertanyaan dengan seksama</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Jawab dengan jelas dan terstruktur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Berbicara dengan percaya diri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Gunakan bahasa yang sopan dan profesional</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleStartInterview}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Mulai Wawancara
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* PREPARATION PHASE MODAL */}
      {mounted &&
        interviewState === "preparation" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative w-full max-w-4xl">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-12 animate-fadeIn">
                <div className="text-center">
                  {/* Large Countdown Circle */}
                  <div className="relative w-64 h-64 mx-auto mb-12">
                    <svg className="w-64 h-64 transform -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="white"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 110}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          110 *
                          (1 - preparationTimer / PREPARATION_TIME)
                        }`}
                        className="transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-9xl font-black text-white mb-3 animate-pulse">
                          {preparationTimer}
                        </div>
                        <div className="text-2xl text-white/90 font-bold">
                          detik
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Relaxation Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border-2 border-white/30 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-white/20 p-6 rounded-3xl">
                        <StepIcon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4">
                      {currentStep.text}
                    </h3>
                    <p className="text-xl text-white/90">
                      {currentStep.subtext}
                    </p>
                  </div>

                  {/* Bottom Info */}
                  <div className="mt-12 space-y-4">
                    <p className="text-white/90 text-lg font-semibold">
                      💡 Bersiaplah untuk wawancara
                    </p>
                    <p className="text-white/70 text-base">
                      Wawancara akan dimulai otomatis
                    </p>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={handleCancelPreparation}
                    className="mt-10 px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all border-2 border-white/30"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* TIME UP MODAL */}
      {mounted &&
        timeUp &&
        createPortal(
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-white max-w-lg w-full rounded-3xl shadow-2xl p-10 text-center animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl">
                <AlarmClock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">
                Waktu Habis!
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Rekaman & pertanyaan dihentikan otomatis karena mencapai batas{" "}
                <strong className="text-orange-600">60 detik</strong>.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => router.push("/podium-swara/selesai")}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-105"
                >
                  Akhiri & Lihat Hasil
                </button>
                <button
                  onClick={() => {
                    setInterviewState("not-started");
                    setPreparationTimer(PREPARATION_TIME);
                    setCurrentQuestionIndex(0);
                    setTotalTime(0);
                    setAnswerTime(0);
                    setIsPaused(false);
                    setTimeUp(false);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Ulangi dari Awal
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={currentQuestion.audio}
        onEnded={handleAudioEnded}
        className="hidden"
      />

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
