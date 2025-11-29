import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export const dynamic = "force-dynamic";

interface DetailRow extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  topic: string;
  mode_id: number;
  score: number;
  tempo: number;
  artikulasi: number;
  kontak_mata: number;
  kesesuaian_topik: number;
  struktur: number;
  duration: number;
  status: string;
  feedback: string;
  transcript: string;
  video_url: string;
  created_at: Date;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("swara_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const { id } = params;
    console.log("Fetching detail for ID:", id);

    // Query database - UPDATED: skor_swara bukan skor_swara_sessions
    const result = await queryOne<DetailRow>(
      `SELECT 
        id,
        user_id,
        title,
        topic,
        mode_id,
        score,
        tempo,
        artikulasi,
        kontak_mata,
        kesesuaian_topik,
        struktur,
        duration,
        status,
        feedback,
        transcript,
        video_url,
        created_at
      FROM skor_swara
      WHERE id = ?`,
      [id]
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        title: result.title,
        topic: result.topic,
        mode_id: result.mode_id,
        score: result.score,
        tempo: result.tempo,
        artikulasi: result.artikulasi,
        kontak_mata: result.kontak_mata,
        kesesuaian_topik: result.kesesuaian_topik,
        struktur: result.struktur,
        duration: result.duration,
        status: result.status,
        feedback: result.feedback,
        transcript: result.transcript,
        video_url: result.video_url,
        date: result.created_at,
      },
    });
  } catch (error: any) {
    console.error("Error fetching detail:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error?.message || "Unknown error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}