# Home initial JavaScript dependency remediation

**Date:** 2026-09-01  
**Scope:** Korean home initial JavaScript request graph, lazy route boundaries, bundle budget, and mobile lab measurement  
**Author:** Manus AI

## Conclusion

The Korean Home did not have a source-level static import from `Home.tsx` to `LandingEN/JA/ZH` or `treatments-data.ts`. The actual bridge was Rollup's previous `manualChunks` behavior: forcing `Landing*` into `page-landings` and admin routes into `page-admin` also pulled their transitive shared dependencies into those chunks. The entry artifact then had static imports to both chunks, so the Home request graph still reached them even after their `modulepreload` hints were stripped.

The safe correction is to remove those two page-level manual chunk rules and preserve route-level `React.lazy` imports. This returns Landing and admin entries to Rollup/Vite's automatic dynamic splitting and leaves the Home entry with only its direct shared UI/runtime chunks. The final artifact has no `page-landings` chunk, no `page-admin` static import, and no static `data-treatments` import.

| Metric / dependency fact | Before correction | Final build | Interpretation |
|---|---:|---:|---|
| Home entry static import | `page-landings` present | absent | `/`, `/en`, `/ja`, `/zh` route boundary restored |
| `page-landings` artifact | 742,725 raw bytes | not emitted | shared Landing dependency aggregation removed |
| Home entry static import | `page-admin` present | absent | Admin lazy route is not initial Home JS |
| `data-treatments` static import from entry | present while manual data rule was trialled | absent | no initial static treatment-data payload |
| Final initial JS gzip (entry + modulepreload) | historical waterfall included page-level chunks | 319,318 bytes across 5 files | budgeted at 325 KiB (332,800 bytes) |
| Rollup circular warnings | manual chunk experiment produced 7 warnings | 0 | final configuration does not use the cycle-inducing workaround |

## Source and data-boundary decision

The 1,969-line `treatments-data.ts` is a legacy static data leaf. The active Korean `TreatmentsEquipmentSection` explicitly uses DB-backed `equipment3` data and does not import it. Its remaining runtime import is confined to `useStaticTreatmentFilter.ts`, while the active Home reaches neither that hook nor the data file as a value dependency. In the final build Rollup tree-shakes the unused legacy source, so no `data-treatments` artifact exists to “restore.” Creating a forced empty or artificial chunk, or extracting types/constants merely to manufacture a cycle, would add complexity without reducing Home work; it was correctly not applied.

> Rollup documents that manual chunks can pull a matched module's dependencies into the manual chunk, which is the behavior observed here. The final configuration relies on automatic splitting for lazy route entries instead of assigning route modules to a page-wide manual chunk.[1]

## Regression prevention

`.size-limit.json` now expresses the measured Home entry plus actual HTML `modulepreload` assets and sets a 325 KiB gzip limit. The new `scripts/check-home-initial-budget.mjs` parses the final HTML, sums gzip bytes, fails if `page-landings` or `data-treatments` leaks into initial HTML, and fails if the entry statically imports either deferred chunk. It also fails above the numeric budget. `pnpm test:size` runs this check after `pnpm build` in the GitHub Actions build job. The test suite additionally locks the absence of the page-level manual chunk rules.

## Validation

| Validation | Result |
|---|---|
| Final production build | passed |
| Rollup circular chunk warnings | 0 |
| `pnpm test:size` | passed: 319,318 bytes / 332,800-byte budget |
| TypeScript | passed |
| ESLint | 0 errors; 106 existing warnings |
| `pnpm test:unit` | 222 files, 1,968 tests passed |
| Mobile Lighthouse (single local HTTPS lab run) | TBT 2,168 ms; interactive 6.9 s; 0 page-landings/data-treatments requests |

The reported prior measurement (TBT 2,080 ms and TTI 14.5 s) came from a different run/environment, so it cannot be treated as a direct numerical baseline for a one-run local Lighthouse comparison. The final lab run proves the requested dependency chain is absent and reports an interactive value of 6.9 s, but its TBT is not lower than the user-provided 2,080 ms. Therefore this patch is a verified request-graph and transfer regression fix, **not** a claim that it alone lowered field TBT. The remaining TBT work is likely main-thread execution in the shared Home entry and should be profiled separately rather than expanding this route-boundary patch.

The managed screenshot service failed for the 390px capture. Automated build inspection, the static import assertions, final Lighthouse network data, and the complete unit suite were used instead. No route paths, locale URLs, Home/landing page JSX, data content, booking, OTP, or external reservation behavior changed.

## Reference

[1]: https://rollupjs.org/configuration-options/#output-manualchunks "Rollup — output.manualChunks"
