import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const clientRoot = resolve(process.cwd(), "client/src/pages");
const newSource = readFileSync(resolve(clientRoot, "AdminEquipment3New.tsx"), "utf8");
const editSource = readFileSync(resolve(clientRoot, "AdminEquipment3Edit.tsx"), "utf8");

describe("AdminEquipment3 create/edit error mapper", () => {
  it("maps action failures to safe messages and stable codes without rendering raw err.message", () => {
    expect(newSource).toContain('getAdminErrorDetails(err, "equipment3.seo-generate")');
    expect(newSource).toContain('getAdminErrorDetails(err, "equipment3.create")');
    expect(editSource).toContain('getAdminErrorDetails(err, "equipment3.translate")');
    expect(editSource).toContain('getAdminErrorDetails(err, "equipment3.seo-generate")');
    expect(editSource).toContain('getAdminErrorDetails(err, "equipment3.update")');
    expect(newSource).not.toMatch(/err\.message/);
    expect(editSource).not.toMatch(/err\.message/);
    expect(newSource).toContain("오류 코드:");
    expect(editSource).toContain("오류 코드:");
  });
});
