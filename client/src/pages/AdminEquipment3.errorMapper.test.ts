import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminEquipment3.tsx"), "utf8");

describe("AdminEquipment3 error mapper contract", () => {
  it("maps mutation and load failures without rendering raw error.message", () => {
    expect(source).toContain('getAdminErrorDetails(err, "equipment3.delete")');
    expect(source).toContain('getAdminErrorDetails(err, "equipment3.update")');
    expect(source).toContain('getAdminErrorDetails(err, "equipment3.reorder")');
    expect(source).toContain('getAdminErrorDetails(error, "equipment3.load")');
    expect(source).not.toContain("{error.message}");
    expect(source).not.toContain("description: err.message");
  });
});
