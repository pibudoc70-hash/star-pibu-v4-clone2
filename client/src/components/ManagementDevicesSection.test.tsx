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
});
