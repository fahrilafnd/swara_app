import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitScoreBody = {
  point_earned: number;
  mode_id: number; // 1=text, 2=topik+gambar, 3=text custom
  // optional relations
  user_id?: number | null; // biasanya diambil dari token, boleh tidak dikirim
  image_id?: number | null;
  skor_swara_topic_id?: number | null;
  // custom
  custom_topic?: string | null;
  custom_keyword?: string | null;
  // metrics
  tempo?: number | null;
  artikulasi?: number | null;
  kontak_mata?: number | null;
  kesesuaian_topik?: number | null;
  struktur?: number | null;
  jeda?: number | null;
  first_impression?: number | null;
  ekspresi?: number | null;
  gestur?: number | null;
  kata_pengisi?: number | null;
  kata_tidak_senonoh?: number | null;
};

const toInt = (v: any) =>
  v === null || v === undefined || v === "" ? null : Number.parseInt(String(v), 10);
const toNum = (v: any) =>
  v === null || v === undefined || v === "" ? null : Number.parseFloat(String(v));

export async function POST(req: NextRequest) {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ??
      "https://swara-backend.onrender.com/api/swara";
    const url = `${apiBase}/skor-swara/submit`;

    const bodyIn = await req.json();

    // Normalisasi payload sesuai kolom DB
    const payload: SubmitScoreBody = {
      point_earned: Number(
        bodyIn.point_earned ??
          bodyIn.total_score ??
          bodyIn.score ??
          0
      ),
      mode_id: Number(bodyIn.mode_id), // wajib 1/2/3
      user_id: toInt(bodyIn.user_id) ?? null, // opsional
      image_id: toInt(bodyIn.image_id),
      skor_swara_topic_id: toInt(bodyIn.skor_swara_topic_id),
      custom_topic: bodyIn.custom_topic ?? null,
      custom_keyword: bodyIn.custom_keyword ?? null,

      tempo: toNum(bodyIn.tempo),
      artikulasi: toNum(bodyIn.artikulasi),
      kontak_mata: toNum(bodyIn.kontak_mata),
      kesesuaian_topik: toNum(bodyIn.kesesuaian_topik),
      struktur: toNum(bodyIn.struktur),
      jeda: toNum(bodyIn.jeda),
      first_impression: toNum(bodyIn.first_impression),
      ekspresi: toNum(bodyIn.ekspresi),
      gestur: toNum(bodyIn.gestur),
      kata_pengisi: toNum(bodyIn.kata_pengisi),
      kata_tidak_senonoh: toNum(bodyIn.kata_tidak_senonoh),
    };

    const cookieStore = await cookies();
    const token = cookieStore.get("swara_token")?.value;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: data?.message || "Submit score failed", error: data },
        { status: res.status }
      );
    }
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}