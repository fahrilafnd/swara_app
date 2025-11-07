"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Square,
  Type as TypeIcon,
  Droplets,
  Image as ImageIcon,
  Edit3,
  Wind,
  Heart,
  Smile,
} from "lucide-react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";
import type { TrainingTopic } from "../config/levels";

// Web Speech API typing
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Instruksi relaksasi yang akan muncul bergantian
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
    subtext: "Kamu siap untuk tampil maksimal",
  },
];

export default function SesiLatihanPage() {
  const router = useRouter();

  // ===== CONFIG =====
  const MAX_SECONDS = 60;
  const PREPARATION_TIME = 15; // 15 detik persiapan

  // ===== TRAINING MODE & TOPIC =====
  // ===== TRAINING MODE & TOPIC =====
  const [trainingMode, setTrainingMode] = useState<
    "full-text" | "topic-image" | "custom-topic"
  >("full-text");

  const [selectedTopic, setSelectedTopic] = useState<TrainingTopic | null>(
    null
  );

  // ===== PREPARATION PHASE =====
  const [isPreparation, setIsPreparation] = useState(false);
  const [preparationTimer, setPreparationTimer] = useState(PREPARATION_TIME);
  const preparationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ===== RECORDING =====
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const endedRef = useRef(false);

  // ===== TELEPROMPTER =====
  const [showTele, setShowTele] = useState(false);
  const teleContainerRef = useRef<HTMLDivElement>(null);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  // overlay controls
  const [fontPx, setFontPx] = useState<number>(22);
  const [bgOpacity, setBgOpacity] = useState<number>(0.6);

  // speech rec
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [speechReady, setSpeechReady] = useState<boolean>(false);
  const [fallback, setFallback] = useState(false);
  const fallbackTickerRef = useRef<NodeJS.Timeout | null>(null);

  // Load selected topic from sessionStorage
  useEffect(() => {
    const mode = sessionStorage.getItem("skor-swara:selectedMode") as
      | "full-text"
      | "topic-image"
      | "custom-topic"
      | null;
    const topicStr = sessionStorage.getItem("skor-swara:selectedTopic");

    if (mode) setTrainingMode(mode);
    if (topicStr) {
      try {
        const parsed = JSON.parse(topicStr);
        setSelectedTopic(parsed);
      } catch (e) {
        console.error("Failed to parse topic:", e);
      }
    }
  }, []);

  const topik =
    selectedTopic?.title ||
    "Merancang Masa Depan: Membangun Karier di Era Digital";

  const latihanText = useMemo(() => {
    if (selectedTopic) {
      if (selectedTopic.text) return selectedTopic.text;
      if ((selectedTopic as any).customDescription)
        return (selectedTopic as any).customDescription;
    }
    return `Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan ide dengan jelas dan berkolaborasi dengan tim.

Dalam era saat ini, ketepatan bicara, cara menyampaikan informasi dengan jelas juga menjadi harga mahal yang memang sangat berguna di era Industri 5.0 di mana banyak persaingan dalam berbagai bidang.`;
  }, [selectedTopic]);

  // ===== helpers =====
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const normalize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[.,!?;:()"""''\-–—]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const teleWords = useMemo(() => {
    const flat = latihanText.replace(/\n+/g, " \n ");
    return flat.split(/\s+/).filter(Boolean);
  }, [latihanText]);

  const teleWordsNormalized = useMemo(
    () => teleWords.map((w) => (w === "\n" ? "" : normalize(w))),
    [teleWords]
  );

  // Current relaxation step based on timer
  const currentRelaxationStep = useMemo(() => {
    const elapsed = PREPARATION_TIME - preparationTimer;
    if (elapsed < 5) return 0;
    if (elapsed < 10) return 1;
    return 2;
  }, [preparationTimer]);

  // ===== camera =====
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  // SR support
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSpeechReady(Boolean(SR));
  }, []);

  // auto-scroll active word
  useEffect(() => {
    if (trainingMode === "topic-image") return;

    const box = teleContainerRef.current;
    if (!box) return;
    const el = box.querySelector<HTMLSpanElement>(
      `[data-word-idx="${currentWordIdx}"]`
    );
    if (!el) return;

    const targetTop = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;

    box.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }, [currentWordIdx, trainingMode]);

  // ===== PREPARATION PHASE =====
  const startPreparation = () => {
    setIsPreparation(true);
    setPreparationTimer(PREPARATION_TIME);

    preparationIntervalRef.current = setInterval(() => {
      setPreparationTimer((prev) => {
        if (prev <= 1) {
          if (preparationIntervalRef.current) {
            clearInterval(preparationIntervalRef.current);
            preparationIntervalRef.current = null;
          }
          setIsPreparation(false);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelPreparation = () => {
    if (preparationIntervalRef.current) {
      clearInterval(preparationIntervalRef.current);
      preparationIntervalRef.current = null;
    }
    setIsPreparation(false);
    setPreparationTimer(PREPARATION_TIME);
  };

  // ===== start recording =====
  const startRecording = async () => {
    setIsRecording(true);
    setShowTele(true);
    setTimer(0);
    setCurrentWordIdx(0);
    endedRef.current = false;

    intervalRef.current = setInterval(() => setTimer((p) => p + 1), 1000);

    try {
      const stream = videoRef.current?.srcObject as MediaStream | undefined;
      if (stream) {
        const preferred = "video/webm;codecs=vp8,opus";
        const opts = MediaRecorder.isTypeSupported?.(preferred)
          ? { mimeType: preferred }
          : (undefined as unknown as MediaRecorderOptions);
        const mr = new MediaRecorder(stream, opts);
        mediaRecorderRef.current = mr;
        recordedChunksRef.current = [];
        mr.ondataavailable = (e: BlobEvent) => {
          if (e.data?.size) recordedChunksRef.current.push(e.data);
        };
        mr.onstop = async () => {
          try {
            const blob = new Blob(recordedChunksRef.current, {
              type: "video/webm",
            });
            const dataUrl = await new Promise<string>((res, rej) => {
              const r = new FileReader();
              r.onloadend = () => res((r.result as string) || "");
              r.onerror = rej;
              r.readAsDataURL(blob);
            });
            const payload = {
              src: dataUrl,
              durationSeconds: timer,
              createdAt: Date.now(),
              topic: topik,
              text: latihanText,
              mimeType: "video/webm",
              mode: trainingMode,
            };
            try {
              localStorage.setItem(
                "skor-swara:lastRecording",
                JSON.stringify(payload)
              );
              sessionStorage.setItem(
                "skor-swara:lastRecording",
                JSON.stringify(payload)
              );
            } catch (e) {
              console.error("Failed to save recording:", e);
            }
            router.push("/skor-swara/hasil-skor");
          } catch (e) {
            console.error("Recording processing error:", e);
            router.push("/skor-swara/hasil-skor");
          }
        };
        mr.start();
      }
    } catch (e) {
      console.error(e);
    }

    if (trainingMode === "full-text") {
      startSR();
    } else {
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
    }
  };

  const handleStartTraining = () => {
    startPreparation();
  };

  const handleFinishTraining = () => {
    if (endedRef.current) return;
    endedRef.current = true;

    setIsRecording(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    stopSR();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.requestData?.();
      } catch (e) {
        console.error("Failed to request data:", e);
      }
      mediaRecorderRef.current.stop();
    } else {
      router.push("/skor-swara/hasil-skor");
    }
  };

  // ===== SR logic =====
  const startSR = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setFallback(true);
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
      return;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = "id-ID";
    rec.continuous = true;
    rec.interimResults = true;
    recognitionRef.current = rec;

    let lastLen = 0;

    rec.onresult = (ev: SpeechRecognitionEvent) => {
      let t = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        t += ev.results[i][0].transcript + " ";
      }
      t = normalize(t);
      if (t.length === lastLen) return;
      lastLen = t.length;

      const heard = t.split(" ").filter(Boolean).slice(-6);
      setCurrentWordIdx((cur) => {
        let idx = cur;
        for (const hw of heard) {
          while (teleWordsNormalized[idx] === "") idx++;
          const next = teleWordsNormalized[idx] || "";
          const ok = hw === next || hw.includes(next) || next.includes(hw);
          if (ok) idx = Math.min(idx + 1, teleWordsNormalized.length - 1);
        }
        return idx;
      });
    };

    rec.onerror = () => {};
    rec.onend = () => {
      if (isRecording) {
        try {
          rec.start();
        } catch (e) {
          console.error("Failed to restart recognition:", e);
        }
      }
    };

    try {
      rec.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setFallback(true);
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
    }
  };

  const stopSR = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.error("Failed to stop recognition:", e);
    }
    recognitionRef.current = null;
    if (fallbackTickerRef.current) {
      clearInterval(fallbackTickerRef.current);
      fallbackTickerRef.current = null;
    }
    setFallback(false);
  };

  // ===== AUTO-FINISH EFFECT =====
  useEffect(() => {
    if (!isRecording || endedRef.current) return;
    const reachedTime = timer >= MAX_SECONDS;
    const reachedEnd =
      trainingMode === "full-text" && currentWordIdx >= teleWords.length - 1;
    if (reachedTime || reachedEnd) {
      handleFinishTraining();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, timer, currentWordIdx, teleWords.length, trainingMode]);

  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      if (preparationIntervalRef.current) {
        clearInterval(preparationIntervalRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (fallbackTickerRef.current) {
        clearInterval(fallbackTickerRef.current);
      }
    };
  }, []);

  // ===== RENDER =====
  const currentStep = RELAXATION_STEPS[currentRelaxationStep];
  const StepIcon = currentStep.icon;

  return (
    <>
      <SkorSwaraHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Topic Header */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                Topik Latihan:
              </div>
              <h2 className="text-orange-600 font-semibold text-lg flex-1">
                {topik}
              </h2>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-600">Mode:</span>
              <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded">
                {trainingMode === "full-text" && "📝 Teks Lengkap"}
                {trainingMode === "topic-image" && "🖼️ Topik + Gambar"}
                {trainingMode === "custom-topic" && "✨ Topik Kustom"}
              </span>
            </div>
          </div>

          {/* VIDEO + TELEPROMPTER OVERLAY */}
          <div className="p-6">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
              {/* Preparation Phase Overlay - SIMPLIFIED */}
              {isPreparation && (
                <div className="absolute inset-0 z-50 bg-gradient-to-br from-blue-500/95 via-blue-600/95 to-purple-600/95 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center px-8 w-full max-w-2xl">
                    {/* Countdown Circle - COMPACT */}
                    <div className="relative w-40 h-40 mx-auto mb-8">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="72"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="72"
                          stroke="white"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 72}`}
                          strokeDashoffset={`${
                            2 *
                            Math.PI *
                            72 *
                            (1 - preparationTimer / PREPARATION_TIME)
                          }`}
                          className="transition-all duration-1000 ease-linear"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-black text-white">
                            {preparationTimer}
                          </div>
                          <div className="text-xs text-white/70 font-medium mt-1">
                            detik
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Relaxation Instructions - COMPACT */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-center mb-3">
                        <div className="bg-white/20 p-3 rounded-full">
                          <StepIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {currentStep.text}
                      </h3>
                      <p className="text-sm text-white/80">
                        {currentStep.subtext}
                      </p>
                    </div>

                    {/* Bottom Info - MINIMAL */}
                    <div className="mt-6 space-y-2">
                      <p className="text-white/70 text-xs">
                        💡 Bersiaplah dengan tenang
                      </p>
                      <p className="text-white/60 text-xs">
                        Recording akan dimulai otomatis
                      </p>
                    </div>

                    {/* Cancel button - SUBTLE */}
                    <button
                      onClick={cancelPreparation}
                      className="mt-4 px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg font-medium transition-all border border-white/20"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  RECORDING
                </div>
              )}

              {isRecording && (
                <div className="absolute top-4 right-4 z-30 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-mono">
                  {formatTime(timer)}
                </div>
              )}

              {/* Topic+Image Mode */}
              {trainingMode === "topic-image" &&
                selectedTopic?.image &&
                isRecording && (
                  <div className="absolute top-20 left-2 z-30 bg-white/40 backdrop-blur-lg rounded-2xl p-6 max-w-lg mx-auto shadow-2xl">
                    <div className="relative w-full h-48 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl mb-4 overflow-hidden shadow-lg">
                      <img
                        src={selectedTopic.image}
                        alt={selectedTopic.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {selectedTopic.topic && (
                      <div>
                        <p className="text-sm text-gray-600 mb-3 font-semibold flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-orange-500" />
                          Topik Pembahasan:
                        </p>
                        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-5 border-2 border-orange-300 shadow-sm">
                          <p className="text-xl font-black text-gray-900 text-center leading-tight">
                            {selectedTopic.topic}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedTopic.minWords && selectedTopic.maxWords && (
                      <div className="mt-4 text-xs text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                          <span className="font-semibold">💡 Target:</span>
                          <span className="font-bold">
                            {selectedTopic.minWords}-{selectedTopic.maxWords}{" "}
                            kata
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Font & Opacity Controls */}
              {showTele && trainingMode === "full-text" && (
                <div className="absolute z-40 bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-2 py-1 rounded-lg shadow">
                  <TypeIcon className="w-4 h-4 text-gray-700" />
                  <button
                    onClick={() => setFontPx((v) => Math.max(14, v - 2))}
                    className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                    aria-label="perkecil"
                  >
                    A-
                  </button>
                  <span className="text-sm w-10 text-center">{fontPx}px</span>
                  <button
                    onClick={() => setFontPx((v) => Math.min(48, v + 2))}
                    className="px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                    aria-label="perbesar"
                  >
                    A+
                  </button>

                  <Droplets className="w-4 h-4 text-gray-700 ml-2" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                    className="w-24"
                    aria-label="opasitas"
                  />
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full [transform:scaleX(-1)] object-cover"
              />

              {/* Teleprompter for full-text mode */}
              {showTele && trainingMode === "full-text" && (
                <div
                  ref={teleContainerRef}
                  className="absolute z-20 left-4 right-4 top-4 max-h-[55%] rounded-xl border border-gray-200 shadow overflow-auto resize p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{
                    backgroundColor: `rgba(255,255,255,${bgOpacity})`,
                    fontSize: `${fontPx}px`,
                    lineHeight: 1.6,
                  }}
                >
                  <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-9 rounded bg-orange-50/60" />
                  {teleWords.map((w, i) => {
                    if (w === "\n") return <br key={`br-${i}`} />;
                    const spoken = i < currentWordIdx;
                    const current = i === currentWordIdx;
                    return (
                      <span
                        key={i}
                        data-word-idx={i}
                        className={[
                          "mx-[2px] whitespace-pre-wrap transition-colors duration-150 relative",
                          spoken
                            ? "text-gray-400"
                            : current
                            ? "bg-yellow-200 px-1 rounded"
                            : "text-gray-900",
                        ].join(" ")}
                      >
                        {w}
                        {i < teleWords.length - 1 ? " " : ""}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Custom Topic Mode */}
              {showTele && trainingMode === "custom-topic" && (
                <div className="absolute z-20 left-4 right-4 top-4 bg-white/40 backdrop-blur rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
                      <Edit3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      {topik}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Berbicara bebas tentang topik ini dengan gayamu sendiri
                    </p>
                  </div>
                </div>
              )}

              {!isRecording && !isPreparation && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                  <div className="text-white text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      Siap untuk memulai latihan?
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Kontrol */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleStartTraining}
                disabled={isRecording || isPreparation}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  isRecording || isPreparation
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <Play className="w-5 h-5" />
                {isPreparation ? "Bersiap..." : "Mulai Berlatih"}
              </button>

              <button
                onClick={handleFinishTraining}
                disabled={!isRecording}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  !isRecording
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <Square className="w-5 h-5" />
                Selesai Latihan
              </button>
            </div>

            {/* Info Preparation - COMPACT */}
            {!isRecording && !isPreparation && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🧘‍♀️</div>
                  <div>
                    <p className="text-sm text-blue-900 font-semibold mb-1">
                      Tahap Persiapan Mental
                    </p>
                    <p className="text-xs text-blue-800">
                      Setelah klik "Mulai Berlatih", kamu akan mendapat waktu{" "}
                      <span className="font-bold">15 detik</span> untuk
                      relaksasi sebelum recording dimulai.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback speed */}
            {!speechReady && isRecording && trainingMode === "full-text" && (
              <div className="mt-4 text-sm text-gray-700 flex items-center gap-3">
                Teleprompter: auto-scroll (fallback)
                <button
                  onClick={() => {
                    if (!fallbackTickerRef.current) return;
                    clearInterval(fallbackTickerRef.current);
                    fallbackTickerRef.current = setInterval(() => {
                      setCurrentWordIdx((i) =>
                        Math.min(i + 1, teleWords.length - 1)
                      );
                    }, 480);
                  }}
                  className="px-3 py-1 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
                >
                  Lebih cepat
                </button>
                <button
                  onClick={() => {
                    if (!fallbackTickerRef.current) return;
                    clearInterval(fallbackTickerRef.current);
                    fallbackTickerRef.current = setInterval(() => {
                      setCurrentWordIdx((i) =>
                        Math.min(i + 1, teleWords.length - 1)
                      );
                    }, 800);
                  }}
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  Lebih lambat
                </button>
              </div>
            )}

            {/* Mode-specific info */}
            {trainingMode === "topic-image" && !isPreparation && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  💡 Tips Mode Topik + Gambar:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Gunakan keyword hints sebagai panduan</li>
                  <li>• Berbicara bebas dengan bahasa sendiri</li>
                  <li>• Tidak perlu mengikuti teks tertentu</li>
                  <li>• Fokus pada penyampaian ide yang jelas</li>
                </ul>
              </div>
            )}

            {trainingMode === "custom-topic" && !isPreparation && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm text-purple-900 font-semibold mb-2">
                  ✨ Tips Mode Topik Kustom:
                </p>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Ikuti outline yang sudah kamu buat</li>
                  <li>• Sampaikan dengan percaya diri</li>
                  <li>• Jangan terlalu kaku, tapi tetap terstruktur</li>
                  <li>• Ini kesempatan berkreasi sepenuhnya!</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
