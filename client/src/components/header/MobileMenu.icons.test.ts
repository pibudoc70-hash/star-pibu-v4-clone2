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
});
