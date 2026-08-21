# P2-7 Unused UI Audit — 2026-08-21

## Scope and boundary

This is a **read-only evidence audit** of non-reservation UI code. It does not delete, rename, route, or refactor any component. Reservation, OTP, external booking CTAs, database code, migrations, and frozen global layout components are excluded.

## Evidence summary

| Candidate | Static evidence | Decision |
|---|---|---|
| `client/src/pages/Events.tsx` | `client/src/routes.ts` marks `Events` as `dormant`; no import or route registration was found in `App.tsx`. `EventDetail` and event-data ownership remain independently live. | **Keep / no deletion.** Route activation requires separate Header and SEO review. |
| `client/src/pages/Facilities.tsx` | `client/src/routes.ts` marks `Facilities` as `dormant`; no import or route registration was found in `App.tsx`. | **Keep / no deletion.** Route activation requires separate Header review. |
| `client/src/components/EventsSection.tsx` | Its shared data source is referenced by `EventDetail`; the component itself has legacy identifiers. Static import evidence alone does not prove runtime absence across lazy/route boundaries. | **Keep / no deletion.** Requires browser DOM evidence and product decision. |
| `client/src/components/ScrollAnimationWrapper.tsx` | Imported and rendered repeatedly by `Home.tsx`. Deprecated props do not make the component unused. | **Live. No action.** |
| `client/src/components/TreatmentsSection.tsx` | `Home.tsx` documents section consolidation; static evidence is insufficient to distinguish a dormant compatibility module from a dynamic import path. | **Keep / no deletion.** |
| `client/src/pages/Reserve.tsx` | Marked legacy and non-routed, but it belongs to the explicitly frozen reservation scope. | **Excluded. No action.** |

## Conclusion

No candidate has both the required **static import/route evidence** and runtime DOM evidence for safe removal. P2-7 therefore makes **no production code change**. A later, separate activation/removal decision must include route ownership, Header navigation, SEO redirects, and browser DOM evidence.
