import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Equipment3.tsx"),
  "utf8",
);
const cssSource = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8",
);

describe("Equipment3 warm greige listing theme", () => {
  it("scopes warm greige surfaces to the equipment listing without changing the card link semantics", () => {
    const cardSource = pageSource.slice(
      pageSource.indexOf("function Equipment3Card"),
      pageSource.indexOf("// ─────────────────────────────────────────────────────────────────────────────"),
    );

    expect(pageSource).toContain("equipment-list-page");
    expect(pageSource).toContain("equipment-list__tab-panel");
    expect(pageSource).toContain("equipment-list__search");
    expect(pageSource).toContain("equipment-list__card-grid");
    expect(cardSource).toContain("equipment-list__card");
    expect(cardSource).toContain('<a\n      href={detailPath}');
    expect(cardSource).toContain("aria-label={`${name} ${detail}`}");
  });

  it("keeps navy and gold hover feedback keyboard-visible and motion-safe", () => {
    expect(cssSource).toContain(".equipment-list-page");
    expect(cssSource).toContain("--equipment-list-page-bg: #F4F1EA");
    expect(cssSource).toContain(".equipment-list__card");
    expect(cssSource).toContain("--equipment-list-surface: #EEEBE4");
    expect(cssSource).toContain(".equipment-list__more-button");
    expect(cssSource).toContain(".equipment-list__more-button:hover");
    expect(cssSource).toContain("--equipment-list-accent: #7A5C35");
    expect(cssSource).toContain(".equipment-list__more-button:focus-visible");
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
