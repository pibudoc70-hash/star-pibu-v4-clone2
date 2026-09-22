import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/contact/ClinicMapEmbed.tsx"),
  "utf8",
);

describe("ClinicMapEmbed", () => {
  it("uses an API-key-free Google map iframe centered on the clinic coordinates", () => {
    expect(source).toContain("https://www.google.com/maps/embed?");
    expect(source).toContain("35.1572312");
    expect(source).toContain("129.0581932");
    expect(source).toContain("origin=mfe");
    expect(source).toContain("<iframe");
    expect(source).toContain("loading=\"lazy\"");
  });

  it("keeps a responsive map height while filling the desktop information panel", () => {
    expect(source).toContain("h-[360px]");
    expect(source).toContain("sm:h-[440px]");
    expect(source).toContain("lg:h-full");
    expect(source).toContain("lg:min-h-0");
  });
});
