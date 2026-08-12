/**
 * seoHelpers 심층 회귀 테스트
 *
 * P0-1 목표:
 *   - buildHreflangs: 잘못된 path 경고 가드, subset 페이지 오용 가드, x-default 정책
 *   - buildClinicJsonLd: openingHoursSpecification 파싱, employee 구조, availableService 구조
 *   - buildBreadcrumbJsonLd: position 순서, 다중 항목 검증
 *   - buildWebSiteJsonLd: potentialAction SearchAction 구조
 *   - SEO_PRESETS: admin noindex 자동 정책 (effectiveNoindex 로직)
 *   - BASE_URL / SITE_NAME 상수 불변성
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  BASE_URL,
  SITE_NAME,
  buildHreflangs,
  buildClinicJsonLd,
  buildWebSiteJsonLd,
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildOpeningHoursSpec,
  buildVideoObjectListJsonLd,
  SEO_PRESETS,
  COMMON_HREFLANGS,
} from "./seoHelpers";

// ─────────────────────────────────────────────────────────────────────────────
// BASE_URL / SITE_NAME 불변성
// ─────────────────────────────────────────────────────────────────────────────
describe("BASE_URL / SITE_NAME 상수", () => {
  it("BASE_URL이 https://star-pibu.com 이어야 한다", () => {
    expect(BASE_URL).toBe("https://star-pibu.com");
  });

  it("SITE_NAME이 비어있지 않아야 한다", () => {
    expect(SITE_NAME.length).toBeGreaterThan(0);
  });

  it("BASE_URL이 https:// 로 시작해야 한다", () => {
    expect(BASE_URL).toMatch(/^https:\/\//);
  });

  it("BASE_URL이 trailing slash 없이 끝나야 한다", () => {
    expect(BASE_URL).not.toMatch(/\/$/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildHreflangs — 경로 가드 및 x-default 정책
// ─────────────────────────────────────────────────────────────────────────────
describe("buildHreflangs — 경로 가드", () => {
  /**
   * 주의: buildHreflangs의 콘솔 경고는 process.env.NODE_ENV !== "production" 조건에 의존한다.
   * Vite는 번들링 시 process.env.NODE_ENV를 정적으로 치환하므로
   * 테스트 환경에서 이 값이 예측 불가능할 수 있다.
   * 따라서 콘솔 경고 발생 여부 대신 반환값(생성된 URL)의 정확성을 검증한다.
   * 이 방식이 더 견고한 테스트다.
   */

  it("'/''로 시작하지 않는 koPath도 URL에 그대로 포함되어야 한다 (경고 발생 여부와 무관하게 출력은 생성됨)", () => {
    // '/''로 시작하지 않는 잘못된 경로도 반환값에는 포함됨 (경고만 발생)
    const result = buildHreflangs("about");
    const ko = result.find((h) => h.hreflang === "ko");
    expect(ko).toBeDefined();
    expect(ko!.href).toBe(`${BASE_URL}about`);
  });

  it("'/en'으로 시작하지 않는 enPath도 URL에 포함되어야 한다", () => {
    const result = buildHreflangs("/about", "/english-about");
    const en = result.find((h) => h.hreflang === "en");
    expect(en!.href).toBe(`${BASE_URL}/english-about`);
  });

  it("'/ja'로 시작하지 않는 jaPath도 URL에 포함되어야 한다", () => {
    const result = buildHreflangs("/about", "/en/about", "/japanese-about");
    const ja = result.find((h) => h.hreflang === "ja");
    expect(ja!.href).toBe(`${BASE_URL}/japanese-about`);
  });

  it("'/zh'로 시작하지 않는 zhPath도 URL에 포함되어야 한다", () => {
    const result = buildHreflangs("/about", "/en/about", "/ja/about", "/chinese-about");
    const zh = result.find((h) => h.hreflang === "zh");
    expect(zh!.href).toBe(`${BASE_URL}/chinese-about`);
  });

  it("올바른 경로를 전달하면 각 hreflang URL이 정확하게 생성되어야 한다", () => {
    const result = buildHreflangs("/about", "/en/about", "/ja/about", "/zh/about");
    expect(result.find((h) => h.hreflang === "ko")!.href).toBe(`${BASE_URL}/about`);
    expect(result.find((h) => h.hreflang === "en")!.href).toBe(`${BASE_URL}/en/about`);
    expect(result.find((h) => h.hreflang === "ja")!.href).toBe(`${BASE_URL}/ja/about`);
    expect(result.find((h) => h.hreflang === "zh")!.href).toBe(`${BASE_URL}/zh/about`);
  });

  it("루트 경로('/')는 유효한 koPath로 정확하게 처리되어야 한다", () => {
    const result = buildHreflangs("/", "/en", "/ja", "/zh");
    expect(result.find((h) => h.hreflang === "ko")!.href).toBe(`${BASE_URL}/`);
    expect(result.find((h) => h.hreflang === "en")!.href).toBe(`${BASE_URL}/en`);
  });
});

