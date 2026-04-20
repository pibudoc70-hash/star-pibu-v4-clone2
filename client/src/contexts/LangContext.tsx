import React, { createContext, useState, useEffect } from "react";
import { Lang, I18nContent, i18n } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: I18nContent;
}

export const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("star-lang");
    return (stored as Lang) || "ko";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("star-lang", l);
  };

  useEffect(() => {
    document.documentElement.lang = lang === "ja" ? "ja" : lang === "zh" ? "zh" : lang === "en" ? "en" : "ko";
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: i18n[lang] }}>
      {children}
    </LangContext.Provider>
  );
}
