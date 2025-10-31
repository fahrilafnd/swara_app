export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type ApiError = { message?: string; [k: string]: any };

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    // disable caching utk request auth
    cache: "no-store",
  });

  // coba parse json kalau ada
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err: ApiError = data ?? { message: res.statusText };
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return data as T;
}
