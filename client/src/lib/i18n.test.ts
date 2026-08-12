import { describe, expect, it } from "vitest";
import { i18n } from "./i18n";

function collectLeafPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    // 의료진·시술 목록은 언어별 콘텐츠 수와 문자열/문단 구조가 다를 수 있으므로,
    // 개별 항목이 아닌 해당 목록 자체가 제공되는지만 검증한다.
    return [prefix];
  }

  if (value !== null && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      collectLeafPaths(item, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [prefix];
}

describe("i18n 리소스 완결성", () => {
  const koreanPaths = collectLeafPaths(i18n.ko).sort();

  it.each(["en", "ja", "zh", "zh-TW"] as const)("ko와 동일한 키 경로를 제공한다: %s", (lang) => {
    expect(collectLeafPaths(i18n[lang]).sort()).toEqual(koreanPaths);
  });
});
