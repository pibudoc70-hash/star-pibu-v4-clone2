import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const popupSource = readFileSync(resolve(process.cwd(), "client/src/components/WelcomePopup.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("WelcomePopup motion, dim, and mobile touch targets", () => {
  it("uses visible fade motion and a dimmed backdrop while respecting reduced-motion preferences", () => {
    expect(cssSource).toContain("rgba(10, 16, 30, 0.48)");
    expect(cssSource).toContain("transform: translateY(24px) scale(0.98)");
    expect(cssSource).toContain(".popup-overlay,");
    expect(cssSource).toContain(".popup-modal-mobile");
  });

  it("gives mobile close and today-hide controls an explicit touch-target treatment", () => {
    expect(popupSource).toContain("popup-close-control");
    expect(popupSource).toContain("popup-today-hide");
    expect(popupSource).toContain("size-11");
    expect(popupSource).toContain("min-h-11");
  });
});
