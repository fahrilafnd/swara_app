// src/app/api/auth/logout/route.ts
export async function POST() {
  // hapus cookie
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie":
        "swara_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" +
        (process.env.NODE_ENV === "production" ? "; Secure" : ""),
    },
  });
}
