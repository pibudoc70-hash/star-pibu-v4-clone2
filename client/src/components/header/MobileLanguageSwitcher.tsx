import { ChevronDown, Globe2 } from "lucide-react";
import type { RefObject } from "react";
import type { LangOption } from "@/hooks/useHeaderState";

const LANG_CODE_LABEL: Record<string, string> = {
  ko: "KO",
  en: "EN",
  ja: "JA",
  zh: "ZH",
  "zh-TW": "繁中",
};

interface MobileLanguageSwitcherProps {
  lang: string;
  langOptions: LangOption[];
  currentLangOption: LangOption;
  langDropOpen: boolean;
  setLangDropOpen: (open: boolean) => void;
  langDropRef: RefObject<HTMLDivElement | null>;
  langTriggerRef: RefObject<HTMLButtonElement | null>;
  handleLangChange: (option: LangOption) => void;
  scrolled: boolean;
}

export default function MobileLanguageSwitcher({
  lang,
  langOptions,
  currentLangOption,
  langDropOpen,
  setLangDropOpen,
  langDropRef,
  langTriggerRef,
  handleLangChange,
  scrolled,
}: MobileLanguageSwitcherProps) {
  const foreground = scrolled ? "#3d2b1a" : "rgba(255,255,255,0.96)";
  const surface = scrolled ? "rgba(255,255,255,0.82)" : "rgba(12,8,4,0.22)";
  const border = scrolled ? "rgba(61,43,26,0.16)" : "rgba(255,255,255,0.32)";

  return (
    <div
      className="md:hidden flex items-center flex-shrink-0"
      ref={langDropRef}
      style={{ position: "relative", marginLeft: "auto", marginRight: "4px" }}
    >
      <button
        type="button"
        ref={langTriggerRef}
        onClick={() => setLangDropOpen(!langDropOpen)}
        className="flex items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
        style={{
          minWidth: "44px",
          height: "44px",
          padding: "0 8px",
          borderRadius: "10px",
          color: foreground,
          background: langDropOpen ? (scrolled ? "#fff" : "rgba(12,8,4,0.40)") : surface,
          border: `1px solid ${border}`,
          textShadow: scrolled ? "none" : "0 1px 5px rgba(0,0,0,0.6)",
        }}
        aria-label="언어 선택"
        aria-expanded={langDropOpen}
        aria-haspopup="listbox"
        aria-controls="mobile-language-menu"
      >
        <Globe2 size={15} aria-hidden="true" />
        <span style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.04em" }}>
          {LANG_CODE_LABEL[currentLangOption.lang] ?? currentLangOption.lang.toUpperCase()}
        </span>
        <ChevronDown
          size={13}
          aria-hidden="true"
          style={{ transform: langDropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        />
      </button>

      {langDropOpen && (
        <div
          id="mobile-language-menu"
          role="listbox"
          aria-label="언어 목록"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            minWidth: "176px",
            overflow: "hidden",
            borderRadius: "14px",
            border: "1px solid rgba(61,43,26,0.14)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            background: "#fffdf9",
            zIndex: 1000,
            animation: "fadeSlideDown 0.15s ease",
          }}
        >
          {langOptions.map(option => (
            <button
              type="button"
              key={option.lang}
              id={`mobile-lang-option-${option.lang}`}
              role="option"
              aria-selected={option.lang === lang}
              onClick={() => handleLangChange(option)}
              className="w-full flex items-center gap-3 text-left transition-colors hover:bg-[var(--mobile-surface-muted)] focus-visible:outline-none focus-visible:bg-[var(--mobile-surface-muted)]"
              style={{
                minHeight: "44px",
                padding: "10px 14px",
                color: option.lang === lang ? "#3d2b1a" : "#4f4b47",
                fontSize: "13px",
                fontWeight: option.lang === lang ? 700 : 500,
                background: option.lang === lang ? "rgba(201,168,76,0.13)" : "transparent",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "30px",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  color: option.lang === lang ? "#3d2b1a" : "#625b54",
                }}
              >
                {LANG_CODE_LABEL[option.lang] ?? option.lang.toUpperCase()}
              </span>
              <span>{option.label}</span>
              {option.lang === lang && <span aria-hidden="true" style={{ marginLeft: "auto", color: "#3d2b1a" }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
