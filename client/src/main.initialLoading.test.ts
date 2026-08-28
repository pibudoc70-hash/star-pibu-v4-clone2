import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectPath = process.cwd();
const indexHtml = readFileSync(resolve(projectPath, "client/index.html"), "utf8");
const mainSource = readFileSync(resolve(projectPath, "client/src/main.tsx"), "utf8");

describe("initial loading screen", () => {
  it("uses a normal loading message rather than a maintenance-sounding message", () => {
    expect(indexHtml).toContain("콘텐츠를 불러오는 중입니다");
    expect(indexHtml).not.toContain("스타피부과를 준비하고 있습니다");
  });

  it("releases after React is ready and has a bounded fallback release", () => {
    expect(mainSource).toContain('window.dispatchEvent(new Event("star-pibu:app-ready"))');
    expect(indexHtml).toContain("window.setTimeout(release, 10000)");
  });
});