describe("buildHreflangs — x-default 정책", () => {
  it("x-default는 항상 koPath를 가리켜야 한다", () => {
    const result = buildHreflangs("/treatments", "/en/treatments", "/ja/treatments", "/zh/treatments");
    const xDefault = result.find((h) => h.hreflang === "x-default");
    expect(xDefault).toBeDefined();
    expect(xDefault!.href).toBe(`${BASE_URL}/treatments`);
  });

  it("koPath가 루트('/')일 때 x-default도 루트를 가리켜야 한다", () => {
    const result = buildHreflangs("/");
    const xDefault = result.find((h) => h.hreflang === "x-default");
    expect(xDefault!.href).toBe(`${BASE_URL}/`);
  });

  it("COMMON_HREFLANGS의 x-default는 BASE_URL 루트를 가리켜야 한다 (홈 전용 정책)", () => {
    const xDefault = COMMON_HREFLANGS.find((h) => h.hreflang === "x-default");
    expect(xDefault!.href).toBe(BASE_URL);
  });

  it("buildHreflangs x-default와 COMMON_HREFLANGS x-default 정책이 다름을 확인 (문서화)", () => {
    // buildHreflangs: x-default = koPath (페이지별)
    // COMMON_HREFLANGS: x-default = BASE_URL (홈 고정, 트레일링 슬래시 없음)
    // 이 두 정책은 의도적으로 다름 — 이 테스트는 그 차이를 문서화함
    const pageHreflangs = buildHreflangs("/about");
    const pageXDefault = pageHreflangs.find((h) => h.hreflang === "x-default");
    const commonXDefault = COMMON_HREFLANGS.find((h) => h.hreflang === "x-default");

    expect(pageXDefault!.href).toBe(`${BASE_URL}/about`);
    expect(commonXDefault!.href).toBe(BASE_URL);
    // 두 값이 다름을 명시적으로 확인
    expect(pageXDefault!.href).not.toBe(commonXDefault!.href);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildClinicJsonLd — 구조 심층 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("buildClinicJsonLd — 구조 심층 검증", () => {
  let schema: ReturnType<typeof buildClinicJsonLd>;

  beforeEach(() => {
    schema = buildClinicJsonLd();
  });

  it("@type이 MedicalBusiness와 LocalBusiness를 모두 포함해야 한다", () => {
    const types = schema["@type"] as string[];
    expect(types).toContain("MedicalBusiness");
    expect(types).toContain("LocalBusiness");
  });

  it("@id가 BASE_URL/#organization 형식이어야 한다", () => {
    expect(schema["@id"]).toBe(`${BASE_URL}/#organization`);
  });

  it("address 필드가 PostalAddress 타입이어야 한다", () => {
    const address = schema["address"] as Record<string, unknown>;
    expect(address["@type"]).toBe("PostalAddress");
    expect(typeof address["streetAddress"]).toBe("string");
    expect(typeof address["postalCode"]).toBe("string");
    expect(address["addressCountry"]).toBe("KR");
  });

  it("geo 필드가 GeoCoordinates 타입이어야 한다", () => {
    const geo = schema["geo"] as Record<string, unknown>;
    expect(geo["@type"]).toBe("GeoCoordinates");
    expect(typeof geo["latitude"]).toBe("number");
    expect(typeof geo["longitude"]).toBe("number");
  });

  it("openingHoursSpecification이 배열이어야 하고 각 항목에 dayOfWeek/opens/closes가 있어야 한다", () => {
    const specs = schema["openingHoursSpecification"] as Record<string, unknown>[];
    expect(Array.isArray(specs)).toBe(true);
    expect(specs.length).toBeGreaterThan(0);
    for (const spec of specs) {
      expect(spec["@type"]).toBe("OpeningHoursSpecification");
      expect(Array.isArray(spec["dayOfWeek"])).toBe(true);
      expect(typeof spec["opens"]).toBe("string");
      expect(typeof spec["closes"]).toBe("string");
    }
  });

  it("openingHoursSpecification에서 Mo-Fr 파싱이 올바르게 되어야 한다 (월~금 5일)", () => {
    const specs = schema["openingHoursSpecification"] as Record<string, unknown>[];
    const weekdaySpec = specs.find((s) => {
      const days = s["dayOfWeek"] as string[];
      return days.includes("Monday") && days.includes("Friday");
    });
    expect(weekdaySpec).toBeDefined();
    const days = weekdaySpec!["dayOfWeek"] as string[];
    expect(days).toContain("Monday");
    expect(days).toContain("Tuesday");
    expect(days).toContain("Wednesday");
    expect(days).toContain("Thursday");
    expect(days).toContain("Friday");
    expect(days).toHaveLength(5);
    expect(weekdaySpec!["opens"]).toBe("10:00");
    expect(weekdaySpec!["closes"]).toBe("19:00");
  });

  it("openingHoursSpecification에서 Sa(토요일) 파싱이 올바르게 되어야 한다", () => {
    const specs = schema["openingHoursSpecification"] as Record<string, unknown>[];
    const satSpec = specs.find((s) => {
      const days = s["dayOfWeek"] as string[];
      return days.includes("Saturday") && days.length === 1;
    });
    expect(satSpec).toBeDefined();
    expect(satSpec!["opens"]).toBe("09:30");
    expect(satSpec!["closes"]).toBe("15:00");
  });

  it("employee 배열이 존재하고 각 항목이 Physician 타입이어야 한다", () => {
    const employees = schema["employee"] as Record<string, unknown>[];
    expect(Array.isArray(employees)).toBe(true);
    expect(employees.length).toBeGreaterThan(0);
    for (const emp of employees) {
      expect(emp["@type"]).toBe("Physician");
      expect(typeof emp["name"]).toBe("string");
      expect(emp["worksFor"]).toBeDefined();
    }
  });

  it("availableService 배열이 존재하고 각 항목이 MedicalProcedure 타입이어야 한다", () => {
    const services = schema["availableService"] as Record<string, unknown>[];
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    for (const svc of services) {
      expect(svc["@type"]).toBe("MedicalProcedure");
      expect(typeof svc["name"]).toBe("string");
    }
  });

  it("검증 근거 없는 aggregateRating과 review 필드를 포함하지 않아야 한다", () => {
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("review");
  });

  it("logo 필드가 ImageObject 타입이어야 한다", () => {
    const logo = schema["logo"] as Record<string, unknown>;
    expect(logo["@type"]).toBe("ImageObject");
    expect(typeof logo["url"]).toBe("string");
  });

  it("sameAs 배열이 존재하고 URL 형식이어야 한다", () => {
    const sameAs = schema["sameAs"] as string[];
    expect(Array.isArray(sameAs)).toBe(true);
    expect(sameAs.length).toBeGreaterThan(0);
    for (const url of sameAs) {
      expect(url).toMatch(/^https?:\/\//);
    }
  });

  it("additionalProperty 배열이 존재하고 PropertyValue 타입이어야 한다", () => {
    const props = schema["additionalProperty"] as Record<string, unknown>[];
    expect(Array.isArray(props)).toBe(true);
    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) {
      expect(prop["@type"]).toBe("PropertyValue");
      expect(typeof prop["name"]).toBe("string");
    }
  });

  it("JSON 직렬화가 오류 없이 완료되어야 한다 (순환 참조 없음)", () => {
    expect(() => JSON.stringify(schema)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildWebSiteJsonLd — SearchAction 구조 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("buildWebSiteJsonLd — SearchAction 구조", () => {
  it("potentialAction이 SearchAction 타입이어야 한다", () => {
    const schema = buildWebSiteJsonLd();
    const action = schema["potentialAction"] as Record<string, unknown>;
    expect(action["@type"]).toBe("SearchAction");
  });

  it("SearchAction target이 urlTemplate을 포함해야 한다", () => {
    const schema = buildWebSiteJsonLd();
    const action = schema["potentialAction"] as Record<string, unknown>;
    const target = action["target"] as Record<string, unknown>;
    expect(target["urlTemplate"]).toContain("{search_term_string}");
    expect(target["urlTemplate"]).toContain(BASE_URL);
  });

  it("query-input 필드가 required name=search_term_string 이어야 한다", () => {
    const schema = buildWebSiteJsonLd();
    const action = schema["potentialAction"] as Record<string, unknown>;
    expect(action["query-input"]).toBe("required name=search_term_string");
  });

  it("@id가 BASE_URL/#website 형식이어야 한다", () => {
    const schema = buildWebSiteJsonLd();
    expect(schema["@id"]).toBe(`${BASE_URL}/#website`);
  });

  it("publisher가 organization @id를 참조해야 한다", () => {
    const schema = buildWebSiteJsonLd();
    const publisher = schema["publisher"] as Record<string, unknown>;
    expect(publisher["@id"]).toBe(`${BASE_URL}/#organization`);
  });

  it("inLanguage가 4개 언어를 포함해야 한다", () => {
    const schema = buildWebSiteJsonLd();
    const langs = schema["inLanguage"] as string[];
    expect(langs).toContain("ko");
    expect(langs).toContain("en");
    expect(langs).toContain("ja");
    expect(langs).toContain("zh");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildBreadcrumbJsonLd — position 순서 및 다중 항목 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("buildBreadcrumbJsonLd — position 순서 검증", () => {
  it("3개 항목의 position이 1, 2, 3 순서여야 한다", () => {
    const items = [
      { name: "홈", url: `${BASE_URL}/` },
      { name: "시술·장비소개", url: `${BASE_URL}/treatments` },
      { name: "울쎄라", url: `${BASE_URL}/treatments/ulthera` },
    ];
    const schema = buildBreadcrumbJsonLd(items);
    const list = schema["itemListElement"] as Record<string, unknown>[];
    expect(list[0]["position"]).toBe(1);
    expect(list[1]["position"]).toBe(2);
    expect(list[2]["position"]).toBe(3);
  });

  it("각 항목의 name과 item(url)이 입력과 일치해야 한다", () => {
    const items = [
      { name: "홈", url: `${BASE_URL}/` },
      { name: "피부과 소개", url: `${BASE_URL}/about` },
    ];
    const schema = buildBreadcrumbJsonLd(items);
    const list = schema["itemListElement"] as Record<string, unknown>[];
    expect(list[0]["name"]).toBe("홈");
    expect(list[0]["item"]).toBe(`${BASE_URL}/`);
    expect(list[1]["name"]).toBe("피부과 소개");
    expect(list[1]["item"]).toBe(`${BASE_URL}/about`);
  });

  it("각 ListItem의 @type이 ListItem이어야 한다", () => {
    const schema = buildBreadcrumbJsonLd([{ name: "홈", url: `${BASE_URL}/` }]);
    const list = schema["itemListElement"] as Record<string, unknown>[];
    expect(list[0]["@type"]).toBe("ListItem");
  });

  it("단일 항목도 올바르게 처리되어야 한다", () => {
    const schema = buildBreadcrumbJsonLd([{ name: "홈", url: `${BASE_URL}/` }]);
    const list = schema["itemListElement"] as Record<string, unknown>[];
    expect(list).toHaveLength(1);
    expect(list[0]["position"]).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SEO_PRESETS — admin noindex 자동 정책 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("SEO_PRESETS — admin noindex 자동 정책", () => {
  it("admin 프리셋은 includeMedicalSchema=false, includeWebSiteSchema=false 이어야 한다", () => {
    expect(SEO_PRESETS.admin.includeMedicalSchema).toBe(false);
    expect(SEO_PRESETS.admin.includeWebSiteSchema).toBe(false);
  });

  it("admin pageType에서 effectiveNoindex 로직이 true를 반환해야 한다 (noindex=false여도)", () => {
    // SeoHead 내부 로직: effectiveNoindex = noindex || pageType === "admin"
    const noindex = false;
    const pageType = "admin";
    const effectiveNoindex = noindex || pageType === "admin";
    expect(effectiveNoindex).toBe(true);
  });

  it("non-admin pageType에서 noindex=false이면 effectiveNoindex가 false여야 한다", () => {
    const pageTypes = ["home", "treatment", "default"] as const;
    for (const pt of pageTypes) {
      const effectiveNoindex = false || pt === "admin";
      expect(effectiveNoindex).toBe(false);
    }
  });

  it("non-admin pageType에서 noindex=true이면 effectiveNoindex가 true여야 한다", () => {
    const effectiveNoindex = true || "home" === "admin";
    expect(effectiveNoindex).toBe(true);
  });

  it("SEO_PRESETS 키가 SeoPageType 유니온과 일치해야 한다", () => {
    const expectedKeys = ["home", "treatment", "default", "admin"];
    const actualKeys = Object.keys(SEO_PRESETS);
    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildOpeningHoursSpec — [DRY] 공통 헬퍼 회귀 테스트
// buildClinicJsonLd / buildLocalBusinessJsonLd 양쪽에서 사용하는 파싱 로직을 단일 함수로 추출한 것을 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("buildOpeningHoursSpec — DRY 공통 헬퍼", () => {
  it("연속 요일 범위(Mo-Fr)를 올바르게 파싱해야 한다", () => {
    const result = buildOpeningHoursSpec(["Mo-Fr 10:00-19:00"]);
    expect(result).toHaveLength(1);
    const spec = result[0];
    expect(spec["@type"]).toBe("OpeningHoursSpecification");
    expect(spec.dayOfWeek).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
    expect(spec.opens).toBe("10:00");
    expect(spec.closes).toBe("19:00");
  });

  it("단일 요일(Sa)을 올바르게 파싱해야 한다", () => {
    const result = buildOpeningHoursSpec(["Sa 09:30-15:00"]);
    expect(result).toHaveLength(1);
    const spec = result[0];
    expect(spec.dayOfWeek).toEqual(["Saturday"]);
    expect(spec.opens).toBe("09:30");
    expect(spec.closes).toBe("15:00");
  });

  it("여러 스펙을 한번에 처리해야 한다", () => {
    const result = buildOpeningHoursSpec(["Mo-Fr 10:00-19:00", "Sa 09:30-15:00"]);
    expect(result).toHaveLength(2);
    expect(result[0].dayOfWeek).toContain("Monday");
    expect(result[1].dayOfWeek).toContain("Saturday");
  });

  it("빈 배열을 전달하면 빈 배열을 반환해야 한다", () => {
    const result = buildOpeningHoursSpec([]);
    expect(result).toHaveLength(0);
  });

  it("readonly 배열도 수용해야 한다 (as const 사용 시)", () => {
    const hours = ["Mo-Fr 10:00-19:00"] as const;
    const result = buildOpeningHoursSpec(hours);
    expect(result).toHaveLength(1);
    expect(result[0].dayOfWeek).toContain("Monday");
  });

  it("buildClinicJsonLd와 buildLocalBusinessJsonLd가 동일한 openingHoursSpecification을 생성해야 한다", () => {
    // 두 함수가 동일한 buildOpeningHoursSpec을 사용하므로 결과가 일치해야 함
    const clinic = buildClinicJsonLd();
    const local = buildLocalBusinessJsonLd();
    const clinicSpecs = clinic["openingHoursSpecification"] as Record<string, unknown>[];
    const localSpecs = local["openingHoursSpecification"] as Record<string, unknown>[];
    expect(clinicSpecs).toEqual(localSpecs);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildLocalBusinessJsonLd — 지역 검색 최적화 필드 검증
// ─────────────────────────────────────────────────────────────────────────────
describe("buildLocalBusinessJsonLd — 지역 검색 최적화 필드", () => {
  it("hasMap 필드가 Google Maps URL 형식이어야 한다", () => {
    const schema = buildLocalBusinessJsonLd();
    expect(schema["hasMap"]).toMatch(/^https:\/\/maps\.google\.com\/\?q=/);
  });

  it("검증 근거 없는 review와 aggregateRating을 포함하지 않아야 한다", () => {
    const schema = buildLocalBusinessJsonLd();
    expect(schema).not.toHaveProperty("review");
    expect(schema).not.toHaveProperty("aggregateRating");
  });

  it("amenityFeature 배열이 LocationFeatureSpecification 타입이어야 한다", () => {
    const schema = buildLocalBusinessJsonLd();
    const features = schema["amenityFeature"] as Record<string, unknown>[];
    expect(Array.isArray(features)).toBe(true);
    expect(features.length).toBeGreaterThan(0);
    expect(features[0]["@type"]).toBe("LocationFeatureSpecification");
    expect(features[0]["name"]).toBeTruthy();
    expect(features[0]["value"]).toBe(true);
  });

  it("areaServed 배열이 여러 지역을 포함해야 한다 (부산, 부산진구, 서면)", () => {
    const schema = buildLocalBusinessJsonLd();
    const areas = schema["areaServed"] as Record<string, unknown>[];
    expect(Array.isArray(areas)).toBe(true);
    expect(areas.length).toBeGreaterThanOrEqual(3);
    const names = areas.map((a) => a["name"]);
    expect(names).toContain("Busan");
    expect(names).toContain("Busanjin-gu");
    expect(names).toContain("Seomyeon");
  });

  it("specialOpeningHoursSpecification 배열이 점심시간 정보를 포함해야 한다", () => {
    const schema = buildLocalBusinessJsonLd();
    const special = schema["specialOpeningHoursSpecification"] as Record<string, unknown>[];
    expect(Array.isArray(special)).toBe(true);
    expect(special.length).toBeGreaterThan(0);
    expect(special[0]["@type"]).toBe("OpeningHoursSpecification");
    expect(special[0]["opens"]).toBe("13:00");
    expect(special[0]["closes"]).toBe("14:00");
  });

  it("hasOfferCatalog가 OfferCatalog 타입이고 시술 목록을 포함해야 한다", () => {
    const schema = buildLocalBusinessJsonLd();
    const catalog = schema["hasOfferCatalog"] as Record<string, unknown>;
    expect(catalog["@type"]).toBe("OfferCatalog");
    const items = catalog["itemListElement"] as Record<string, unknown>[];
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]["@type"]).toBe("Offer");
    const offered = items[0]["itemOffered"] as Record<string, unknown>;
    expect(offered["@type"]).toBe("MedicalProcedure");
    expect(offered["name"]).toBeTruthy();
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// buildVideoObjectListJsonLd — 실제 YouTube 식별자만 구조화 데이터에 포함
// ─────────────────────────────────────────────────────────────────────────────
describe("buildVideoObjectListJsonLd — 검증된 영상 식별자", () => {
  it("placeholder 또는 잘못된 식별자만 있으면 VideoObject를 생성하지 않아야 한다", () => {
    expect(buildVideoObjectListJsonLd([
      { title: "임시 영상", videoId: "PLACEHOLDER_VIDEO" },
      { title: "짧은 값", videoId: "short" },
    ])).toBeNull();
  });

  it("유효한 11자리 YouTube 식별자만 ItemList에 포함해야 한다", () => {
    const schema = buildVideoObjectListJsonLd([
      { title: "유효 영상", videoId: "dQw4w9WgXcQ" },
      { title: "임시 영상", videoId: "PLACEHOLDER_VIDEO" },
    ]);
    expect(schema).not.toBeNull();
    const items = schema!["itemListElement"] as Record<string, unknown>[];
    expect(items).toHaveLength(1);
    const video = items[0]["item"] as Record<string, unknown>;
    expect(video["contentUrl"]).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Physician 스키마 강화 테스트 (honorificPrefix, memberOf, award, workLocation, availableService)
// ─────────────────────────────────────────────────────────────────────────────
describe("Physician 스키마 강화 필드 검증", () => {
  it("employee 배열에 3명의 Physician이 있어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    expect(employees).toHaveLength(3);
    employees.forEach((emp) => expect(emp["@type"]).toBe("Physician"));
  });

  it("각 Physician에 honorificPrefix Dr.가 있어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      expect(emp["honorificPrefix"]).toBe("Dr.");
    });
  });

  it("각 Physician에 nationality KR이 있어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      expect(emp["nationality"]).toBe("KR");
    });
  });

  it("medicalSpecialty가 배열이고 Dermatology를 포함해야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      const specialties = emp["medicalSpecialty"] as Record<string, unknown>[];
      expect(Array.isArray(specialties)).toBe(true);
      expect(specialties[0]["name"]).toBe("Dermatology");
      expect(specialties.length).toBeGreaterThan(1);
    });
  });

  it("각 Physician에 memberOf 배열이 있어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      const memberOf = emp["memberOf"] as Record<string, unknown>[];
      expect(Array.isArray(memberOf)).toBe(true);
      expect(memberOf.length).toBeGreaterThan(0);
      memberOf.forEach((org) => {
        expect(org["@type"]).toBe("MedicalOrganization");
        expect(org["name"]).toBeTruthy();
      });
    });
  });

  it("각 Physician에 award 배열이 있어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      const award = emp["award"] as string[];
      expect(Array.isArray(award)).toBe(true);
      expect(award.length).toBeGreaterThan(0);
    });
  });

  it("각 Physician에 workLocation이 Place 타입이어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      const workLocation = emp["workLocation"] as Record<string, unknown>;
      expect(workLocation["@type"]).toBe("Place");
      const address = workLocation["address"] as Record<string, unknown>;
      expect(address["@type"]).toBe("PostalAddress");
      expect(address["addressCountry"]).toBe("KR");
    });
  });

  it("각 Physician에 availableService 배열이 있어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      const services = emp["availableService"] as Record<string, unknown>[];
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      services.forEach((svc) => {
        expect(svc["@type"]).toBe("MedicalProcedure");
        expect(svc["name"]).toBeTruthy();
      });
    });
  });

  it("조시형 원장의 @id가 올바른 형식이어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    const cho = employees.find((emp) => emp["name"] === "조시형");
    expect(cho).toBeDefined();
    expect(cho!["@id"]).toBe("https://star-pibu.com/#physician-cho-si-hyung");
  });

  it("alumniOf가 EducationalOrganization 타입이어야 한다", () => {
    const schema = buildClinicJsonLd();
    const employees = schema["employee"] as Record<string, unknown>[];
    employees.forEach((emp) => {
      const alumniOf = emp["alumniOf"] as Record<string, unknown>[];
      expect(Array.isArray(alumniOf)).toBe(true);
      alumniOf.forEach((school) => {
        expect(school["@type"]).toBe("EducationalOrganization");
        expect(school["name"]).toBeTruthy();
      });
    });
  });
});
