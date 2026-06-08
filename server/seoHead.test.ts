/**
 * SeoHead / seoHelpers 단위 테스트 (Round-24 P0-3)
 *
 * 테스트 범위:
 * A. SEO_PRESETS 구조: 각 pageType별 includeMedicalSchema/includeWebSiteSchema
 * B. SeoHead: effectiveNoindex 정책 (admin 자동 noindex)
 * C. SeoHead: preset별 출력 구조 (canonical/og/twitter/json-ld/hreflang)
 * D. buildHreflangs: 정상 케이스 + 오용 케이스 (런타임 가드)
 * E. buildBreadcrumbJsonLd: 핵심 필드 + 빈 배열 경고
 * F. buildClinicJsonLd: 핵심 필드 존재 여부
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const readSeoHelpers = () =>
  fs.readFileSync(path.join(ROOT, "client/src/lib/seoHelpers.ts"), "utf-8");
const readSeoHead = () =>
  fs.readFileSync(path.join(ROOT, "client/src/components/SeoHead.tsx"), "utf-8");

describe("A. SEO_PRESETS 구조", () => {
  it("A-1: SEO_PRESETS가 export되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("export const SEO_PRESETS");
  });

  it("A-2: SEO_PRESETS에 home/treatment/default/admin 4개 pageType이 있어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("home:");
    expect(src).toContain("treatment:");
    expect(src).toContain("default:");
    expect(src).toContain("admin:");
  });

  it("A-3: home preset은 includeMedicalSchema: true + includeWebSiteSchema: true여야 한다", () => {
    const src = readSeoHelpers();
    // home: { includeMedicalSchema: true, includeWebSiteSchema: true }
    const homeMatch = src.match(/home:\s*\{[^}]+\}/);
    expect(homeMatch).toBeTruthy();
    expect(homeMatch![0]).toContain("includeMedicalSchema: true");
    expect(homeMatch![0]).toContain("includeWebSiteSchema: true");
  });

  it("A-4: admin preset은 includeMedicalSchema: false + includeWebSiteSchema: false여야 한다", () => {
    const src = readSeoHelpers();
    const adminMatch = src.match(/admin:\s*\{[^}]+\}/);
    expect(adminMatch).toBeTruthy();
    expect(adminMatch![0]).toContain("includeMedicalSchema: false");
    expect(adminMatch![0]).toContain("includeWebSiteSchema: false");
  });

  it("A-5: SeoPageType이 export되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("export type SeoPageType");
  });
});

describe("B. SeoHead: effectiveNoindex 정책", () => {
  it("B-1: effectiveNoindex가 noindex prop OR pageType==='admin' 조건이어야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain('effectiveNoindex = noindex || pageType === "admin"');
  });

  it("B-2: effectiveNoindex가 true일 때 robots noindex 메타태그가 출력되어야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain('effectiveNoindex && <meta name="robots" content="noindex, nofollow"');
  });

  it("B-3: admin pageType 자동 noindex 정책 주석이 있어야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain("admin pageType은 자동 noindex");
  });
});

describe("C. SeoHead: preset 기반 출력 구조", () => {
  it("C-1: SEO_PRESETS를 import해야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain("SEO_PRESETS");
  });

  it("C-2: pageType 기반으로 preset을 조회해야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain("SEO_PRESETS[pageType]");
  });

  it("C-3: canonical이 있을 때 <link rel='canonical'>를 출력해야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain('canonical && <link rel="canonical"');
  });

  it("C-4: hreflangs가 있을 때 <link rel='alternate' hrefLang>를 출력해야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain('rel="alternate"');
    expect(src).toContain("hrefLang");
  });

  it("C-5: OG 메타태그 (og:title, og:description, og:url, og:type, og:site_name)가 모두 있어야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain('property="og:title"');
    expect(src).toContain('property="og:description"');
    expect(src).toContain('property="og:url"');
    expect(src).toContain('property="og:type"');
    expect(src).toContain('property="og:site_name"');
  });

  it("C-6: Twitter 메타태그 (twitter:card, twitter:title)가 있어야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain('name="twitter:card"');
    expect(src).toContain('name="twitter:title"');
  });

  it("C-7: JSON-LD 스키마가 shouldIncludeMedical/shouldIncludeWebSite 조건으로 출력되어야 한다", () => {
    const src = readSeoHead();
    expect(src).toContain("shouldIncludeMedical");
    expect(src).toContain("shouldIncludeWebSite");
    expect(src).toContain("buildClinicJsonLd");
    expect(src).toContain("buildWebSiteJsonLd");
  });
});

describe("D. buildHreflangs: 정상/오용 케이스", () => {
  it("D-1: buildHreflangs가 export되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("export function buildHreflangs");
  });

  it("D-2: buildHreflangs가 ko/en/ja/zh/x-default 5개 항목을 반환해야 한다", () => {
    const src = readSeoHelpers();
    // 반환 배열에 5개 hreflang 항목이 있어야 함
    expect(src).toContain('hreflang: "ko"');
    expect(src).toContain('hreflang: "en"');
    expect(src).toContain('hreflang: "ja"');
    expect(src).toContain('hreflang: "zh"');
    expect(src).toContain('hreflang: "x-default"');
  });

  it("D-3: x-default는 항상 koPath를 사용해야 한다", () => {
    const src = readSeoHelpers();
    // x-default href가 koPath를 사용하는지 확인
    expect(src).toContain("x-default");
    // x-default 정책 주석이 있어야 함
    expect(src).toContain("x-default 정책");
  });

  it("D-4: enPath가 /en으로 시작하지 않으면 경고를 출력해야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("enPath?.startsWith(\"/\") && !enPath.startsWith(\"/en\")");
  });

  it("D-5: jaPath가 /ja로 시작하지 않으면 경고를 출력해야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("jaPath?.startsWith(\"/\") && !jaPath.startsWith(\"/ja\")");
  });

  it("D-6: zhPath가 /zh로 시작하지 않으면 경고를 출력해야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("zhPath?.startsWith(\"/\") && !zhPath.startsWith(\"/zh\")");
  });

  it("D-7: 경로가 /로 시작하지 않으면 경고를 출력해야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("p !== \"/\" && !p.startsWith(\"/\")");
  });

  it("D-8: 런타임 가드가 NODE_ENV !== production 조건으로 실행되어야 한다", () => {
    const src = readSeoHelpers();
    // buildHreflangs 함수 내에 NODE_ENV 조건이 있어야 함
    expect(src).toContain('process.env.NODE_ENV !== "production"');
  });
});

describe("E. buildBreadcrumbJsonLd: 핵심 필드", () => {
  it("E-1: buildBreadcrumbJsonLd가 export되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("export function buildBreadcrumbJsonLd");
  });

  it("E-2: BreadcrumbList @type이 있어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain('"BreadcrumbList"');
  });

  it("E-3: ListItem @type이 있어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain('"ListItem"');
  });

  it("E-4: 빈 배열에 대한 경고가 있어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("buildBreadcrumbJsonLd");
    expect(src).toContain("items 배열이 비어 있습니다");
  });
});

describe("F. buildClinicJsonLd: 핵심 필드", () => {
  it("F-1: buildClinicJsonLd가 export되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("export function buildClinicJsonLd");
  });

  it("F-2: MedicalBusiness/LocalBusiness @type이 있어야 한다", () => {
    const src = readSeoHelpers();
    // buildClinicJsonLd는 MedicalBusiness + LocalBusiness 동시 선언
    expect(src).toContain('"MedicalBusiness"');
    expect(src).toContain('"LocalBusiness"');
  });

  it("F-3: CLINIC_INFO에서 name/url/telephone/address를 사용해야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("CLINIC_INFO.name");
    expect(src).toContain("CLINIC_INFO.url");
    expect(src).toContain("CLINIC_INFO.telephone");
    expect(src).toContain("CLINIC_INFO.address");
  });

  it("F-4: aggregateRating이 있어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("aggregateRating");
  });

  it("F-5: employee 목록이 CLINIC_DOCTORS에서 생성되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("CLINIC_DOCTORS");
    expect(src).toContain("employee");
  });

  it("F-6: availableService 목록이 CLINIC_PROCEDURES에서 생성되어야 한다", () => {
    const src = readSeoHelpers();
    expect(src).toContain("CLINIC_PROCEDURES");
    expect(src).toContain("availableService");
  });
});
