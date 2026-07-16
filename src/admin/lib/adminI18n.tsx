import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { adminEn, adminAr } from "./adminLocale";

export type AdminLang = "en" | "ar";

const AdminLangContext = createContext<{
  lang: AdminLang;
  t: typeof adminEn;
  dir: "ltr" | "rtl";
  toggle: () => void;
} | null>(null);

const STORAGE_KEY = "mk-admin-lang";

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<AdminLang>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : "en";
    } catch {
      return "en";
    }
  });

  function toggle() {
    setLang((prev) => {
      const next = prev === "en" ? "ar" : "en";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }

  const t = lang === "ar" ? adminAr : adminEn;
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <AdminLangContext.Provider value={{ lang, t, dir, toggle }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  const ctx = useContext(AdminLangContext);
  if (!ctx) throw new Error("useAdminLang must be used inside AdminLangProvider");
  return ctx;
}
