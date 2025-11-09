"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* ========= Types ========= */
interface Category {
  category_content_swara_id: number;
  category_name: string;
}
interface Level {
  level_content_swara_id: number;
  level_name: string;
}
interface ContentSwara {
  content_swara_id: number;
  title: string;
  thumbnail: string;
  url_video: string;
  description: string;
  category_content_swara_id: number;
  level_content_swara_id: number;
  speaker: string;
  video_duration: string;
  views: number;
  category: Category;
  level: Level;
}
interface WatchItem {
  id: number;
  title: string;
  thumbnail: string;
  href: string;
  durationSec: number;
  lastSec: number;
  progress: number; // 0..1
  updatedAt: number;
}

/* ========= Component ========= */
export default function Inspira() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [contents, setContents] = useState<ContentSwara[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [watchHistory, setWatchHistory] = useState<WatchItem[]>([]);
  const HISTORY_KEY = "swara:watchHistory";

  // --- Search state ---
  const [search, setSearch] = useState<string>("");
  const [debounced, setDebounced] = useState<string>("");

  // Debounce input 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleCategoryClick = (id: number) => setSelectedCategory(id);

  const categoryItems = [
    { id: 1, name: "Semua" },
    { id: 2, name: "Tips Dasar Public Speaking" },
    { id: 3, name: "Atasi Grogi & Rasa Malu" },
    { id: 4, name: "Teknik Intonasi & Artikulasi" },
    { id: 5, name: "Storytelling" },
    { id: 6, name: "Cara Ngomong yang Baik" },
  ];

  const load = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const qs =
        selectedCategory && selectedCategory !== 1
          ? `?category_id=${selectedCategory}`
          : "";
      const res = await fetch(`/api/inspira${qs}`, { cache: "no-store" });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status}: ${t}`);
      }
      const data = await res.json();
      setContents(data?.data?.contents ?? []);
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Gagal memuat konten. Silakan login ulang.");
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  // load konten & riwayat
  useEffect(() => {
    load();
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed: WatchItem[] = JSON.parse(raw);
        parsed.sort((a, b) => b.updatedAt - a.updatedAt);
        setWatchHistory(parsed.slice(0, 5));
      } else {
        setWatchHistory([]);
      }
    } catch {
      setWatchHistory([]);
    }
  }, [selectedCategory]);

  // Filter client-side oleh pencarian
  const filteredContents = useMemo(() => {
    if (!debounced) return contents;
    return contents.filter((c) => {
      const hay = `${c.title} ${c.speaker ?? ""} ${
        c.description ?? ""
      }`.toLowerCase();
      return hay.includes(debounced);
    });
  }, [contents, debounced]);

  return (
    <div className="font-lexend h-full flex flex-col pb-5">
      <div className="bg-white flex items-center py-4 px-6 rounded-2xl font-bold mb-4">
        <span className="w-9 h-1 bg-[#F07122] rounded-full mr-4"></span>
        <p className="text-[#F07122]">Inspira Swara</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ======= Bagian utama (kiri) ======= */}
        <aside className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 bg-white rounded-2xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="font-semibold">Video Unggulan Minggu Ini</p>
            {/* Quick search (duplikat dari sidebar untuk UX cepat) */}
            <div className="hidden md:flex items-center gap-2 bg-[#F6F7F9] border border-[#E6E8EE] rounded-2xl px-3 py-2 w-80">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="opacity-60"
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14m-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, deskripsi, atau speaker…"
                className="bg-transparent outline-none text-sm w-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Kategori */}
          <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-custom pb-2 mb-6">
            {categoryItems.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full transition-all text-sm border ${
                  selectedCategory === c.id
                    ? "bg-[#F07122] text-white border-transparent"
                    : "bg-white text-[#6B7280] hover:bg-[#FFF3EC] border-[#E5E7EB]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* State handling */}
          {loading && <p className="text-gray-500">Memuat konten...</p>}
          {!loading && errorMsg && <p className="text-red-500">{errorMsg}</p>}
          {!loading && !errorMsg && filteredContents.length === 0 && (
            <div className="text-center py-14 border-2 border-dashed rounded-2xl border-[#F1F2F6]">
              <p className="text-gray-700 font-semibold mb-1">
                Tidak ada hasil
              </p>
              <p className="text-gray-500 text-sm">
                Coba kata kunci lain atau ubah kategori.
              </p>
            </div>
          )}

          {/* Grid video */}
          {!loading && !errorMsg && filteredContents.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {filteredContents.map((item) => (
                <Link
                  key={item.content_swara_id}
                  href={`/inspira/${item.content_swara_id}`}
                  className="flex flex-col justify-between relative h-[240px] rounded-2xl overflow-hidden bg-cover bg-center group ring-1 ring-[#EAECEF]"
                  style={{ backgroundImage: `url(${item.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b to-[#1F1F1F] from-[#00000010] opacity-90 group-hover:opacity-100 transition" />
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <span className="bg-black/40 text-white text-xs px-2 py-1 rounded-md">
                      {item.video_duration || "00:00"}
                    </span>
                  </div>

                  <div className="mx-auto cursor-pointer absolute inset-0 m-auto w-max h-max z-10">
                    <svg width="40" height="40" viewBox="0 0 38 38" fill="none">
                      <circle cx="19" cy="19" r="19" fill="white" />
                      <path
                        d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                        fill="#F07122"
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 p-4 mt-auto">
                    <div className="text-white text-xs opacity-80">
                      {item.speaker || "Narasumber"}
                    </div>
                    <h4 className="font-semibold text-white line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>

        {/* ======= Sidebar kanan (search + lanjutkan menonton saja) ======= */}
        <aside className="w-96 sticky top-0 h-full ml-4 flex flex-col gap-4">
          {/* Lanjutkan Menonton */}
          <div className="bg-white rounded-2xl p-5 flex-1 overflow-hidden">
            <p className="font-semibold mb-3">Lanjutkan Menonton</p>

            {watchHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Belum ada riwayat tontonan.
              </div>
            ) : (
              <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-3 h-full">
                {watchHistory.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 group rounded-xl hover:bg-[#FFF3EC] p-2 transition"
                  >
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden ring-1 ring-[#EAECEF]">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-gray-300 h-[4px]">
                        <div
                          className="bg-[#F07122] h-[4px] transition-all"
                          style={{ width: `${item.progress * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-[#39363D] group-hover:text-[#F07122] line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.floor(item.progress * 100)}% ditonton
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
