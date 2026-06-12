/**
 * LanguageSwitcher — 데스크탑 언어 드롭다운
 * Header.tsx에서 분리 추출 (2026-06-12)
 */
import { Globe, ChevronDown } from "lucide-react";
import type { RefObject } from "react";
import type { LangOption } from "@/hooks/useHeaderState";

interface LanguageSwitcherProps {
  lang: string;
  langOptions: LangOption[];
  currentLangOption: LangOption;
  langDropOpen: boolean;
  setLangDropOpen: (open: boolean) => void;
  langDropRef: RefObject<HTMLDivElement | null>;
  langTriggerRef: RefObject<HTMLButtonElement | null>;
  handleLangChange: (option: LangOption) => void;
}

export default function LanguageSwitcher({
  lang,
  langOptions,
  currentLangOption,
  langDropOpen,
  setLangDropOpen,
  langDropRef,
  langTriggerRef,
  handleLangChange,
}: LanguageSwitcherProps) {
  return (
    <div
      className="hidden md:flex items-center flex-shrink-0"
      ref={langDropRef}
      style={{ position: "relative", marginLeft: "16px" }}
    >
      <button
        type="button"
        ref={langTriggerRef}
        onClick={() => setLangDropOpen(!langDropOpen)}
        className="flex items-center gap-1.5 transition-all duration-200 hover:bg-gray-50"
        style={{
          fontSize: "12.5px",
          color: "#555",
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: "100px",
          padding: "5px 12px",
          background: langDropOpen ? "#f7f7f7" : "white",
          gap: "5px",
        }}
        aria-label="언어 선택"
        aria-expanded={langDropOpen}
        aria-haspopup="listbox"
      >
        <Globe size={12} style={{ color: "#999" }} />
        <span>{currentLangOption.flag}</span>
        <ChevronDown
          size={11}
          style={{
            color: "#aaa",
            transform: langDropOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {langDropOpen && (
        <div
          role="listbox"
          aria-label="언어 목록"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            minWidth: "148px",
            overflow: "hidden",
            zIndex: 200,
            animation: "fadeSlideDown 0.15s ease",
          }}
        >
          {langOptions.map((option) => (
            <button
              type="button"
              id={`lang-option-${option.lang}`}
              key={option.lang}
              role="option"
              aria-selected={option.lang === lang}
              onClick={() => handleLangChange(option)}
              className="w-full flex items-center gap-2.5 text-left transition-colors hover:bg-gray-50"
              style={{
                padding: "10px 16px",
                fontSize: "13px",
                color: option.lang === lang ? "#C9A84C" : "#333",
                fontWeight: option.lang === lang ? 600 : 400,
                background: option.lang === lang ? "rgba(201,168,76,0.05)" : "transparent",
              }}
            >
              <span style={{ fontSize: "15px" }}>{option.flag}</span>
              <span>{option.label}</span>
              {option.lang === lang && (
                <span style={{ marginLeft: "auto", color: "#C9A84C", fontSize: "11px" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
