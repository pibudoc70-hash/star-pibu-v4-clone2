import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const equipment3Source = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3.tsx"), "utf8");

describe("Equipment3 tab selection", () => {
  it("derives the initial tab from explicit user choice, a valid URL tab, or the first tab without an effect state write", () => {
    expect(equipment3Source).toContain('const [requestedTabId, setActiveId] = useState<string>("");');
    expect(equipment3Source).toContain("if (requestedTabId && tabs.some((tab) => tab.id === requestedTabId)) return requestedTabId;");
    expect(equipment3Source).toContain("if (urlTab && tabs.some((tab) => tab.id === urlTab)) return urlTab;");
    expect(equipment3Source).toContain('return tabs[0]?.id ?? "";');
  });

  it("does not suppress Hooks lint or synchronize tab state with an effect", () => {
    expect(equipment3Source).not.toContain("eslint-disable-next-line react-hooks/exhaustive-deps");
    expect(equipment3Source).not.toMatch(/useEffect\(\(\) => \{[\s\S]*?setActiveId\(urlTab\)/);
  });
});
