import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export function usePageTitle(title?: string) {
  const { t } = useLang();

  useEffect(() => {
    document.title = title ? `${title} · ${t.brand}` : t.titles.base;
    return () => {
      document.title = t.titles.base;
    };
  }, [title, t]);
}
