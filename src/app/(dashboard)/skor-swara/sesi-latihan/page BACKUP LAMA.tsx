"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Play, Square, Type as TypeIcon, Droplets } from "lucide-react";
import SkorSwaraHeader from "@/app/components/skor-swara/SkorSwaraHeader";

// Web Speech API typing
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function SesiLatihanPage() {
  const router = useRouter();

  // ===== CONFIG =====
  const MAX_SECONDS = 60; // auto stop di 1 menit

  // ===== RECORDING =====
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const endedRef = useRef(false); // cegah finish ganda

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

  const topik = "Merancang Masa Depan: Membangun Karier di Era Digital";
  const latihanText = `Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan ide dengan jelas dan berkolaborasi dengan tim.

Dalam era saat ini, ketepatan bicara, cara menyampaikan informasi dengan jelas juga menjadi harga mahal yang memang sangat berguna di era Industri 5.0 di mana banyak persaingan dalam berbagai bidang.`;

  // ===== helpers =====
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const normalize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[.,!?;:()"“”'’\-–—]/g, "")
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
      (window as any).SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechReady(Boolean(SR));
  }, []);

  // auto-scroll active word (now ON OVERLAY)
  useEffect(() => {
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
  }, [currentWordIdx]);

  // ===== start/stop =====
  const handleStartTraining = async () => {
    setIsRecording(true);
    setShowTele(true);
    setTimer(0);
    setCurrentWordIdx(0);
    endedRef.current = false;

    // timer
    intervalRef.current = setInterval(() => setTimer((p) => p + 1), 1000);

    // media recorder
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
            } catch {}
            router.push("/skor-swara/hasil-skor");
          } catch {
            router.push("/skor-swara/hasil-skor");
          }
        };
        mr.start();
      }
    } catch (e) {
      console.error(e);
    }

    startSR();
  };

  const handleFinishTraining = () => {
    if (endedRef.current) return; // guard
    endedRef.current = true;

    setIsRecording(false);

    // timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    stopSR();

    // stop recorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.requestData?.();
      } catch {}
      mediaRecorderRef.current.stop();
    } else {
      router.push("/skor-swara/hasil-skor");
    }
  };

  // ===== SR logic =====
  const startSR = () => {
    const SR =
      (window as any).SpeechRecognition || window.webkitSpeechRecognition;

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
        } catch {}
      }
    };

    try {
      rec.start();
    } catch {
      setFallback(true);
      fallbackTickerRef.current = setInterval(() => {
        setCurrentWordIdx((i) => Math.min(i + 1, teleWords.length - 1));
      }, 650);
    }
  };

  const stopSR = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
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
    const reachedEnd = currentWordIdx >= teleWords.length - 1;
    if (reachedTime || reachedEnd) {
      handleFinishTraining();
    }
  }, [isRecording, timer, currentWordIdx, teleWords.length]);

  // ===== RENDER =====
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
          </div>

          {/* VIDEO + TELEPROMPTER OVERLAY */}
          <div className="p-6">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
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

              {showTele && (
                <div className="absolute z-40 bottom-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur px-2 py-1 rounded-lg shadow">
                  <TypeIcon className="w-4 h-4 text-gray-700" />
                  <button
                    onClick={() => setFontPx((v) => Math.max(14, v - 2))}
                    className="px-2 py-0.5 rounded bg-gray-200"
                    aria-label="perkecil"
                  >
                    A-
                  </button>
                  <span className="text-sm w-10 text-center">{fontPx}px</span>
                  <button
                    onClick={() => setFontPx((v) => Math.min(48, v + 2))}
                    className="px-2 py-0.5 rounded bg-gray-200"
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

              {showTele && (
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

              {!isRecording && (
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
                disabled={isRecording}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  isRecording
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <Play className="w-5 h-5" />
                Mulai Berlatih
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

            {/* Fallback speed (muncul kalau SR tidak ada) */}
            {!speechReady && isRecording && (
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
                  className="px-3 py-1 rounded bg-orange-100 text-orange-700"
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
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700"
                >
                  Lebih lambat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
