import { describe, expect, it } from "vitest";
import { assertProductionAppId } from "./envSchema";
import { buildDegradedPayload, buildHealthyPayload } from "./health";
import { maskSensitiveForLog } from "./logger";
import { isCurrentAppSession } from "./sdk";
import { evaluateUserRoleChange, wouldRemoveLastAdmin, wouldRemoveOwnAdminRole } from "../db/users";
import { normalizeKey, readStorageUrlResponse } from "../storage";

describe("JWT app binding", () => {
  it("accepts only a non-empty appId matching the current app", () => {
    expect(isCurrentAppSession("current-app", "current-app")).toBe(true);
    expect(isCurrentAppSession("other-app", "current-app")).toBe(false);
    expect(isCurrentAppSession("", "current-app")).toBe(false);
  });

  it("fails fast when production appId is missing", () => {
    expect(() => assertProductionAppId("production", "")).toThrow("VITE_APP_ID is required");
    expect(() => assertProductionAppId("production", "current-app")).not.toThrow();
    expect(() => assertProductionAppId("development", "")).not.toThrow();
  });
});

describe("health payload minimization", () => {
  it("returns only safe success fields", () => {
    expect(buildHealthyPayload(10, 4)).toEqual({ status: "ok", db: "ok", uptimeSec: 10, latencyMs: 4 });
  });

  it("does not expose database error detail when degraded", () => {
    const payload = buildDegradedPayload(10);
    expect(payload).toEqual({ status: "degraded", db: "fail", code: "DB_UNAVAILABLE", uptimeSec: 10 });
    expect(JSON.stringify(payload)).not.toMatch(/sql|host|stack|error/i);
  });
});

describe("admin role guard decisions", () => {
  it("protects self-demotion and the final administrator without blocking safe changes", () => {
    expect(wouldRemoveOwnAdminRole(7, 7, "user")).toBe(true);
    expect(wouldRemoveOwnAdminRole(7, 8, "user")).toBe(false);
    expect(wouldRemoveLastAdmin("admin", "user", 1)).toBe(true);
    expect(wouldRemoveLastAdmin("admin", "user", 2)).toBe(false);
    expect(wouldRemoveLastAdmin("admin", "admin", 1)).toBe(false);
  });

  it("returns explicit outcomes for missing users and same-role requests", () => {
    expect(evaluateUserRoleChange({
      actorUserId: 1, targetUserId: 999, targetExists: false,
      currentRole: "user", nextRole: "admin", activeAdminCount: 1,
    })).toBe("NOT_FOUND");
    expect(evaluateUserRoleChange({
      actorUserId: 1, targetUserId: 2, targetExists: true,
      currentRole: "admin", nextRole: "admin", activeAdminCount: 2,
    })).toBe("UNCHANGED");
    expect(evaluateUserRoleChange({
      actorUserId: 1, targetUserId: 1, targetExists: true,
      currentRole: "admin", nextRole: "user", activeAdminCount: 2,
    })).toBe("SELF_ADMIN_DEMOTION");
    expect(evaluateUserRoleChange({
      actorUserId: 1, targetUserId: 2, targetExists: true,
      currentRole: "admin", nextRole: "user", activeAdminCount: 1,
    })).toBe("LAST_ADMIN_DEMOTION");
  });
});

describe("logger masking", () => {
  it("masks credentials in normal error messages and stack-like text", () => {
    const value = maskSensitiveForLog(
      "Authorization: Bearer abc.def.ghi\nCookie: session=secret; other=value\n?code=oauth-code&access_token=access-value email=user@example.com phone=010-1234-5678",
    );
    expect(value).not.toMatch(/abc\.def\.ghi|session=secret|oauth-code|access-value|user@example\.com|010-1234-5678/);
    expect(value).toMatch(/Authorization:\s*\[REDACTED\]/);
    expect(value).toMatch(/Cookie:\s*\[REDACTED\]/);
  });
});

describe("storage boundary validation", () => {
  it("rejects unsafe keys and retains ordinary nested keys", () => {
    expect(normalizeKey("notices/1/image.webp")).toBe("notices/1/image.webp");
    for (const key of ["", "../secret", "dir\\file", "bad\0key", "bad\nkey", "x".repeat(201)]) {
      expect(() => normalizeKey(key)).toThrow("Storage key is invalid");
    }
  });

  it("accepts only successful HTTP(S) storage URLs without forwarding upstream bodies", async () => {
    await expect(readStorageUrlResponse(new Response(JSON.stringify({ url: "https://storage.example/file.webp" }), { status: 200 }), "upload"))
      .resolves.toBe("https://storage.example/file.webp");
    await expect(readStorageUrlResponse(new Response(JSON.stringify({ url: "javascript:alert(1)" }), { status: 200 }), "upload"))
      .rejects.toThrow("response URL is invalid");
    await expect(readStorageUrlResponse(new Response("upstream secret body", { status: 502 }), "download"))
      .rejects.toThrow("Storage download request failed (502)");
  });
});
