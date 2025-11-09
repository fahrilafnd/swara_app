"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Pause, Play, Check, AlarmClock, RotateCcw } from "lucide-react"; // [ADD] icons
import Link from "next/link";
import { createPortal } from "react-dom"; // [ADD]

type PeopleRowProps = {
  count?: number;
  people?: string[];
  applauseMinMs?: number;
  applauseMaxMs?: number;
  className?: string;
};

function PeopleRow({
  count = 5,
  people,
  applauseMinMs = 900,
  applauseMaxMs = 2000,
  className = "",
}: PeopleRowProps) {
  const peopleList = useMemo(
    () =>
      people && people.length > 0
        ? people
        : Array.from(
            { length: count },
            (_, i) => `/podium/people ${i + 1}.png`
          ),
    [people, count]
  );

  const [applaudIndex, setApplaudIndex] = useState<number | null>(null);
  const [applauseStyle, setApplauseStyle] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    let mounted = true;
    const schedule = () => {
      const delay =
        Math.floor(Math.random() * (applauseMaxMs - applauseMinMs + 1)) +
        applauseMinMs;
      const t = setTimeout(() => {
        if (!mounted || peopleList.length === 0) return;
        const idx = Math.floor(Math.random() * peopleList.length);
        setApplaudIndex(idx);
        setApplauseStyle({
          x: Math.floor(Math.random() * 16) - 8,
          y: Math.floor(Math.random() * 8),
          scale: 0.9 + Math.random() * 0.4,
        });
        setTimeout(() => {
          setApplaudIndex(null);
          schedule();
        }, 800);
      }, delay);
      return () => clearTimeout(t);
    };
    const clean = schedule();
    return () => {
      mounted = false;
      clean && clean();
    };
  }, [peopleList.length, applauseMinMs, applauseMaxMs]);

  return (
    <div>
      <div className="flex justify-between mt-4">
        <div className="flex flex-col">
          <div
            className={`flex ml-40 -mb-6  items-center gap-4 px-24 ${className}`}
          >
            {peopleList.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative flex flex-col items-center"
              >
                {applaudIndex === i && (
                  <img
                    src="/podium/plause.png"
                    alt="applause"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none animate-bounce"
                    style={{
                      transform: `translateX(-50%) translateY(-${applauseStyle.y}px) scale(${applauseStyle.scale})`,
                      marginLeft: applauseStyle.x,
                      width: 64,
                    }}
                    draggable={false}
                  />
                )}
                <img
                  src={src}
                  alt={`penonton ${i + 1}`}
                  className="w-[88px] h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div
            className={`flex ml-20 -mb-10  items-center gap-4 px-24 ${className}`}
          >
            {peopleList.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative flex flex-col items-center"
              >
                {applaudIndex === i && (
                  <img
                    src="/podium/plause.png"
                    alt="applause"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none animate-bounce"
                    style={{
                      transform: `translateX(-50%) translateY(-${applauseStyle.y}px) scale(${applauseStyle.scale})`,
                      marginLeft: applauseStyle.x,
                      width: 64,
                    }}
                    draggable={false}
                  />
                )}
                <img
                  src={src}
                  alt={`penonton ${i + 1}`}
                  className="w-[88px] h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className={`flex items-center gap-4 px-24 mt-4 ${className}`}>
            {peopleList.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative flex flex-col items-center"
              >
                {applaudIndex === i && (
                  <img
                    src="/podium/plause.png"
                    alt="applause"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none animate-bounce"
                    style={{
                      transform: `translateX(-50%) translateY(-${applauseStyle.y}px) scale(${applauseStyle.scale})`,
                      marginLeft: applauseStyle.x,
                      width: 64,
                    }}
                    draggable={false}
                  />
                )}
                <img
                  src={src}
                  alt={`penonton ${i + 1}`}
                  className="w-[88px] h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div
            className={`flex mr-40 -mb-6  items-center gap-4 px-24 ${className}`}
          >
            {peopleList.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative flex flex-col items-center"
              >
                {applaudIndex === i && (
                  <img
                    src="/podium/plause.png"
                    alt="applause"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none animate-bounce"
                    style={{
                      transform: `translateX(-50%) translateY(-${applauseStyle.y}px) scale(${applauseStyle.scale})`,
                      marginLeft: applauseStyle.x,
                      width: 64,
                    }}
                    draggable={false}
                  />
                )}
                <img
                  src={src}
                  alt={`penonton ${i + 1}`}
                  className="w-[88px] h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div
            className={`flex mr-20 -mb-10  items-center gap-4 px-24 ${className}`}
          >
            {peopleList.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative flex flex-col items-center"
              >
                {applaudIndex === i && (
                  <img
                    src="/podium/plause.png"
                    alt="applause"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none animate-bounce"
                    style={{
                      transform: `translateX(-50%) translateY(-${applauseStyle.y}px) scale(${applauseStyle.scale})`,
                      marginLeft: applauseStyle.x,
                      width: 64,
                    }}
                    draggable={false}
                  />
                )}
                <img
                  src={src}
                  alt={`penonton ${i + 1}`}
                  className="w-[88px] h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className={`flex items-center gap-4 px-24 mt-4 ${className}`}>
            {peopleList.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative flex flex-col items-center"
              >
                {applaudIndex === i && (
                  <img
                    src="/podium/plause.png"
                    alt="applause"
                    className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none animate-bounce"
                    style={{
                      transform: `translateX(-50%) translateY(-${applauseStyle.y}px) scale(${applauseStyle.scale})`,
                      marginLeft: applauseStyle.x,
                      width: 64,
                    }}
                    draggable={false}
                  />
                )}
                <img
                  src={src}
                  alt={`penonton ${i + 1}`}
                  className="w-[88px] h-auto"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Pidato() {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(60); // [ADD] batasi ke 1 menit
  const [timeUp, setTimeUp] = useState(false); // [ADD]
  const [mounted, setMounted] = useState(false); // [ADD]
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => setMounted(true), []); // [ADD]

  useEffect(() => {
    const el = document.getElementById("");
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

  useEffect(() => {
    if (!isPaused && time > 0) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, time]);

  // [ADD] ketika waktu habis: pause & munculkan modal
  useEffect(() => {
    if (time === 0 && !timeUp) {
      setIsPaused(true);
      setTimeUp(true);
      // hentikan track kamera supaya hemat resource (opsional)
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((tr) => tr.stop());
    }
  }, [time, timeUp]);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Tidak dapat mengakses kamera:", err);
      }
    };
    enableCamera();
  }, []);

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
        <section className="relative h-screen w-full bg-[url(/podium/tirai.png)] bg-no-repeat bg-cover bg-top overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="bg-white rounded-md w-fit px-6 py-4 shadow-sm">
                <p className="text-orange-500 font-medium text-sm">
                  Merancang Masa Depan: Membangun Karier di Era Digital
                </p>
              </div>
              <div className="bg-white rounded-2xl px-6 py-2 shadow-sm">
                <p className="text-orange-500 font-bold text-lg">
                  Mode : Pidato
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="bg-white rounded-3xl p-6 shadow-sm max-w-3xl">
                <p className="text-gray-700 text-base leading-relaxed">
                  {speechText.split("Dengan").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="bg-green-400 text-white px-2 py-1 rounded-md font-medium">
                          Dengan
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <div className="bg-white w-[30rem] h-80 flex items-center justify-center rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto rounded-xl"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </div>
          <PeopleRow
            people={[
              "/podium/people 1.png",
              "/podium/people 1.png",
              "/podium/people 1.png",
              "/podium/people 1.png",
              "/podium/people 1.png",
            ]}
          />
          <div className="flex items-center justify-center">
            <div className="bg-white flex items-center justify-center w-[90%] h-40 rounded-2xl shadow-md">
              <div className="flex items-center gap-4 z-40">
                <button
                  onClick={() => !timeUp && setIsPaused(!isPaused)} // [ADD] nonaktif saat timeUp
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

      {/* [ADD] Modal waktu habis */}
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
                    Sesi pidato dihentikan otomatis karena mencapai batas{" "}
                    <strong>60 detik</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/podium-swara/selesai"
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 text-center"
                    >
                      Akhiri & Lihat Hasil
                    </Link>
                    <button
                      onClick={() => {
                        setIsPaused(false);
                        setTime(60);
                        setTimeUp(false);
                        // hidupkan kamera lagi
                        (async () => {
                          try {
                            const stream =
                              await navigator.mediaDevices.getUserMedia({
                                video: true,
                              });
                            if (videoRef.current)
                              videoRef.current.srcObject = stream;
                          } catch {}
                        })();
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
