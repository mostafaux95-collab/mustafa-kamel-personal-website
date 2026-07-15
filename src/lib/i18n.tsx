import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { en } from "@/locales/en";
import { ar } from "@/locales/ar";

export type Lang = "ar" | "en";
export type Locale = typeof en;

const LangContext = createContext<{
  lang: Lang;
  t: Locale;
  setLang: (l: Lang) => void;
  toggle: () => void;
} | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem("mk-lang") === "en" ? "en" : "ar";
    } catch {
      return "ar";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("mk-lang", lang);
    } catch {
      /* private mode */
    }
  }, [lang]);

  const t = lang === "ar" ? ar : en;

  return (
    <LangContext.Provider
      value={{
        lang,
        t,
        setLang,
        toggle: () => setLang((l) => (l === "ar" ? "en" : "ar")),
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
