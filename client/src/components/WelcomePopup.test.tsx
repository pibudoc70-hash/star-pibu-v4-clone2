import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WelcomePopup from "./WelcomePopup";

const popupEvent = {
  id: 1,
  imageUrl: "/api/storage/popup.webp",
  clickUrl: "https://example.com/popup",
  isActive: "1" as const,
  updatedAt: 1,
};

vi.mock("@/contexts/useLang", () => ({
  useLang: () => ({ lang: "ko" }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    popup: {
      list: {
        useQuery: () => ({ data: [popupEvent], isLoading: false, error: null }),
      },
    },
  },
}));

vi.mock("@/components/OptimizedImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("lucide-react", () => ({
  X: () => <span aria-hidden="true">×</span>,
}));

describe("WelcomePopup keyboard focus", () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalOpen = window.open;

  beforeEach(() => {
    vi.useFakeTimers();
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof window.requestAnimationFrame;
    window.open = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.open = originalOpen;
    document.body.innerHTML = "";
  });

  function renderVisiblePopup() {
    render(<WelcomePopup />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    return screen.getByRole("dialog", { name: "팝업 이벤트" });
  }

  it("keeps Tab and Shift+Tab focus inside the dialog", () => {
    const dialog = renderVisiblePopup();
    const buttons = within(dialog).getAllByRole("button");
    const first = buttons[0]!;
    const last = buttons[buttons.length - 1]!;

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("returns focus to the previously focused element after dismissal", () => {
    const opener = document.createElement("button");
    opener.textContent = "open popup";
    document.body.append(opener);
    opener.focus();

    renderVisiblePopup();
    fireEvent.click(screen.getByLabelText("닫기"));
    act(() => {
      vi.advanceTimersByTime(260);
    });

    expect(document.activeElement).toBe(opener);
  });

  it("keeps popup image clicks opening the configured URL", () => {
    renderVisiblePopup();

    fireEvent.click(screen.getByLabelText("팝업 이미지 클릭"));

    expect(window.open).toHaveBeenCalledWith("https://example.com/popup", "_blank");
  });
});
