"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Check } from "lucide-react";
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
  constraints = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: "user",
    },
    audio: false,
  },
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let stopped = false;

    (async () => {
      try {
        setError(null);
        const supported = !!navigator.mediaDevices?.getUserMedia;
        if (!supported) {
          setError("Browser tidak mendukung getUserMedia.");
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!stopped && videoRef.current) {
          videoRef.current.srcObject = stream;
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
  }, [constraints]);

  return (
    <div className={`relative bg-white ${className}`}>
      {label && (
        <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded">
          {label}
        </span>
      )}

      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`h-full w-full object-cover ${
          mirrored ? "scale-x-[-1]" : ""
        }`}
      />

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm p-4 text-center rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
}

/* =========================
   Halaman Pidato
   ========================= */
export default function Pidato() {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(292);

  // Kunci scroll pada main#app-scroll (sesuai layout kamu)
  useEffect(() => {
    const el = document.getElementById("app-scroll");
    if (!el) return;
    const prevOverflow = el.style.overflowY;
    const prevHeight = el.style.height;
    el.style.overflowY = "hidden";
    el.style.height = "100vh";
    return () => {
      el.style.overflowY = prevOverflow;
      el.style.height = prevHeight;
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!isPaused && time > 0) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const speechText =
    "Keterampilan komunikasi yang kuat dan kemampuan beradaptasi adalah dua hal yang saya anggap sangat penting di dunia kerja. Dengan komunikasi yang efektif, saya dapat menyampaikan";

  return (
    <div className="pr-8">
      <div className="bg-white p-4 rounded-xl">
        <section className="relative h-screen w-full bg-[url(/podium/tirai.png)] bg-no-repeat bg-cover bg-top overflow-hidden rounded-xl">
          {/* Header kecil */}
          <div className="p-4">
            <div className="flex justify-between items-center">
           

              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-orange-500 font-bold text-lg">
                  Mode : Wawancara
                </p>
              </div>
            </div>
          </div>

          {/* Dua kotak video */}
          <div className="flex justify-center items-center gap-10 w-full">
            {/* Kamera Anda */}
            <CameraFeed
              className="w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-200"
              label="Anda"
              mirrored
            />

            <div className="relative bg-white w-[35rem] h-80 rounded-xl overflow-hidden ring-4 ring-orange-400">
              <img
                src="/podium/virtual.png"
                alt="Bu Hilda PT Foodie"
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 bottom-3 z-10 text-xs bg-black/60 text-white px-2 py-1 rounded">
                Bu Hilda PT Foodie
              </span>
            </div>
          </div>

          {/* Kontrol bawah */}
          <div className="flex items-center justify-center mt-10">
            <div className="bg-white flex items-center justify-center w-[90%] h-40 rounded-2xl shadow-md">
              <div className="flex items-center gap-4 z-40">
                <button
                  onClick={() => setIsPaused((v) => !v)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </button>

                <div className="bg-white border-3 border-orange-300 px-8 py-4 rounded-2xl shadow-xl">
                  <p className="text-3xl font-bold text-gray-800 tabular-nums">
                    {formatTime(time)}
                  </p>
                </div>

                <Link
                  href="/podium-swara/selesai"
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Check className="w-5 h-5" />
                  Selesai
                </Link>
              </div>
            </div>
          </div>

          {/* Bubble pertanyaan (opsional) */}
          {/* <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2">
            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-sm border border-white/60">
              <p className="text-orange-500 text-sm font-medium text-center">
                {speechText.split("Dengan").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="bg-green-400 text-white px-2 py-1 rounded-md font-medium ml-1">
                        Dengan
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div> */}
        </section>
      </div>
    </div>
  );
}
