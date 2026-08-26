import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ManagementDevicesSection from "./ManagementDevicesSection";

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    t: {
      managementDevices: {
        eyebrow: "MANAGEMENT DEVICES",
        sectionTitle: "관리 장비",
        sectionSubtitle: "피부 고민별 관리 장비를 확인하세요.",
      },
    },
  }),
}));

vi.mock("@/hooks/useLocalizedText", () => ({
  useLocalizedText: () => ({ getText: (ko: string) => ko }),
}));

vi.mock("@/hooks/useScrollReveal", () => ({
  useSectionReveal: () => undefined,
}));

vi.mock("@/components/OptimizedImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("lucide-react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("lucide-react")>()),
  X: () => <span aria-hidden="true">×</span>,
}));

describe("ManagementDevicesSection dialog keyboard focus", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("traps Tab, closes on Escape, and restores focus to the trigger", () => {
    render(<ManagementDevicesSection />);

    const trigger = screen.getAllByRole("button")[0]!;
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog");
    const closeButton = within(dialog).getByRole("button", { name: "닫기" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps the photo-description dialog focused on the device description", () => {
    render(<ManagementDevicesSection />);

    fireEvent.click(screen.getAllByRole("button")[0]!);
    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByText("초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.")).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "기기 FAQ" })).not.toBeInTheDocument();
  });

  it("expands device FAQ below the card photo without opening the photo-description dialog", () => {
    render(<ManagementDevicesSection />);

    const faqButton = screen.getByRole("button", { name: "소노필 기기 FAQ" });
    expect(faqButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(faqButton);

    expect(faqButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "소노필 기기 FAQ" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
