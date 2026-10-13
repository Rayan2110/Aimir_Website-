import { twMerge } from "tailwind-merge";

/** Concatène des classes et résout les conflits Tailwind (la dernière l'emporte). */
export function cn(...parts: (string | false | null | undefined)[]) {
  return twMerge(parts.filter(Boolean).join(" "));
}
