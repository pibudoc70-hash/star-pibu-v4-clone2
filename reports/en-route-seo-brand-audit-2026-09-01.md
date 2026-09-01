# English Route SEO Brand Audit

**Date:** 2026-09-01  
**Scope:** Canonical `/en` URLs listed in the public global sitemap; `<title>`, Open Graph, Twitter metadata, and JSON-LD brand values only.

## Public baseline

The public `https://star-pibu.com/sitemap-global.xml` listed **83** canonical English URLs. A read-only crawl found HTTP 200 for all 83 URLs. In their current raw HTML, 76 URLs contained JSON-LD, 75 contained the legacy display spelling `Star Dermatology`, and 21 also contained `STAR Dermatology`. The inconsistency is source-owned: English site-name constants, client route metadata, route prerenderers, and DB-first equipment SEO fields currently do not share one casing policy.

| Route family | Raw owner / current signal | Safe scope in this task |
|---|---|---|
| `/en` | `homePrerender.ts`, then client `LandingEN.tsx` | Normalize the brand casing in home metadata/schema source |
| `/en/about` | `aboutPrerender.ts`, then client `About.tsx` | Normalize the same title/description/keyword brand casing in both owners |
| `/en/doctors` | `doctorsPrerender.ts` + `doctorsSeo.ts` | Normalize `SITE_NAME_LOCALIZED.en` and Doctors SEO copy; physician `worksFor.name` inherits this value |
| `/en/equipment3` | client `Equipment3.tsx` | Normalize static list title/description/site name |
| `/en/equipment3/:slug` | `equipmentPrerender.ts` + client `Equipment3Detail.tsx`; DB `seo*` values take precedence | Normalize code fallbacks and English display casing only; do not overwrite DB content |
| `/en/foreign-guide`, `/en/non-covered`, `/en/research` | client route `SeoHead` | Normalize source-owned English SEO strings and shared default `og:site_name` behavior |
| `/en/privacy` | noindex Korean-original policy | Explicitly excluded: it is intentionally non-canonical/non-indexable for English SEO |

## Important boundary

Several currently published English equipment-detail raw titles and OG titles are Korean because non-empty `equipment3.seoTitle`, `seoDescription`, and `seoKeywords` database fields intentionally override code fallbacks. These are **data-owned translation quality issues**, not an appropriate reason to overwrite customer/admin data in a brand-casing patch. The present change may normalize an existing English `Star Dermatology` occurrence at rendering time but must not invent English equipment metadata or change medical claims.

Raw HTML for some non-prerendered English routes still begins from the Korean static shell before browser hydration. That is a separate SSR/prerender coverage concern, not a casing change. This task preserves the current rendering architecture and updates the source-owned metadata that the existing client and prerender paths emit.

## Development render check

After client hydration, the actual `/en` document title rendered as `STAR Dermatology Busan | Ultherapy · Thermage FLX · Under-Eye Fat Repositioning | Seomyeon`, and the visible English home render completed normally. The head source contract now gives the locale-specific `og:site_name` and shared MedicalBusiness/WebSite schema the same `STAR Dermatology Busan` value. Existing Korean body copy that appears in data-driven cards or research links was not rewritten in this metadata casing task.

## Applied source-owned correction

The English display policy is now **`STAR Dermatology`** and the English localized site name is **`STAR Dermatology Busan`**. The correction was applied to English client metadata sources, home/about/doctors/equipment raw prerender output, shared OG `site_name`, clinic/provider schema values, and title/description/keyword fallbacks. Existing non-empty DB metadata retains its content priority, but only the exact brand phrase is case-normalized in English crawler/hydrated metadata output.

For equipment detail JSON-LD, the same narrow normalization is applied to the serialised MedicalProcedure and FAQ fields. This corrects source/DB strings such as `Star Dermatology's` to `STAR Dermatology's` in structured data while deliberately leaving crawler body text and database values unchanged. No medical claim, treatment name, price, canonical, hreflang, JSON-LD type, booking, or route was changed.

## Final verification

| Check | Result |
|---|---|
| Production build | Passed |
| TypeScript check | Passed |
| ESLint | 0 errors; 106 pre-existing warnings |
| Focused SEO regression tests | 196 passed across 7 files |
| Full unit suite | 220 files, 1,964 tests passed |
| Local production raw audit | 83/83 English sitemap routes fetched; 0 legacy `Star Dermatology` values in raw `<head>`/JSON-LD; all 83 had `og:site_name = STAR Dermatology Busan` |
| Hydrated `/en` home | English title and visible render confirmed without runtime error |

The 83-route audit isolates the requested brand-casing contract. It intentionally does not classify Korean fallback titles or the absence of per-route server prerender on unrelated English route families as a brand-casing defect. Those are separate SEO localization/SSR coverage decisions and require their own scope because they can change indexing-facing content rather than a verified typographic brand correction.
