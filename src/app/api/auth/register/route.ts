const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://40d78b4d17e2.ngrok-free.app/api/swara";

export async function POST(req: Request) {
  const body = await req.json();
  const upstream = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
