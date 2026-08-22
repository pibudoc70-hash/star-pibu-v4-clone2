import { describe, expect, it } from "vitest";
import express from "express";
import { getLegacyTreatmentRedirectPath } from "./treatmentPrerender";
import { registerTreatmentPrerender } from "./treatmentPrerender";

describe("treatment legacy redirect ownership", () => {
  it("keeps classic Ulthera and Ultherapy Prime on their distinct canonical routes", () => {
    expect(getLegacyTreatmentRedirectPath("울쎄라")).toBe("/treatments/ulthera-classic");
    expect(getLegacyTreatmentRedirectPath("울쎄라피 프라임")).toBe("/treatments/ulthera");
    expect(getLegacyTreatmentRedirectPath("%EC%9A%B8%EC%8E%84%EB%9D%BC")).toBe("/treatments/ulthera-classic");
  });

  it("returns no redirect for an unknown legacy name", () => {
    expect(getLegacyTreatmentRedirectPath("존재하지 않는 시술")).toBeNull();
  });

  it("returns an HTTP 301 for an encoded crawler request", async () => {
    const app = express();
    registerTreatmentPrerender(app);
    const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
      const listener = app.listen(0, () => resolve(listener));
    });

    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("missing test server address");
      const response = await fetch(`http://127.0.0.1:${address.port}/treatment/%EC%9A%B8%EC%8E%84%EB%9D%BC`, {
        redirect: "manual",
      });
      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("/treatments/ulthera-classic");
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
