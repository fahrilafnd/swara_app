// src/app/api/auth/register/route.ts
export const dynamic = "force-dynamic";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://swara-backend.onrender.com/api/swara";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1) daftar
    const reg = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const regText = await reg.text();
    if (!reg.ok) {
      return new Response(regText, {
        status: reg.status,
        headers: {
          "Content-Type": reg.headers.get("content-type") ?? "application/json",
        },
      });
    }

    // 2) login langsung (pakai email & password yang sama)
    const login = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });

    const text = await login.text();
    const contentType = login.headers.get("content-type") ?? "application/json";
    let headers: Record<string, string> = { "Content-Type": contentType };

    if (login.ok && contentType.includes("application/json")) {
      const parsed = JSON.parse(text);
      const token = parsed?.data?.accessToken as string | undefined;
      const role =
        (
          parsed?.data?.user?.role?.role_name as string | undefined
        )?.toLowerCase() ?? "user";

      if (token) {
        const oneWeek = 60 * 60 * 24 * 7;
        headers["Set-Cookie"] = [
          `swara_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${oneWeek}`,
          `swara_role=${role}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${oneWeek}`,
        ].join(", ");
      }

      return new Response(JSON.stringify(parsed), {
        status: login.status,
        headers,
      });
    }

    return new Response(text, { status: login.status, headers });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err?.message ?? "Register upstream error",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
