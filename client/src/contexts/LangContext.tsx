import React, { createContext, useState, useEffect, useContext } from "react";
import { Lang, I18nContent, i18n } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: I18nContent;
}

export const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("star-lang");
      if (stored && ["ko", "en", "ja", "zh"].includes(stored)) return stored as Lang;
    } catch {}
    return "ko";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("star-lang", l); } catch {}
  };

  useEffect(() => {
    document.documentElement.lang =
      lang === "ja" ? "ja" : lang === "zh" ? "zh" : lang === "en" ? "en" : "ko";
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
