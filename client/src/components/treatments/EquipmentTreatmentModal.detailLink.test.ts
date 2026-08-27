import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildEquipment3DetailUrl } from "../../lib/equipment3DetailUrl";

const modalSource = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/EquipmentTreatmentModal.tsx"),
  "utf8",
);
const cardSource = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/EquipmentTreatmentCard.tsx"),
  "utf8",
);
const treatmentAdapterSource = readFileSync(
  resolve(process.cwd(), "client/src/hooks/useEquipment3AsTreatments.ts"),
  "utf8",
);

describe("EquipmentTreatmentModal Equipment3 detail links", () => {
  it("maps Ultherapy Prime to the user-confirmed Equipment3 detail URL", () => {
    expect(decodeURIComponent(buildEquipment3DetailUrl("울쎄라피프라임", "리프팅·탄력"))).toBe(
      "/equipment3/울쎄라피프라임?tab=리프팅·탄력",
    );
    expect(treatmentAdapterSource).toContain("detailUrl: buildEquipment3DetailUrl(item.slug, item.category)");
    expect(cardSource).toContain("detailUrl={item.detailUrl}");
  });

  it("renders the detail button directly after media and navigates to the mapped URL", () => {
    expect(modalSource).toContain("detailUrl: string | undefined");
    expect(modalSource).toContain("setLocation(detailUrl)");
    expect(modalSource.indexOf("{/* 상세 페이지 이동 버튼 */}")).toBeGreaterThan(
      modalSource.indexOf("{/* 모달 이미지 (유튜브 embed 불가능하거나 없을 때) */}"),
    );
    expect(modalSource.indexOf("{/* 상세 페이지 이동 버튼 */}")).toBeLessThan(
      modalSource.indexOf("{/* 상세 설명 */}"),
    );
    expect(modalSource).toContain("{detailUrl && (");
  });
});
