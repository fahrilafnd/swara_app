"use client";

import React, { useMemo, useState } from "react";
import MentorFilterBar from "./MentorFilterBar";
import { Star } from "lucide-react";
import Link from "next/link";

type Mentor = {
  id: string;
  name: string;
  title: string;
  bio: string;
  price: number; // dalam rupiah
  rating: number;
  ratingsCount: number;
  image: string;
  spesialisasi: string; // kunci filter
  lokasi: string; // kunci filter
};

// --- Dummy data mentor (silakan ganti dari API nanti) ---
const MENTORS: Mentor[] = [
  {
    id: "m1",
    name: "Daffa Arif Setyawan",
    title: "CEO Merah Putih",
    bio: "Halo, disini aku bantu kamu untuk skill up public speakingmu!",
    price: 30000,
    rating: 4.78,
    ratingsCount: 40,
    image:
      "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1471",
    spesialisasi: "public-speaking",
    lokasi: "jakarta",
  },
  {
    id: "m2",
    name: "Ayla Putri",
    title: "HR Interviewer",
    bio: "Siap bantu persiapan interview kerja dengan simulasi real.",
    price: 45000,
    rating: 4.9,
    ratingsCount: 62,
    image:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=1470&auto=format&fit=crop",
    spesialisasi: "interview",
    lokasi: "bandung",
  },
  {
    id: "m3",
    name: "Raka Pratama",
    title: "Presentation Coach",
    bio: "Bangun presentasi yang padat, jelas, & engaging.",
    price: 35000,
    rating: 4.7,
    ratingsCount: 28,
    image:
      "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1470&auto=format&fit=crop",
    spesialisasi: "presentasi",
    lokasi: "surabaya",
  },
  {
    id: "m4",
    name: "Nadya Rahma",
    title: "Public Speaker",
    bio: "Latihan artikulasi & storytelling biar makin percaya diri.",
    price: 30000,
    rating: 4.85,
    ratingsCount: 51,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1470&auto=format&fit=crop",
    spesialisasi: "public-speaking",
    lokasi: "jakarta",
  },
  {
    id: "m5",
    name: "Dion Hartanto",
    title: "Tech Recruiter",
    bio: "Tingkatkan jawaban STAR-mu untuk interview teknis.",
    price: 50000,
    rating: 4.8,
    ratingsCount: 37,
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1470&auto=format&fit=crop",
    spesialisasi: "interview",
    lokasi: "surabaya",
  },
  {
    id: "m6",
    name: "Rina Maharani",
    title: "Slide Designer",
    bio: "Buat deck presentasi yang rapi & profesional.",
    price: 32000,
    rating: 4.76,
    ratingsCount: 22,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1470&auto=format&fit=crop",
    spesialisasi: "presentasi",
    lokasi: "bandung",
  },
];

type Filters = { q: string; spesialisasi: string; lokasi: string };
const PAGE_SIZE = 3; // tetap 3 card per halaman seperti desain kamu

export default function LatihSwara() {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    spesialisasi: "",
    lokasi: "",
  });
  const [page, setPage] = useState(1);

  // terima hasil dari MentorFilterBar
  const handleSubmitFilters = (f: Filters) => {
    setFilters(f);
    setPage(1); // reset ke halaman 1 saat filter berubah
  };

  // filtering data tanpa mengubah desain card
  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return MENTORS.filter((m) => {
      const matchQ =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q);
      const matchSpec =
        !filters.spesialisasi || m.spesialisasi === filters.spesialisasi;
      const matchLok = !filters.lokasi || m.lokasi === filters.lokasi;
      return matchQ && matchSpec && matchLok;
    });
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="pr-8 pb-8">
      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <div className="w-4 h-1 bg-orange-500"></div>
        <h1 className="text-orange-500 font-semibold text-lg">Latih Swara</h1>
      </div>

      <div className="flex bg-white px-6 py-4 rounded-xl items-center gap-2 mb-4">
        <MentorFilterBar
          className="justify-start"
          onSubmit={handleSubmitFilters}
        />
      </div>

      <div className=" bg-white px-6 py-6  rounded-xl items-center gap-2 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Cari Mentor</h1>
          <Link
            href={"/latih-swara/mentor-saya"}
            className="bg-primary px-6 py-4 rounded-2xl text-white"
          >
            Mentor Saya
          </Link>
        </div>

        {/* GRID CARD — tetap sesuai desainmu */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {current.map((m) => (
            <div key={m.id} className="border-2 border-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-3 ">
                <Star className="text-yellow-300" />
                <p className="font-bold">{m.rating.toFixed(2)}</p>
                <p>({m.ratingsCount}+ rating)</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="mt-2 flex flex-col">
                  <p className="font-bold text-2xl">{m.name}</p>
                  <p>{m.title}</p>
                  <p className="text-gray-300">{m.bio}</p>
                </div>
                <img
                  src={m.image}
                  alt="Mentor"
                  className="w-20  h-20 object-cover rounded-md "
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-bold">
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(m.price)}{" "}
                  / Sesi
                </p>
                <Link
                  href={`/latih-swara/mentor?id=${m.id}`}
                  className="bg-primary px-4 py-2 rounded-xl text-white"
                >
                  Lihat Profil
                </Link>
              </div>
            </div>
          ))}

          {/* kalau kosong */}
          {current.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Tidak ada mentor yang cocok dengan filter.
            </div>
          )}
        </div>

        {/* PAGINATION — kelas tetap sama, tapi dinamis */}
        <ul className="flex items-center justify-center gap-4 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li
              key={p}
              onClick={() => setPage(p)}
              className={
                p === page
                  ? "bg-primary w-12 h-12 flex items-center justify-center text-white rounded-md text-lg cursor-pointer"
                  : "border  border-gray-200 text-gray-800 w-12 h-12 flex items-center justify-center rounded-md text-lg cursor-pointer"
              }
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
