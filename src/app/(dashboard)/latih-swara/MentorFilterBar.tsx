"use client";

import { useState, FormEvent } from "react";
import { Search, ChevronDown } from "lucide-react";

type Filters = {
  q: string;
  spesialisasi: string;
  lokasi: string;
};

type Props = {
  onSubmit?: (filters: Filters) => void;
  className?: string;
};

const SPESIALISASI = [
  { value: "", label: "Semua spesialisasi" },
  { value: "public-speaking", label: "Public Speaking" },
  { value: "interview", label: "Interview Kerja" },
  { value: "presentasi", label: "Presentasi" },
];

const LOKASI = [
  { value: "", label: "Semua lokasi" },
  { value: "jakarta", label: "Jakarta" },
  { value: "surabaya", label: "Surabaya" },
  { value: "bandung", label: "Bandung" },
];

export default function MentorFilterBar({ onSubmit, className = "" }: Props) {
  const [q, setQ] = useState("");
  const [spesialisasi, setSpesialisasi] = useState("");
  const [lokasi, setLokasi] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.({ q, spesialisasi, lokasi });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap items-center gap-4 ${className}`}
      role="search"
      aria-label="Filter mentor"
    >
      {/* Search */}
      <label className="relative isolate flex-1 min-w-[240px] max-w-[520px]">
        <span className="sr-only">Cari nama mentor</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search nama mentor"
          className="w-full rounded-2xl bg-white px-12 py-3 text-slate-600 placeholder:text-slate-400 shadow-sm outline-none ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
        />
      </label>

      {/* Spesialisasi */}
      <div className="relative">
        <label htmlFor="spesialisasi" className="sr-only">
          Spesialisasi
        </label>
        <select
          id="spesialisasi"
          value={spesialisasi}
          onChange={(e) => setSpesialisasi(e.target.value)}
          className="appearance-none rounded-2xl bg-white px-4 py-3 pr-10 text-slate-600 shadow-sm outline-none ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
        >
          {SPESIALISASI.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      </div>

      {/* Lokasi */}
      <div className="relative">
        <label htmlFor="lokasi" className="sr-only">
          Lokasi
        </label>
        <select
          id="lokasi"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="appearance-none rounded-2xl bg-white px-4 py-3 pr-10 text-slate-600 shadow-sm outline-none ring-1 ring-transparent focus:ring-2 focus:ring-orange-300"
        >
          {LOKASI.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      </div>

      {/* Tombol submit opsional (enter juga jalan) */}
      <button
        type="submit"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </form>
  );
}
