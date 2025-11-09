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
  // [ADD] ikon untuk modal waktu habis (opsional)
  AlarmClock,
  RotateCcw,
  ArrowLeft,
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
    <div className={`relative bg-white ${className}`}>
      {label && (
        <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm p-4 text-center rounded-xl">
          {error}
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

export default function Pidato() {
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

  // [ADD] Limit 1 menit
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

  // [ADD] Otomatis berhenti ketika mencapai 60 detik
  useEffect(() => {
    if (
      totalTime >= MAX_TOTAL_TIME &&
      !timeUp &&
      interviewState !== "not-started" &&
      interviewState !== "preparation"
    ) {
      // hentikan audio & rekaman
      if (audioRef.current) audioRef.current.pause();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
      // jeda semua timer & munculkan modal
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

  // Auto play audio pertanyaan saat state berubah
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
    // [ADD] reset limit
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
    // [ADD] jika waktu habis, tombol tidak berfungsi
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
    <div className="pr-8">
      <div className="bg-white p-4 rounded-xl">
        <section className="relative min-h-screen w-full bg-[url(/podium/tirai.png)] bg-no-repeat bg-cover bg-top rounded-xl">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-orange-500 font-bold text-lg">
                  Mode: Wawancara
                </p>
              </div>

              {/* Progress Indicator */}
              {interviewState !== "not-started" &&
                interviewState !== "preparation" && (
                  <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                    <p className="text-gray-700 font-semibold">
                      Pertanyaan {currentQuestionIndex + 1} /{" "}
                      {INTERVIEW_QUESTIONS.length}
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div className="flex justify-center items-end gap-10 w-full relative min-h-[500px]">
            {/* START INTERVIEW CARD - Full overlay centered */}
            {interviewState === "not-started" && (
              <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20 rounded-xl">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full mx-8">
                  <div className="text-center">
                    <Link href={"/podium-swara"} className="flex items-center gap-2">
                      <ArrowLeft />
                      Kembali
                    </Link>
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mic className="w-12 h-12 text-orange-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Siap untuk Wawancara?
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                      Anda akan mendapatkan waktu{" "}
                      <strong className="text-orange-600">15 detik</strong>{" "}
                      untuk bersiap-siap dan relaksasi sebelum wawancara
                      dimulai.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                    <p className="text-base text-blue-900 font-bold mb-4 flex items-center gap-2">
                      💡 Tips Wawancara:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Dengarkan pertanyaan dengan seksama</li>
                      <li>• Jawab dengan jelas dan terstruktur</li>
                      <li>• Berbicara dengan percaya diri</li>
                      <li>• Gunakan bahasa yang sopan dan profesional</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleStartInterview}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-6 h-6" />
                    Mulai Wawancara
                  </button>
                </div>
              </div>
            )}

            {/* PREPARATION PHASE - Modal */}
            {mounted && interviewState === "preparation"
              ? createPortal(
                  <div>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                      onClick={handleCancelPreparation}
                      aria-hidden="true"
                    />

                    {/* Modal container */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <div
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
                      >
                        {/* Modal header/background */}
                        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8">
                          <div className="text-center px-2 sm:px-6">
                            {/* Large Countdown Circle */}
                            <div className="relative w-56 h-56 mx-auto mb-10">
                              <svg className="w-56 h-56 transform -rotate-90">
                                <circle
                                  cx="112"
                                  cy="112"
                                  r="100"
                                  stroke="rgba(255,255,255,0.2)"
                                  strokeWidth="8"
                                  fill="none"
                                />
                                <circle
                                  cx="112"
                                  cy="112"
                                  r="100"
                                  stroke="white"
                                  strokeWidth="8"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 100}`}
                                  strokeDashoffset={`${
                                    2 *
                                    Math.PI *
                                    100 *
                                    (1 - preparationTimer / PREPARATION_TIME)
                                  }`}
                                  className="transition-all duration-1000 ease-linear"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-8xl font-black text-white mb-2">
                                    {preparationTimer}
                                  </div>
                                  <div className="text-lg text-white/80 font-semibold">
                                    detik
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Relaxation Card */}
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 max-w-2xl mx-auto">
                              <div className="flex items-center justify-center mb-5">
                                <div className="bg-white/20 p-5 rounded-2xl">
                                  <StepIcon className="w-12 h-12 text-white" />
                                </div>
                              </div>
                              <h3 className="text-3xl font-bold text-white mb-3">
                                {currentStep.text}
                              </h3>
                              <p className="text-lg text-white/90">
                                {currentStep.subtext}
                              </p>
                            </div>

                            {/* Bottom Info */}
                            <div className="mt-10 space-y-3">
                              <p className="text-white/80 text-base">
                                💡 Bersiaplah untuk wawancara
                              </p>
                              <p className="text-white/70 text-sm">
                                Wawancara akan dimulai otomatis
                              </p>
                            </div>

                            {/* Actions */}
                            <button
                              onClick={handleCancelPreparation}
                              className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/30"
                            >
                              Batalkan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body
                )
              : null}

            {/* Camera Feeds - Always visible in background */}
            <CameraFeed
              className="w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-200"
              label="Anda"
              mirrored
            />
            <div className="flex items-center flex-col justify-center gap-10">
              {/* Question Bubble */}
              {interviewState !== "not-started" &&
                interviewState !== "preparation" && (
                  <div className="relative w-fit max-w-3xl mx-auto">
                    <div
                      className={`bg-white rounded-3xl shadow-md px-8 py-4 text-center text-orange-500 font-medium text-lg relative transition-all ${
                        interviewState === "playing-question"
                          ? "ring-4 ring-orange-400 animate-pulse"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {interviewState === "playing-question" && (
                          <Volume2 className="w-5 h-5 text-orange-500 animate-bounce" />
                        )}
                        {interviewState === "user-answering" && (
                          <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                        )}
                      </div>
                      <p>{currentQuestion.text}</p>
                      <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-transparent border-t-white"></div>
                    </div>

                    {/* State Indicator */}
                    <div className="mt-4 text-center">
                      {interviewState === "playing-question" && (
                        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                          <Volume2 className="w-4 h-4" />
                          Mendengarkan Pertanyaan...
                        </span>
                      )}
                      {interviewState === "user-answering" && (
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            SEDANG MEREKAM - {formatTime(answerTime)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Interviewer Avatar */}
              <div className="relative bg-white w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-400">
                <img
                  src="/podium/virtual.png"
                  alt="Bu Hilda PT Foodie"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded">
                  Bu Hilda PT Foodie
                </span>

                {/* Speaking Indicator */}
                {interviewState === "playing-question" && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Berbicara
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          {interviewState !== "not-started" &&
            interviewState !== "preparation" && (
              <div className="flex items-center justify-center mt-10">
                <div className="bg-white flex items-center justify-center w-[90%] h-40 rounded-2xl shadow-md">
                  <div className="flex items-center gap-4 z-40">
                    {/* Pause/Resume */}
                    <button
                      onClick={handlePauseResume}
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isPaused ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <Pause className="w-5 h-5" />
                      )}
                      {isPaused ? "Resume" : "Pause"}
                    </button>

                    {/* Total Time */}
                    <div className="bg-white border-4 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                      <p className="text-xs text-gray-600 mb-1">Total Waktu</p>
                      <p className="text-3xl font-bold text-gray-800 tabular-nums">
                        {formatTime(totalTime)}
                      </p>
                    </div>

                    {/* Finish Answer Button */}
                    {interviewState === "user-answering" && (
                      <button
                        onClick={handleFinishAnswer}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse"
                      >
                        <Square className="w-5 h-5" />
                        Berhenti Bicara
                      </button>
                    )}

                    {/* Next/Finish Button */}
                    {interviewState === "user-answering" && (
                      <button
                        onClick={handleFinishAnswer}
                        className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
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
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Progress Bar */}
          {interviewState !== "not-started" &&
            interviewState !== "preparation" && (
              <div className="px-8 pb-6">
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
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
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            INTERVIEW_QUESTIONS.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
        </section>
      </div>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={currentQuestion.audio}
        onEnded={handleAudioEnded}
        className="hidden"
      />

      {/* [ADD] Modal waktu habis 1 menit */}
      {mounted && timeUp
        ? createPortal(
            <div>
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlarmClock className="w-10 h-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Waktu Habis (1 Menit)
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Rekaman & pertanyaan dihentikan otomatis karena mencapai
                    batas <strong>60 detik</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.push("/podium-swara/selesai")}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700"
                    >
                      Akhiri & Lihat Hasil
                    </button>
                    <button
                      onClick={() => {
                        // reset ke awal sesi
                        setInterviewState("not-started");
                        setPreparationTimer(PREPARATION_TIME);
                        setCurrentQuestionIndex(0);
                        setTotalTime(0);
                        setAnswerTime(0);
                        setIsPaused(false);
                        setTimeUp(false);
                      }}
                      className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Ulangi dari Awal
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
