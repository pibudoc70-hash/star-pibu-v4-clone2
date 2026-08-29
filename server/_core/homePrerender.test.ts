import { describe, expect, it } from "vitest";
import { buildHomePrerenderedHtml, HOME_PRERENDER_CACHE_CONTROL } from "./homePrerender";

const template = `<!doctype html><html lang="ko"><head><link rel="canonical" href="https://star-pibu.com" /></head><body><div id="root"></div></body></html>`;

describe("homePrerender", () => {
  it("한국어 홈 원본 HTML에 실제 FAQ와 진료 안내를 주입한다", () => {
    const html = buildHomePrerenderedHtml(template, "/");

    expect(html).toContain("자주 묻는 질문");
    expect(html).toContain("울쎄라피 프라임은 어떤 시술인가요?");
    expect(html).not.toContain("울쎄라는 어떤 시술인가요?");
    expect(html).toContain("피부과전문의가 알려주는 피부이야기");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('href="https://star-pibu.com"');
    expect(html).toContain('data-prerender="home-schema"');
    expect(html).toContain('https://star-pibu.com/#organization');
    expect(html).toContain('https://star-pibu.com/#website');
    expect(html).toContain('"@type":"VideoObject"');
    expect(html).toContain('"uploadDate":"2024-09-06"');
  });

  it.each([
    ["/", "ko", "ko", "부산 서면 스타피부과"],
    ["/en", "en", "en", "Star Dermatology Busan"],
    ["/ja", "ja", "ja", "釜山スター皮膚科"],
    ["/zh", "zh", "zh", "釜山STAR皮肤科"],
    ["/zh-tw", "zh-Hant", "zh-TW", "釜山STAR皮膚科"],
  ])("%s 홈 schema는 %s HTML 언어와 %s JSON-LD 언어를 사용한다", (pathName, htmlLang, schemaLang, clinicName) => {
    const html = buildHomePrerenderedHtml(template, pathName);

    expect(html).toContain(`lang="${htmlLang}"`);
    expect(html).toContain(`"inLanguage":"${schemaLang}"`);
    expect(html).toContain(`"name":"${clinicName}"`);
  });

  it("비한국어 홈 prerender에는 한국어 원본 YouTube VideoObject를 추가하지 않는다", () => {
    expect(buildHomePrerenderedHtml(template, "/en")).not.toContain('"@type":"VideoObject"');
  });

  it("홈 언어 루트가 아닌 경로는 처리하지 않는다", () => {
    expect(buildHomePrerenderedHtml(template, "/about")).toBeNull();
  });

  it("브라우저 최신성을 유지하면서 공유 캐시 재검증 정책을 사용한다", () => {
    expect(HOME_PRERENDER_CACHE_CONTROL).toBe("public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  });
});
