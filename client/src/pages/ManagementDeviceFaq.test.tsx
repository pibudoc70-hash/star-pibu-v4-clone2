import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ManagementDeviceFaq from "./ManagementDeviceFaq";

vi.mock("@/components/MainLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
vi.mock("@/components/SeoHead", () => ({
  default: () => null,
  buildHreflangs: () => [],
  LANG_TO_OG_LOCALE: { ko: "ko_KR", en: "en_US", ja: "ja_JP", zh: "zh_CN", "zh-TW": "zh_TW" },
}));
vi.mock("@/components/OptimizedImage", () => ({ default: ({ alt }: { alt: string }) => <img alt={alt} /> }));
vi.mock("@/contexts/LangContext", () => ({ useLang: () => ({ lang: "ko", t: { nav: { managementDeviceFaq: "관리장비 FAQ" } } }) }));
vi.mock("@/hooks/useLocalizedText", () => ({ useLocalizedText: () => ({ getText: (ko: string) => ko }) }));

describe("ManagementDeviceFaq", () => {
  it("shows only the existing SonoFill FAQ content on the dedicated page", () => {
    render(<ManagementDeviceFaq />);

    expect(screen.getByRole("heading", { level: 1, name: "관리장비 FAQ" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "소노필" })).toBeInTheDocument();
    expect(screen.getByText("소노필 관리는 어떤 방식으로 진행되나요?")).toBeInTheDocument();
    expect(screen.getByText("관리 전 무엇을 확인하나요?")).toBeInTheDocument();
    expect(screen.queryByText("포어덤")).not.toBeInTheDocument();
  });
});
