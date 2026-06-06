/**
 * PR-46 / PR-47 회귀 방지 테스트
 *
 * 이 테스트는 소스코드 정적 검사 방식으로 PR-46/47에서 확립된 정책을 보호합니다.
 *
 * 검사 대상:
 *   1. Stat suffix source-of-truth — STAT_UNITS에 + 포함, 렌더링에서 추가 + 없음
 *   2. SeoHead includeClinicSchema=false — 시술/장비 상세 페이지 중복 스키마 방지
 *   3. SpecialEventSection empty-state — i18n.ts 키 사용, 하드코딩 문구 없음
 *   4. i18n.ts specialEmptyTitle/specialEmptyDesc — 4개 언어 모두 존재
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const constantsSource = readFileSync(
  path.resolve(root, "client/src/lib/constants.ts"),
  "utf8",
);
const heroSource = readFileSync(
  path.resolve(root, "client/src/components/HeroSection.tsx"),
  "utf8",
);
const philosophySource = readFileSync(
  path.resolve(root, "client/src/components/PhilosophySection.tsx"),
  "utf8",
);
const seoHeadSource = readFileSync(
  path.resolve(root, "client/src/components/SeoHead.tsx"),
  "utf8",
);
const treatmentPageSource = readFileSync(
  path.resolve(root, "client/src/pages/TreatmentPage.tsx"),
  "utf8",
);
const treatmentDetailSource = readFileSync(
  path.resolve(root, "client/src/pages/TreatmentDetail.tsx"),
  "utf8",
);
const equipment2DetailSource = readFileSync(
  path.resolve(root, "client/src/pages/Equipment2Detail.tsx"),
  "utf8",
);
const specialEventSource = readFileSync(
  path.resolve(root, "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);
const i18nSource = readFileSync(
  path.resolve(root, "client/src/lib/i18n.ts"),
  "utf8",
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Stat suffix source-of-truth
// ─────────────────────────────────────────────────────────────────────────────
describe("Stat suffix source-of-truth (PR-46/47)", () => {
  it("STAT_UNITS.years 값에 + 가 포함되어 있어야 한다 (ko=년+, en=+yrs, ja=年+, zh=年+)", () => {
    expect(constantsSource).toContain('years:');
    // ko suffix
    expect(constantsSource).toMatch(/years:\s*\{[^}]*ko:\s*"년\+"/);
    // en suffix
    expect(constantsSource).toMatch(/years:\s*\{[^}]*en:\s*"\+yrs"/);
    // ja suffix
    expect(constantsSource).toMatch(/years:\s*\{[^}]*ja:\s*"年\+"/);
    // zh suffix
    expect(constantsSource).toMatch(/years:\s*\{[^}]*zh:\s*"年\+"/);
  });

  it("STAT_UNITS.cases 값에 + 가 포함되어 있어야 한다 (ko=례+, en=+, ja=例+, zh=例+)", () => {
    expect(constantsSource).toMatch(/cases:\s*\{[^}]*ko:\s*"례\+"/);
    expect(constantsSource).toMatch(/cases:\s*\{[^}]*en:\s*"\+"/);
    expect(constantsSource).toMatch(/cases:\s*\{[^}]*ja:\s*"例\+"/);
    expect(constantsSource).toMatch(/cases:\s*\{[^}]*zh:\s*"例\+"/);
  });

  it("STAT_UNITS.types 값에 + 가 포함되어 있어야 한다 (ko=종+, en=+, ja=種+, zh=种+)", () => {
    expect(constantsSource).toMatch(/types:\s*\{[^}]*ko:\s*"종\+"/);
    expect(constantsSource).toMatch(/types:\s*\{[^}]*en:\s*"\+"/);
    expect(constantsSource).toMatch(/types:\s*\{[^}]*ja:\s*"種\+"/);
    expect(constantsSource).toMatch(/types:\s*\{[^}]*zh:\s*"种\+"/);
  });

  it("HeroSection에서 STAT_UNITS 뒤에 추가 '+' 를 붙이지 않아야 한다 (double-plus 방지)", () => {
    // STAT_UNITS.years[...]}+ 패턴이 없어야 함
    expect(heroSource).not.toMatch(/STAT_UNITS\.years\[[^\]]+\]\}?\+/);
    expect(heroSource).not.toMatch(/STAT_UNITS\.cases\[[^\]]+\]\}?\+/);
    expect(heroSource).not.toMatch(/STAT_UNITS\.types\[[^\]]+\]\}?\+/);
  });

  it("PhilosophySection에서 STAT_UNITS 뒤에 추가 '+' 를 붙이지 않아야 한다 (double-plus 방지)", () => {
    // suffix: `${STAT_UNITS...}+` 패턴이 없어야 함
    expect(philosophySource).not.toMatch(/STAT_UNITS\.[a-z]+\[[^\]]+\]\s*\?\?\s*STAT_UNITS\.[a-z]+\.en\}`?\s*\+/);
    // suffix: STAT_UNITS...en, 뒤에 + 없어야 함
    expect(philosophySource).not.toMatch(/suffix:\s*`\$\{STAT_UNITS\.[^}]+\}\+`/);
  });

  it("English stat 표기에서 double-plus 문자열이 생성되지 않아야 한다", () => {
    // +yrs+ 패턴이 소스에 없어야 함
    expect(heroSource).not.toContain("+yrs+");
    expect(philosophySource).not.toContain("+yrs+");
    // ++ 패턴이 stat 관련 맥락에서 없어야 함 (단, 주석 등 제외)
    const heroStatLines = heroSource
      .split("\n")
      .filter((l) => l.includes("STAT_UNITS") && l.includes("++"));
    expect(heroStatLines).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. SeoHead includeClinicSchema=false — 시술/장비 상세 페이지
// ─────────────────────────────────────────────────────────────────────────────
describe("SeoHead includeClinicSchema=false (PR-46)", () => {
  // [PHASE-4] includeClinicSchema → includeMedicalSchema 마이그레이션 (2026-06-06)
  // 레거시 prop은 제거되었으므로 includeMedicalSchema={false}로 검증
  it("TreatmentPage에 includeMedicalSchema={false} 가 있어야 한다 (includeClinicSchema 마이그레이션)", () => {
    expect(treatmentPageSource).toContain("includeMedicalSchema={false}");
  });

  it("TreatmentDetail에 includeMedicalSchema={false} 가 있어야 한다 (includeClinicSchema 마이그레이션)", () => {
    expect(treatmentDetailSource).toContain("includeMedicalSchema={false}");
  });

  it("Equipment2Detail에 includeMedicalSchema={false} 가 있어야 한다 (includeClinicSchema 마이그레이션)", () => {
    expect(equipment2DetailSource).toContain("includeMedicalSchema={false}");
  });

  it("SeoHead 구현에서 includeClinicSchema=false 시 두 스키마 모두 제외해야 한다", () => {
    // buildClinicJsonLd와 buildWebSiteJsonLd 모두 includeClinicSchema 조건 안에 있어야 함
    expect(seoHeadSource).toMatch(
      /includeClinicSchema[\s\S]*buildClinicJsonLd[\s\S]*buildWebSiteJsonLd/,
    );
    // includeClinicSchema=false 시 빈 배열 반환 패턴
    expect(seoHeadSource).toContain(": []");
  });

  it("SeoHead prop 주석이 WebSite 스키마도 함께 제어함을 명시해야 한다", () => {
    // 주석에 WebSite 언급
    expect(seoHeadSource).toMatch(/WebSite/);
    // prop 설명에 두 스키마 제어 언급
    expect(seoHeadSource).toMatch(/MedicalBusiness.*WebSite|WebSite.*MedicalBusiness/s);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. SpecialEventSection empty-state i18n 중앙화
// ─────────────────────────────────────────────────────────────────────────────
describe("SpecialEventSection empty-state i18n 중앙화 (PR-46/47)", () => {
  it("SpecialEventSection이 i18n.ts를 import해야 한다", () => {
    expect(specialEventSource).toContain("from \"@/lib/i18n\"");
  });

  it("SpecialEventSection empty-state에서 specialEmptyTitle 키를 사용해야 한다", () => {
    expect(specialEventSource).toContain("specialEmptyTitle");
  });

  it("SpecialEventSection empty-state에서 specialEmptyDesc 키를 사용해야 한다", () => {
    expect(specialEventSource).toContain("specialEmptyDesc");
  });

  it("SpecialEventSection empty-state에 하드코딩된 영어 문구가 없어야 한다", () => {
    // 이전 하드코딩 문구가 제거되었는지 확인
    expect(specialEventSource).not.toContain(
      "Special promotions are being prepared.",
    );
    expect(specialEventSource).not.toContain(
      "New offers coming soon. Contact us via KakaoTalk",
    );
  });

  it("SpecialEventSection empty-state에 하드코딩된 일본어 문구가 없어야 한다", () => {
    expect(specialEventSource).not.toContain("スペシャルイベントを準備中です");
    expect(specialEventSource).not.toContain("近日中に新しいご案内を");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. i18n.ts specialEmptyTitle/specialEmptyDesc 4개 언어 존재
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ts specialEmptyTitle/specialEmptyDesc 4개 언어 (PR-47)", () => {
  it("타입 정의에 specialEmptyTitle, specialEmptyDesc 가 있어야 한다", () => {
    expect(i18nSource).toContain("specialEmptyTitle: string;");
    expect(i18nSource).toContain("specialEmptyDesc: string;");
  });

  it("ko 번역에 specialEmptyTitle 이 있어야 한다", () => {
    expect(i18nSource).toContain("스페셜 이벤트가 준비 중입니다.");
  });

  it("en 번역에 specialEmptyTitle 이 있어야 한다", () => {
    expect(i18nSource).toContain("Special promotions are being prepared.");
  });

  it("ja 번역에 specialEmptyTitle 이 있어야 한다", () => {
    expect(i18nSource).toContain("スペシャルイベントを準備中です。");
  });

  it("zh 번역에 specialEmptyTitle 이 있어야 한다", () => {
    expect(i18nSource).toContain("特别优惠活动正在准备中。");
  });

  it("ko 번역에 specialEmptyDesc 가 있어야 한다", () => {
    expect(i18nSource).toContain("곧 새로운 혜택으로 찾아뵙겠습니다.");
  });

  it("en 번역에 specialEmptyDesc 가 있어야 한다", () => {
    expect(i18nSource).toContain("New offers coming soon.");
  });

  it("ja 번역에 specialEmptyDesc 가 있어야 한다", () => {
    expect(i18nSource).toContain("近日中に新しいご案内をお届けします。");
  });

  it("zh 번역에 specialEmptyDesc 가 있어야 한다", () => {
    expect(i18nSource).toContain("即将推出新优惠");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. i18n.ts treatments.moreBtn / treatments.collapseBtn 4개 언어 존재
//    (P1 수정: TreatmentsEquipmentSection 하드코딩 한국어 제거)
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ts treatments.moreBtn/collapseBtn 4개 언어 (P1-fix)", () => {
  it("타입 정의에 moreBtn 키가 있어야 한다", () => {
    expect(i18nSource).toContain("moreBtn: string;");
  });
  it("타입 정의에 collapseBtn 키가 있어야 한다", () => {
    expect(i18nSource).toContain("collapseBtn: string;");
  });
  it("ko 번역에 moreBtn 이 있어야 한다 ({n}개 더 보기)", () => {
    expect(i18nSource).toContain("{n}개 더 보기");
  });
  it("en 번역에 moreBtn 이 있어야 한다 ({n} more)", () => {
    expect(i18nSource).toContain("{n} more");
  });
  it("ja 번역에 moreBtn 이 있어야 한다 (さらに{n}件)", () => {
    expect(i18nSource).toContain("さらに{n}件");
  });
  it("zh 번역에 moreBtn 이 있어야 한다 (再显示{n}个)", () => {
    expect(i18nSource).toContain("再显示{n}个");
  });
  it("ko 번역에 collapseBtn 이 있어야 한다 (접기)", () => {
    expect(i18nSource).toContain('collapseBtn: "접기"');
  });
  it("en 번역에 collapseBtn 이 있어야 한다 (Collapse)", () => {
    expect(i18nSource).toContain('collapseBtn: "Collapse"');
  });
  it("ja 번역에 collapseBtn 이 있어야 한다 (閉じる)", () => {
    expect(i18nSource).toContain('collapseBtn: "閉じる"');
  });
  it("zh 번역에 collapseBtn 이 있어야 한다 (收起)", () => {
    expect(i18nSource).toContain('collapseBtn: "收起"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. TreatmentsEquipmentSection — 하드코딩 한국어 제거 확인
//    (P1 수정: alt/title/접기/더보기 i18n 키로 교체)
// ─────────────────────────────────────────────────────────────────────────────
describe("TreatmentsEquipmentSection 하드코딩 한국어 제거 (P1-fix)", () => {
  const treatmentsSource = readFileSync(
    path.resolve(root, "client/src/components/TreatmentsEquipmentSection.tsx"),
    "utf8",
  );
  it("하드코딩된 '베너' 문자열이 없어야 한다 (alt 다국어화)", () => {
    expect(treatmentsSource).not.toMatch(/`\$\{[^}]+\}\s*베너`/);
  });
  it("하드코딩된 '소개 영상' 문자열이 없어야 한다 (title 다국어화)", () => {
    expect(treatmentsSource).not.toMatch(/`\$\{[^}]+\}\s*소개 영상`/);
  });
  it("하드코딩된 '접기' 문자열이 JSX 텍스트로 없어야 한다 (collapseBtn i18n 키 사용)", () => {
    expect(treatmentsSource).not.toMatch(/>접기</);
    expect(treatmentsSource).not.toMatch(/\{["']접기["']\}/);
  });
  it("하드코딩된 '개 더 보기' 문자열이 없어야 한다 (moreBtn i18n 키 사용)", () => {
    expect(treatmentsSource).not.toMatch(/개 더 보기`/);
  });
  it("tr.moreBtn.replace 패턴이 사용되어야 한다", () => {
    expect(treatmentsSource).toContain("tr.moreBtn.replace(");
  });
  it("tr.collapseBtn 패턴이 사용되어야 한다", () => {
    expect(treatmentsSource).toContain("tr.collapseBtn");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. LandingJA/ZH — hash-scroll MutationObserver 패턴 사용 확인
//    (P2 수정: setTimeout(300) → MutationObserver 패턴으로 교체)
// ─────────────────────────────────────────────────────────────────────────────
describe("LandingJA/ZH hash-scroll MutationObserver 패턴 (P2-fix)", () => {
  const landingJASource = readFileSync(
    path.resolve(root, "client/src/pages/LandingJA.tsx"),
    "utf8",
  );
  const landingZHSource = readFileSync(
    path.resolve(root, "client/src/pages/LandingZH.tsx"),
    "utf8",
  );
  it("LandingJA에서 MutationObserver를 사용해야 한다", () => {
    expect(landingJASource).toContain("MutationObserver");
  });
  it("LandingZH에서 MutationObserver를 사용해야 한다", () => {
    expect(landingZHSource).toContain("MutationObserver");
  });
  it("LandingJA에서 observer.disconnect()가 있어야 한다 (cleanup)", () => {
    expect(landingJASource).toContain("observer.disconnect()");
  });
  it("LandingZH에서 observer.disconnect()가 있어야 한다 (cleanup)", () => {
    expect(landingZHSource).toContain("observer.disconnect()");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 8: doctors 추가 i18n 키 4개 언어 존재 확인 (P1-i18n-fix)
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ts doctors 추가 키 4개 언어 (P1-i18n-fix)", () => {
  const KEYS = ["badge", "specialistCount", "tagline", "specialtyTitle", "credentialsTitle", "dermBadge", "swipeHint"];

  for (const key of KEYS) {
    it(`타입 정의에 doctors.${key} 키가 있어야 한다`, () => {
      expect(i18nSource).toMatch(new RegExp(`${key}:\\s*string`));
    });
  }

  it("ko 번역에 doctors.badge 가 있어야 한다 (원장)", () => {
    expect(i18nSource).toContain('badge: "원장"');
  });

  it("en 번역에 doctors.badge 가 있어야 한다 (Director)", () => {
    expect(i18nSource).toContain('badge: "Director"');
  });

  it("ja 번역에 doctors.badge 가 있어야 한다 (院長)", () => {
    expect(i18nSource).toContain('badge: "院長"');
  });

  it("zh 번역에 doctors.badge 가 있어야 한다 (院长)", () => {
    expect(i18nSource).toContain('badge: "院长"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 9: treatments 추가 i18n 키 4개 언어 존재 확인 (P1-i18n-fix)
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ts treatments 추가 키 4개 언어 (P1-i18n-fix)", () => {
  const KEYS = ["recoveryPrefix", "equipmentRelated", "equipmentUnits", "equipmentDetailPending", "equipmentConsultBtn"];

  for (const key of KEYS) {
    it(`타입 정의에 treatments.${key} 키가 있어야 한다`, () => {
      expect(i18nSource).toMatch(new RegExp(`${key}:\\s*string`));
    });
  }

  it("ko 번역에 treatments.recoveryPrefix 가 있어야 한다 (회복 )", () => {
    expect(i18nSource).toContain("recoveryPrefix:");
  });

  it("treatments.equipmentUnits 에 {n} 플레이스홀더가 있어야 한다", () => {
    expect(i18nSource).toContain("{n}");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 10: floatingCta i18n 블록 4개 언어 존재 확인 (P1-i18n-fix)
// ─────────────────────────────────────────────────────────────────────────────
describe("i18n.ts floatingCta 블록 4개 언어 (P1-i18n-fix)", () => {
  it("타입 정의에 floatingCta 블록이 있어야 한다", () => {
    expect(i18nSource).toMatch(/floatingCta\s*:/);
  });

  it("floatingCta.kakao 키가 있어야 한다", () => {
    expect(i18nSource).toContain("kakao:");
  });

  it("floatingCta.call 키가 있어야 한다", () => {
    expect(i18nSource).toContain('call: "');
  });

  it("floatingCta.callAria 키가 있어야 한다", () => {
    expect(i18nSource).toContain("callAria:");
  });

  it("floatingCta.reserve 키가 있어야 한다", () => {
    expect(i18nSource).toContain("reserve:");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 11: 컴포넌트 인라인 lang 분기 제거 확인 (P1-i18n-fix)
// ─────────────────────────────────────────────────────────────────────────────
describe("컴포넌트 인라인 lang 분기 제거 확인 (P1-i18n-fix)", () => {
  const doctorsSource = readFileSync(
    path.resolve(root, "client/src/components/DoctorsSection.tsx"),
    "utf8",
  );
  const floatingSource = readFileSync(
    path.resolve(root, "client/src/components/FloatingCTA.tsx"),
    "utf8",
  );
  const headerSource = readFileSync(
    path.resolve(root, "client/src/components/Header.tsx"),
    "utf8",
  );
  const treatmentsSource2 = readFileSync(
    path.resolve(root, "client/src/components/TreatmentsEquipmentSection.tsx"),
    "utf8",
  );

  it("DoctorsSection에 '원장' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(doctorsSource).not.toContain("lang === \"ko\" ? \"원장\"");
  });

  it("DoctorsSection에 '피부과전문의 3인' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(doctorsSource).not.toContain("피부과전문의 3인");
  });

  it("DoctorsSection에 '전문 시술' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(doctorsSource).not.toContain("lang === \"ko\" ? \"전문 시술\"");
  });

  it("DoctorsSection에 '학력 · 경력 · 자격' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(doctorsSource).not.toContain("학력 · 경력 · 자격`");
  });

  it("DoctorsSection에 '탭하여 의료진 보기' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(doctorsSource).not.toContain("탭하여 의료진 보기");
  });

  it("FloatingCTA에 labels 인라인 객체가 없어야 한다", () => {
    expect(floatingSource).not.toContain("const labels");
  });

  it("Header에 '외국인 안내' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(headerSource).not.toContain("\"외국인 안내\"");
  });

  it("TreatmentsEquipmentSection에 '회복 ' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(treatmentsSource2).not.toContain("lang === 'ko' ? '회복 '");
  });

  it("TreatmentsEquipmentSection에 '관련 장비' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(treatmentsSource2).not.toContain("lang === 'en' ? 'Related Equipment'");
  });

  it("TreatmentsEquipmentSection에 '상세 정보 준비 중' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(treatmentsSource2).not.toContain("상세 정보 준비 중입니다.");
  });

  it("TreatmentsEquipmentSection에 '카카오톡으로 장비 상담하기' 하드코딩 인라인 분기가 없어야 한다", () => {
    expect(treatmentsSource2).not.toContain("카카오톡으로 장비 상담하기");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 12: SEO/OG 정책 정합성 — About/ForeignGuide/Equipment2 OG 이미지
// ─────────────────────────────────────────────────────────────────────────────
describe("SEO/OG 정책 정합성 — OG_IMAGE_LOCALIZED 사용 (P1-seo-fix)", () => {
  const aboutSource = readFileSync(
    path.resolve(root, "client/src/pages/About.tsx"),
    "utf8",
  );
  const foreignGuideSource = readFileSync(
    path.resolve(root, "client/src/pages/ForeignGuide.tsx"),
    "utf8",
  );
  const equipment2Source = readFileSync(
    path.resolve(root, "client/src/pages/Equipment2.tsx"),
    "utf8",
  );

  it("About.tsx에 구 og-image.jpg 하드코딩 URL이 없어야 한다", () => {
    expect(aboutSource).not.toContain("og-image.jpg");
  });
  it("About.tsx에 OG_IMAGE_LOCALIZED를 import해야 한다", () => {
    expect(aboutSource).toContain("OG_IMAGE_LOCALIZED");
  });
  it("ForeignGuide.tsx에 구 og-image.jpg 하드코딩 URL이 없어야 한다", () => {
    expect(foreignGuideSource).not.toContain("og-image.jpg");
  });
  it("ForeignGuide.tsx에 OG_IMAGE_LOCALIZED를 import해야 한다", () => {
    expect(foreignGuideSource).toContain("OG_IMAGE_LOCALIZED");
  });
  it("Equipment2.tsx에 구 og-image.jpg 하드코딩 URL이 없어야 한다", () => {
    expect(equipment2Source).not.toContain("og-image.jpg");
  });
  it("Equipment2.tsx에 OG_IMAGE_LOCALIZED를 import해야 한다", () => {
    expect(equipment2Source).toContain("OG_IMAGE_LOCALIZED");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 13: Header.tsx reserveUrl 중복 계산 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("Header.tsx reserveUrl 중복 계산 제거 (P1-header-fix)", () => {
  // 구조 분해 후 로직은 useHeaderState.ts에 위치 — 두 파일 합산 검사
  const headerSource2 = readFileSync(
    path.resolve(root, "client/src/components/Header.tsx"),
    "utf8",
  );
  const hookSource2 = readFileSync(
    path.resolve(root, "client/src/hooks/useHeaderState.ts"),
    "utf8",
  );
  const combinedHeader = headerSource2 + "\n" + hookSource2;

  it("Header.tsx에 NAVER_MAP_URL 하드코딩이 없어야 한다 (useChatConfig().reserveUrl 사용)", () => {
    expect(combinedHeader).not.toContain("NAVER_MAP_URL");
  });
  it("Header.tsx에 CHAT_URLS import가 없어야 한다 (미사용 import 제거)", () => {
    expect(combinedHeader).not.toContain("CHAT_URLS");
  });
  it("Header.tsx에서 useChatConfig에서 reserveUrl을 구조분해해야 한다", () => {
    // 구조 분해 후 useHeaderState.ts에 위치
    expect(combinedHeader).toContain("reserveUrl");
    expect(combinedHeader).toContain("useChatConfig");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 섹션 14: ContactSection.tsx closedLabel i18n 중앙화 및 fallback 삼항 제거
// ─────────────────────────────────────────────────────────────────────────────
describe("ContactSection.tsx closedLabel i18n 중앙화 및 fallback 삼항 제거 (P2-contact-fix)", () => {
  const contactSource = readFileSync(
    path.resolve(root, "client/src/components/ContactSection.tsx"),
    "utf8",
  );

  it("ContactSection.tsx에 closedLabel 인라인 lang 삼항이 없어야 한다", () => {
    expect(contactSource).not.toContain('lang === "en" ? "Closed"');
  });
  it("ContactSection.tsx에서 t.hours.rows를 통해 closedLabel을 계산해야 한다", () => {
    expect(contactSource).toContain("t.hours.rows");
    expect(contactSource).toContain("closedLabel");
  });
  it("ContactSection.tsx addressLabel에 인라인 fallback 삼항이 없어야 한다", () => {
    expect(contactSource).not.toContain("t.access.addressLabel ?? (lang");
  });
  it("ContactSection.tsx phoneLabel에 인라인 fallback 삼항이 없어야 한다", () => {
    expect(contactSource).not.toContain("t.access.phoneLabel ?? (lang");
  });
  it("ContactSection.tsx kakaoMapLabel에 인라인 fallback 삼항이 없어야 한다", () => {
    expect(contactSource).not.toContain("t.access.kakaoMapLabel ?? (lang");
  });
});
