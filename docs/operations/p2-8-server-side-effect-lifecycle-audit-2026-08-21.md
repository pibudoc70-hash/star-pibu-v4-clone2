# P2-8 Server Side-effect Lifecycle Audit — 2026-08-21

## Scope and boundary

This is a read-only audit of non-reservation server bootstrap side effects. OTP cleanup, database lifecycle, schema, migrations, and reservation code are explicitly excluded.

## Findings

| Area | Evidence | Conclusion |
|---|---|---|
| Bootstrap entry | `startServer()` has one module-scope call after its declaration in `server/_core/index.ts`. | No repeated in-process bootstrap path found. |
| WebSocket initialization | `initializeWebSocketServer()` retains a module singleton and only constructs when `wsServer` is null. | Duplicate WebSocket initialization is guarded. |
| WebSocket heartbeat | The heartbeat timer is `unref`ed and `close()` clears it. | No retained heartbeat timer after normal shutdown. |
| WebSocket shutdown | `closeWebSocketServer()` awaits the instance close and resets the singleton to null. | A fresh process/server lifecycle can initialize cleanly again. |
| Process listeners | `SIGTERM`, `SIGINT`, `unhandledRejection`, and `uncaughtException` are registered once by the single startup flow. | No duplicate listener registration path found in the current process model. |
| Scheduled handler | `collectKeywordTrendsHandler` is request-scoped; it does not self-register timers or global listeners. | Not a repeated startup side-effect source. |

## Conclusion

No actual non-reservation lifecycle defect was found. This P2 item makes **no production code or test change**. A future refactor should only be considered if the runtime moves to multi-bootstrap in-process tests or hot module replacement that re-evaluates the server entrypoint; that would require a new lifecycle test harness and separate approval.
