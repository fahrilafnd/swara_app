// src/app/components/Header.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Bell, CheckCheck, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";

/** ====== Types ====== */
type NotifType = "info" | "success" | "warning";
type Notif = {
  id: string;
  title: string;
  message: string;
  href?: string;
  type?: NotifType;
  createdAt: number; // epoch ms
  read: boolean;
};

/** ====== Helpers ====== */
const fmtTimeAgo = (t: number) => {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j`;
  const d = Math.floor(h / 24);
  return `${d}h`;
};

const typeStyles: Record<NotifType, string> = {
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
};

/** ====== STORAGE KEYS ====== */
const LS_KEY = "swara:notifs";

/** ====== MAIN HEADER ====== */
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // ---- ensure mounted to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shouldShowBackButton =
    pathname.includes("/hasil-skor") || pathname.includes("/sesi-latihan");

  const handleBackNavigation = () => {
    if (pathname.includes("/hasil-skor")) {
      router.push("/skor-swara/sesi-latihan");
    } else if (pathname.includes("/sesi-latihan")) {
      router.push("/skor-swara");
    } else {
      router.back();
    }
  };

  /** ====== NOTIFICATIONS STATE ====== */
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setNotifs(JSON.parse(raw));
      else {
        const seed: Notif[] = [
          {
            id: crypto.randomUUID(),
            title: "Selamat! Skor kamu meningkat",
            message: "Peningkatan 12% di Latihan Dasar minggu ini.",
            href: "/skor-swara/riwayat",
            type: "success",
            createdAt: Date.now() - 1000 * 60 * 8,
            read: false,
          },
          {
            id: crypto.randomUUID(),
            title: "Event malam ini",
            message: "Webinar ‘Mengatasi Grogi’ mulai 19.00 WIB.",
            href: "/event",
            type: "info",
            createdAt: Date.now() - 1000 * 60 * 60 * 4,
            read: false,
          },
          {
            id: crypto.randomUUID(),
            title: "Tips cepat",
            message: "Coba latihan 5 menit tiap pagi untuk konsistensi.",
            type: "warning",
            createdAt: Date.now() - 1000 * 60 * 60 * 30,
            read: true,
          },
        ];
        setNotifs(seed);
        localStorage.setItem(LS_KEY, JSON.stringify(seed));
      }
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(notifs));
    } catch {}
  }, [notifs]);

  const unreadCount = useMemo(
    () => notifs.filter((n) => !n.read).length,
    [notifs]
  );

  const markAllRead = () =>
    setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const removeOne = (id: string) =>
    setNotifs((ns) => ns.filter((n) => n.id !== id));

  const clearAll = () => setNotifs([]);

  /** Toggle modal */
  const toggleOpen = () => setOpen((v) => !v);

  return (
    <header className="sticky top-0 z-30 flex w-full pr-12 py-5">
      <div className="flex w-full items-center justify-between">
        {/* Left: Back button / Search */}
        <div className="flex-1 flex justify-start">
          {shouldShowBackButton ? (
            <button
              onClick={handleBackNavigation}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-orange-500 hover:text-orange-600 font-medium transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </button>
          ) : (
            <div className="w-full max-w-md relative">
              <label
                htmlFor="search"
                className="absolute left-4 top-0 bottom-0 m-auto h-max w-max"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.9011 18.5992L16.5003 15.2258C17.8204 13.5799 18.4597 11.4907 18.2867 9.38786C18.1137 7.28503 17.1416 5.32839 15.5703 3.92026C13.999 2.51213 11.9479 1.75955 9.83879 1.81727C7.72965 1.87498 5.72277 2.7386 4.23083 4.23055C2.73888 5.7225 1.87526 7.72937 1.81754 9.83852C1.75983 11.9477 2.51241 13.9988 3.92054 15.5701C5.32866 17.1414 7.28531 18.1134 9.38814 18.2864C11.491 18.4594 13.5802 17.8201 15.2261 16.5L18.5994 19.8733C18.6847 19.9593 18.786 20.0275 18.8977 20.074C19.0095 20.1205 19.1293 20.1445 19.2503 20.1445C19.3713 20.1445 19.4911 20.1205 19.6028 20.074C19.7145 20.0275 19.8159 19.9593 19.9011 19.8733C20.0663 19.7024 20.1587 19.474 20.1587 19.2363C20.1587 18.9985 20.0663 18.7701 19.9011 18.5992ZM10.0836 16.5C8.81452 16.5 7.57392 16.1237 6.5187 15.4186C5.46349 14.7135 4.64105 13.7114 4.15538 12.5389C3.66972 11.3664 3.54265 10.0762 3.79024 8.83151C4.03783 7.5868 4.64896 6.44346 5.54634 5.54607C6.44373 4.64868 7.58707 4.03755 8.83178 3.78996C10.0765 3.54238 11.3667 3.66945 12.5392 4.15511C13.7117 4.64077 14.7138 5.46321 15.4189 6.51843C16.1239 7.57364 16.5003 8.81424 16.5003 10.0833C16.5003 11.7851 15.8242 13.4172 14.6209 14.6206C13.4175 15.824 11.7854 16.5 10.0836 16.5Z"
                    fill="#B3C8CF"
                  />
                </svg>
              </label>
              <input
                type="text"
                name="search"
                id="search"
                className="w-full font-lexend text-[#F07122] bg-white py-4 rounded-2xl pl-14 pr-4 focus:outline-2 focus:outline focus:outline-[#F07122]"
                placeholder="Search"
              />
            </div>
          )}
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center gap-4 ml-4">
          {/* BELL */}
          <button
            aria-label="Buka notifikasi"
            onClick={toggleOpen}
            className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-[#39363D]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F07122] text-white text-[10px] font-bold grid place-items-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <Link href="/profile" className="hover:opacity-80 transition-opacity">
            <img
              src="https://i.pinimg.com/736x/5b/03/a2/5b03a2f8bd8d357c97754d572a3b816b.jpg"
              className="w-[48px] h-[48px] rounded-full border-2 border-[#F07122] cursor-pointer"
              alt="pp"
            />
          </Link>
        </div>
      </div>

      {/* Modal Notifikasi — render only after mounted and via Portal */}
      {mounted && (
        <NotificationsModal
          open={open}
          onClose={() => setOpen(false)}
          notifs={notifs}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onRemove={removeOne}
          onClearAll={clearAll}
        />
      )}
    </header>
  );
}

/** ================== NOTIFICATIONS MODAL ================== */
function NotificationsModal(props: {
  open: boolean;
  onClose: () => void;
  notifs: Notif[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}) {
  const {
    open,
    onClose,
    notifs,
    onMarkRead,
    onMarkAllRead,
    onRemove,
    onClearAll,
  } = props;
  const router = useRouter();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const containerRef = useRef<HTMLDivElement | null>(null);

  // lock scroll body when open
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const list = useMemo(
    () => (tab === "all" ? notifs : notifs.filter((n) => !n.read)),
    [tab, notifs]
  );

  if (!open) return null;

  // ---- render to body so it always sits above everything
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/25 backdrop-blur-[1px] flex items-start justify-end"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={containerRef}
        className="mt-20 mr-8 w-[420px] max-w-[92vw] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                tab === "all"
                  ? "bg-orange-100 text-[#F07122]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setTab("unread")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                tab === "unread"
                  ? "bg-orange-100 text-[#F07122]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Belum dibaca
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
              title="Tandai semua sudah dibaca"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai semua
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Tutup notifikasi"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada notifikasi {tab === "unread" ? "baru" : ""}.
          </div>
        ) : (
          <ul className="max-h-[60vh] overflow-y-auto divide-y">
            {list.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 flex gap-3 items-start ${
                  !n.read ? "bg-orange-50/40" : ""
                }`}
              >
                {/* bullet */}
                <div
                  className={[
                    "mt-1 shrink-0 rounded-full ring-2 w-8 h-8 grid place-items-center",
                    typeStyles[n.type ?? "info"],
                  ].join(" ")}
                >
                  {n.type === "success"
                    ? "🏆"
                    : n.type === "warning"
                    ? "💡"
                    : "🔔"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {n.title}
                    </h4>
                    <span className="text-xs text-gray-500 shrink-0">
                      {fmtTimeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{n.message}</p>

                  <div className="mt-2 flex items-center gap-2">
                    {!n.read && (
                      <button
                        onClick={() => onMarkRead(n.id)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border hover:bg-gray-50"
                      >
                        Tandai sudah dibaca
                      </button>
                    )}
                    {n.href && (
                      <button
                        onClick={() => {
                          onMarkRead(n.id);
                          router.push(n.href!);
                          onClose();
                        }}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F07122] text-white hover:brightness-110"
                      >
                        Buka
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onRemove(n.id)}
                  className="p-1.5 rounded-md hover:bg-gray-100 shrink-0"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {notifs.filter((n) => !n.read).length} belum dibaca
          </span>
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-red-600 hover:text-red-700"
          >
            Hapus semua
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
