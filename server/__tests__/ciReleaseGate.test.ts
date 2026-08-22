import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/ci.yml"), "utf8");

describe("CI aggregate release gate", () => {
  it("requires every quality job before the release gate can succeed", () => {
    expect(workflow).toMatch(/release-gate:\s*\n\s*name: Release Gate/);
    expect(workflow).toMatch(
      /release-gate:[\s\S]*?needs:\s*\[check, lint, test-unit, test-integration, build, audit\]/
    );
    expect(workflow).toMatch(/release-gate:[\s\S]*?- run: echo "All release gates passed"/);
  });

  it("does not define an unguarded deploy job in this workflow", () => {
    expect(workflow).not.toMatch(/^\s*deploy:\s*$/m);
  });
});
