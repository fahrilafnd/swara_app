// src/app/api/auth/login/route.ts
export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://swara-backend.onrender.com/api/swara";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstream.text();
    const contentType =
      upstream.headers.get("content-type") ?? "application/json";

    let headers: Record<string, string> = { "Content-Type": contentType };

    if (upstream.ok && contentType.includes("application/json")) {
      const parsed = JSON.parse(text);
      const token: string | undefined = parsed?.data?.accessToken;

      // cookie 1 minggu
      if (token) {
        const oneWeek = 60 * 60 * 24 * 7;
        const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
        headers[
          "Set-Cookie"
        ] = `swara_token=${token}; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=${oneWeek}`;
      }

      return new Response(JSON.stringify(parsed), {
        status: upstream.status,
        headers,
      });
    }

    // non-JSON: teruskan apa adanya
    return new Response(text, { status: upstream.status, headers });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message ?? "Upstream error saat login.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
