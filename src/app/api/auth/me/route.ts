// src/app/api/auth/me/route.ts
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = /(?:^|;\s*)swara_token=([^;]+)/.exec(cookie)?.[1];

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
  const upstream = await fetch(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await upstream.text();
  const contentType =
    upstream.headers.get("content-type") || "application/json";
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}
