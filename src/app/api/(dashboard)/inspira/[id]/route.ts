import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.API_BASE ?? "https://swara-backend.onrender.com/api/swara";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = (await cookies()).get("swara_token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthenticated: token tidak ada." },
      { status: 401 }
    );
  }

  const id = params.id;
  try {
    const upstream = await fetch(`${API_BASE}/inspira-swara/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const contentType =
      upstream.headers.get("content-type") || "application/json";
    const payload = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    return new NextResponse(
      contentType.includes("application/json")
        ? JSON.stringify(payload)
        : payload,
      { status: upstream.status, headers: { "Content-Type": contentType } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: "Upstream error", error: String(e) },
      { status: 502 }
    );
  }
}
