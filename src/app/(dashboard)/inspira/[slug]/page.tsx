"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/** ====== Types ====== */
interface DetailData {
  content_swara_id: number;
  title: string;
  thumbnail: string;
  url_video: string; // bisa YouTube URL atau direct MP4
  description: string;
  category_content_swara_id: number;
  level_content_swara_id: number;
  speaker: string;
  video_duration: string; // "HH:MM:SS" | "MM:SS"
  views: number;
  category?: { category_content_swara_id: number; category_name: string };
  level?: { level_content_swara_id: number; level_name: string };
  gayaPenyampaian?: { gaya_penyampaian_id: number; gaya_penyampaian: string }[];
  struktur?: { struktur_id: number; struktur: string }[];
  teknikPembuka?: { teknik_pembuka_id: number; teknik_pembuka: string }[];
  tags?: { tag_id: number; tag_name: string }[];

  /** Opsional dari backend: daftar transkrip terstruktur */
  transcript?: { time_label?: string; time_sec?: number; text: string }[];
}

type WatchItem = {
  id: number;
  title: string;
  thumbnail: string;
  href: string;
  durationSec: number;
  lastSec: number;
  progress: number; // 0..1
  updatedAt: number;
};

type TranscriptEntry = {
  t: number; // detik
  label: string; // [mm:ss] / [hh:mm:ss]
  text: string;
};

/** ====== Constants ====== */
const HISTORY_KEY = "swara:watchHistory";

/** ====== Helpers ====== */
const parseHmsToSec = (s?: string) => {
  if (!s) return 0;
  const p = s.split(":").map(Number);
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
  if (p.length === 2) return p[0] * 60 + p[1];
  return Number(s) || 0;
};

const secToLabel = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const normalizeTranscript = (
  raw?: DetailData["transcript"]
): TranscriptEntry[] => {
  if (!raw || raw.length === 0) return [];
  return raw
    .map((r) => {
      const t =
        typeof r.time_sec === "number"
          ? r.time_sec
          : parseHmsToSec((r.time_label || "").replace(/\[|\]/g, ""));
      return {
        t: Math.max(0, Math.floor(t || 0)),
        label: `[${secToLabel(Math.max(0, Math.floor(t || 0)))}]`,
        text: r.text,
      };
    })
    .sort((a, b) => a.t - b.t);
};

const upsertWatchHistory = (item: WatchItem) => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr: WatchItem[] = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((x) => x.id === item.id);
    if (idx >= 0) arr[idx] = { ...arr[idx], ...item, updatedAt: Date.now() };
    else arr.unshift({ ...item, updatedAt: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(0, 20)));
  } catch {
    /* noop */
  }
};

const isYouTubeUrl = (url?: string) =>
  !!url && /(youtube\.com|youtu\.be)/i.test(url);

/** =======================================================
 *                  COMPONENT
 * =======================================================*/
