import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const equipmentPage = readFileSync(resolve(projectRoot, "client/src/pages/Equipment3.tsx"), "utf8");
const adapter = readFileSync(resolve(projectRoot, "client/src/hooks/useEquipment3AsTreatments.ts"), "utf8");
const card = readFileSync(resolve(projectRoot, "client/src/components/treatments/EquipmentTreatmentCard.tsx"), "utf8");
const modal = readFileSync(resolve(projectRoot, "client/src/components/treatments/EquipmentTreatmentModal.tsx"), "utf8");

describe("zh-TW equipment treatment localization", () => {
  it("passes direct Equipment3 card fields through the Traditional Chinese fallback slot", () => {
    expect(equipmentPage).toContain("item.nameZhTw");
    expect(equipmentPage).toContain("item.descZhTw");
    expect(equipmentPage).toContain("item.categoryZhTw");
    expect(equipmentPage).toContain("item.badgeZhTw");
    expect(equipmentPage).toContain('"查看詳情"');
  });

  it("preserves verified zh-TW data through the home treatment adapter, card, and modal", () => {
    expect(adapter).toContain("nameZhTw: item.nameZhTw ?? undefined");
    expect(adapter).toContain("detailZhTw: item.detailZhTw ?? undefined");
    expect(adapter).toContain("cautionZhTw: item.cautionZhTw ?? undefined");
    expect(adapter).toContain("badgeZhTw: item.badgeZhTw ?? undefined");
    expect(card).toContain("item.nameZhTw");
    expect(modal).toContain("item.effectZhTw");
    expect(modal).toContain("item.cautionZhTw");
  });
});
