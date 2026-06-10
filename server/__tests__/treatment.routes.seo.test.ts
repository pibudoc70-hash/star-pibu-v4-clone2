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

// routes.ts가 존재하면 함께 검사 (App.tsx 리팩터링 시 라우트 선언이 분리될 수 있음)
const routesSource = existsSync(path.resolve(process.cwd(), "client/src/routes.ts"))
  ? readFileSync(path.resolve(process.cwd(), "client/src/routes.ts"), "utf8")
  : "";

/** App.tsx 또는 routes.ts 중 하나에 해당 문자열이 있으면 true */
function inRouteConfig(str: string): boolean {
  return appSource.includes(str) || routesSource.includes(str);
}

const treatmentPageSource = readFileSync(
  path.resolve(process.cwd(), "client/src/pages/TreatmentPage.tsx"),
  "utf8",
);

describe("PR-24: TreatmentPage 다국어 라우팅 정합성", () => {
  describe("라우트 존재 여부 (App.tsx 또는 routes.ts)", () => {
    it("/treatments/:slug 기본 한국어 라우트가 존재해야 한다", () => {
      expect(inRouteConfig('path={"/treatments/:slug"}')
        || inRouteConfig('"treatments/:slug"')
        || inRouteConfig("'treatments/:slug'")
      ).toBe(true);
    });

    it("/en/treatments/:slug 영어 라우트가 존재해야 한다", () => {
      // withLangPrefixes 헬퍼가 있으면 언어별 접두사를 자동 생성하므로 routes.ts에 treatments/:slug만 있어도 통과
      const usesLangHelper = routesSource.includes('"treatments/:slug"') && routesSource.includes('withLangPrefixes');
      expect(
        inRouteConfig('path={"/en/treatments/:slug"}')
        || inRouteConfig('"en/treatments/:slug"')
        || inRouteConfig("'en/treatments/:slug'")
        || usesLangHelper
      ).toBe(true);
    });

    it("/ja/treatments/:slug 일본어 라우트가 존재해야 한다", () => {
      const usesLangHelper = routesSource.includes('"treatments/:slug"') && routesSource.includes('withLangPrefixes');
      expect(
        inRouteConfig('path={"/ja/treatments/:slug"}')
        || inRouteConfig('"ja/treatments/:slug"')
        || inRouteConfig("'ja/treatments/:slug'")
        || usesLangHelper
      ).toBe(true);
    });

    it("/zh/treatments/:slug 중국어 라우트가 존재해야 한다", () => {
      const usesLangHelper = routesSource.includes('"treatments/:slug"') && routesSource.includes('withLangPrefixes');
      expect(
        inRouteConfig('path={"/zh/treatments/:slug"}')
        || inRouteConfig('"zh/treatments/:slug"')
        || inRouteConfig("'zh/treatments/:slug'")
        || usesLangHelper
      ).toBe(true);
    });

    it("4개 언어 라우트가 모두 TreatmentPage 컴포넌트를 사용해야 한다", () => {
      // routes.ts 기반 구조: LANG_ROUTES에 treatments/:slug 항목이 있고 TreatmentPage를 참조
      const usesRoutesTs =
        routesSource.includes('"treatments/:slug"') &&
        routesSource.includes("TreatmentPage");
      // App.tsx 직접 선언 구조: <Route> 태그 4개
      const treatmentRoutes = appSource
        .split("\n")
        .filter((line) => line.includes("/treatments/:slug") && line.includes("<Route"));
      const usesAppTsx = treatmentRoutes.length === 4 &&
        treatmentRoutes.every(line => line.includes("TreatmentPage"));
      expect(usesRoutesTs || usesAppTsx).toBe(true);
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
    // App.tsx 직접 선언 또는 routes.ts 경유 모두 허용
    const inApp = appSource
      .split("\n")
      .some((line) => line.includes('path={"/treatment/:name"}') && line.includes("<Route") && line.includes("TreatmentRedirect"));
    const inRoutes =
      routesSource.includes('"treatment/:name"') &&
      routesSource.includes("TreatmentRedirect");
    // App.tsx에 <Route path="/treatment/:name" ...> 가 있으면 직접 선언 방식
    const hasDirectRoute = appSource.includes('path="/treatment/:name"') ||
      appSource.includes('path={"/treatment/:name"}');
    expect(inApp || inRoutes || hasDirectRoute).toBe(true);
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
