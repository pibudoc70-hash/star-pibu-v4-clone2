export type HealthPayload = {
  status: "ok" | "degraded";
  db: "ok" | "fail";
  uptimeSec: number;
  latencyMs?: number;
  code?: "DB_UNAVAILABLE";
};

export function buildHealthyPayload(uptimeSec: number, latencyMs: number): HealthPayload {
  return { status: "ok", db: "ok", uptimeSec, latencyMs };
}

export function buildDegradedPayload(uptimeSec: number): HealthPayload {
  return { status: "degraded", db: "fail", code: "DB_UNAVAILABLE", uptimeSec };
}
