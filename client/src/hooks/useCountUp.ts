import { useEffect, useRef, useState } from "react";

/**
 * useCountUp - 스크롤 진입 시 숫자 카운팅 애니메이션 훅
 * - GIF 분석 결과: 거의 선형(linear) 속도로 증가, 끝에서 아주 약간 감속
 * - easeOutQuad: 선형에 가깝지만 끝에서 자연스럽게 마무리
 * - 0부터 시작하여 목표값까지 카운팅
 * - 모바일 대응: threshold 0.05 + rootMargin으로 조기 트리거
 * - isDone: 카운팅 완료 시 true → 완료 후 강조 효과 트리거용
 * - locale: toLocaleString 포맷 로케일 (기본값 "ko-KR" → 호출부에서 lang 전달 권장)
 */

// easeOutQuad: 선형에 가깝고 끝에서 아주 약간 감속 (GIF 패턴과 일치)
function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/** lang → BCP-47 locale 매핑 */
const LANG_TO_LOCALE: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

export function useCountUp(
  targetValue: string | number,
  duration: number = 2000,
  suffix: string = "",
  startDelay: number = 0,
  triggerRef?: React.RefObject<Element | null>,
  lang?: string
): { value: string; isDone: boolean } {
  const [displayValue, setDisplayValue] = useState("0");
  const [isDone, setIsDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAnimatedRef = useRef(false);

  const locale = lang ? (LANG_TO_LOCALE[lang] ?? "ko-KR") : "ko-KR";

  useEffect(() => {
    const numericValue =
      typeof targetValue === "number"
        ? targetValue
        : parseInt(String(targetValue).replace(/[^0-9]/g, ""), 10);

    if (isNaN(numericValue)) {
      setDisplayValue(String(targetValue));
      setIsDone(true);
      return;
    }

    // 초기값 명시적으로 0 설정
    setDisplayValue("0");
    setIsDone(false);

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      delayTimerRef.current = setTimeout(() => {
        const startTime = performance.now();

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const rawProgress = Math.min(elapsed / duration, 1);

          // easeOutQuad: 선형에 가깝고 끝에서 자연스럽게 마무리
          const eased = easeOutQuad(rawProgress);
          const currentValue = Math.round(numericValue * eased);

          // 천 단위 콤마 포맷 (locale-aware)
          setDisplayValue(currentValue.toLocaleString(locale));

          if (rawProgress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            // 최종값 정확히 고정 후 완료 플래그
            setDisplayValue(numericValue.toLocaleString(locale));
            setIsDone(true);
          }
        };

        rafRef.current = requestAnimationFrame(animate);
      }, startDelay);
    };

    if (!triggerRef) {
      startAnimation();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      };
    }

    // 모바일 대응: threshold 낮추고 rootMargin으로 화면 밖에서도 조기 트리거
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const el = triggerRef.current;
    if (el) {
      observer.observe(el);
    } else {
      startAnimation();
    }

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, [targetValue, duration, suffix, startDelay, triggerRef, locale]);

  return { value: displayValue, isDone };
}
