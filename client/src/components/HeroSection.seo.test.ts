import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const heroSource = readFileSync(resolve(process.cwd(), "client/src/components/HeroSection.tsx"), "utf8");
const homeSeoSource = readFileSync(resolve(process.cwd(), "client/src/lib/homeSeo.ts"), "utf8");

describe("홈 Hero SEO H1", () => {
  it("한국어 홈의 단일 H1은 사용자 지정 SEO title을 사용하고 시각용 브랜드명은 H1으로 중복 렌더하지 않는다", () => {
    expect(homeSeoSource).toContain(
      'title: "부산 서면 스타피부과 | 부산울쎄라ㅣ부산써마지ㅣ부산 리프팅ㅣ피부과전문의 3인 진료"',
    );
    expect(heroSource).toContain('const seoHeading = lang === "ko" ? HOME_SEO_META.title : t.hero.title;');
    expect(heroSource).toContain('<h1 className="sr-only">{seoHeading}</h1>');
    expect(heroSource).toContain('<div className="font-medium hero-title" aria-hidden="true">');
    expect(heroSource).toContain('<div className="hero-mobile-title" aria-hidden="true">{t.hero.title}</div>');
  });
});
