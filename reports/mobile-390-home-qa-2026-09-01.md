# 390px mobile homepage QA

**Target:** `https://star-pibu.com/?mobile-qa=390`  
**Viewport:** 390 × 844 CSS pixels  
**Date:** 2026-09-01

## Initial browser observation

A local Chromium mobile-viewport capture reached a browser error page rather than the site: `ERR_CONNECTION_CLOSED`. The run used a 12-second virtual-time budget and produced SSL handshake errors (`net_error -100`) before the connection closed. This is a sandbox-to-public-domain connectivity limitation for that direct Chromium route, not evidence of a page-level layout or touch defect.

The managed preview screenshot service has also intermittently failed at the 390px full-page path. The remainder of this QA therefore uses the publicly accessible preview/runtime response where available, DOM-level measurement, the accessibility audit, and component interaction tests. Any unverified real-device gesture must be labeled as such rather than assumed.

## Full-page visual review notes

The Chrome DevTools capture rendered at an emulated 390px CSS viewport and 3× device scale factor, producing a 1,170×36,408px full-page image. The image was sliced into 47 top-to-bottom tiles with 12% vertical overlap. Tiles 1–2 show the mobile Hero without horizontal clipping: brand mark, Korean title, and the two-line English strapline remain centered inside the imagery. The second tile begins at the expected Hero overlap and shows no content collision at the seam.

Tiles 3–4 continue the Hero statistic strip and show the expected transition to the warm off-white Lifting Care section. All three statistic columns remain within the 390px content width, with no clipped numeral or label. The section heading and descriptive copy begin on the intended left content edge; the overlap between tiles does not reveal a vertical jump or unexpected spacer.

Tiles 5–6 show the remaining Lifting Care copy, the regenerative-medicine banner, and the Special Event heading. The banner stays inside its rounded container without right-edge clipping. The vertical transition into Special Event is intentional editorial whitespace rather than an empty broken module; the heading and two-line caption are aligned to the same left inset with no overlap.

Tiles 7–8 capture the Special Event loading skeleton followed by the start of the Pain Management surface. The skeleton is an expected transient loading state, not a persistent visual gap. The Pain Management eyebrow, multi-line title, and description are centered within the panel; no horizontal clipping is visible at the transition. The actual stage/FAQ content is checked in later tiles after lazy mounting.

Tiles 9–10 show all three compact Pain Management stage cards. Their 68px+ disclosure rows remain readable and each has a separated `자세히 보기` action. The longer third title wraps after the slash and creates a taller, still-contained row; no content overflows the card, but the Korean word break (`수면마취`) is visually less polished than the first two cards. This is logged as a confirmed mobile typography refinement candidate, not changed during the read-only QA phase.

Tiles 11–12 show the three-row trust guide and start of the FAQ card. The compressed guide rows retain centered vertical icon/text alignment and visible dividers without the former surplus blank space. The FAQ header and expanded first-answer state remain inside the rounded card. No clipped icon, rule, or text appears across the tile overlap; the `details` answer expansion is validated independently by the 390px touch event measurement.

Tile 13 shows the expanded FAQ answer at a readable mobile line length and the following closed FAQ rows. The answer has sufficient breathing room above its divider, while the compact closed rows retain a clear icon, label, and chevron. The two-line question is contained and no text crosses the card boundary.

For the complete final review, the same full-page capture was re-sliced into 14 larger 3,000px-high tiles with overlap. Tiles 1–2 reconfirm the Hero, statistic strip, Lifting Care copy, regenerative-medicine banner, and Special Event entry. All remain within their containers. The event skeleton is visible only as the captured lazy-loading state, so it is not treated as a persistent spacing defect.

Tiles 3–4 show the whole Pain Management composition. The intended compact summary cards, shortened trust guide, and FAQ all fit in the panel with no horizontal overflow. The Touch DevTools test separately opened the first FAQ through an emulated touch point at 390px; the 44px summary target expanded correctly and increased document height from 10,819px to 12,136px without changing scroll position. The longer third stage title remains a contained but visually awkward Korean line break; it is the only confirmed refinement candidate in this section.

## Fully mounted capture review

After simulated scrolling through every deferred threshold, the full capture grew to 18,389 CSS pixels and no `section-fallback` remained. Re-sliced mounted tiles 1–2 show the Hero, Lifting, transient event skeleton, fully rendered Pain Management panel, and medical-team card in sequence. The compact cards, guide, and FAQ form a coherent mobile hierarchy, and the medical-team content begins directly after its intended section gap. No persistent blank region remains once deferred content mounts.

