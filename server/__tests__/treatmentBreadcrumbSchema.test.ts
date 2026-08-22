import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("treatment BreadcrumbList JSON-LD", () => {
  it("emits the same canonical breadcrumb graph from the client and crawler-facing SSR sources", () => {
    const clientSource = read("client/src/pages/TreatmentPage.tsx");
    const ssrSource = read("server/_core/treatmentPrerender.ts");

    for (const source of [clientSource, ssrSource]) {
      expect(source).toContain('"@type": "BreadcrumbList"');
      expect(source).toContain("/treatments");
      expect(source).toContain("itemListElement");
    }
  });
});
