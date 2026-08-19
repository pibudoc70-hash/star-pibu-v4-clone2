import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@/lib/trpc", () => ({
  trpc: { notices: { list: { useQuery: mocks.useQuery } } },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({ lang: "ko" }),
}));

vi.mock("sonner", () => ({ toast: mocks.toast }));

import { useNewNoticeToast } from "./useNewNoticeToast";

describe("useNewNoticeToast idle query", () => {
  let idleCallback: IdleRequestCallback | undefined;
  const cancelIdleCallback = vi.fn();

  beforeEach(() => {
    mocks.useQuery.mockReturnValue({ data: [] });
    vi.stubGlobal(
      "requestIdleCallback",
      vi.fn((callback: IdleRequestCallback) => {
        idleCallback = callback;
        return 1;
      })
    );
    vi.stubGlobal("cancelIdleCallback", cancelIdleCallback);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    idleCallback = undefined;
  });

  it("초기 렌더에서는 공지 query와 toast를 idle 전까지 비활성으로 유지한다", () => {
    renderHook(() => useNewNoticeToast(vi.fn()));

    expect(mocks.useQuery).toHaveBeenLastCalledWith(
      { lang: "ko" },
      expect.objectContaining({ enabled: false })
    );
    expect(mocks.toast).not.toHaveBeenCalled();
  });

  it("idle callback 뒤에만 공지 query를 활성화한다", () => {
    renderHook(() => useNewNoticeToast(vi.fn()));

    act(() => {
      idleCallback?.({ didTimeout: false, timeRemaining: () => 12 });
    });

    expect(mocks.useQuery).toHaveBeenLastCalledWith(
      { lang: "ko" },
      expect.objectContaining({ enabled: true })
    );
  });

  it("unmount 시 예약된 idle callback을 취소한다", () => {
    const { unmount } = renderHook(() => useNewNoticeToast(vi.fn()));

    unmount();

    expect(cancelIdleCallback).toHaveBeenCalledWith(1);
  });
});
