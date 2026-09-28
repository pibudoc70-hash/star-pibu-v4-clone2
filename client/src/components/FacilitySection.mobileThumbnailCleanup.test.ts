import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const component = readFileSync(
  resolve(process.cwd(), "client/src/components/FacilitySection.tsx"),
  "utf8",
);
const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("FacilitySection mobile thumbnail cleanup", () => {
  it("retains thumbnail data while hiding only the mobile strip through CSS", () => {
    expect(component).toContain("{/* Thumbnail Strip (Mobile)");
    expect(component).toContain('className="flex gap-2 mt-4 overflow-x-auto pb-2 px-2"');
    expect(component).toContain("onClick={() => setCurrentIndex(i)}");

    expect(styles).toContain("@media (max-width: 767px)");
    expect(styles).toContain("#facility .facility-carousel-wrap + .flex {");
    expect(styles).toContain("display: none !important;");
  });

  it("keeps the large-image controls in the shared mobile carousel", () => {
    expect(component).toContain("onClick={goPrev}");
    expect(component).toContain("onClick={goNext}");
    expect(component).toContain("setIsAutoPlay(!isAutoPlay)");
    expect(component).toContain("aria-current={i === currentIndex ? \"true\" : undefined}");
  });
});
