"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  time: string; // e.g. "12:20 WIB | 25 Maret 2023"
  tag?: string; // e.g. "Terampil Bicara"
};

const EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Webinar Public Speaking #1: Let's Learn",
    time: "12:20 WIB | 25 Maret 2023",
    tag: "Terampil Bicara",
  },
  {
    id: "e2",
    title: "Penguasaan Intonasi & Artikulasi",
    time: "19:00 WIB | 12 April 2023",
    tag: "Terampil Bicara",
  },
  {
    id: "e3",
    title: "Storytelling yang Menggugah",
    time: "09:30 WIB | 1 Mei 2023",
    tag: "Terampil Bicara",
  },
];

export default function EventCard() {
  const [index, setIndex] = useState(0);

  // ===== Autoplay (opsional: aktifkan dengan true) =====
  const AUTOPLAY = true;
  const INTERVAL_MS = 5000;
  const timerRef = useRef<number | null>(null);

  const len = EVENTS.length;
  const clamp = (i: number) => (i + len) % len;

  const goPrev = () => setIndex((i) => clamp(i - 1));
  const goNext = () => setIndex((i) => clamp(i + 1));

  // ===== Keyboard navigation =====
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ===== Autoplay =====
  useEffect(() => {
    if (!AUTOPLAY) return;
    timerRef.current = window.setInterval(goNext, INTERVAL_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // pause saat hover
  const onMouseEnter = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  };
  const onMouseLeave = () => {
    if (!AUTOPLAY) return;
    timerRef.current = window.setInterval(goNext, INTERVAL_MS);
  };

  // ===== Swipe (mobile) =====
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    const dx = touchDeltaX.current;
    if (Math.abs(dx) > 50) {
      dx > 0 ? goPrev() : goNext();
    }
  };

  // untuk aria-live teks
  const liveTitle = useMemo(() => EVENTS[index]?.title ?? "", [index]);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-800 text-base sm:text-lg font-semibold mb-4">
          Event terdekat
        </h2>
        <Link className="text-sm text-gray-600" href={"/event"}>Lihat Semua</Link>
      </div>

      <div
        className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* TRACK */}
        <div
          className="relative h-48 sm:h-56 lg:h-64 overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="h-full flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {EVENTS.map((ev) => (
              <Slide key={ev.id} item={ev} />
            ))}
          </div>

          {/* Panah */}
          <button
            onClick={goPrev}
            aria-label="Sebelumnya"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goNext}
            aria-label="Berikutnya"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
            {EVENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ke slide ${i + 1}`}
                className={[
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-white"
                    : "w-3 bg-white/60 hover:bg-white/80",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Live region untuk aksesibilitas */}
          <span className="sr-only" aria-live="polite">
            {liveTitle}
          </span>
        </div>
      </div>
    </div>
  );
}

/** ===== Satu Slide, mempertahankan desain auditoriummu ===== */
function Slide({ item }: { item: EventItem }) {
  return (
    <div className="min-w-full relative h-full">
      {/* Auditorium Background */}
      <div className="w-full h-full bg-gradient-to-br from-red-200 via-red-300 to-red-400 relative overflow-hidden">
        {/* Interior */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200" />
          {/* Audience rows */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 px-2">
            <Row
              count={50}
              from="red-600"
              to="red-700"
              min={12}
              spread={6}
              opacityBase={0.3}
              extra="w-1.5"
            />
            <Row
              count={45}
              from="red-500"
              to="red-600"
              min={16}
              spread={8}
              opacityBase={0.5}
              extra="w-2"
            />
            <Row
              count={40}
              from="red-400"
              to="red-500"
              min={20}
              spread={10}
              opacityBase={0.7}
              extra="w-2.5 shadow-sm"
            />
          </div>
          {/* Speaker box kanan */}
          <div className="absolute bottom-4 right-8 w-8 h-12 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-lg opacity-80" />
        </div>
        {/* Orange overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-orange-600/80" />
      </div>

      {/* Tag Button */}
      {item.tag && (
        <div className="absolute top-3 right-3">
          <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg transition-colors">
            {item.tag}
          </button>
        </div>
      )}

      {/* Event details */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-orange-600/80 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              {item.title}
            </h3>
            <p className="text-white/90 text-xs sm:text-sm font-medium">
              {item.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Baris penonton, sedikit random agar hidup */
function Row({
  count,
  from,
  to,
  min,
  spread,
  opacityBase,
  extra = "",
}: {
  count: number;
  from: string;
  to: string;
  min: number;
  spread: number;
  opacityBase: number;
  extra?: string;
}) {
  return (
    <div className="flex justify-center gap-0.5 mb-1">
      {Array.from({ length: count }).map((_, i) => {
        const h = Math.random() * spread + min;
        const op = Math.min(1, opacityBase + Math.random() * 0.4);
        return (
          <div
            key={i}
            className={`h-6 bg-gradient-to-b from-${from} to-${to} rounded-t-sm ${extra}`}
            style={{ height: `${h}px`, opacity: op }}
          />
        );
      })}
    </div>
  );
}
