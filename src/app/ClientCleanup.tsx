"use client";

import { useEffect } from "react";

export default function ClientCleanup() {
  useEffect(() => {
    const hideUwaw = () => {
      // tangkap berbagai variasi class yang disuntik UserWay
      const nodes = document.querySelectorAll<HTMLElement>(
        '.uwaw-footer, div.uwaw-footer, div[class*="uwaw-footer"]'
      );

      nodes.forEach((el) => {
        // coba hapus, kalau gagal (mis. dibikin ulang), sembunyikan paksa
        try {
          el.remove();
        } catch {
          el.style.setProperty("display", "none", "important");
          el.style.setProperty("visibility", "hidden", "important");
          el.style.setProperty("opacity", "0", "important");
          el.style.setProperty("height", "0px", "important");
          el.style.setProperty("pointer-events", "none", "important");
        }
      });
    };

    // jalankan saat load pertama
    hideUwaw();

    // pantau DOM—kalau widget muncul lagi, langsung sembunyikan
    const observer = new MutationObserver(() => hideUwaw());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
