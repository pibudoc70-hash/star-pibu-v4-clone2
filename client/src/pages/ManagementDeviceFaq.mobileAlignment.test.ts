import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const mobileHeaderBlock = css.slice(
  css.indexOf("/* Shared public-subpage mobile header rhythm."),
  css.indexOf("/* Shared, border-led mobile editorial list."),
);

describe("ManagementDeviceFaq mobile alignment", () => {
  it("reuses the shared subpage header rhythm instead of adding a page-specific header override", () => {
    expect(mobileHeaderBlock).toContain("--subpage-mobile-header-top: calc(3rem + 1.5rem);");
    expect(mobileHeaderBlock).toContain("--subpage-mobile-header-bottom: 3rem;");
    expect(mobileHeaderBlock).toContain(".dr-page-header:not(#contact)");
    expect(mobileHeaderBlock).not.toContain(".management-device-faq-page-header");
  });

  it("centers every mapped device card only inside the mobile subpage rule", () => {
    expect(mobileHeaderBlock).toContain(".management-device-faq-grid .management-device-faq-card__content");
    expect(mobileHeaderBlock).toContain("align-items: center;");
    expect(mobileHeaderBlock).toContain("justify-content: center;");
    expect(mobileHeaderBlock).toContain(".management-device-faq-card__image");
    expect(mobileHeaderBlock).toContain(".management-device-faq-card__copy,");
    expect(mobileHeaderBlock).toContain(".management-device-faq-card__description");
    expect(mobileHeaderBlock).toContain(".management-device-faq-card__tags {");
    expect(mobileHeaderBlock).toContain(".management-device-faq-card__tags > li");
  });
});