export default function DetailInspira() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DetailData | null>(null);

  // ==== Video refs (dua mode: YouTube iframe atau <video>) ====
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // YouTube
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);
  const ytPlayerRef = useRef<any>(null); // window.YT.Player
  const ytTickRef = useRef<number | null>(null);

  const [currentSec, setCurrentSec] = useState(0);

  // ==== Transcript state ====
  const transcript: TranscriptEntry[] = useMemo(() => {
    // pakai dari backend jika ada, kalau tidak fallback dua blok contoh
    if (data?.transcript && data.transcript.length > 0) {
      return normalizeTranscript(data.transcript);
    }
    return [
      {
        t: 12,
        label: "[00:12]",
        text: "Jadi, saya akan mulai dengan ini: beberapa tahun yang lalu, seorang perencana acara menghubungi saya karena saya akan mengadakan acara pidato.",
      },
      {
        t: 18,
        label: "[00:18]",
        text: "Dia menelepon dan berkata, “Saya benar-benar kesulitan menulis tentang Anda di brosur kecil ini.”",
      },
    ];
  }, [data?.transcript]);

  // untuk autoscroll item aktif
  const rowRefs = useRef<HTMLDivElement[]>([]);

  // ==== Fetch video detail ====
  useEffect(() => {
    const load = async () => {
      try {
        if (!slug) return;
        const res = await fetch(`/api/inspira/${slug}`, { cache: "no-store" });
        const json = await res.json();
        if (res.ok && json?.data) setData(json.data as DetailData);
      } catch {
        /* noop */
      }
    };
    load();
  }, [slug]);

  // ==== Simpan history saat data siap ====
  useEffect(() => {
    if (!data) return;
    const durationSec = parseHmsToSec(data.video_duration);
    upsertWatchHistory({
      id: data.content_swara_id,
      title: data.title,
      thumbnail: data.thumbnail,
      href: `/inspira/${data.content_swara_id}`,
      durationSec,
      lastSec: 0,
      progress: 0,
      updatedAt: Date.now(),
    });
  }, [data]);

  // =======================================================
  //          Sinkronisasi waktu (YouTube / <video>)
  // =======================================================
  // --- YouTube: inject API dan buat player ---
  useEffect(() => {
    if (!data?.url_video || !isYouTubeUrl(data.url_video)) return;

    const ensureYT = () =>
      new Promise<void>((resolve) => {
        if ((window as any).YT?.Player) return resolve();
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        (window as any).onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(tag);
      });

    let cancelled = false;

    (async () => {
      await ensureYT();
      if (cancelled) return;

      // ganti embed URL ke format /embed/{id}?enablejsapi=1
      const url = new URL(
        data.url_video.includes("http")
          ? data.url_video
          : `https:${data.url_video}`
      );
      let videoId = "";
      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.replace("/", "");
      } else {
        videoId = url.searchParams.get("v") || "";
      }

      if (!ytIframeRef.current) return;

      ytPlayerRef.current = new (window as any).YT.Player(ytIframeRef.current, {
        videoId,
        events: {
          onReady: () => {
            // interval update current time
            if (ytTickRef.current) window.clearInterval(ytTickRef.current);
            ytTickRef.current = window.setInterval(() => {
              const t = ytPlayerRef.current?.getCurrentTime?.() || 0;
              setCurrentSec(Math.floor(t));
            }, 500);
          },
          onStateChange: (e: any) => {
            // simpan progress saat pause/end
            if (e.data === 2 || e.data === 0) {
              const t = ytPlayerRef.current?.getCurrentTime?.() || 0;
              const dur =
                ytPlayerRef.current?.getDuration?.() ||
                parseHmsToSec(data.video_duration);
              const progress = dur ? Math.min(1, t / dur) : 0;
              upsertWatchHistory({
                id: data.content_swara_id,
                title: data.title,
                thumbnail: data.thumbnail,
                href: `/inspira/${data.content_swara_id}`,
                durationSec: dur,
                lastSec: Math.floor(t),
                progress,
                updatedAt: Date.now(),
              });
            }
          },
        },
        playerVars: { rel: 0, modestbranding: 1 },
      });
    })();

    return () => {
      cancelled = true;
      if (ytTickRef.current) window.clearInterval(ytTickRef.current);
      ytTickRef.current = null;
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {}
      ytPlayerRef.current = null;
    };
  }, [data?.url_video]);

  // --- <video>: dengarkan timeupdate ---
  useEffect(() => {
    if (!data?.url_video || isYouTubeUrl(data.url_video)) return;

    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrentSec(Math.floor(v.currentTime || 0));
    const onSave = () => {
      const dur = Math.floor(
        v.duration || parseHmsToSec(data.video_duration) || 0
      );
      const cur = Math.floor(v.currentTime || 0);
      upsertWatchHistory({
        id: data.content_swara_id,
        title: data.title,
        thumbnail: data.thumbnail,
        href: `/inspira/${data.content_swara_id}`,
        durationSec: dur,
        lastSec: cur,
        progress: dur ? Math.min(1, cur / dur) : 0,
        updatedAt: Date.now(),
      });
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("pause", onSave);
    v.addEventListener("ended", onSave);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("pause", onSave);
      v.removeEventListener("ended", onSave);
    };
  }, [data?.url_video]);

  // ==== Hitung indeks transkrip aktif & autoscroll ====
  const activeIdx = useMemo(() => {
    if (transcript.length === 0) return -1;
    // cari baris terakhir yang t <= currentSec
    let idx = -1;
    for (let i = 0; i < transcript.length; i++) {
      if (transcript[i].t <= currentSec) idx = i;
      else break;
    }
    return idx;
  }, [transcript, currentSec]);

  useEffect(() => {
    if (activeIdx < 0) return;
    const el = rowRefs.current[activeIdx];
    if (!el) return;
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIdx]);

  // ==== Seek saat klik baris transkrip ====
  const seekTo = (sec: number) => {
    if (!data?.url_video) return;
    if (isYouTubeUrl(data.url_video)) {
      ytPlayerRef.current?.seekTo?.(sec, true);
      ytPlayerRef.current?.playVideo?.();
    } else if (videoRef.current) {
      videoRef.current.currentTime = sec;
      videoRef.current.play().catch(() => {});
    }
  };

  /** ====== Fallback texts ====== */
  const viewsText =
    typeof data?.views === "number"
      ? `${new Intl.NumberFormat("id-ID", {
          notation: data.views >= 10000 ? "compact" : "standard",
          maximumFractionDigits: 1,
        }).format(data.views)} penonton`
      : "15.2k penonton";

  const durationText = data?.video_duration || "18:45";
  const categoryText = data?.category?.category_name || "Motivational";
  const levelText = data?.level?.level_name || "Pemula";

  const teknikPembuka = data?.teknikPembuka?.map((t) => t.teknik_pembuka) || [
    "Personal Story",
    "Hook",
    "Bicara Mudah",
  ];
  const gayaPenyampaian = data?.gayaPenyampaian?.map(
    (g) => g.gaya_penyampaian
  ) || ["Tone Bicara", "Humor", "Tegas"];
  const struktur = data?.struktur?.map((s) => s.struktur) || [
    "Masalah-Solusi",
    "Berbasis Penelitian",
    "Call To Action",
  ];

  return (
    <div className="font-lexend h-full flex flex-col pb-5">
      {/* Header (tetap) */}
      <div className="bg-white flex items-center py-4 px-6 rounded-2xl font-bold mb-4">
        <Link href={"/inspira"}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.17245 11.9167L11.6641 16.4084C11.8474 16.5917 11.9354 16.8056 11.9281 17.05C11.9208 17.2945 11.8251 17.5084 11.6412 17.6917C11.4579 17.8597 11.244 17.9477 10.9995 17.9557C10.7551 17.9636 10.5412 17.8756 10.3579 17.6917L4.30786 11.6417C4.2162 11.55 4.15111 11.4507 4.11261 11.3438C4.07411 11.2368 4.05547 11.1222 4.0567 11C4.05792 10.8778 4.07717 10.7632 4.11445 10.6563C4.15172 10.5493 4.2165 10.45 4.30878 10.3584L10.3588 4.30836C10.5268 4.1403 10.7371 4.05627 10.9894 4.05627C11.2418 4.05627 11.4594 4.1403 11.6421 4.30836C11.8254 4.49169 11.9171 4.70955 11.9171 4.96194C11.9171 5.21433 11.8254 5.43189 11.6421 5.61461L7.17245 10.0834H17.4162C17.6759 10.0834 17.8938 10.1714 18.0698 10.3474C18.2458 10.5234 18.3335 10.7409 18.3329 11C18.3323 11.2591 18.2443 11.477 18.0689 11.6536C17.8935 11.8302 17.6759 11.9179 17.4162 11.9167H7.17245Z"
              fill="#F07122"
            />
          </svg>
        </Link>
        <p className="text-[#F07122] ml-4">Inspira Swara - Detail Video</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Kiri: Video & deskripsi (STYLE dipertahankan) */}
        <aside className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 bg-white rounded-2xl">
          {isYouTubeUrl(data?.url_video) ? (
            // YouTube iframe (tetap className & ukuran yang sama)
            <div className="w-full h-[420px] rounded-xl mb-4 overflow-hidden">
              <iframe
                ref={ytIframeRef as any}
                className="w-full h-[420px] rounded-xl mb-4"
                src="about:blank"
                title="YouTube video player"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            // HTML5 video (tetap className & ukuran yang sama)
            <video
              ref={videoRef}
              className="w-full h-[420px] rounded-xl mb-4"
              src={data?.url_video || ""}
              controls
              playsInline
            />
          )}

          <h1 className="text-xl font-semibold text-[#39363D] mb-4">
            {data?.title || "Tips public speaking anti malu"}
          </h1>

          <div className="flex items-center mb-5">
            <div className="mr-4">
              <img
                src="/default-profile.png"
                alt=""
                className="rounded-full w-[44px] h-[44px] object-cover object-center"
              />
            </div>
            <div>
              <p className="font-bold">
                {data?.speaker || "Tim Kurator Swara"}
              </p>
              <p className="text-sm text-[#B3C8CF]">
                {data?.category?.category_name ||
                  "Ahli Public Speaking & Komunikasi"}
              </p>
            </div>
          </div>

          <div className="flex items-center mb-5 flex-wrap gap-4 text-sm text-[#39363D]">
            <p>👁️ {viewsText}</p>
            <p>⏱️ {durationText}</p>
            <p>🏷️ {categoryText}</p>
            <p>🎯 Level: {levelText}</p>
          </div>

          <p className="text-sm leading-normal">
            {data?.description ||
              `Video pembelajaran ini akan membawa kamu menyelami seni menunjukkan
            kerentanan dan keaslian sebagai kunci untuk membangun koneksi yang
            kuat dengan audiens. Dalam dunia public speaking, sering kali kita
            merasa harus terlihat sempurna, padahal justru keterbukaan dan
            kejujuranlah yang membuat pesan kita lebih bermakna.`}
          </p>
        </aside>

        {/* Kanan: Transkrip & Teknik (STYLE dipertahankan) */}
        <aside className="w-96 sticky top-0 h-full ml-4 flex flex-col justify-between">
          {/* Transkrip Interaktif */}
          <div className="bg-white rounded-2xl h-[38%] overflow-hidden">
            <div className="bg-[#F07122] text-white flex items-center py-4 px-4 font-semibold">
              🗒️ <span className="ml-2">Transkrip Interaktif</span>
            </div>

            <div className="overflow-y-auto h-full pb-14 p-4 text-sm">
              {transcript.map((row, i) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={`${row.t}-${i}`}
                    ref={(el) => {
                      if (el) rowRefs.current[i] = el;
                    }}
                    onClick={() => seekTo(row.t)}
                    className={
                      (isActive
                        ? "bg-[#FFF3CD] rounded-lg border-x-4 border-[#F07122] p-3 mb-2 cursor-pointer"
                        : "rounded-lg border-x-4 border-transparent p-3 mb-2 cursor-pointer") +
                      " select-none"
                    }
                  >
                    <p className="text-[#F07122] mb-2">{row.label}</p>
                    <p>{row.text}</p>
                  </div>
                );
              })}
              {transcript.length === 0 && (
                <div className="rounded-lg border-x-4 border-transparent p-3 mb-2">
                  <p className="text-[#F07122] mb-2">[00:00]</p>
                  <p>Transkrip belum tersedia.</p>
                </div>
              )}
            </div>
          </div>

          {/* Teknik yang Dipelajari */}
          <div className="bg-white rounded-2xl h-[60%] overflow-hidden">
            <div className="bg-[#F07122] text-white flex items-center py-4 px-4 font-semibold">
              🎤 <span className="ml-2">Teknik yang Dipelajari</span>
            </div>

            <div className="overflow-y-auto h-full pb-20 p-4 text-sm">
              <div className="flex flex-wrap items-center mb-3">
                <p className="mr-2">Teknik Pembuka:</p>
                {teknikPembuka.map((t) => (
                  <span
                    key={t}
                    className="text-[#1976D2] bg-[#1976D230] w-max py-1 px-3 rounded-full text-xs mr-2 mb-2"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center mb-3">
                <p className="mr-2">Gaya Penyampaian:</p>
                {gayaPenyampaian.map((g) => (
                  <span
                    key={g}
                    className="text-[#1976D2] bg-[#1976D230] w-max py-1 px-3 rounded-full text-xs mr-2 mb-2"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center mb-3">
                <p className="mr-2">Struktur:</p>
                {struktur.map((s) => (
                  <span
                    key={s}
                    className="text-[#1976D2] bg-[#1976D230] w-max py-1 px-3 rounded-full text-xs mr-2 mb-2"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="bg-[#F8F9FA] p-4 rounded-2xl">
                <p className="text-sm font-bold mb-2">💡 Note:</p>
                <p className="text-[#39363D] text-sm">
                  Pembukaan yang personal membuat koneksi emosional lebih kuat
                  dengan audiens. Teknik ini membantu audiens merasa terlibat
                  sejak awal.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
