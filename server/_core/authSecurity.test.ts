import { describe, expect, it } from "vitest";
import { decodeOAuthState, encodeOAuthState } from "@shared/const";
import { hasMatchingOAuthState } from "./oauth";
import { maskSensitiveForLog } from "./logger";
import { wouldRemoveLastAdmin } from "../db/users";

describe("OAuth state security", () => {
  it("preserves a valid callback origin and one-time nonce", () => {
    const state = encodeOAuthState({
      redirectUri: "https://star-pibu.com/api/oauth/callback",
      nonce: "abcdefghijklmnopqrstuvwxyz123456",
    });

    expect(decodeOAuthState(state)).toEqual({
      redirectUri: "https://star-pibu.com/api/oauth/callback",
      nonce: "abcdefghijklmnopqrstuvwxyz123456",
    });
  });

  it("fails closed for malformed or insecure OAuth state", () => {
    expect(decodeOAuthState("not-base64")).toEqual({});
    expect(decodeOAuthState(btoa(JSON.stringify({
      redirectUri: "http://example.com/api/oauth/callback",
      nonce: "abcdefghijklmnopqrstuvwxyz123456",
    })))).toEqual({});
  });

  it("accepts only the callback state that matches the browser nonce cookie", () => {
    const nonce = "abcdefghijklmnopqrstuvwxyz123456";
    const state = encodeOAuthState({
      redirectUri: "https://star-pibu.com/api/oauth/callback",
      nonce,
    });

    expect(hasMatchingOAuthState({ headers: { cookie: `__Host-oauth_state=${nonce}` } }, state)).toBe(true);
    expect(hasMatchingOAuthState({ headers: { cookie: "__Host-oauth_state=other" } }, state)).toBe(false);
  });
});

describe("log sensitive data masking", () => {
  it("masks health data identifiers and credentials in error text", () => {
    const message = maskSensitiveForLog(
      "email=test@example.com phone=010-1234-5678 token=abc123 Bearer eyJhbGciOiJIUzI1NiJ9.payload.signature",
    );

    expect(message).not.toContain("test@example.com");
    expect(message).not.toContain("010-1234-5678");
    expect(message).not.toContain("abc123");
    expect(message).toContain("[EMAIL]");
    expect(message).toContain("[PHONE]");
    expect(message).toContain("token=[REDACTED]");
  });
});

describe("last administrator role protection", () => {
  it("rejects only a demotion that would remove the final active administrator", () => {
    expect(wouldRemoveLastAdmin("admin", "user", 1)).toBe(true);
    expect(wouldRemoveLastAdmin("admin", "user", 2)).toBe(false);
    expect(wouldRemoveLastAdmin("admin", "admin", 1)).toBe(false);
    expect(wouldRemoveLastAdmin("user", "user", 0)).toBe(false);
  });
});
