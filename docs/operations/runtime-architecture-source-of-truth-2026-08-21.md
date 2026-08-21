# Runtime Architecture Source of Truth — 2026-08-21

## Scope

This document describes the repository runtime as verified from current source and P0/P1/P2 checkpoints. It is not a deployment history and does not expose secret values.

## Client runtime

| Boundary | Source of truth | Responsibility |
|---|---|---|
| Application shell | `client/src/App.tsx` | Error boundary, theme, language provider, tooltip/toast providers, route registry, top-scroll and HTML language synchronization. |
| Primary home | `client/src/pages/Home.tsx` | Home composition, deferred section mounting, anchor navigation, and lazy-section integration. |
| Content routes | `client/src/routes.ts` and route components | Localized treatment/equipment, notices, events, directions, foreign guide and price-list routes. |
| Data client | `client/src/lib/trpc.ts` | Typed tRPC client transport. |
| Authentication redirect | `client/src/const.ts` | Constructs OAuth callback URI from `window.location.origin`; no custom-domain hardcode. |

## Server runtime

| Boundary | Source of truth | Responsibility |
|---|---|---|
| Bootstrap | `server/_core/index.ts` | Fail-fast environment and DB verification, Express middleware, security/rate limit setup, route registration, static/Vite selection, exact production port binding, graceful shutdown. |
| API | `server/routers.ts` and feature routers | tRPC procedure registration and public/admin feature boundaries. |
| Health | `server/_core/index.ts` `/healthz` | DB-backed healthy/degraded JSON response. |
| Static serving | `server/_core/vite.ts` | Development Vite middleware or production static assets with SPA fallback excluding API paths. |
| OAuth | `server/_core/oauth.ts` | State validation, token exchange, session cookie, relative home redirect. |
| WebSocket | `server/_core/websocket.ts` | Singleton `/ws/trends` server, origin verification, client cap, heartbeat, graceful close; P1 admin subscription policy gates allowed channels. |

## Data and external boundaries

- Client content requests use tRPC; server DB access stays behind routers and DB helpers.
- YouTube thumbnail proxy validates the 11-character video ID before cache-key and upstream URL creation.
- Client YouTube cards/modal apply the same allowlist before thumbnail or iframe rendering.
- Popup/images use server-side proxy boundaries, content-type/size checks, rate limits, and cache policies.
- No runtime source dependency exists on `APP_URL`; `APP_ORIGIN` is platform-provided but not used to build OAuth redirects.

## P0/P1/P2 safeguards currently retained

| Area | Guardrail |
|---|---|
| Consultation error UI | Raw backend URI/secret/stack details are not rendered; safe generic/known messages and Turnstile reset are regression-protected. |
| WebSocket subscriptions | Admin-only allowlist, per-client cap, idempotent duplicates, and safe rejection. |
| Native navigation | Equipment and event detail cards retain semantic anchors, accessible names, and keyboard focus. |
| Facility dialog/carousel | Focus trap, Escape/trigger restoration, body-scroll restoration, reduced-motion autoplay policy, and 44px indicators with current-slide semantics. |
| YouTube | Strict client/server ID boundary, modal lifecycle, retry recovery, no debug logging, dead position state removed. |
| UI token family | `--focus-ring` is the semantic non-reservation focus-ring token used by Events, Equipment3, Facility, and YouTube interactive elements. |
| Derived state | Events filtering is render-time memoized; Equipment3 falls back when requested tabs are no longer in current data. |

## Explicitly frozen / out of scope

The following remain untouched by these P0/P1/P2 activities: Header, Hero, Footer, MobileBottomCTA, `useChatConfig`, external reservation/chat/phone CTA values, `/my-reservations`, reservation routers/services/repositories/schema/migrations/fixtures/seeds/tests, OTP/email/SMS, administrator reservation functionality, and the production database.

## Operational verification baseline

For a non-DB code change, run focused regression, `pnpm check`, `pnpm lint`, `env -u DATABASE_URL -u TEST_DATABASE_URL pnpm test:unit`, local production build, client build high-risk marker scan, and frozen-path diff audit. Production-dependent behavior must be verified separately without exposing secrets or accessing the production database.
