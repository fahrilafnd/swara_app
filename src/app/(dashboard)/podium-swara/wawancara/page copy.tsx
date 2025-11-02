"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  constraints,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Stabilkan constraints (default jika tidak diberikan)
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
          // tambahkan muted agar autoplay tidak diblokir browser
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

export default function Pidato() {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(292);

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

  return (
    <div className="pr-8">
      <div className="bg-white p-4 rounded-xl">
        <section className="relative min-h-screen w-full bg-[url(/podium/tirai.png)] bg-no-repeat bg-cover bg-top rounded-xl">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-orange-500 font-bold text-lg">
                  Mode : Wawancara
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
              <div className="relative w-fit max-w-3xl mx-auto ">
                <div className="bg-white rounded-3xl shadow-md px-8 py-4 text-center text-orange-500 font-medium text-lg relative">
                  <p>
                    Ceritakan pengalaman Anda bekerja dalam sebuah tim
                    <br />
                    dan bagaimana peran Anda di dalamnya?
                  </p>
                  <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-transparent border-t-white"></div>
                </div>
              </div>

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
          </div>

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
        </section>
      </div>
    </div>
  );
}
