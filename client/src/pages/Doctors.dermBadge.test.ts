import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Doctors.tsx"), "utf8");

describe("approved dermatologist-specialist badge", () => {
  it("uses the managed WebP badge for desktop and mobile doctor detail panels", () => {
    expect(source).toContain('const DERM_SPECIALIST_BADGE = "/manus-storage/derm-specialist-badge_');
    expect(source.match(/src=\{DERM_SPECIALIST_BADGE\}/g)).toHaveLength(2);
    expect(source).not.toContain('/api/storage/derm-specialist-badge_9b9bcf96.png');
  });

  it("retains localized alt text and the existing desktop/mobile badge classes", () => {
    expect(source).toContain('alt={t.doctors.dermBadge?.replace("\\n", " ") ?? "피부과 전문의"}');
    expect(source).toContain('dr-derm-badge-img-desktop');
    expect(source).toContain('dr-derm-badge-img-mobile');
  });
});
