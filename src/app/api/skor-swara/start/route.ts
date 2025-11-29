import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { run, queryOne, query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface StartSessionBody {
  mode_id: number;
  skor_swara_topic_id?: number | null;
  image_id?: number | null;
  custom_topic?: string | null;
  custom_keyword?: string | null;
}

type ModeInfo = { mode_id: number; mode_name: string; mode_type: "text" | "image" | "custom" };

function getModeInfo(modeId: number): ModeInfo {
  if (modeId === 2) return { mode_id: 2, mode_name: "Latihan Gambar", mode_type: "image" };
  if (modeId === 3) return { mode_id: 3, mode_name: "Topik Kustom", mode_type: "custom" };
  return { mode_id: 1, mode_name: "Latihan Teks", mode_type: "text" };
}

async function resolveTopic(topicId?: number | null, customTopic?: string | null) {
  if (customTopic && customTopic.trim().length > 0) {
    return { id: null, topic: customTopic.trim() };
  }

  if (topicId) {
    try {
      const row = await queryOne<any>(
        `SELECT skor_swara_topic_id, 
                COALESCE(topic, name, title) AS topic
         FROM skor_swara_topics
         WHERE skor_swara_topic_id = ?
         LIMIT 1`,
        [topicId]
      );
      if (row?.topic) {
        return { id: Number(row.skor_swara_topic_id), topic: String(row.topic) };
      }
    } catch (e: any) {
      console.error("Error fetching topic:", e);
    }
  }

  return { id: null, topic: "Alam Semesta" };
}

async function resolveImage(topicName?: string | null, imageId?: number | null) {
  console.log("🔍 Resolving image - topicName:", topicName, "imageId:", imageId);

  // Priority 1: Jika imageId diberikan langsung
  if (imageId) {
    try {
      const row = await queryOne<any>(
        `SELECT image_id, image_url, image_keyword, image_topic
         FROM skor_swara_images
         WHERE image_id = ? AND is_active = 1
         LIMIT 1`,
        [imageId]
      );
      
      if (row?.image_url) {
        console.log("✅ Found by imageId:", row);
        return {
          image_id: Number(row.image_id),
          image_url: String(row.image_url),
          image_keyword: row.image_keyword || null,
        };
      }
    } catch (e: any) {
      console.error("❌ Error by imageId:", e.message);
    }
  }

  // Priority 2: Cari berdasarkan image_topic (nama topik) - RANDOM
  if (topicName) {
    try {
      const row = await queryOne<any>(
        `SELECT image_id, image_url, image_keyword, image_topic
         FROM skor_swara_images
         WHERE image_topic LIKE ? AND is_active = 1
         ORDER BY RAND()
         LIMIT 1`,
        [`%${topicName}%`]
      );
      
      if (row?.image_url) {
        console.log("✅ Found by topic name:", row);
        return {
          image_id: Number(row.image_id),
          image_url: String(row.image_url),
          image_keyword: row.image_keyword || null,
        };
      }
    } catch (e: any) {
      console.error("❌ Error by topic name:", e.message);
    }
  }

  // Priority 3: Ambil gambar aktif random
  try {
    const row = await queryOne<any>(
      `SELECT image_id, image_url, image_keyword, image_topic
       FROM skor_swara_images
       WHERE is_active = 1
       ORDER BY RAND()
       LIMIT 1`
    );
    
    if (row?.image_url) {
      console.log("✅ Found fallback image:", row);
      return {
        image_id: Number(row.image_id),
        image_url: String(row.image_url),
        image_keyword: row.image_keyword || null,
      };
    }
  } catch (e: any) {
    console.error("❌ Error fallback:", e.message);
  }

  // Hardcoded fallback
  console.warn("⚠️ Using hardcoded fallback");
  return {
    image_id: 1,
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    image_keyword: "lingkungan, alam, kebersihan, sekitar, kepedulian",
  };
}

export async function POST(req: NextRequest) {
  console.log("=== START SESSION API CALLED ===");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("swara_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: StartSessionBody = await req.json();
    console.log("📥 Request body:", body);

    const modeId = Number(body.mode_id);
    if (!modeId || ![1, 2, 3].includes(modeId)) {
      return NextResponse.json(
        { success: false, message: `Mode tidak valid: ${modeId}` },
        { status: 400 }
      );
    }

    const userId = 1; // TODO: dari token

    // Resolve topic
    const topicResolved = await resolveTopic(body.skor_swara_topic_id, body.custom_topic);
    console.log("📝 Topic:", topicResolved);

    // Resolve image untuk mode 2
    let imageResolved = null;
    if (modeId === 2) {
      // Pass nama topik untuk matching
      imageResolved = await resolveImage(topicResolved.topic, body.image_id);
      console.log("🖼️ Image:", imageResolved);
    }

    // Insert session
    const insert = await run(
      `INSERT INTO skor_swara (
        user_id,
        mode_id,
        image_id,
        skor_swara_topic_id,
        custom_topic,
        custom_keyword,
        point_earned,
        jeda,
        first_impression,
        ekspresi,
        gestur,
        kata_pengisi,
        kata_tidak_senonoh
      ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0)`,
      [
        userId,
        modeId,
        imageResolved ? imageResolved.image_id : null,
        topicResolved.id,
        body.custom_topic ?? null,
        body.custom_keyword ?? null,
      ]
    );

    const skorSwaraId = insert.insertId;
    const modeInfo = getModeInfo(modeId);

    console.log("✅ Session created:", skorSwaraId);

    const responseData: any = {
      skor_swara_id: skorSwaraId,
      mode: modeInfo,
      topic: {
        topic: topicResolved.topic,
        text: `Sampaikan presentasi Anda tentang: ${topicResolved.topic}`,
      },
    };

    if (modeInfo.mode_type === "image" && imageResolved) {
      responseData.image = imageResolved;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Latihan started successfully",
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("=== ERROR ===");
    console.error("Code:", error?.code);
    console.error("Message:", error?.message);

    return NextResponse.json(
      { 
        success: false, 
        message: error?.message || "Unknown error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

// INSERT INTO skor_swara_images 
//   (skor_swara_topic_id, image_url, image_keyword) 
// VALUES 
//   (1, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', 'alam, lingkungan'),
//   (2, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'pendidikan, belajar'),
//   (3, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'teknologi, masa depan');