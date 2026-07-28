import React, { createContext, useState, useEffect, useContext } from "react";
import { Lang, I18nContent, i18n } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang, persist?: boolean) => void;
  t: I18nContent;
}

export const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("star-lang");
      if (stored && ["ko", "en", "ja", "zh", "zh-TW"].includes(stored)) return stored as Lang;
    } catch {}
    return "ko";
  });

  const setLang = (l: Lang, persist = true) => {
    setLangState(l);
    if (persist) {
      try { localStorage.setItem("star-lang", l); } catch {}
    }
  };

  useEffect(() => {
    document.documentElement.lang =
      lang === "ja" ? "ja" : lang === "zh" ? "zh-Hans" : lang === "zh-TW" ? "zh-Hant" : lang === "en" ? "en" : "ko";
    // body에 font-lang-* 클래스 설정 (index.css 언어별 폰트/줄높이 CSS 활성화)
    const body = document.body;
    body.classList.remove("font-lang-ko", "font-lang-ja", "font-lang-zh", "font-lang-en");
    // zh-TW reuses zh font class (same CJK font stack)
    body.classList.add(lang === "zh-TW" ? "font-lang-zh" : `font-lang-${lang}`);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: i18n[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextType {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
