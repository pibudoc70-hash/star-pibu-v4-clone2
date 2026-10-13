import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/treatments/TreatmentCardMedia.tsx"),
  "utf8",
);

const fillClass = "block w-full h-full object-cover object-center";

describe("TreatmentCardMedia thumbnail fill contract", () => {
  it("uses the same edge-to-edge fill class for banner, gallery, and single-image data", () => {
    expect(source).toContain("item.cardBannerImage");
    expect(source).toContain("item.images && item.images.length > 1");
    expect(source).toContain("src={item.image}");
    expect(source.split(fillClass)).toHaveLength(4);
  });

  it("keeps the zoom inside the media container", () => {
    expect(source).toContain("relative overflow-hidden bg-[#f6efe0] w-full");
    expect(source).toContain("group-hover:scale-105");
    expect(source).toContain('style={{ aspectRatio: "16/9" }}');
  });
});
