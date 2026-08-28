import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const detailSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3Detail.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Equipment3Detail off-white pilot theme", () => {
  it("scopes off-white FAQ and information-card surfaces to equipment details", () => {
    expect(detailSource).toContain("equipment-detail__faq-item");
    expect(detailSource).toContain("equipment-detail__info-card");
    expect(cssSource).toContain(".equipment-detail__faq-item");
    expect(cssSource).toContain("background: #F7F5F0;");
    expect(cssSource).toContain(".equipment-detail__info-card");
  });

  it("provides navy and gold hover feedback while retaining visible focus and reduced-motion support", () => {
    expect(detailSource).toContain("equipment-detail__contact-action");
    expect(detailSource).toContain("equipment-detail__back-button");
    expect(cssSource).toContain(".equipment-detail__contact-action:hover");
    expect(cssSource).toContain(".equipment-detail__back-button:hover");
    expect(cssSource).toContain("background: #7A5C35;");
    expect(cssSource).toContain(".equipment-detail__contact-action:focus-visible");
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
