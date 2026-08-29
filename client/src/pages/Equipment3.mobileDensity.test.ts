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

describe("Equipment3 mobile card density", () => {
  it("keeps dedicated card hooks so density changes do not affect routes or card links", () => {
    const cardSource = pageSource.slice(
      pageSource.indexOf("function Equipment3Card"),
      pageSource.indexOf("// ─────────────────────────────────────────────────────────────────────────────"),
    );

    expect(cardSource).toContain("equipment-list__card-media");
    expect(cardSource).toContain("equipment-list__card-body");
    expect(cardSource).toContain("equipment-list__card-title");
    expect(cardSource).toContain("equipment-list__card-description");
    expect(cardSource).toContain("equipment-list__card-meta");
    expect(cardSource).toContain('<a\n      href={detailPath}');
  });

  it("uses a 639px mobile scope to reduce unused card height while keeping readable type", () => {
    expect(cssSource).toContain("@media (max-width: 639px)");
    expect(cssSource).toContain(".equipment-list__card-media");
    expect(cssSource).toContain("height: 11.5rem !important");
    expect(cssSource).toContain("min-height: 0 !important");
    expect(cssSource).toContain("font-size: 0.8125rem");
    expect(cssSource).toContain("line-height: 1.55");
  });
});
