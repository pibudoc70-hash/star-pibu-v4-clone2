import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  MAX_SUBSCRIPTIONS_PER_CLIENT,
  applySubscriptionRequest,
} from "./websocketSubscriptionPolicy";

const websocketSource = readFileSync(resolve(process.cwd(), "server/_core/websocket.ts"), "utf8");

describe("WebSocket subscription policy", () => {
  it("rejects unauthenticated connections without adding the requested channel", () => {
    const result = applySubscriptionRequest({
      isAdmin: false,
      channel: "keywords",
      subscriptions: new Set(),
    });

    expect(result).toEqual({
      accepted: false,
      reason: "subscription_forbidden",
      subscriptions: new Set(),
    });
  });

  it("allows only the observed admin channels", () => {
    const accepted = applySubscriptionRequest({
      isAdmin: true,
      channel: "keywords",
      subscriptions: new Set(),
    });
    const rejected = applySubscriptionRequest({
      isAdmin: true,
      channel: "arbitrary-private-channel",
      subscriptions: new Set(),
    });

    expect(accepted).toEqual({
      accepted: true,
      subscriptions: new Set(["keywords"]),
    });
    expect(rejected).toEqual({
      accepted: false,
      reason: "invalid_subscription_channel",
      subscriptions: new Set(),
    });
    expect(JSON.stringify(rejected)).not.toContain("arbitrary-private-channel");
  });

  it("keeps duplicate subscriptions idempotent and bounded", () => {
    const duplicate = applySubscriptionRequest({
      isAdmin: true,
      channel: "keywords",
      subscriptions: new Set(["keywords"]),
    });
    const overLimit = applySubscriptionRequest({
      isAdmin: true,
      channel: "statistics",
      subscriptions: new Set(["keywords", "stale"]),
    });

    expect(duplicate).toEqual({
      accepted: true,
      subscriptions: new Set(["keywords"]),
    });
    expect(duplicate.subscriptions.size).toBe(1);
    expect(MAX_SUBSCRIPTIONS_PER_CLIENT).toBeGreaterThan(0);
    expect(overLimit).toEqual({
      accepted: false,
      reason: "subscription_limit_reached",
      subscriptions: new Set(["keywords", "stale"]),
    });
  });

  it("uses the policy before mutating live connection subscriptions and returns a channel-free rejection", () => {
    expect(websocketSource).toContain('import { applySubscriptionRequest } from "./websocketSubscriptionPolicy"');
    expect(websocketSource).toContain("const result = applySubscriptionRequest({");
    expect(websocketSource).toContain("connection.subscriptions = result.subscriptions;");
    expect(websocketSource).toContain('{ type: "subscription_rejected", reason: result.reason }');
  });
});
