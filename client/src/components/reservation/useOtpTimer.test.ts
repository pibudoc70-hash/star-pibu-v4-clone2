/**
 * useOtpTimer.test.ts — OTP 타이머 훅 단위 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOtpTimer } from "./useOtpTimer";

describe("useOtpTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("초기 상태: remaining=0, isRunning=false, isExpired=false", () => {
    const { result } = renderHook(() => useOtpTimer());
    expect(result.current.remaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
  });

  it("start() 호출 시 remaining=180, isRunning=true", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    expect(result.current.remaining).toBe(180);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isExpired).toBe(false);
  });

  it("1초 경과 후 remaining=179", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.remaining).toBe(179);
  });

  it("60초 경과 후 remaining=120", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current.remaining).toBe(120);
  });

  it("180초 경과 후 isExpired=true, isRunning=false, remaining=0", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(180_000); });
    expect(result.current.remaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(true);
  });

  it("formatted이 MM:SS 형식으로 반환된다 (03:00 → 시작)", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    expect(result.current.formatted).toBe("03:00");
  });

  it("90초 경과 후 formatted = '01:30'", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(90_000); });
    expect(result.current.formatted).toBe("01:30");
  });

  it("progress는 시작 시 100, 90초 경과 시 50", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    expect(result.current.progress).toBe(100);
    act(() => { vi.advanceTimersByTime(90_000); });
    expect(result.current.progress).toBe(50);
  });

  it("reset() 호출 시 remaining=0, isRunning=false로 초기화", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(30_000); });
    act(() => { result.current.reset(); });
    expect(result.current.remaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("start()를 두 번 호출하면 타이머가 180초로 재시작된다", () => {
    const { result } = renderHook(() => useOtpTimer());
    act(() => { result.current.start(); });
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current.remaining).toBe(120);
    act(() => { result.current.start(); }); // 재발송
    expect(result.current.remaining).toBe(180);
  });
});
