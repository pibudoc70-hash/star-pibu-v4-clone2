import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const mobileMenu = readFileSync(
  resolve(process.cwd(), "client/src/components/header/MobileMenu.tsx"),
  "utf8"
);

describe("MobileMenu icon mapping", () => {
  it("renders the existing users symbol for the dermatology specialists route", () => {
    expect(mobileMenu).toMatch(/"\/doctors":\s+Users,/);
  });

  it("maps every current menu route to a matching outline icon and has a shared fallback", () => {
    expect(mobileMenu).toMatch(/"\/event":\s+Gift,/);
    expect(mobileMenu).toMatch(/"\/directions":\s+MapPin,/);
    expect(mobileMenu).toMatch(/"\/management-device-faq":\s+Sparkles,/);
    expect(mobileMenu).toMatch(/"\/notice":\s+Megaphone,/);
    expect(mobileMenu).toContain("NAV_ICONS[item.href] ?? Sparkles");
  });

  it("uses one icon container for primary and secondary menu items", () => {
    expect(mobileMenu).not.toContain("mobile-menu-icon-secondary");
    expect((mobileMenu.match(/className=\"mobile-menu-icon\"/g) ?? []).length).toBe(2);
  });
});
