import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "client", "src");
const sectionSource = readFileSync(resolve(root, "components/YouTubeSection.tsx"), "utf8");
const css = readFileSync(resolve(root, "index.css"), "utf8");

describe("YouTube channel CTA selected-tab style", () => {
  it("uses a dedicated channel CTA class instead of an inline color override", () => {
    const channelCta = sectionSource.slice(
      sectionSource.indexOf("{/* 채널 링크 */}"),
      sectionSource.indexOf("{/* P3: Portal")
    );

    expect(channelCta).toContain('className="youtube-channel-cta-button"');
    expect(channelCta).not.toContain("style={{ background:");
  });

  it("reuses the FAQ selected tab gold token and pill metrics", () => {
    const start = css.indexOf(".youtube-channel-cta-button {");
    const end = css.indexOf("/* 아코디언 래퍼 */", start);
    const rules = css.slice(start, end);

    expect(rules).toContain("background: var(--color-gold-primary);");
    expect(rules).toContain("border-radius: 9999px;");
    expect(rules).toContain("color: #fff;");
    expect(rules).toContain("font-size: 0.95rem;");
    expect(rules).toContain("font-weight: 500;");
    expect(rules).toContain("padding: 10px 26px;");
    expect(rules).toContain(".youtube-channel-cta-button:hover");
    expect(rules).toContain(".youtube-channel-cta-button:active");
    expect(rules).toContain("@media (max-width: 767px)");
    expect(rules).toContain("font-size: 0.8rem;");
    expect(rules).toContain("padding: 7px 18px;");
  });
});
