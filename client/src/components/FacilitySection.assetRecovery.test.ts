import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/FacilitySection.tsx"), "utf8");

const restoredAssets = [
  "facility-metaview-room_535d3491",
  "facility-waiting-room_ce355737",
  "facility-multi-skincare-room_ebebe73e",
  "facility-laser-corridor_9e114a15",
  "facility-reception-desk_f4dd56dc",
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
});
