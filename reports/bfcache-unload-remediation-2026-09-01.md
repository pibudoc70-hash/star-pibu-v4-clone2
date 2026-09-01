# bfcache unload listener remediation

**Date:** 2026-09-01  
**Scope:** main-frame bfcache eligibility for the homepage and production response headers  
**Author:** Manus AI

## Conclusion

The actionable blocker was the development-only Manus debug collector. It registered a main-frame `beforeunload` listener solely to flush diagnostic logs. The production public HTML and production build did not load that collector; nevertheless, changing it to `pagehide` removes the Lighthouse failure in the managed preview and eliminates a future release risk. The production response now also carries `Permissions-Policy: unload=()` to prevent first- or third-party scripts from registering an `unload` handler.

| Surface | Before | After | Result |
|---|---|---|---|
| Development preview | Debug collector registered `beforeunload` and sent its final diagnostic batch through `navigator.sendBeacon()` | Same sendBeacon payload on `pagehide` | No bfcache-blocking listener |
| Production HTML / build | Debug collector absent; no `beforeunload` string found | Remains absent | Debug tooling is not shipped to production HTML |
| Production security header | No unload-specific Permissions Policy | `unload=()` added to the existing Permissions-Policy | Future unload registration is blocked at the document-policy level |
| Existing anonymous Web Vitals | Already used `pagehide` and `visibilitychange` | Unchanged | bfcache-safe lifecycle pattern preserved |
| Service worker / bootstrap / analytics loader | No unload or beforeunload registration found | Unchanged | No unsupported rewrite made |

## Root cause and measured result

The Vite development-only debug plugin injects `/__manus__/debug-collector.js` only during development. The collector previously registered `window.addEventListener("beforeunload", ...)` at its final diagnostic-log flush. This explains the reported `UnloadHandlerExistsInMainFrame` on the managed development preview URL. A direct inspection confirmed one collector injection in development, and the served collector had one `beforeunload` occurrence. The public `https://star-pibu.com/` response and production build HTML both contained zero debug-collector references and zero `beforeunload` occurrences.

The collector now listens to `pagehide` and retains its existing `navigator.sendBeacon()` delivery. `pagehide` does not itself make a document ineligible for bfcache, and `visibilitychange` is already used by the Web Vitals module for end-of-visibility reporting.[1] [2]

Local production Lighthouse ran the actual back/forward cache restoration test and returned a binary `bf-cache` score of **1** with the title **“Page didn't prevent back/forward cache restoration.”** The production response also confirmed `Permissions-Policy: ... unload=()`. This audit exercises the browser-managed back/forward navigation path; no application reload, session rewrite, authentication logic, or manual scroll restoration code was changed.

## Regression protection

`client/public/debugCollector.bfcache.test.ts` now protects three contracts: the diagnostic collector must use `pagehide`, it must use `navigator.sendBeacon`, and it must not register `beforeunload` or `unload`. The same test also requires debug-collector injection to remain wrapped in the development-only Vite plugin. `server/securityHeaders.test.ts` protects the `unload=()` policy value.

The focused lifecycle/security suite passed 25 tests. The complete unit suite passed **221 files / 1,966 tests**; TypeScript checking and ESLint passed with **0 errors** (the project retains 106 pre-existing lint warnings). The production build passed.

## Boundaries

The `unload=()` directive prevents unload handlers, not `beforeunload` prompts. There is no first-party production `beforeunload` registration in the audited sources. If a future form adds an unsaved-change warning, it must register `beforeunload` only while real unsaved changes exist and remove it immediately on save, rather than leaving a global listener active.[1]

The Lighthouse JSON was produced as a transient verification artifact and intentionally not committed with source code. The stable test result and remediation evidence are recorded here.

## References

[1]: https://web.dev/articles/bfcache "web.dev — Back/forward cache"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event "MDN — Window: pagehide event"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event "MDN — Document: visibilitychange event"
