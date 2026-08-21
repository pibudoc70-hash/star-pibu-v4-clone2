import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminNotices.tsx"), "utf8");

describe("AdminNotices translation modal accessibility", () => {
  it("uses a native backdrop button instead of a noninteractive outer click handler", () => {
    expect(source).toContain('aria-label="자동번역 모달 닫기"');
    expect(source).toContain('onClick={() => setShowTranslateModal(false)}');
    const outerModal = source.match(/<div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-50">/);
    expect(outerModal?.[0]).toBeDefined();
    expect(outerModal?.[0]).not.toContain("onClick");
  });

  it("keeps dialog semantics and closes on Escape through a cleaned-up document listener", () => {
    expect(source).toMatch(/role="dialog"[\s\S]*?aria-modal="true"/);
    expect(source).not.toMatch(/role="dialog"[\s\S]*?onKeyDown=/);
    expect(source).toContain("document.addEventListener('keydown', handleEscape)");
    expect(source).toContain("document.removeEventListener('keydown', handleEscape)");
  });
});
