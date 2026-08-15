import { describe, expect, it } from "vitest";
import { buildEquipmentPrerenderedHtml, EQUIPMENT_PRERENDER_CACHE_CONTROL } from "./equipmentPrerender";

const template = `<!doctype html><html><head><title>스타피부과</title><meta name="description" content="" /><link rel="canonical" href="https://star-pibu.com" /></head><body><div id="root"></div></body></html>`;
const item = {
  id: 1, slug: "rejuran", name: "리쥬란힐러", nameEn: "Rejuran Healer", nameJa: "リジュラン", nameZh: "丽珠兰", nameZhTw: "", category: "스킨부스터", categoryEn: "Skin Booster", categoryJa: "", categoryZh: "",
  desc: "피부 재생을 돕는 주사 시술", descEn: "A skin regeneration injection treatment", descJa: "", descZh: "", descZhTw: "", detail: "PDRN 성분을 피부에 주입합니다.", detailEn: "PDRN is injected into the skin.", detailJa: "", detailZh: "", detailZhTw: "", effect: "피부결 개선", effectEn: "Texture improvement", effectJa: "", effectZh: "", effectZhTw: "", caution: "시술 후 자외선 차단이 필요합니다.", cautionEn: "Use sunscreen after treatment.", cautionJa: "", cautionZh: "", cautionZhTw: "", sessions: "3회", sessionsEn: "3 sessions", sessionsJa: "", sessionsZh: "", sessionsZhTw: "", time: "30분", timeEn: "30 min", timeJa: "", timeZh: "", timeZhTw: "", recovery: "2~3일", recoveryEn: "2–3 days", recoveryJa: "", recoveryZh: "", recoveryZhTw: "", faqs: JSON.stringify([{ question: "저장 FAQ 질문", answer: "저장 FAQ 답변" }]), faqsEn: "[]", faqsJa: "[]", faqsZh: "[]", faqsZhTw: "[]", imageUrl: "/image.webp", bgImageUrl: null, images: "[]", youtubeUrl: null, modalImage: null, badge: "", badgeColor: "#000", seoTitle: "", seoDescription: "", seoKeywords: "", ogImageUrl: null, sortOrder: 1, isActive: "1" as const, isBest: "0" as const, isNew: "0" as const, createdAt: new Date(), updatedAt: new Date(),
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

  it("저장 FAQ를 원본 HTML과 FAQPage JSON-LD에 함께 넣는다", () => {
    const html = buildEquipmentPrerenderedHtml(template, item, "ko", "/equipment3/rejuran");
    expect(html).toContain("저장 FAQ 질문");
    expect(html).toContain("저장 FAQ 답변");
    expect(html).toContain("FAQPage");
  });

  it("원본 HTML에서 FAQ를 진료·시술 안내보다 먼저 배치한다", () => {
    const html = buildEquipmentPrerenderedHtml(template, item, "ko", "/equipment3/rejuran");

    expect(html.indexOf("저장 FAQ 질문")).toBeLessThan(html.indexOf("진료·시술 안내"));
  });

  it("언어별 위치·진료시간·전문의·통증 관리 고정 인용 블록을 원본 HTML에 넣는다", () => {
    const english = buildEquipmentPrerenderedHtml(template, item, "en", "/en/equipment3/rejuran");
    const japanese = buildEquipmentPrerenderedHtml(template, item, "ja", "/ja/equipment3/rejuran");
    const simplified = buildEquipmentPrerenderedHtml(template, item, "zh", "/zh/equipment3/rejuran");
    const traditional = buildEquipmentPrerenderedHtml(template, item, "zh-TW", "/zh-tw/equipment3/rejuran");

    expect(english).toContain("Clinic &amp; Treatment Information");
    expect(english).toContain("74 Seomyeon-ro");
    expect(english).toContain("Pain &amp; Sedation Management");
    expect(japanese).toContain("診療・施術のご案内");
    expect(simplified).toContain("诊疗与治疗信息");
    expect(traditional).toContain("診療與療程資訊");
  });

  it("번체 상세는 간체 nameZh 대신 전용 nameZhTw를 원본 HTML과 MedicalProcedure에 사용한다", () => {
    const html = buildEquipmentPrerenderedHtml(template, { ...item, nameZh: "BBL紧肤", nameZhTw: "BBL緊膚" }, "zh-TW", "/zh-tw/equipment3/bbl-skin-tight");

    expect(html).toContain("<h1>BBL緊膚</h1>");
    expect(html).toContain('"name":"BBL緊膚"');
    expect(html).not.toContain("<h1>BBL紧肤</h1>");
  });

  it("번체 상세는 전용 본문이 있으면 간체 본문 대신 표·메타·MedicalProcedure에 사용한다", () => {
    const html = buildEquipmentPrerenderedHtml(template, {
      ...item,
      descZh: "简体简介",
      descZhTw: "繁體簡介",
      detailZh: "简体疗程说明",
      detailZhTw: "繁體療程說明",
      effectZh: "简体效果",
      effectZhTw: "繁體效果",
      cautionZh: "简体注意事项",
      cautionZhTw: "繁體注意事項",
      sessionsZh: "简体次数",
      sessionsZhTw: "繁體次數",
      timeZh: "简体时间",
      timeZhTw: "繁體時間",
      recoveryZh: "简体恢复期",
      recoveryZhTw: "繁體恢復期",
    }, "zh-TW", "/zh-tw/equipment3/rejuran");

    expect(html).toContain("繁體簡介");
    expect(html).toContain("繁體療程說明");
    expect(html).toContain("繁體注意事項");
    expect(html).toContain('"description":"繁體簡介"');
    expect(html).not.toContain("简体疗程说明");
  });

  it("병원·시술·FAQ 엔터티 ID를 클라이언트 스키마와 같은 표준 URL로 연결한다", () => {
    const html = buildEquipmentPrerenderedHtml(template, item, "ko", "/equipment3/rejuran");

    expect(html).toContain('"@id":"https://star-pibu.com/#organization"');
    expect(html).toContain('"@id":"https://star-pibu.com/equipment3/rejuran#medical-procedure"');
    expect(html).toContain('"@id":"https://star-pibu.com/equipment3/rejuran#faq"');
  });

  it("장비 상세는 관리 반영을 위해 짧은 공유 캐시 재검증 정책을 사용한다", () => {
    expect(EQUIPMENT_PRERENDER_CACHE_CONTROL).toBe("public, max-age=0, s-maxage=60, stale-while-revalidate=120");
  });
});
