/**
 * useOtpTimer — OTP 유효 시간 카운트다운 훅
 *
 * - OTP 유효 시간: 3분 (180초)
 * - start(): OTP 발송 직후 호출 → 카운트다운 시작
 * - reset(): 폼 초기화 시 호출 → 타이머 정지
 * - isExpired: 시간이 0이 되면 true → 입력 비활성화 + 재발송 유도
 * - formatted: "MM:SS" 형식 문자열 (UI 표시용)
 * - progress: 0~100 (progress bar용, 100=시작, 0=만료)
 */
import { useState, useEffect, useRef, useCallback } from "react";

const OTP_TTL_SEC = 180; // 3분

export interface OtpTimerState {
  remaining: number;       // 남은 초
  formatted: string;       // "MM:SS"
  progress: number;        // 100 → 0
  isExpired: boolean;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
}

export function useOtpTimer(): OtpTimerState {
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // start() 호출 여부
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setRemaining(OTP_TTL_SEC);
    setIsRunning(true);
    setHasStarted(true);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setRemaining(0);
    setIsRunning(false);
    setHasStarted(false);
  }, [clearTimer]);

  // 언마운트 시 정리
  useEffect(() => () => clearTimer(), [clearTimer]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = Math.round((remaining / OTP_TTL_SEC) * 100);
  // isExpired: start()가 한 번이라도 호출된 후 remaining이 0이 된 상태
  const isExpired = hasStarted && !isRunning && remaining === 0;

  return { remaining, formatted, progress, isExpired, isRunning, start, reset };
}
