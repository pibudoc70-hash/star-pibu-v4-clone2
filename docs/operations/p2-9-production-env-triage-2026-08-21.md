# P2-9 Production Environment and Deployment Triage — 2026-08-21

## Scope and boundary

This is a read-only source and managed-environment presence audit. It does not expose secret values, modify secrets, access the production database, change GitHub, or alter deployment configuration.

## Environment presence (values intentionally omitted)

| Variable | Presence | Source use / observation |
|---|---:|---|
| `APP_ORIGIN` | Set | Platform-provided. No application source dependency found. |
| `APP_URL` | Unset | No application source dependency found. |
| `PORT` / `NODE_ENV` | Set | Validated at startup; production uses the configured exact port. |
| `DATABASE_URL` | Set | Required by the startup schema and DB health endpoint. |
| `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` | Set | Client login builds redirects from `window.location.origin`; server callback redirects relatively to `/`. |
| `TURNSTILE_SECRET_KEY`, `JWT_SECRET` | Set | Production startup fails closed if either is absent. |

## Startup and routing evidence

| Concern | Evidence | Result |
|---|---|---|
| Startup crash visibility | Environment schema and DB connection are validated before listening; failure logs a fatal reason and exits. | Pass. |
| Port binding | Development may select an available port; production exits if the requested `PORT` is unavailable. | Pass. |
| OAuth/custom domain | Client redirect URI is built from `window.location.origin`; callback uses a relative home redirect. | Pass. |
| Production static fallback | Production path invokes `serveStatic`; health endpoint is registered before it. | Pass. |

## No-code conclusion

No source defect requiring a configuration or deployment change was found. `APP_URL` remains intentionally unused by application source; do not introduce an origin hardcode merely to consume it. If a future production symptom occurs, first capture the deployment boot log, `/healthz` status, active custom domain, and browser-reported `window.location.origin` without exposing environment values.
