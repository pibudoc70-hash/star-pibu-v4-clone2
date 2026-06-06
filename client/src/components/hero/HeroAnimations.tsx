/**
 * HeroAnimations — CharReveal + WordReveal 텍스트 애니메이션 컴포넌트
 * HeroSection에서 분리 (STRUCT-HERO-2)
 */
import React from "react";

/** 문자열을 글자 단위로 분해하여 <span> 배열 반환 */
export function CharReveal({
  text,
  startDelay = 0,
  charGap = 55,
  className = "",
  style = {},
}: {
  text: string;
  startDelay?: number;
  charGap?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ animationDelay: `${startDelay + i * charGap}ms`, fontWeight: "600" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/** 문자열을 공백 기준으로 단어 분해하여 <span> 배열 반환 */
export function WordReveal({
  text,
  startDelay = 0,
  wordGap = 90,
  className = "",
  style = {},
}: {
  text: string;
  startDelay?: number;
  wordGap?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block" }}>
          <span
            className="hero-word"
            style={{ animationDelay: `${startDelay + i * wordGap}ms`, fontWeight: "100" }}
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span
              className="hero-word"
              style={{ animationDelay: `${startDelay + i * wordGap}ms` }}
            >
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
