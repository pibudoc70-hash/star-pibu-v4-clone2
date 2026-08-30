import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const pageSource = readFileSync(resolve(root, "client/src/pages/Equipment3.tsx"), "utf8");
const cssSource = readFileSync(resolve(root, "client/src/index.css"), "utf8");

describe("Equipment3 mobile multilingual card titles", () => {
  it("preserves the complete localized card title in the native detail link", () => {
    const cardSource = pageSource.slice(
      pageSource.indexOf("function Equipment3Card"),
      pageSource.indexOf("// ─────────────────────────────────────────────────────────────────────────────"),
    );

    expect(cardSource).toContain("const name     = getText(item.name, item.nameEn, item.nameJa, item.nameZh)");
    expect(cardSource).toContain("aria-label={`${name} ${detail}`}");
    expect(cardSource).toContain("equipment-list__card-overlay-title");
  });

  it("removes the mobile-only body-title clamp and balances long Latin and CJK titles", () => {
    const mobileStart = cssSource.indexOf("@media (max-width: 639px)");
    const mobileCss = cssSource.slice(mobileStart);

    expect(mobileCss).toContain(".equipment-list__card-title");
    expect(mobileCss).toContain("-webkit-line-clamp: unset");
    expect(mobileCss).toContain("overflow-wrap: anywhere");
    expect(mobileCss).toContain("word-break: keep-all");
    expect(mobileCss).toContain(".equipment-list__card-overlay-title");
    expect(mobileCss).toContain("text-wrap: balance");
  });
});
