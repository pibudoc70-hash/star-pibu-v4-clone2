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

let popupQueryResult: {
  data: typeof popupEvent[] | undefined;
  isLoading: boolean;
  error: Error | null;
} = {
  data: [popupEvent],
  isLoading: false,
  error: null,
};

vi.mock("@/contexts/useLang", () => ({
  useLang: () => ({ lang: "ko" }),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    popup: {
      list: {
        useQuery: () => popupQueryResult,
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
    localStorage.clear();
    popupQueryResult = { data: [popupEvent], isLoading: false, error: null };
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
    document.body.style.overflow = "";
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
    const first = within(dialog).getByRole("button", { name: "닫기" });
    const last = within(dialog).getByRole("checkbox", { name: "오늘은 보지 않음" });

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

  it("offers a close button and today-hide checkbox that persists until local midnight", () => {
    vi.setSystemTime(new Date("2026-08-22T14:30:00"));
    const dialog = renderVisiblePopup();
    const todayHide = within(dialog).getByRole("checkbox", { name: "오늘은 보지 않음" });

    expect(todayHide).not.toBeChecked();
    fireEvent.click(todayHide);
    expect(todayHide).toBeChecked();
    fireEvent.click(within(dialog).getByRole("button", { name: "닫기" }));
    act(() => {
      vi.advanceTimersByTime(260);
    });

    const expiry = new Date(localStorage.getItem("star-popup-v2-dismissed")!);
    expect(expiry.getHours()).toBe(0);
    expect(expiry.getMinutes()).toBe(0);
    expect(expiry.getSeconds()).toBe(0);
  });

  it("opens configured popup URLs with an isolated new-window policy", () => {
    renderVisiblePopup();

    fireEvent.click(screen.getByLabelText("팝업 이미지 클릭"));

    expect(window.open).toHaveBeenCalledWith("https://example.com/popup", "_blank", "noopener,noreferrer");
  });

  it("does not open unsafe popup URL schemes", () => {
    popupQueryResult = {
      data: [{ ...popupEvent, clickUrl: "javascript:alert(document.domain)" }],
      isLoading: false,
      error: null,
    };

    renderVisiblePopup();
    fireEvent.click(screen.getByLabelText("팝업 이미지 클릭"));

    expect(window.open).not.toHaveBeenCalled();
  });

  it("restores the original body overflow value when an open popup unmounts", () => {
    document.body.style.overflow = "scroll";
    const { unmount } = render(<WelcomePopup />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("silently falls back when the optional popup query fails", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    popupQueryResult = {
      data: undefined,
      isLoading: false,
      error: new Error("DATABASE_URL=mysql://user:secret@internal.example/popup"),
    };

    render(<WelcomePopup />);

    expect(screen.queryByRole("dialog", { name: "팝업 이벤트" })).toBeNull();
    expect(consoleWarn).not.toHaveBeenCalled();
    consoleWarn.mockRestore();
  });
});
