// src/lib/auth.ts
export type Role = "admin" | "user" | "mentor";

export const homeByRole: Record<Role, string> = {
  admin: "/admin",
  user: "/dashboard",
  mentor: "/mentor",
};

export const isAllowed = (role: Role, pathname: string) => {
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/mentor")) return role === "mentor";
  if (pathname.startsWith("/dashboard")) return role === "user";
  return true;
};
