import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

const mocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  getDb: vi.fn(),
  lt: vi.fn(() => "older-than-thirty-days"),
}));

vi.mock("./sdk", () => ({
  sdk: { authenticateRequest: mocks.authenticateRequest },
}));

vi.mock("../db", () => ({ getDb: mocks.getDb }));

vi.mock("drizzle-orm", () => ({ lt: mocks.lt }));

vi.mock("../../drizzle/schema", () => ({
  keywordTrends: { collectedAt: "collectedAt" },
}));

import { collectKeywordTrendsHandler } from "./scheduled";

const originalNodeEnv = process.env.NODE_ENV;

function createResponse() {
  const state: { statusCode: number; body?: unknown } = { statusCode: 200 };
  const res = {
    status: vi.fn((statusCode: number) => {
      state.statusCode = statusCode;
      return res;
    }),
    json: vi.fn((body: unknown) => {
      state.body = body;
      return res;
    }),
  };

  return { res: res as unknown as Response, state };
}

function createDatabase() {
  const insertValues = vi.fn().mockResolvedValue(undefined);
  const deleteWhere = vi.fn().mockResolvedValue(undefined);
  const database = {
    insert: vi.fn(() => ({ values: insertValues })),
    delete: vi.fn(() => ({ where: deleteWhere })),
  };

  return { database, insertValues, deleteWhere };
}

describe("collectKeywordTrendsHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authenticateRequest.mockResolvedValue({ isCron: true, taskUid: "cron-task-1" });
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("does not access the database or write sample placeholders in production", async () => {
    process.env.NODE_ENV = "production";
    const response = createResponse();

    await collectKeywordTrendsHandler({} as Request, response.res);

    expect(mocks.getDb).not.toHaveBeenCalled();
    expect(response.state.body).toEqual({
      ok: true,
      skipped: "sample-placeholder-production",
      taskUid: "cron-task-1",
    });
  });

  it("retains the existing non-production sample behavior", async () => {
    process.env.NODE_ENV = "test";
    const { database, insertValues, deleteWhere } = createDatabase();
    mocks.getDb.mockResolvedValue(database);
    const response = createResponse();

    await collectKeywordTrendsHandler({} as Request, response.res);

    expect(insertValues).toHaveBeenCalledOnce();
    expect(deleteWhere).toHaveBeenCalledOnce();
    expect(response.state.body).toMatchObject({ ok: true, collected: 10, taskUid: "cron-task-1" });
  });
});
