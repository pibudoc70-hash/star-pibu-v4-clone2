/**
 * PR-24/31/32/33 검증 테스트: TreatmentPage 다국어 라우팅 및 SEO URL 정합성
 *
 * 소스코드 정적 검사 방식 (TreatmentsEquipmentSection.copy.test.ts 패턴 동일)
 * - App.tsx에 4개 treatment 라우트 존재 여부
 * - TreatmentPage.tsx의 LANG_PREFIX 정의 및 pageUrl/canonical/hreflang/JSON-LD 정합성
 * - 내부 이동 locale 유지 여부
 * - PR-32: 7개 시술 slug 데이터 파일 존재 여부
 * - PR-33: /treatment/:name → TreatmentRedirect 라우팅 여부
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const appSource = readFileSync(
  path.resolve(process.cwd(), "client/src/App.tsx"),
  "utf8",
);

const treatmentPageSource = readFileSync(
  path.resolve(process.cwd(), "client/src/pages/TreatmentPage.tsx"),
  "utf8",
);

describe("PR-24: TreatmentPage 다국어 라우팅 정합성", () => {
  describe("App.tsx 라우트 존재 여부", () => {
    it("/treatments/:slug 기본 한국어 라우트가 존재해야 한다", () => {
      expect(appSource).toContain('path={"/treatments/:slug"}');
    });

    it("/en/treatments/:slug 영어 라우트가 존재해야 한다", () => {
      expect(appSource).toContain('path={"/en/treatments/:slug"}');
    });

    it("/ja/treatments/:slug 일본어 라우트가 존재해야 한다", () => {
      expect(appSource).toContain('path={"/ja/treatments/:slug"}');
    });

    it("/zh/treatments/:slug 중국어 라우트가 존재해야 한다", () => {
      expect(appSource).toContain('path={"/zh/treatments/:slug"}');
    });

    it("4개 라우트가 모두 TreatmentPage 컴포넌트를 사용해야 한다", () => {
      // <Route 태그가 있는 라인만 필터링 (주석 라인 제외 — PR-31에서 주석에 /treatments/:slug 문자열이 포함됨)
      const treatmentRoutes = appSource
        .split("\n")
        .filter((line) => line.includes("/treatments/:slug") && line.includes("<Route"));
      // 4개 라우트 모두 TreatmentPage를 참조
      for (const line of treatmentRoutes) {
        expect(line).toContain("TreatmentPage");
      }
      expect(treatmentRoutes).toHaveLength(4);
    });
  });

  describe("TreatmentPage.tsx SEO URL 정합성", () => {
    it("LANG_PREFIX 매핑이 4개 언어 모두 정의되어야 한다", () => {
      expect(treatmentPageSource).toContain('const LANG_PREFIX: Record<SupportedLang, string>');
      expect(treatmentPageSource).toContain('ko: ""');
      expect(treatmentPageSource).toContain('en: "/en"');
      expect(treatmentPageSource).toContain('ja: "/ja"');
      expect(treatmentPageSource).toContain('zh: "/zh"');
    });

    it("pageUrl이 langPrefix를 포함한 BASE_URL 기반으로 생성되어야 한다", () => {
      expect(treatmentPageSource).toContain(
        "const pageUrl = `${BASE_URL}${langPrefix}/treatments/${slug}`"
      );
    });

    it("buildHreflangs 호출이 4개 언어별 경로를 사용해야 한다", () => {
      expect(treatmentPageSource).toContain("`/treatments/${slug}`");
      expect(treatmentPageSource).toContain("`/en/treatments/${slug}`");
      expect(treatmentPageSource).toContain("`/ja/treatments/${slug}`");
      expect(treatmentPageSource).toContain("`/zh/treatments/${slug}`");
    });

    it("JSON-LD buildJsonLd가 pageUrl을 인자로 받아야 한다", () => {
      // 함수 시그니처에 pageUrl 파라미터가 있어야 함
      expect(treatmentPageSource).toContain(
        "function buildJsonLd(t: TreatmentI18n, lang: SupportedLang, pageUrl: string)"
      );
      // JSON-LD url 필드가 pageUrl을 사용해야 함
      expect(treatmentPageSource).toContain('"url": pageUrl');
    });

    it("SeoHead canonical과 ogUrl이 pageUrl을 사용해야 한다", () => {
      expect(treatmentPageSource).toContain("canonical={pageUrl}");
      expect(treatmentPageSource).toContain("ogUrl={pageUrl}");
    });
  });

  describe("TreatmentPage.tsx 내부 이동 locale 유지", () => {
    it("홈 버튼이 localizedHomePath를 사용해야 한다", () => {
      expect(treatmentPageSource).toContain("setLocation(localizedHomePath)");
    });

    it("다른 시술 카드 이동이 langPrefix를 포함해야 한다", () => {
      expect(treatmentPageSource).toContain(
        "setLocation(`${langPrefix}/treatments/${t.slug}`)"
      );
    });

    it("localizedHomePath 계산이 langPrefix 기반이어야 한다", () => {
      expect(treatmentPageSource).toContain(
        'const localizedHomePath = langPrefix || "/"'
      );
    });
  });
});

describe("PR-32: 7개 시술 slug 데이터 파일 존재 여부", () => {
  const EXPECTED_SLUGS = [
    "ulthera",
    "thermage",
    "under-eye-fat",
    "ulthera-classic",
    "pico-laser",
    "ruby-pico-laser",
    "rosacea",
  ];

  for (const slug of EXPECTED_SLUGS) {
    it(`${slug}.ts 데이터 파일이 존재해야 한다`, () => {
      const filePath = path.resolve(
        process.cwd(),
        `client/src/data/treatments/${slug}.ts`
      );
      expect(existsSync(filePath)).toBe(true);
    });
  }

  it("TREATMENT_DATA index에 7개 slug가 모두 등록되어야 한다", () => {
    const indexSource = readFileSync(
      path.resolve(process.cwd(), "client/src/data/treatments/index.ts"),
      "utf8",
    );
    for (const slug of EXPECTED_SLUGS) {
      // slug가 TREATMENT_DATA 키로 등록되어 있는지 확인
      const isRegistered =
        indexSource.includes(`"${slug}":`) ||
        indexSource.includes(`  ${slug},`);
      expect(isRegistered).toBe(true);
    }
  });
});

describe("PR-33: /treatment/:name redirect 정책 검증", () => {
  it("/treatment/:name 라우트가 TreatmentRedirect를 사용해야 한다", () => {
    const routeLines = appSource
      .split("\n")
      .filter((line) => line.includes('path={"/treatment/:name"}') && line.includes("<Route"));
    expect(routeLines).toHaveLength(1);
    expect(routeLines[0]).toContain("TreatmentRedirect");
  });

  it("TreatmentRedirect.tsx가 존재해야 한다", () => {
    const filePath = path.resolve(
      process.cwd(),
      "client/src/pages/TreatmentRedirect.tsx"
    );
    expect(existsSync(filePath)).toBe(true);
  });

  it("TreatmentRedirect.tsx가 7개 시술 NAME_TO_SLUG 매핑을 포함해야 한다", () => {
    const redirectSource = readFileSync(
      path.resolve(process.cwd(), "client/src/pages/TreatmentRedirect.tsx"),
      "utf8",
    );
    const expectedNames = [
      "울쎄라",
      "울쎄라피 프라임",
      "써마지 FLX",
      "눈밑지방재배치",
      "피코레이저",
      "루비피코레이저",
      "안면홍조 치료",
    ];
    for (const name of expectedNames) {
      expect(redirectSource).toContain(name);
    }
  });

  it("TreatmentRedirect.tsx가 replace: true로 navigate를 호출해야 한다", () => {
    const redirectSource = readFileSync(
      path.resolve(process.cwd(), "client/src/pages/TreatmentRedirect.tsx"),
      "utf8",
    );
    expect(redirectSource).toContain("replace: true");
  });
});
