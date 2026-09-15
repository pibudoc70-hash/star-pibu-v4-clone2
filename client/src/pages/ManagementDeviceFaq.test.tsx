import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MANAGEMENT_DEVICES } from "@/lib/clinic-data";
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
  it("shows purpose/effect tags and each device description without FAQ accordions", () => {
    render(<ManagementDeviceFaq />);

    expect(screen.getByRole("heading", { level: 1, name: "관리장비 FAQ" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "소노필" })).toBeInTheDocument();
    expect(screen.getByText("초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "포어덤" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "트랜스킨" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(MANAGEMENT_DEVICES.length);
    expect(screen.queryByText("관리 전 무엇을 확인하나요?")).not.toBeInTheDocument();
    expect(screen.getAllByLabelText("주요 관리 목적과 기대 효과")).toHaveLength(MANAGEMENT_DEVICES.length);
    expect(screen.getAllByText("관리 목적")).toHaveLength(MANAGEMENT_DEVICES.length);
    expect(screen.getByText("각질 케어")).toBeInTheDocument();
    expect(screen.getAllByText("기대 효과")).toHaveLength(MANAGEMENT_DEVICES.length);
    expect(screen.getAllByText("영양 성분 침투")).toHaveLength(2);

    const cardGrid = screen.getByTestId("management-device-faq-grid");
    expect(cardGrid).toHaveClass("grid-cols-1", "lg:grid-cols-2");

    expect(screen.queryByText("소노필 관리는 어떤 방식으로 진행되나요?")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("group")).toHaveLength(0);
  });
});
