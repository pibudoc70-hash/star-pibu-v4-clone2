/**
 * TreatmentRedirect.tsx
 *
 * PURPOSE:
 *   Handles the legacy /treatment/:name route and navigates to the canonical
 *   /treatments/:slug URL when a slug mapping exists.
 *
 * REDIRECT LOGIC:
 *   - If NAME_TO_SLUG[name] exists → SPA navigation to /treatments/:slug (replace history)
 *   - If no slug mapping found → SPA navigation to /404 (replace history)
 *
 * NOTE: This is a client-side SPA route replacement (wouter navigate + replace: true),
 * NOT an HTTP 301 redirect. The browser history entry is replaced so the user
 * cannot navigate back to the legacy /treatment/:name URL within the session.
 * For true HTTP-level permanent redirects, a server-side rule (e.g., nginx, CDN)
 * would be required — not currently configured.
 *
 * This component replaces TreatmentDetail as the handler for /treatment/:name.
 * TreatmentDetail.tsx is kept as a reference but is no longer routed.
 *
 * PR-33: Implements Step 2 of the treatment consolidation plan.
 */

import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";

/**
 * Mapping from legacy treatment name (URL-decoded) to canonical slug.
 * Must stay in sync with TreatmentDetail.tsx NAME_TO_SLUG.
 */
const NAME_TO_SLUG: Record<string, string> = {
  // Original 3 (PR-31)
  "울쎄라": "ulthera-classic",
  "울쎄라피 프라임": "ulthera",
  "써마지 FLX": "thermage",
  "눈밑지방재배치": "under-eye-fat",
  // New 4 (PR-32)
  "피코레이저": "pico-laser",
  "루비피코레이저": "ruby-pico-laser",
  "안면홍조 치료": "rosacea",
};

export default function TreatmentRedirect() {
  const [, params] = useRoute("/treatment/:name");
  const [, navigate] = useLocation();

  useEffect(() => {
    const rawName = params?.name ?? "";
    const decodedName = decodeURIComponent(rawName);
    const slug = NAME_TO_SLUG[decodedName];

    if (slug) {
      // SPA route replacement → canonical TreatmentPage URL (history entry replaced)
      navigate(`/treatments/${slug}`, { replace: true });
    } else {
      // Unknown treatment name → 404
      navigate("/404", { replace: true });
    }
  }, [params?.name, navigate]);

  // Render nothing while navigation is in progress
  return null;
}
