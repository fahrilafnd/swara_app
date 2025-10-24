"use client";

import { useState, useEffect, useMemo } from "react";
import { Pause, Play, Check } from "lucide-react";
import Link from "next/link";

/* ===== Komponen Reusable: PeopleRow ===== */
type PeopleRowProps = {
  /** jumlah penonton => akan generate /podium/people {i}.png */
  count?: number;
  /** kalau mau manual, pakai array path */
  people?: string[];
  /** rentang interval acak applause (ms) */
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
  const [applauseStyle, setApplauseStyle] = useState<{
    x: number;
    y: number;
    scale: number;
  }>({
    x: 0,
    y: 0,
    scale: 1,
  });

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
          x: Math.floor(Math.random() * 16) - 8, // -8..8 px
          y: Math.floor(Math.random() * 8), // 0..7 px
          scale: 0.9 + Math.random() * 0.4, // 0.9..1.3
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
  );
}

export default function MC() {
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(292);

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
                  Mode : MC
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
            <div className="bg-white w-[30rem] h-fit flex items-center justify-center rounded-xl">
              <img src="/podium/virtual.png" alt="" />
            </div>
          </div>

          <PeopleRow people={[
            "/podium/people 1.png",
            "/podium/people 1.png",
            "/podium/people 1.png",
            "/podium/people 1.png",
            "/podium/people 1.png",
          ]} />
         

          <div className="flex items-center justify-center">
            <div className="bg-white flex items-center justify-center w-[90%] h-40 rounded-2xl shadow-md">
              <div className="flex items-center gap-4 z-40">
                <button
                  onClick={() => setIsPaused(!isPaused)}
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

                <Link href="/podium-swara/selesai" className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all duration-300 transform hover:scale-105">
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
