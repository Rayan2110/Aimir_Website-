"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Lit le chemin courant et le transmet au parent. Isolé (et placé dans un
 * <Suspense>) pour que l'en-tête reste prérendu sur les routes à paramètres.
 */
export function RouteSync({ onChange }: { onChange: (path: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange(pathname);
  }, [pathname, onChange]);
  return null;
}
