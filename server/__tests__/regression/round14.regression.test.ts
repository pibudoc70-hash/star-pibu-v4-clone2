/**
 * Round-14 시니어 검수 회귀 테스트
 *
 * 수정 항목:
 *   A. HeroSection 이미지 URL → hero/constants.ts 분리 (HERO_IMAGES 객체)
 *   B. DoctorsSection useDoctorViewModel 훅 분리 (hooks/useDoctorViewModel.ts)
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const ROOT = resolve(__dirname, "../../..");

function src(rel: string) {
  return readFileSync(resolve(ROOT, rel), "utf-8");
}

function exists(rel: string) {
  return existsSync(resolve(ROOT, rel));
}

// ─────────────────────────────────────────────────────────────────────────────
// [A] HeroSection 이미지 URL → hero/constants.ts 분리
// ─────────────────────────────────────────────────────────────────────────────
describe("[A] HeroSection 이미지 URL constants 분리", () => {
  it("hero/constants.ts 파일이 존재해야 한다", () => {
    expect(exists("client/src/components/hero/constants.ts")).toBe(true);
  });

  describe("hero/constants.ts 내용 검증", () => {
    const constantsSrc = src("client/src/components/hero/constants.ts");

    it("HERO_IMAGES 객체가 export되어야 한다", () => {
      expect(constantsSrc).toMatch(/export\s+const\s+HERO_IMAGES/);
    });

    it("HERO_IMAGES.desktopWebp가 정의되어야 한다", () => {
      expect(constantsSrc).toMatch(/desktopWebp/);
    });

    it("HERO_IMAGES.desktopJpg가 정의되어야 한다", () => {
      expect(constantsSrc).toMatch(/desktopJpg/);
    });

    it("HERO_IMAGES.mobilePortraitWebp가 정의되어야 한다", () => {
      expect(constantsSrc).toMatch(/mobilePortraitWebp/);
    });

    it("HERO_IMAGES.mobilePortraitJpg가 정의되어야 한다", () => {
      expect(constantsSrc).toMatch(/mobilePortraitJpg/);
    });

    it("HERO_LOGO_IMAGE가 export되어야 한다", () => {
      expect(constantsSrc).toMatch(/export\s+const\s+HERO_LOGO_IMAGE/);
    });

    it("관리형 이미지 URL이 포함되어야 한다", () => {
      // CDN·legacy storage·관리형 manus-storage 경로를 모두 허용한다.
      expect(constantsSrc).toMatch(/cloudfront\.net|api\/storage|manus-storage/);
    });

    it("as const로 불변 선언되어야 한다", () => {
      expect(constantsSrc).toMatch(/as\s+const/);
    });
  });

  describe("HeroSection.tsx에서 constants import 사용", () => {
    const heroSrc = src("client/src/components/HeroSection.tsx");

    it("hero/constants에서 HERO_IMAGES를 import해야 한다", () => {
      expect(heroSrc).toMatch(/import.*HERO_IMAGES.*from.*hero\/constants/);
    });

    it("hero/constants에서 HERO_LOGO_IMAGE를 import해야 한다", () => {
      expect(heroSrc).toMatch(/import.*HERO_LOGO_IMAGE.*from.*hero\/constants/);
    });

    it("HERO_IMAGES.desktopWebp를 사용해야 한다", () => {
      expect(heroSrc).toMatch(/HERO_IMAGES\.desktopWebp/);
    });

    it("HERO_IMAGES.desktopJpg를 사용해야 한다", () => {
      expect(heroSrc).toMatch(/HERO_IMAGES\.desktopJpg/);
    });

    it("HERO_IMAGES.mobilePortraitWebp를 사용해야 한다", () => {
      expect(heroSrc).toMatch(/HERO_IMAGES\.mobilePortraitWebp/);
    });

    it("HERO_IMAGES.mobilePortraitJpg를 사용해야 한다", () => {
      expect(heroSrc).toMatch(/HERO_IMAGES\.mobilePortraitJpg/);
    });

    it("HERO_LOGO_IMAGE를 사용해야 한다", () => {
      expect(heroSrc).toMatch(/HERO_LOGO_IMAGE/);
    });

    it("[R14] HeroSection에 인라인 이미지 URL 상수가 없어야 한다", () => {
      // 인라인 const HERO_IMAGE_DESKTOP_WEBP = "..." 패턴이 없어야 함
      const codeWithoutComments = heroSrc
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      expect(codeWithoutComments).not.toMatch(/const\s+HERO_IMAGE_DESKTOP_WEBP\s*=/);
      expect(codeWithoutComments).not.toMatch(/const\s+HERO_IMAGE_DESKTOP_JPG\s*=/);
      expect(codeWithoutComments).not.toMatch(/const\s+LOGO_IMAGE\s*=/);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// [B] DoctorsSection useDoctorViewModel 훅 분리
// ─────────────────────────────────────────────────────────────────────────────
describe("[B] DoctorsSection useDoctorViewModel 훅 분리", () => {
  it("hooks/useDoctorViewModel.ts 파일이 존재해야 한다", () => {
    expect(exists("client/src/hooks/useDoctorViewModel.ts")).toBe(true);
  });

  describe("useDoctorViewModel.ts 내용 검증", () => {
    const hookSrc = src("client/src/hooks/useDoctorViewModel.ts");

    it("useDoctorViewModel 함수가 export되어야 한다", () => {
      expect(hookSrc).toMatch(/export\s+function\s+useDoctorViewModel/);
    });

    it("DoctorViewModel 타입이 export되어야 한다", () => {
      expect(hookSrc).toMatch(/export\s+interface\s+DoctorViewModel/);
    });

    it("UseDoctorViewModelReturn 타입이 export되어야 한다", () => {
      expect(hookSrc).toMatch(/export\s+interface\s+UseDoctorViewModelReturn/);
    });

    it("mergedDoctors를 반환해야 한다", () => {
      expect(hookSrc).toMatch(/mergedDoctors/);
    });

    it("doctor(현재 선택된 의사)를 반환해야 한다", () => {
      expect(hookSrc).toMatch(/\bdoctor\b/);
    });

    it("activeDoctor 상태를 관리해야 한다", () => {
      expect(hookSrc).toMatch(/activeDoctor/);
    });

    it("expandedCredentials 상태를 관리해야 한다", () => {
      expect(hookSrc).toMatch(/expandedCredentials/);
    });

    it("handleDoctorSelect 핸들러를 반환해야 한다", () => {
      expect(hookSrc).toMatch(/handleDoctorSelect/);
    });

    it("toggleCredentials 핸들러를 반환해야 한다", () => {
      expect(hookSrc).toMatch(/toggleCredentials/);
    });

    it("handleTouchStart/handleTouchEnd 스와이프 핸들러를 반환해야 한다", () => {
      expect(hookSrc).toMatch(/handleTouchStart/);
      expect(hookSrc).toMatch(/handleTouchEnd/);
    });

    it("[D항목] id 기반 locale merge를 사용해야 한다", () => {
      // item.id === d.id 패턴으로 id 기반 find
      expect(hookSrc).toMatch(/item\.id\s*===\s*d\.id/);
    });

    it("[R11-A] locale.careers 텍스트만 교체하는 패턴이 있어야 한다", () => {
      expect(hookSrc).toMatch(/locale\.careers/);
    });

    it("useMemo로 mergedDoctors를 메모이제이션해야 한다", () => {
      expect(hookSrc).toMatch(/useMemo/);
    });

    it("I18nContent 타입을 매개변수로 받아야 한다", () => {
      expect(hookSrc).toMatch(/I18nContent/);
    });
  });

  describe("DoctorsSection.tsx에서 useDoctorViewModel 사용", () => {
    const doctorsSrc = src("client/src/components/DoctorsSection.tsx");

    it("useDoctorViewModel을 import해야 한다", () => {
      expect(doctorsSrc).toMatch(/import.*useDoctorViewModel.*from.*hooks\/useDoctorViewModel/);
    });

    it("useDoctorViewModel 훅을 호출해야 한다", () => {
      expect(doctorsSrc).toMatch(/useDoctorViewModel\(t, lang\)/);
    });

    it("[R14] DoctorsSection에 인라인 useState 상태 선언이 없어야 한다", () => {
      // 훅으로 이전된 상태들이 인라인으로 선언되지 않아야 함
      const codeWithoutComments = doctorsSrc
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      expect(codeWithoutComments).not.toMatch(/useState\(0\)/); // activeDoctor
      expect(codeWithoutComments).not.toMatch(/useState\(false\)/); // expandedCredentials
    });

    it("[R14] DoctorsSection에 인라인 useMemo merge 로직이 없어야 한다", () => {
      const codeWithoutComments = doctorsSrc
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      // mergedDoctors를 useMemo로 직접 선언하는 패턴이 없어야 함
      expect(codeWithoutComments).not.toMatch(/const\s+mergedDoctors\s*=\s*useMemo/);
    });

    it("[R14] DoctorsSection에 preloadImages 인라인 함수가 없어야 한다", () => {
      const codeWithoutComments = doctorsSrc
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");
      expect(codeWithoutComments).not.toMatch(/const\s+preloadImages\s*=/);
    });

    it("toggleCredentials를 사용해야 한다", () => {
      expect(doctorsSrc).toMatch(/toggleCredentials/);
    });
  });
});
