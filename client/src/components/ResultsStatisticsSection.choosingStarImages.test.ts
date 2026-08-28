import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/ResultsStatisticsSection.tsx"), "utf8");

const approvedImages = [
  "/manus-storage/choosing-star-01_cd3dce52_18c438e7-optimized_90c3e2a4.webp",
  "/manus-storage/choosing-star-02_92c1e337_7f575d87-optimized_8a7385f0.webp",
  "/manus-storage/choosing-star-03_a440359e_f67b000c-optimized_6294b5b8.webp",
];

const legacyImages = [
  "/api/storage/01_cd3dce52.jpg",
  "/api/storage/02_92c1e337.jpg",
  "/api/storage/03_a440359e.jpg",
];

describe("choosing Star Dermatology card images", () => {
  it("uses the three approved managed WebP images in the supplied file-name order", () => {
    const positions = approvedImages.map((image) => source.indexOf(image));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    legacyImages.forEach((image) => expect(source).not.toContain(image));
  });

  it("keeps localized title-derived alt text and card image layout", () => {
    expect(source).toContain("alt={doctor.title}");
    expect(source).toContain('className="w-full h-full object-cover"');
  });

  it("removes the visible experience, treatment-count, and direct-treatment statistic cards", () => {
    expect(source).not.toContain("statistics.map(");
    expect(source).not.toContain("useClinicStats");
    expect(source).not.toContain("StatisticCardSkeleton");
    expect(source).toContain("doctors.map(");
  });
});
