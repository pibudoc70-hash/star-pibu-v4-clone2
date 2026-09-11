import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const headerSource = readFileSync(resolve(process.cwd(), "client/src/components/Header.tsx"), "utf8");
const mobileMenuSource = readFileSync(resolve(process.cwd(), "client/src/components/header/MobileMenu.tsx"), "utf8");

describe("Header mobile language placement", () => {
  it("renders the mobile-only language disclosure in Header rather than inside the drawer", () => {
    expect(headerSource).toContain('import MobileLanguageSwitcher from "./header/MobileLanguageSwitcher"');
    expect(headerSource).toContain("<MobileLanguageSwitcher");
    expect(mobileMenuSource).not.toContain("mobile-menu-lang-section");
    expect(mobileMenuSource).not.toContain("mobile-menu-lang-grid");
  });
});
