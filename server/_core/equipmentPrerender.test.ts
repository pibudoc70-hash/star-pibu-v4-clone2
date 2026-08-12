import { describe, expect, it } from "vitest";
import { buildEquipmentPrerenderedHtml } from "./equipmentPrerender";

const template = `<!doctype html><html><head><title>스타피부과</title><meta name="description" content="" /><link rel="canonical" href="https://star-pibu.com" /></head><body><div id="root"></div></body></html>`;
const item = {
  id: 1, slug: "rejuran", name: "리쥬란힐러", nameEn: "Rejuran Healer", nameJa: "リジュラン", nameZh: "丽珠兰", category: "스킨부스터", categoryEn: "Skin Booster", categoryJa: "", categoryZh: "",
  desc: "피부 재생을 돕는 주사 시술", descEn: "A skin regeneration injection treatment", descJa: "", descZh: "", detail: "PDRN 성분을 피부에 주입합니다.", detailEn: "PDRN is injected into the skin.", detailJa: "", detailZh: "", effect: "피부결 개선", effectEn: "Texture improvement", effectJa: "", effectZh: "", caution: "시술 후 자외선 차단이 필요합니다.", cautionEn: "Use sunscreen after treatment.", cautionJa: "", cautionZh: "", sessions: "3회", sessionsEn: "3 sessions", sessionsJa: "", sessionsZh: "", time: "30분", timeEn: "30 min", timeJa: "", timeZh: "", recovery: "2~3일", recoveryEn: "2–3 days", recoveryJa: "", recoveryZh: "", imageUrl: "/image.webp", bgImageUrl: null, images: "[]", youtubeUrl: null, modalImage: null, badge: "", badgeColor: "#000", seoTitle: "", seoDescription: "", seoKeywords: "", ogImageUrl: null, sortOrder: 1, isActive: "1" as const, isBest: "0" as const, isNew: "0" as const, createdAt: new Date(), updatedAt: new Date(),
};

describe("equipmentPrerender", () => {
  it("장비 상세 원본 HTML에 표 본문과 MedicalClinic·Physician·MedicalProcedure를 넣는다", () => {
    const html = buildEquipmentPrerenderedHtml(template, item, "ko", "/equipment3/rejuran");
    expect(html).toContain("시술 설명");
    expect(html).toContain("부작용·주의사항");
    expect(html).toContain("MedicalClinic");
    expect(html).toContain("Physician");
    expect(html).toContain("MedicalProcedure");
  });
});
