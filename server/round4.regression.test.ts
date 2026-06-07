/**
 * round4.regression.test.ts
 * Round-4 시니어 재검수 회귀 테스트
 *
 * 검증 항목:
 *  A. HeroSection.tsx "已复制!" 하드코딩 제거 → t.access.copiedLabel 사용
 *  B. Equipment2Detail.tsx 인라인 lang 삼항 제거 → useLocalizedText 훅 사용
 *  C. Equipment2Detail.tsx JSON-LD bodyLocation 다국어 처리
 *  D. Equipment2Detail.tsx 갤러리 alt 하드코딩 제거
 *  E. i18n.ja.ts / i18n.zh.ts teamLabel 영어 하드코딩 제거
 *  F. SeoHead includeMedicalSchema 명시 정책 (8개 페이지)
 */
import { readFileSync } from "fs";
import path from "path";

const root = path.resolve(__dirname, "..");

const heroSource = readFileSync(
  path.resolve(root, "client/src/components/HeroSection.tsx"),
  "utf8"
);
const equipment2DetailSource = readFileSync(
  path.resolve(root, "client/src/pages/Equipment2Detail.tsx"),
  "utf8"
);
const jaI18n = readFileSync(
  path.resolve(root, "client/src/lib/i18n.ja.ts"),
  "utf8"
);
const zhI18n = readFileSync(
  path.resolve(root, "client/src/lib/i18n.zh.ts"),
  "utf8"
);

// ─────────────────────────────────────────────────────────────────────────────
// A. HeroSection WeChat 복사 레이블 i18n 처리
// ─────────────────────────────────────────────────────────────────────────────
describe("HeroSection.tsx — WeChat 복사 레이블 i18n 처리 (Round-4-A)", () => {
  it("\"已复制!\" 하드코딩 문자열이 없어야 한다", () => {
    // 정확히 하드코딩된 중국어 복사 문구가 없어야 함
    expect(heroSource).not.toContain('"已复制!"');
    expect(heroSource).not.toContain("'已复制!'");
  });

  it("t.access?.copiedLabel 또는 copiedLabel 키를 참조해야 한다", () => {
    expect(heroSource).toMatch(/copiedLabel/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// B. Equipment2Detail.tsx — useLocalizedText 훅 사용
// ─────────────────────────────────────────────────────────────────────────────
describe("Equipment2Detail.tsx — useLocalizedText 훅 사용 (Round-4-B)", () => {
  it("useLocalizedText 훅을 import해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/useLocalizedText/);
  });

  it("getText 함수를 사용해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/getText\s*\(/);
  });

  it("인라인 lang 삼항이 5개 이하여야 한다 (훅으로 대체됨)", () => {
    // lang === "en" 패턴 개수 확인 (JSON-LD alternateName 등 불가피한 경우 제외)
    const matches = equipment2DetailSource.match(/lang\s*===\s*["'](?:en|ja|zh)["']/g) ?? [];
    expect(matches.length).toBeLessThanOrEqual(5);
  });

  it("localizedName 변수를 사용해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/localizedName/);
  });

  it("localizedDetail 변수를 사용해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/localizedDetail/);
  });

  it("localizedCaution 변수를 사용해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/localizedCaution/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C. Equipment2Detail.tsx — JSON-LD bodyLocation 다국어 처리
// ─────────────────────────────────────────────────────────────────────────────
describe("Equipment2Detail.tsx — JSON-LD bodyLocation 다국어 처리 (Round-4-C)", () => {
  it("JSON-LD bodyLocation에 \"피부\" 하드코딩이 없어야 한다", () => {
    expect(equipment2DetailSource).not.toContain('"bodyLocation": "피부"');
  });

  it("bodyLocation이 다국어 변수(LABELS.bodyLoc 등)를 참조해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/bodyLocation.*LABELS|LABELS.*bodyLoc/s);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// D. Equipment2Detail.tsx — 갤러리 alt 다국어 처리
// ─────────────────────────────────────────────────────────────────────────────
describe("Equipment2Detail.tsx — 갤러리 alt 다국어 처리 (Round-4-D)", () => {
  it("갤러리 alt에 \"사례\" 한국어 하드코딩이 없어야 한다 (LABELS 정의 외부)", () => {
    // LABELS 정의 내부(getText 호출 인수)는 허용, 템플릿 리터럴에서 직접 사용 금지
    expect(equipment2DetailSource).not.toMatch(/`\$\{[^}]+\}\s*사례\s*\$\{/);
    // alt 속성에 직접 한국어 "사례" 문자열이 없어야 함
    expect(equipment2DetailSource).not.toMatch(/alt=\{`[^`]*사례[^`]*`\}/);
  });

  it("갤러리 alt에 LABELS.caseAlt 등 다국어 변수를 사용해야 한다", () => {
    expect(equipment2DetailSource).toMatch(/caseAlt|LABELS\.gallery/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// E. i18n.ja.ts / i18n.zh.ts — teamLabel 번역 품질
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ja.ts / i18n.zh.ts — teamLabel 번역 품질 (Round-4-E)", () => {
  it("i18n.ja.ts teamLabel이 영어 \"Medical Team\"이 아니어야 한다", () => {
    expect(jaI18n).not.toContain('teamLabel: "Medical Team"');
  });

  it("i18n.ja.ts teamLabel이 일본어로 번역되어야 한다", () => {
    // 의료チーム 또는 유사 일본어 번역
    expect(jaI18n).toMatch(/teamLabel:\s*["'][^"']*[\u3040-\u30FF\u4E00-\u9FFF][^"']*["']/);
  });

  it("i18n.zh.ts teamLabel이 영어 \"Medical Team\"이 아니어야 한다", () => {
    expect(zhI18n).not.toContain('teamLabel: "Medical Team"');
  });

  it("i18n.zh.ts teamLabel이 중국어로 번역되어야 한다", () => {
    // 医疗团队 또는 유사 중국어 번역
    expect(zhI18n).toMatch(/teamLabel:\s*["'][^"']*[\u4E00-\u9FFF][^"']*["']/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// F. SeoHead includeMedicalSchema 명시 정책
// ─────────────────────────────────────────────────────────────────────────────
describe("SeoHead pageType 명시 정책 (Round-4-F)", () => {
  const pagesRequiringMedical = [
    "client/src/pages/About.tsx",
    "client/src/pages/Directions.tsx",
    "client/src/pages/Doctors.tsx",
    "client/src/pages/Events.tsx",
    "client/src/pages/Facilities.tsx",
    "client/src/pages/ForeignGuide.tsx",
    "client/src/pages/NonCoveredGuide.tsx",
    "client/src/pages/Equipment2.tsx",
  ];

  const pagesExcludingMedical = [
    "client/src/pages/Equipment2Detail.tsx",
    "client/src/pages/NotFound.tsx",
    "client/src/pages/Privacy.tsx",
    "client/src/pages/Reserve.tsx",
    "client/src/pages/TreatmentDetail.tsx",
    "client/src/pages/TreatmentPage.tsx",
  ];

  for (const pagePath of pagesRequiringMedical) {
    it(`${pagePath.split("/").pop()} — pageType="treatment" 또는 pageType="home" 명시`, () => {
      const src = readFileSync(path.resolve(root, pagePath), "utf8");
      expect(src).toMatch(/pageType="(treatment|home)"/);
    });
  }

  for (const pagePath of pagesExcludingMedical) {
    it(`${pagePath.split("/").pop()} — pageType="admin" 명시`, () => {
      const src = readFileSync(path.resolve(root, pagePath), "utf8");
      expect(src).toMatch(/pageType="admin"/);
    });
  }
});
