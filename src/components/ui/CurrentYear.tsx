"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Année courante, lue côté navigateur (hors rendu statique). Valeur serveur : année de mise en ligne. */
export function CurrentYear({ fallback = 2026 }: { fallback?: number }) {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => fallback);
  return <>{year}</>;
}
