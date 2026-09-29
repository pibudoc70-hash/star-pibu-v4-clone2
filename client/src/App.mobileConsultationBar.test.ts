import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const appSource = read("client/src/App.tsx");
const homeSource = read("client/src/pages/Home.tsx");
const styles = read("client/src/index.css");

describe("shared mobile consultation bar", () => {
  it("mounts the existing CTA once from the shared public app shell", () => {
    expect(appSource).toContain('import MobileBottomCTA from "./components/MobileBottomCTA";');
    expect(appSource).toContain("function PublicMobileBottomCTA()");
    expect(appSource).toContain('location.startsWith("/admin")');
    expect(appSource).toContain("return <MobileBottomCTA />;");
    expect(appSource.indexOf("<PublicMobileBottomCTA />")).toBeGreaterThan(appSource.indexOf("</Switch>"));
    expect(homeSource).not.toContain("MobileBottomCTA");
  });

  it("uses one mobile-only bottom reserve and keeps modal and drawer layers above the CTA", () => {
    expect(styles).toContain("--mobile-bottom-cta-height: calc(56px + env(safe-area-inset-bottom, 0px));");
    expect(styles).toContain("padding-bottom: var(--mobile-bottom-cta-height);");
    expect(styles).toContain("height: var(--mobile-bottom-cta-height) !important;");
    expect(styles).toContain("z-index: 40;");
    expect(styles).toContain(".mobile-menu-panel");
    expect(styles).toContain("z-index: 999;");
  });
});
