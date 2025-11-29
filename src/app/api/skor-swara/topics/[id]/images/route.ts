import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Row {
  image_id: number | string;
  image_url: string;
  title?: string | null;
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
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const topicId = Number(params.id);
    if (!topicId) {
      return NextResponse.json(
        { success: false, message: "topic id tidak valid" },
        { status: 400 }
      );
    }

    let rows: Row[] = [];

    try {
      // Skema yang disarankan:
      // tabel: skor_swara_images(image_id PK, skor_swara_topic_id, image_url, title)
      rows = await query<Row[]>(
        `SELECT image_id, image_url, title
         FROM skor_swara_images
         WHERE skor_swara_topic_id = ?
         ORDER BY RAND()
         LIMIT 30`,
        [topicId]
      );
    } catch (e: any) {
      // Fallback jika tabel berbeda (misal 'images' dengan kolom id, url, topic_id)
      if (e?.code === "ER_NO_SUCH_TABLE") {
        rows = await query<Row[]>(
          `SELECT id AS image_id, url AS image_url, title
           FROM images
           WHERE topic_id = ?
           ORDER BY RAND()
           LIMIT 30`,
          [topicId]
        );
      } else {
        throw e;
      }
    }

    return NextResponse.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil images",
        code: error?.code || "UNKNOWN",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}