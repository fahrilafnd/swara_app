// src/app/api/inspira/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.API_BASE ?? "https://swara-backend.onrender.com/api/swara";

export async function GET(req: NextRequest) {
  // ambil token user dari cookie hasil login
  const token = cookies().get("swara_token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthenticated: token tidak ada." },
      { status: 401 }
    );
  }

  // teruskan query ?category_id=... (kalau ada)
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");
  const qs = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : "";

  try {
    const upstream = await fetch(`${API_BASE}/inspira-swara${qs}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const ct = upstream.headers.get("content-type") || "application/json";
    const payload = ct.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    // teruskan status & body upstream (apa adanya)
    return new NextResponse(
      ct.includes("application/json") ? JSON.stringify(payload) : payload,
      { status: upstream.status, headers: { "Content-Type": ct } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: "Upstream error", error: String(e) },
      { status: 502 }
    );
  }
}
