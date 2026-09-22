import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const eventPageSource = readFileSync(resolve(process.cwd(), "client/src/pages/Event.tsx"), "utf8");
const routesSource = readFileSync(resolve(process.cwd(), "client/src/routes.ts"), "utf8");
const headerSource = readFileSync(resolve(process.cwd(), "client/src/hooks/useHeaderState.ts"), "utf8");
const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const layoutSource = readFileSync(resolve(process.cwd(), "client/src/components/MainLayout.tsx"), "utf8");

describe("standalone EVENT page", () => {
  it("keeps the existing homepage event section while reusing its presentation on the dedicated page", () => {
    expect(homeSource).toContain("<SpecialEventSection />");
    expect(eventPageSource).toContain("<SpecialEventSection showHeader={false} />");
    expect(eventPageSource).not.toContain("<ContactSection />");
    expect(layoutSource).toContain("<Footer showContactSection={showContactSection} />");
    expect(eventPageSource).toContain('id="event-page-title"');
    expect(eventPageSource).toContain("dr-page-header");
  });

  it("removes only the duplicate special-event introduction on the standalone page", () => {
    expect(eventPageSource).not.toContain("FOR YOU");
    expect(eventPageSource).not.toContain("스타만의 특별한 가격으로 한 단계 높은 피부 관리를 시작해보세요.");
    expect(eventPageSource).toContain("<SpecialEventSection showHeader={false} />");
  });

  it("registers localized event routes and points the EVENT navigation item at them", () => {
    expect(routesSource).toContain('Event:              () => import("@/pages/Event")');
    expect(routesSource).toContain("export const Event              = lazy(pages.Event)");
    expect(routesSource).toContain('{ path: "event",             component: Event }');
    expect(headerSource).toContain('{ label: "EVENT",          href: "/event",      sectionId: null         }');
    expect(headerSource).not.toContain('{ label: "EVENT",          href: "#events",     sectionId: "events"     }');
  });

  it("uses localized metadata and the shared event card URL behavior", () => {
    expect(eventPageSource).toContain("EVENT_COPY");
    expect(eventPageSource).toContain('getLocalizedUrl(lang, "/event")');
    expect(eventPageSource).toContain('buildHreflangs("/event", "/en/event", "/ja/event", "/zh/event", "/zh-tw/event")');
  });
});
