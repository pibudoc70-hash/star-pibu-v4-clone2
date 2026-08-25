import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorsDataSource = readFileSync(resolve(process.cwd(), "client/src/lib/doctors-data.ts"), "utf8");

describe("approved medical-team profile assets", () => {
  it("uses the supplied managed 조시형 image for desktop, mobile, and card renderers", () => {
    expect(doctorsDataSource).toMatch(/DR_JO_IMAGE_DESKTOP_JPG\s*=\s*"\/manus-storage\/dr-jo_5bffd5d8\.webp"/);
    expect(doctorsDataSource).toContain('DR_JO_IMAGE_MOBILE_WEBP = "/manus-storage/dr-jo_5bffd5d8.webp"');
    expect(doctorsDataSource).toMatch(/DR_JO_CARD_IMAGE\s*=\s*"\/manus-storage\/dr-jo_5bffd5d8\.webp"/);
  });

  it("uses the supplied managed 우혜진·이기욱 images for desktop and mobile renderers", () => {
    expect(doctorsDataSource).toMatch(/DR_WOO_IMAGE_DESKTOP_JPG\s*=\s*"\/manus-storage\/dr-woo_290d95d4\.webp"/);
    expect(doctorsDataSource).toContain('DR_WOO_IMAGE_MOBILE_WEBP = "/manus-storage/dr-woo_290d95d4.webp"');
    expect(doctorsDataSource).toMatch(/DR_LEE_IMAGE_DESKTOP_JPG\s*=\s*"\/manus-storage\/dr-lee_72d3f92b\.webp"/);
    expect(doctorsDataSource).toContain('DR_LEE_IMAGE_MOBILE_WEBP = "/manus-storage/dr-lee_72d3f92b.webp"');
  });

  it("removes the broken storage paths for all three doctors", () => {
    expect(doctorsDataSource).not.toContain("01_5e3176cb_69bdbf43_e8e22b42.webp");
    expect(doctorsDataSource).not.toContain("0211_8cfcf452_31628e98_2a57d4d8.webp");
    expect(doctorsDataSource).not.toContain("03_46691618_e287e8e1_dc958eaf.webp");
  });
});
