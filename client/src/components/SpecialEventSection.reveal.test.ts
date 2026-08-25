import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);

describe("SpecialEventSection runtime-safe reveal", () => {
  it("does not call the runtime-incompatible section reveal hook", () => {
    expect(source).not.toContain('from "@/hooks/useScrollReveal"');
    expect(source).not.toContain("useSectionReveal(");
    expect(source).not.toContain("ref={sectionRef}");
  });

  it("keeps visible-fetch and desktop/mobile event rendering contracts", () => {
    expect(source).toContain("useVisibleFetch");
    expect(source).toContain("EventTableMobile");
    expect(source).toContain("EventCard");
    expect(source).toContain("PainManagementGuide");
  });
});
