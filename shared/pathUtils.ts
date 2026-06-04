/**
 * shared/pathUtils.ts
 *
 * Locale resolver utility for Header and Footer navigation.
 *
 * POLICY
 * ──────
 * Given the current pathname, return the logical locale base path:
 *   /en  → "/en"
 *   /ja  → "/ja"
 *   /zh  → "/zh"
 *   /foreign-guide (and sub-paths) → "/en"  ← alias for English
 *   anything else  → "/"  (Korean, the default locale)
 *
 * This single function is the source of truth for locale detection used
 * by both Header and Footer so that /foreign-guide is always treated as
 * an English-context page in navigation.
 *
 * Usage:
 *   import { getLocaleBase } from "@/../../shared/pathUtils";
 *   const base = getLocaleBase(window.location.pathname); // "/en"
 *   const href = base === "/" ? "/about" : `${base}/about`; // "/en/about"
 *
 * NOTE: buildPath() was removed in PR-45 — it was defined but never called.
 *   To build a locale-aware path inline: base === "/" ? href : `${base}${href}`
 */

export type LocaleBase = "/" | "/en" | "/ja" | "/zh";

/**
 * Returns the logical locale base path for the given pathname.
 * Safe to call in both browser and SSR contexts.
 *
 * Callers: Header.tsx (buildLocalizedPath), Footer.tsx (getLocalizedPath)
 */
export function getLocaleBase(pathname: string): LocaleBase {
  if (pathname.startsWith("/en")) return "/en";
  if (pathname.startsWith("/ja")) return "/ja";
  if (pathname.startsWith("/zh")) return "/zh";
  // /foreign-guide is an alias for /en/foreign-guide (English-only content).
  // Treat it as /en context so that all Header/Footer links stay in English.
  if (pathname === "/foreign-guide" || pathname.startsWith("/foreign-guide/")) return "/en";
  return "/";
}

