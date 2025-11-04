"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour-styles.css";

interface TourGuideProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function TourGuide({ isActive, onComplete }: TourGuideProps) {
  const driverRef = useRef<any>(null);

  useEffect(() => {
    if (isActive) {
      driverRef.current = driver({
        showProgress: true,
        showButtons: ["previous", "next", "close"],
        nextBtnText: "Lanjut >",
        prevBtnText: "Sebelumnya",
        doneBtnText: "Selesai",
        // some versions support this; if unsupported, CSS will replace label visually
        // @ts-ignore
        closeBtnText: "Batal",
        allowClose: true,
        disableActiveInteraction: true,
        popoverClass: "driver-popover",
        steps: [
          // 1. StatsCards sebagai Hasil Latihan
          {
            element: '[data-tour="stats-cards"]',
            popover: {
              title: "Hasil Latihan",
              description:
                "Kamu bisa melihat hasil dari latihannmu dengan statistik di sini.",
              side: "bottom",
              align: "start",
            },
          },
          // 2. EventCard sebagai Event & Panduan
          {
            element: '[data-tour="event-card"]',
            popover: {
              title: "Panduan",
              description:
                "Panduan penggunaan setiap fitur di SWARA.",
              side: "bottom",
              align: "start",
            },
          },
          // 3. Level card
          {
            element: '[data-tour="level-card"]',
            popover: {
              title: "Level Kamu",
              description:
                "Naik level dengan rutin berlatih dan berpartisipasi pada fitur lainnya.",
              side: "left",
              align: "center",
            },
          },
          // 3b. Riwayat Latihan (History Section)
          {
            element: '[data-tour="history-section"]',
            popover: {
              title: "Riwayat Latihanmu",
              description:
                "Lihat aktivitas dan progres latihan terakhirmu di sini.",
              side: "left",
              align: "center",
            },
          },
          // 4. Sidebar items (kecuali Dashboard)
          {
            element: '[data-tour="latihan-dasar"]',
            popover: {
              title: "Latihan Dasar",
              description:
                "Kamu bisa berlatih dasar-dasar public speaking di fitur ini.",
              side: "right",
              align: "start",
            },
          },
          {
            element: '[data-tour="skor-swara"]',
            popover: {
              title: "Skor Swara",
              description:
                "Masuk ke fitur analisis AI untuk menilai performa berbicara.",
              side: "right",
              align: "start",
            },
          },
          {
            element: '[data-tour="adu-swara"]',
            popover: {
              title: "Adu Swara",
              description:
                "Bertanding dengan pengguna lain dalam kompetisi public speaking.",
              side: "right",
              align: "start",
            },
          },
          {
            element: '[data-tour="grafik-swara"]',
            popover: {
              title: "Inspira Swara",
              description:
                "Konten inspiratif, tips, dan teknik public speaking dari para ahli.",
              side: "right",
              align: "start",
            },
          },
          {
            element: '[data-tour="podium-swara"]',
            popover: {
              title: "Podium Swara",
              description: "Lihat peringkat dan capai posisi teratas.",
              side: "right",
              align: "start",
            },
          },
          {
            element: '[data-tour="latih-swara"]',
            popover: {
              title: "Latih Swara",
              description:
                "Mulai latihan terstruktur untuk meningkatkan kemampuan berbicara.",
              side: "right",
              align: "start",
            },
          },
        ],
        onDestroyStarted: () => {
          if (onComplete) {
            onComplete();
          }
        },
        onDestroyed: () => {
          if (onComplete) {
            onComplete();
          }
        },
      });

      driverRef.current.drive();
    }

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [isActive, onComplete]);

  return null;
}
