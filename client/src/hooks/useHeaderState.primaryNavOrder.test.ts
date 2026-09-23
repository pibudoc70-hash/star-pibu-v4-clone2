import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/hooks/useHeaderState.ts"),
  "utf8",
);

const primaryNav = source.slice(
  source.indexOf("const primaryNav: NavItem[] = ["),
  source.indexOf("// ── More 패널 항목", source.indexOf("const primaryNav: NavItem[] = [")),
);

describe("Header primary navigation order", () => {
  it("places EVENT before treatments while leaving the remaining primary destinations intact", () => {
    const eventIndex = primaryNav.indexOf('href: "/event"');
    const treatmentsIndex = primaryNav.indexOf('href: "/equipment3"');
    const doctorsIndex = primaryNav.indexOf('href: "/doctors"');
    const aboutIndex = primaryNav.indexOf('href: "/about"');
    const directionsIndex = primaryNav.indexOf('href: "/directions"');

    expect(eventIndex).toBeGreaterThan(-1);
    expect(eventIndex).toBeLessThan(treatmentsIndex);
    expect(treatmentsIndex).toBeLessThan(doctorsIndex);
    expect(doctorsIndex).toBeLessThan(aboutIndex);
    expect(aboutIndex).toBeLessThan(directionsIndex);
  });

  it("continues to expose the same primary collection to both desktop and mobile navigation", () => {
    const headerSource = readFileSync(
      resolve(process.cwd(), "client/src/components/Header.tsx"),
      "utf8",
    );

    expect(headerSource).toContain("<DesktopNav\n            primaryNav={primaryNav}");
    expect(headerSource).toContain("<MobileMenu\n        mobileOpen={mobileOpen}");
    expect(headerSource).toContain("primaryNav={primaryNav}");
  });
});
