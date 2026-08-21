import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FacilitySection from "./FacilitySection";
import { LangProvider } from "@/contexts/LangContext";

vi.mock("@/hooks/useScrollReveal", () => ({
  useSectionReveal: () => null,
}));

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span />,
  ChevronRight: () => <span />,
  Pause: () => <span />,
  Play: () => <span />,
  X: () => <span />,
  Award: () => <span />,
  GraduationCap: () => <span />,
  Stethoscope: () => <span />,
  Zap: () => <span />,
}));

function renderFacility() {
  return render(
    <LangProvider>
      <FacilitySection />
    </LangProvider>,
  );
}

describe("Facility lightbox focus lifecycle", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    document.body.style.overflow = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.style.overflow = "";
  });

  it("moves focus into the dialog, traps both Tab directions, restores the trigger, and cleans up body scroll", () => {
    const { container } = renderFacility();
    const trigger = container.querySelector<HTMLButtonElement>(".facility-grid-thumb");
    expect(trigger).not.toBeNull();
    trigger?.focus();

    act(() => {
      fireEvent.click(trigger!);
    });

    const dialog = screen.getByRole("dialog");
    const closeButton = screen.getByLabelText("이미지 닫기");
    expect(closeButton).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    document.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(closeButton).toHaveFocus();

    const shiftTab = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true });
    document.dispatchEvent(shiftTab);
    expect(shiftTab.defaultPrevented).toBe(true);
    expect(closeButton).toHaveFocus();

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    expect(dialog).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not intercept keyboard focus when the lightbox is closed", () => {
    const { container } = renderFacility();
    const trigger = container.querySelector<HTMLButtonElement>(".facility-grid-thumb");
    expect(trigger).not.toBeNull();
    trigger?.focus();

    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    document.dispatchEvent(tab);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(tab.defaultPrevented).toBe(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
});
