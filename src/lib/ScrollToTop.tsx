import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "@/lib/useLenis";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (target) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target, { immediate: false });
        } else {
          target.scrollIntoView();
        }
        return;
      }
    }

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
