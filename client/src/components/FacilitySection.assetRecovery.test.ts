import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/FacilitySection.tsx"), "utf8");

const restoredAssets = [
  "facility-metaview-room_535d3491_540aa29f-opt-q78_aec54ae1.webp",
  "facility-waiting-room_ce355737_f1c9c5e4-opt-q78_01ca2a55.webp",
  "facility-multi-skincare-room_ebebe73e_6e67b69a-opt-q78_ae572edd.webp",
  "facility-laser-corridor_9e114a15",
  "facility-reception-desk_f4dd56dc_df6ccf98-opt-q78_55c3f6a4.webp",
  "facility-reception-desk-02_1fe4bedc",
];

describe("FacilitySection approved gallery assets", () => {
  it("uses each approved facility asset in the existing gallery order", () => {
    let lastIndex = -1;

    for (const asset of restoredAssets) {
      const index = source.indexOf(`/manus-storage/${asset}`);
      expect(index).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }
  });

  it("does not retain broken legacy facility storage paths", () => {
    expect(source).not.toContain("/api/storage/metaview_room_535d3491.jpg");
    expect(source).not.toContain("/api/storage/waiting_room_ce355737.jpg");
    expect(source).not.toContain("/api/storage/multi_skincare_room_ebebe73e.jpg");
    expect(source).not.toContain("/api/storage/laser_corridor_9e114a15.jpg");
    expect(source).not.toContain("/api/storage/reception_desk_f4dd56dc.jpg");
    expect(source).not.toContain("/api/storage/reception_desk_02_1fe4bedc.jpg");
  });

  it("keeps facility labels for image accessibility without rendering visible gallery captions", () => {
    expect(source).toContain("alt={img.label}");
    expect(source).toContain("aria-label={`${img.label} ${fc.zoomHint}`}");
    expect(source).not.toContain("pcCardTitles");
    expect(source).not.toContain("{img.label}\n                </h3>");
    expect(source).not.toContain("{galleryImages[currentIndex].label}\n                </h3>");
    expect(source).not.toContain("{galleryImages[lightboxIndex].label}\n                </h3>");
  });
});
