# AEO implementation evidence

## 2026-08-28 development preview hydration check

The development preview completed initial loading and rendered the live home content, including the managed hero image at `/manus-storage/hero-background-0000_d3dee03d.webp`. The next DOM inspection records the post-hydration JSON-LD script count and organization/website identity counts; this page-state note separates successful client rendering from production-only server prerender validation.

### DOM result

The hydrated preview had five JSON-LD objects in total: one organization object, one website object, and no `data-prerender="home-schema"` script. This confirms that the client keeps one copy of each shared entity after replacing server fallback markup.

## Development sitemap and asset checks

`GET http://127.0.0.1:3000/sitemap-global.xml` returned UTF-8 XML beginning with `<?xml version="1.0" encoding="UTF-8"?>` and contained 288 localized equipment detail URLs. These are 72 localization-complete active records across English, Japanese, Simplified Chinese, and Traditional Chinese. The public `https://star-pibu.com/favicon.png` response was `200 image/png`, and `https://star-pibu.com/manus-storage/hero-background-0000_d3dee03d.webp` was `200 image/webp`.

The detailed route count was independently checked per locale: English 72, Japanese 72, Simplified Chinese 72, and Traditional Chinese 72. The selection predicate requires a non-empty locale-specific name, description, and parsable FAQ JSON. It does not use Korean content as a fallback.
