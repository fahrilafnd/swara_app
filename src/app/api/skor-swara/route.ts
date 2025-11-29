import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface StartSessionBody {
  level: number;
  mode_id?: number;
  topic_id?: number | null;
  topic?: string | null;
  title?: string | null;
}

export async function POST(req: NextRequest) {
  console.log("=== SKOR SWARA WRAPPER API CALLED ===");
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("swara_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const body: StartSessionBody = await req.json();
    console.log("Request body:", body);

    const level = Number(body.level);
    if (!level || level < 1 || level > 5) {
      return NextResponse.json(
        { success: false, message: `Level tidak valid: ${level}. Harus 1-5` },
        { status: 400 }
      );
    }

    const userId = 1; // TODO: decode from token
    const modeId = body.mode_id ?? 1;
    const topicId = body.topic_id ?? null;
    const topic = body.topic ?? null;
    const title = body.title ?? topic ?? "Latihan Skor Swara";

    console.log("Inserting to database:", {
      userId,
      level,
      modeId,
      topicId,
      topic,
      title,
    });

    const result = await run(
      `INSERT INTO skor_swara (
        user_id, level, mode_id, topic_id, topic, title, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [userId, level, modeId, topicId, topic, title]
    );

    console.log("Insert successful:", result.insertId);

    return NextResponse.json({
      success: true,
      message: "Sesi latihan berhasil dimulai",
      data: {
        sessionId: result.insertId,
        level,
        mode_id: modeId,
        topic,
        title,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("=== ERROR IN SKOR SWARA WRAPPER ===");
    console.error("Error:", error);

    const code = error?.code;
    let msg = "Unknown error";
    let details = error?.message || "";

    if (code === "ER_NO_SUCH_TABLE") {
      msg = "Tabel skor_swara belum ada";
      details = "Jalankan POST /api/setup-db untuk membuat tabel.";
    } else if (code === "ER_BAD_FIELD_ERROR") {
      msg = "Kolom tabel tidak cocok";
      details = error?.sqlMessage || "Pastikan tabel sudah dibuat dengan benar.";
    } else if (code === "ECONNREFUSED") {
      msg = "Tidak dapat terhubung ke database";
      details = "Periksa konfigurasi database di .env";
    }

    return NextResponse.json(
      {
        success: false,
        message: msg,
        error: msg,
        code: code || "UNKNOWN",
        details: details,
      },
      { status: 500 }
    );
  }
}