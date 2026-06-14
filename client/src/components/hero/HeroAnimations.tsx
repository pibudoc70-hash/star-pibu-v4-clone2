/**
 * HeroAnimations — CharReveal + WordReveal 텍스트 애니메이션 컴포넌트
 * HeroSection에서 분리 (STRUCT-HERO-2)
 *
 * [R15-P0-1] animationDelay 인라인 style → CSS custom property 기반 선언형 재설계
 *   - `style={{ animationDelay: '...' }}` 패턴 제거
 *   - CSS custom property `--delay` 를 통해 animation-delay 제어
 *   - 스크린리더 접근성: 시각용 span은 aria-hidden, sr-only로 원문 텍스트 제공
 *   - fontWeight 인라인 style 제거 → Tailwind 클래스(font-semibold, font-light)로 치환
 */
import React from "react";

/**
 * 문자열을 글자 단위로 분해하여 charReveal 애니메이션 적용
 *
 * CSS custom property `--delay` 를 통해 animation-delay를 선언형으로 제어합니다.
 * 스크린리더는 aria-hidden 처리된 시각용 span을 무시하고,
 * sr-only span의 원문 텍스트를 읽습니다.
 */
export function CharReveal({
  text,
  startDelay = 0,
  charGap = 55,
  className = "",
}: {
  text: string;
  startDelay?: number;
  charGap?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {/* 스크린리더용 원문 텍스트 */}
      <span className="sr-only">{text}</span>
      {/* 시각용 글자별 애니메이션 (스크린리더 무시) */}
      <span aria-hidden="true" className="inline-block">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="hero-char font-normal"
            style={{ "--delay": `${startDelay + i * charGap}ms` } as React.CSSProperties}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * 문자열을 공백 기준으로 단어 분해하여 wordReveal 애니메이션 적용
 *
 * CSS custom property `--delay` 를 통해 animation-delay를 선언형으로 제어합니다.
 * 스크린리더는 aria-hidden 처리된 시각용 span을 무시하고,
 * sr-only span의 원문 텍스트를 읽습니다.
 */
export function WordReveal({
  text,
  startDelay = 0,
  wordGap = 90,
  className = "",
}: {
  text: string;
  startDelay?: number;
  wordGap?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {/* 스크린리더용 원문 텍스트 */}
      <span className="sr-only">{text}</span>
      {/* 시각용 단어별 애니메이션 (스크린리더 무시) */}
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block">
            <span
              className="hero-word font-light"
              style={{ "--delay": `${startDelay + i * wordGap}ms` } as React.CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 && (
              <span
                className="hero-word"
                style={{ "--delay": `${startDelay + i * wordGap}ms` } as React.CSSProperties}
              >
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
