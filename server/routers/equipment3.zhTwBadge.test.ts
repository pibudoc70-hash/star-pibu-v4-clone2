import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const schema = readFileSync(resolve(projectRoot, "drizzle/schema.ts"), "utf8");
const router = readFileSync(resolve(projectRoot, "server/routers/equipment3.ts"), "utf8");

describe("equipment3 zh-TW badge data contract", () => {
  it("stores a dedicated Traditional Chinese badge field without replacing the source badge", () => {
    expect(schema).toContain('badge: varchar("badge", { length: 100 }).default("")');
    expect(schema).toContain('badgeZhTw: varchar("badgeZhTw", { length: 100 }).default("")');
  });

  it("accepts and persists badgeZhTw through the existing admin create/update payload", () => {
    expect(router).toContain("badgeZhTw: z.string().max(100).optional()");
    expect(router).toContain('badgeZhTw: input.badgeZhTw ?? ""');
    expect(router).toContain("const { id, ...data } = input;");
  });
});
