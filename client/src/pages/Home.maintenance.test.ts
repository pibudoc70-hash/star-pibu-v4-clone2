import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const fallbackSource = readFileSync(
  resolve(process.cwd(), "client/src/lib/homeSectionFallbacks.ts"),
  "utf8",
);

describe("Home 유지보수성 경계", () => {
  it("초기 스크롤 복원을 전용 hook으로 위임한다", () => {
    expect(homeSource).toContain("useHomeInitialScrollRestore();");
    expect(homeSource).not.toContain('from "@/hooks/useAnchorScroll"');
  });

  it("지연 섹션의 fallback preset을 공통 구성에서 사용한다", () => {
    for (const fallback of [
      "specialEvent",
      "doctors",
      "treatments",
      "managementDevices",
      "philosophy",
      "results",
      "facility",
      "youtube",
      "faq",
      "notices",
      "contact",
    ]) {
      expect(homeSource).toContain(`HOME_SECTION_FALLBACKS.${fallback}`);
    }
    expect(fallbackSource).toContain("specialEvent");
    expect(fallbackSource).toContain("managementDevices");
    expect(fallbackSource).toContain("contact");
  });
});
