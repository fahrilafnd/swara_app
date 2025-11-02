// middleware.ts (di ROOT proyek, bukan di /src)
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/masuk", "/daftar"];
const PRIVATE_PREFIX = ["/dashboard", "/admin", "/mentor"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // helper panggil /api/auth/me sambil meneruskan cookie
  const callMe = () =>
    fetch(new URL("/api/auth/me", req.url), {
      headers: { cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });

  // 1) Proteksi halaman privat
  if (PRIVATE_PREFIX.some((p) => pathname.startsWith(p))) {
    const meRes = await callMe().catch(() => null);
    let authed = false;

    if (meRes) {
      if (meRes.ok) {
        // baca flag success jika backend kadang tetap 200
        const j = await meRes
          .clone()
          .json()
          .catch(() => null);
        authed = j?.success !== false; // true jika tidak jelas gagal
      }
    }

    if (!authed) {
      const url = new URL("/masuk", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Batasi silang role (opsional, jika butuh)
    try {
      const meJson = await meRes!.clone().json();
      const role = meJson?.data?.role?.role_name ?? "user";
      if (pathname.startsWith("/admin") && role !== "admin")
        return NextResponse.redirect(new URL("/dashboard", req.url));
      if (pathname.startsWith("/mentor") && role !== "mentor")
        return NextResponse.redirect(new URL("/dashboard", req.url));
      if (pathname.startsWith("/dashboard") && role === "admin")
        return NextResponse.redirect(new URL("/admin", req.url));
      if (pathname.startsWith("/dashboard") && role === "mentor")
        return NextResponse.redirect(new URL("/mentor", req.url));
    } catch {}
    return NextResponse.next();
  }

  // 2) Blokir /masuk & /daftar bagi yang sudah login
  if (PUBLIC_PATHS.includes(pathname)) {
    const meRes = await callMe().catch(() => null);
    let authed = false;

    if (meRes?.ok) {
      const j = await meRes
        .clone()
        .json()
        .catch(() => null);
      authed = j?.success !== false;
    }

    if (authed) {
      const j = await meRes!
        .clone()
        .json()
        .catch(() => ({}));
      const role = j?.data?.role?.role_name ?? "user";
      const dest =
        role === "admin"
          ? "/admin"
          : role === "mentor"
          ? "/mentor"
          : "/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/mentor/:path*",
    "/masuk",
    "/daftar",
  ],
};
