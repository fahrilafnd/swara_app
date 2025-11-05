// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const API_BASE =
  process.env.API_BASE ?? "https://swara-backend.onrender.com/api/swara";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    // Ambil payload upstream
    const payload = isJson ? await upstream.json() : await upstream.text();

    // Jika gagal login, teruskan status & payload upstream
    if (!upstream.ok) {
      return NextResponse.json(
        isJson ? payload : { success: false, message: String(payload) },
        { status: upstream.status }
      );
    }

    // Ambil token dari payload JSON
    const token: string | undefined = isJson
      ? payload?.data?.accessToken ||
        payload?.data?.token ||
        payload?.access_token
      : undefined;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan di response login." },
        { status: 502 }
      );
    }

    // Set cookie HttpOnly 7 hari
    const res = NextResponse.json(payload, { status: upstream.status });
    res.cookies.set("swara_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Upstream error saat login.",
        error: String(err?.message || err),
      },
      { status: 502 }
    );
  }
}