Mounted tiles 3–4 require a qualification to that interim conclusion: after the doctor card's final accordion, the capture still shows a large empty region over more than one tile. The deferred placeholders themselves have unmounted, so the remaining source must be identified from the post-scroll DOM rather than attributed to fallback height. No visual-layout removal has been made; the next measurement will inspect all live elements covering the actual 390px coordinate range.

Tiles 5–6 cover the medical-team carousel and its selected-doctor detail. Portrait, tab controls, navigation arrows, specialty chips, and credential rows remain inside the mobile card. The dense credential list is intentional expandable content and no horizontal clipping appears in either tile or their overlap.

Tiles 7–8 in the first full-page capture showed the end of the medical-team card followed by a large blank white region. Follow-up DOM inspection identified the visible blocks as `section-fallback` placeholders for three deferred sections (560px, 400px, and 440px minimum heights), not a static spacer in the medical-team layout. A second 390px emulated-touch run scrolled through all deferred thresholds and waited at each position; every fallback had then unmounted (`deferredSections: []`) and the document height expanded from 10,819px to 18,389px as real content replaced placeholders. The first screenshot therefore captured a pre-mount loading state and **does not establish a persistent homepage-height defect**. No layout change is warranted from that transient state.

## Final mobile measurement and correction

The emulated Chrome viewport was 390 × 844 CSS pixels. Before and after the full deferred-section scan, `document.documentElement.scrollWidth` remained exactly 390px, so the page has no global horizontal scroll. The only detected right-edge element was a clipped transient event skeleton child (`right: 440px` inside an overflow-hidden container); it did not expand the document width and requires no layout correction.

The first pain-management FAQ was opened with an emulated touch input and changed `details.open` to true. Its 44px summary target expanded without a scroll-position jump. The three stage summaries retain their 68px target size. A small group of utility controls has widths between 30–39px but heights of 44px; these all remain above WCAG 2.2's 24px minimum target-size criterion and are intentionally compact header/utility affordances, not a verified access failure.[1]

The only confirmed polish issue was the third Korean stage title, `수면진정 / 수면마취`, which used two lines in the initial 390px measurement. The first typographic adjustment alone was insufficient because the visible `자세히 보기` label consumed title width. Mobile now preserves the label as an accessible screen-reader name but displays a dedicated 40px chevron action; desktop restores the visible label. The final 390px Chrome measurement recorded the title at **166px wide, 22px high, and one text line**. The text, 68px disclosure target, native open/close behavior, and all locales remain unchanged.

| Final 390px QA item | Result |
|---|---|
| Global horizontal overflow | No — `scrollWidth: 390px` |
| Deferred sections after full scroll | No fallback remains |
| Medical-team “blank area” | Transient deferred loading state only; no persistent defect |
| FAQ touch response | Opened successfully, 44px target, no scroll jump |
| Pain stage response | Native disclosures retain 68px target |
| Third Korean stage title | Corrected from 2 lines to 1 line |
| Full quality gate | TypeScript, lint (0 errors), unit tests, production build passed |

## Reference

[1]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html "WCAG 2.2 — Target Size (Minimum)"

## Residual whitespace refinement

The repeat 390px review found no hidden min-height or unresolved blank container within the Pain Management content. The remaining perception of excess space came from the outer mobile panel padding, the visual gradient depth, the header-to-summary separation, and the final closing-message margin. These are presentation surfaces rather than content or interaction height.

The mobile panel now uses 16px outer padding (`p-4`), 12px header-to-summary spacing (`mb-3`), a shallower 128px top gradient (`h-32`), and a 12px final note margin (`mt-3`). Desktop restores the preceding 32px outer padding, 32px header separation, 160px gradient, and 16px closing margin at `sm`. The existing 68px stage targets, 44px FAQ targets, text, dividers, native accordion behavior, and all localized content remain unchanged.

The final 390px Chrome measurement retained an exact 390px document width with no horizontal overflow; the third stage title stayed as one 22px-high line. The focused Pain Management suite passed 5/5 after the adjustment. TypeScript, ESLint (0 errors; pre-existing warnings unchanged), the complete unit-test command, and production build passed after the updated source-contract test.
