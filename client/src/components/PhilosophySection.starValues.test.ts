import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/PhilosophySection.tsx"), "utf8");

describe("STAR value-card brand identity", () => {
  it("introduces the four values as the STAR Dermatology promise", () => {
    expect(source).toContain("STAR VALUES");
    expect(source).toContain("스타피부과가 지키는 네 가지 약속");
  });

  it("renders each data-driven letter as a dedicated, visible STAR mark", () => {
    expect(source).toContain('data-testid="star-value-letter"');
    expect(source).toContain("{v.letter}");
    expect(source).toContain("aria-label={`${v.letter} — ${v.title}`}");
  });
});
