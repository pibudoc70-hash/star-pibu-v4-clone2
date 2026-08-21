import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/components/YouTubeSection.tsx"), "utf8");

describe("YouTubeSection modal backdrop accessibility", () => {
  it("uses a native backdrop dismiss control while keeping modal key handling outside static dialog markup", () => {
    expect(source).toContain('data-testid="youtube-modal-backdrop"');
    expect(source).toContain('onClick={closeModal}');
    expect(source).not.toContain('onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}');
    expect(source).not.toContain('onKeyDown={handleKeyDown}');
  });
});
