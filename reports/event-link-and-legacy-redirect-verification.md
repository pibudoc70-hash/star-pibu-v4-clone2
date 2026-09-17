# SPECIAL EVENT link and legacy redirect verification

On 2026-09-17, full-page screenshot capture was attempted at desktop 1440×900 and mobile 390×844 for the local preview. Both captures failed before an image was produced, so no visual conclusion was drawn from them.

The focused test suite passed 81 of 81 tests. The complete unit suite passed 257 files and 2,136 tests. TypeScript, ESLint, and the production build also completed successfully.

Local HTTP requests to `/sub/sub_04_01.html`, `/sub/sub_04_02.html`, and `/sub/sub_04_03.html` each returned `301 Moved Permanently` with `Location: https://star-pibu.com/notice`.

The current-window link contract is covered for the desktop showcase card and the mobile expanded-thumbnail link. The mobile row remains an accordion control; only its expanded thumbnail carries the saved event URL.

The browser was then opened on the local homepage, where it initially showed the loading state. A controlled DOM inspection was attempted after a three-second wait, but the browser service reported `Browser not available` before returning DOM attributes. As a result, the browser-specific verification remains unavailable; the rendered-link behavior is verified by the component DOM regressions rather than an interactive browser session.
