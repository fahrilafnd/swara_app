"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

// tipe data riwayat yang sama dengan dari detail page
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

export default function Inspira() {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [contents, setContents] = useState<ContentSwara[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [watchHistory, setWatchHistory] = useState<WatchItem[]>([]);

  const HISTORY_KEY = "swara:watchHistory";

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

  // load konten dan riwayat
  useEffect(() => {
    load();

    // load riwayat dari localStorage
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed: WatchItem[] = JSON.parse(raw);
        // urutkan terbaru
        parsed.sort((a, b) => b.updatedAt - a.updatedAt);
        setWatchHistory(parsed.slice(0, 5));
      }
    } catch {
      setWatchHistory([]);
    }
  }, [selectedCategory]);

  return (
    <div className="font-lexend h-full flex flex-col pb-5">
      <div className="bg-white flex items-center py-4 px-6 rounded-2xl font-bold mb-4">
        <span className="w-9 h-1 bg-[#F07122] rounded-full mr-4"></span>
        <p className="text-[#F07122]">Inspira Swara</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Bagian utama */}
        <aside className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 bg-white rounded-2xl">
          <p className="font-semibold mb-3">Video Unggulan Minggu Ini</p>

          {/* kategori */}
          <div className="flex space-x-3 overflow-x-auto scrollbar-custom pb-2 mb-6">
            {categoryItems.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full transition-all text-sm ${
                  selectedCategory === c.id
                    ? "bg-[#F07122] text-white border border-transparent"
                    : "bg-transparent text-[#B3C8CF] hover:bg-[#F0712250] hover:text-white border border-[#B3C8CF]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading && <p className="text-gray-500">Memuat konten...</p>}
          {!loading && errorMsg && <p className="text-red-500">{errorMsg}</p>}
          {!loading && !errorMsg && contents.length === 0 && (
            <p className="text-gray-500">Belum ada video tersedia.</p>
          )}

          {!loading && !errorMsg && contents.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {contents.map((item) => (
                <Link
                  key={item.content_swara_id}
                  href={`/inspira/${item.content_swara_id}`}
                  className="flex flex-col justify-between relative h-[240px] rounded-2xl overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b to-[#434343] from-[#D9D9D910]" />
                  <p className="bg-[#F07122] text-sm text-white w-max py-1 px-3 mr-3 mt-3 ms-auto rounded-lg z-10">
                    {item.video_duration || "00:00"}
                  </p>
                  <div className="mx-auto cursor-pointer absolute inset-0 m-auto w-max h-max">
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 38 38"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="19" cy="19" r="19" fill="white" />
                      <path
                        d="M26.2664 20.516C26.4979 20.3369 26.6853 20.1071 26.8142 19.8443C26.9431 19.5815 27.0101 19.2927 27.0101 19C27.0101 18.7073 26.9431 18.4185 26.8142 18.1557C26.6853 17.8929 26.4979 17.6631 26.2664 17.484C23.2686 15.1652 19.9216 13.3371 16.3504 12.068L15.6974 11.836C14.4494 11.393 13.1304 12.237 12.9614 13.526C12.4894 17.1601 12.4894 20.8399 12.9614 24.474C13.1314 25.763 14.4494 26.607 15.6974 26.164L16.3504 25.932C19.9216 24.6629 23.2686 22.8348 26.2664 20.516Z"
                        fill="#F07122"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-white ml-4 mb-5 z-10">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          )}
        </aside>

        {/* Sidebar kanan */}
        <aside className="w-96 sticky top-0 h-full ml-4 flex flex-col justify-between">
          {/* ====== Bagian Riwayat ====== */}
          <div className="bg-white rounded-2xl h-[38%] p-4 overflow-hidden">
            <p className="font-semibold mb-3">Lanjutkan Menonton</p>

            {watchHistory.length === 0 && (
              <p className="text-gray-400 text-sm">
                Belum ada riwayat tontonan.
              </p>
            )}

            {watchHistory.length > 0 && (
              <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-3">
                {watchHistory.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden">
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

          {/* ====== Rekomendasi (dummy sementara) ====== */}
          <div className="bg-white rounded-2xl h-[60%] p-4">
            <p className="font-semibold mb-3">Rekomendasi</p>
            <div className="h-full relative overflow-hidden pb-[86px]">
              <div className="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-end mb-4">
                  <div className="bg-[#F07122] py-2 px-2 rounded-full mr-2">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_723_513)">
                        <path
                          d="M10.3562 3.56399L10.2332 3.84699C10.214 3.89307 10.1816 3.93244 10.14 3.96013C10.0985 3.98782 10.0496 4.00259 9.9997 4.00259C9.94977 4.00259 9.90096 3.98782 9.85941 3.96013C9.81785 3.93244 9.78543 3.89307 9.7662 3.84699L9.6432 3.56399C9.42694 3.06335 9.03089 2.66195 8.5332 2.43899L8.1537 2.26949C8.10766 2.24831 8.06866 2.21438 8.04132 2.17171C8.01398 2.12903 7.99945 2.07942 7.99945 2.02874C7.99945 1.97806 8.01398 1.92845 8.04132 1.88578C8.06866 1.84311 8.10766 1.80917 8.1537 1.78799L8.5122 1.62849C9.0224 1.39918 9.42523 0.982932 9.6377 0.465491L9.7647 0.159991C9.78328 0.112668 9.81569 0.0720402 9.8577 0.0434038C9.8997 0.0147673 9.94936 -0.000549316 10.0002 -0.000549316C10.051 -0.000549316 10.1007 0.0147673 10.1427 0.0434038C10.1847 0.0720402 10.2171 0.112668 10.2357 0.159991L10.3622 0.464991C10.5744 0.982529 10.9771 1.39896 11.4872 1.62849L11.8462 1.78849C11.8921 1.80973 11.931 1.84366 11.9582 1.88628C11.9854 1.92889 11.9999 1.97841 11.9999 2.02899C11.9999 2.07957 11.9854 2.12909 11.9582 2.1717C11.931 2.21432 11.8921 2.24825 11.8462 2.26949L11.4662 2.43849C10.9686 2.66167 10.5727 3.06325 10.3567 3.56399M3.4997 2.99999C3.49973 2.55138 3.62046 2.11104 3.84925 1.72515C4.07803 1.33927 4.40644 1.02205 4.80002 0.806772C5.1936 0.591495 5.63786 0.48609 6.0862 0.501612C6.53454 0.517134 6.97045 0.65301 7.3482 0.894991L6.8082 1.73599C6.58149 1.59091 6.31992 1.50951 6.05091 1.50032C5.78191 1.49113 5.51539 1.5545 5.27931 1.68376C5.04322 1.81303 4.84627 2.00344 4.7091 2.23502C4.57193 2.46661 4.49961 2.73083 4.4997 2.99999V5.99999C4.4997 6.39782 4.65774 6.77935 4.93904 7.06065C5.22035 7.34196 5.60188 7.49999 5.9997 7.49999C6.39753 7.49999 6.77906 7.34196 7.06036 7.06065C7.34167 6.77935 7.4997 6.39782 7.4997 5.99999V3.49999H8.4997V5.99999C8.4997 6.66303 8.23631 7.29892 7.76747 7.76776C7.29863 8.2366 6.66274 8.49999 5.9997 8.49999C5.33666 8.49999 4.70078 8.2366 4.23194 7.76776C3.7631 7.29892 3.4997 6.66303 3.4997 5.99999V2.99999ZM1.0957 6.98099L2.0767 6.78449C2.2589 7.69071 2.74922 8.50591 3.46436 9.09158C4.1795 9.67725 5.07535 9.99728 5.9997 9.99728C6.92406 9.99728 7.81991 9.67725 8.53505 9.09158C9.25019 8.50591 9.74051 7.69071 9.9227 6.78449L10.9037 6.98099C10.4477 9.27249 8.4257 11 5.9997 11C3.5737 11 1.5517 9.27249 1.0957 6.98099Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_723_513">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-sm font-light bg-[#B3C8CF] py-2 px-2 rounded-xl rounded-bl-none">
                    Apakah kamu gugup, grogi, atau merasa kurang percaya diri
                    ketika berbicara?
                  </p>
                </div>
                <div className="flex items-end mb-4">
                  <p className="text-sm font-light bg-[#F07122] text-white py-2 px-2 rounded-xl rounded-br-none">
                    Saya kesulitan mencari video menarik public speaking
                  </p>
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt=""
                    className="ml-2 w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex items-end mb-4">
                  <p className="text-sm font-light bg-[#F07122] text-white py-2 px-2 rounded-xl rounded-br-none">
                    Saya kesulitan mencari video menarik public speaking
                  </p>
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt=""
                    className="ml-2 w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex items-end mb-4">
                  <p className="text-sm font-light bg-[#F07122] text-white py-2 px-2 rounded-xl rounded-br-none">
                    Saya kesulitan mencari video menarik public speaking
                  </p>
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt=""
                    className="ml-2 w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex items-end mb-4">
                  <p className="text-sm font-light bg-[#F07122] text-white py-2 px-2 rounded-xl rounded-br-none">
                    Saya kesulitan mencari video menarik public speaking
                  </p>
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt=""
                    className="ml-2 w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex items-end mb-4">
                  <p className="text-sm font-light bg-[#F07122] text-white py-2 px-2 rounded-xl rounded-br-none">
                    Saya kesulitan mencari video menarik public speaking
                  </p>
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt=""
                    className="ml-2 w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex items-end mb-4">
                  <p className="text-sm font-light bg-[#F07122] text-white py-2 px-2 rounded-xl rounded-br-none">
                    Saya kesulitan mencari video menarik public speaking
                  </p>
                  <img
                    src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
                    alt=""
                    className="ml-2 w-8 h-8 rounded-full"
                  />
                </div>
              </div>
              <div className="w-full flex px-1 pt-2">
                <input
                  type="text"
                  name=""
                  id=""
                  className="w-full text-sm border border-[#B3C8CF70] focus:outline-2 focus:outline focus:outline-[#F07122] rounded-2xl py-3 pl-4 pr-14"
                  placeholder="Ceritakan keluh kesahmu"
                />
                <button className="-translate-x-10 -mr-10">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="28" height="28" rx="14" fill="#F07122" />
                    <path
                      d="M10.0445 19.9399C9.79579 20.0376 9.55954 20.0161 9.33572 19.8755C9.11191 19.7348 9 19.5304 9 19.2622V15.9652L14.9684 14.4998L9 13.0345V9.73743C9 9.46878 9.11191 9.26436 9.33572 9.12418C9.55954 8.98399 9.79579 8.9625 10.0445 9.0597L21.5337 13.8221C21.8446 13.9564 22 14.1823 22 14.4998C22 14.8173 21.8446 15.0432 21.5337 15.1775L10.0445 19.9399Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
