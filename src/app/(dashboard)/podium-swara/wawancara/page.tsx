"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pause,
  Play,
  Check,
  Mic,
  Square,
  Volume2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type InterviewState = "playing-question" | "user-answering" | "paused";

export default function Pidato() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewState, setInterviewState] =
    useState<InterviewState>("playing-question");
  const [totalTime, setTotalTime] = useState(0);
  const [answerTime, setAnswerTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1;

  // Timer untuk total waktu
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => setTotalTime((t) => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused]);

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
        // Save recording if needed
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
      // Redirect ke halaman selesai
      router.push("/podium-swara/selesai");
    } else {
      // Lanjut ke pertanyaan berikutnya
      setCurrentQuestionIndex((prev) => prev + 1);
      setInterviewState("playing-question");
    }
  };

  // Handle pause/resume
  const handlePauseResume = () => {
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
              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-gray-700 font-semibold">
                  Pertanyaan {currentQuestionIndex + 1} /{" "}
                  {INTERVIEW_QUESTIONS.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-end gap-10 w-full">
            <CameraFeed
              className="w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-200"
              label="Anda"
              mirrored
            />
            <div className="flex items-center flex-col justify-center gap-10">
              {/* Question Bubble */}
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

          {/* Progress Bar */}
          <div className="px-8 pb-6">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress Wawancara</span>
                <span>
                  {Math.round(
                    ((currentQuestionIndex + 1) / INTERVIEW_QUESTIONS.length) *
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
        </section>
      </div>

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={currentQuestion.audio}
        onEnded={handleAudioEnded}
        className="hidden"
      />
    </div>
  );
}
