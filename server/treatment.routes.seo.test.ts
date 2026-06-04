/**
 * PR-24 검증 테스트: TreatmentPage 다국어 라우팅 및 SEO URL 정합성
 *
 * 소스코드 정적 검사 방식 (TreatmentsEquipmentSection.copy.test.ts 패턴 동일)
 * - App.tsx에 4개 treatment 라우트 존재 여부
 * - TreatmentPage.tsx의 LANG_PREFIX 정의 및 pageUrl/canonical/hreflang/JSON-LD 정합성
 * - 내부 이동 locale 유지 여부
 */
import { readFileSync } from "node:fs";
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
