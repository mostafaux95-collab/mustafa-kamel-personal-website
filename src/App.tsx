import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { publicQueryClient } from "@/lib/publicQueryClient";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import AboutPage from "@/pages/AboutPage";
import SkillsPage from "@/pages/SkillsPage";
import ContactPage from "@/pages/ContactPage";
import Cv from "@/pages/Cv";
import CaseStudy from "@/pages/CaseStudy";
import AdminApp from "@/admin/AdminApp";
import Cursor from "@/components/cursor/Cursor";
import CommandPalette from "@/components/CommandPalette";
import ShortcutsModal from "@/components/ShortcutsModal";
import KonamiEffect from "@/components/easter-eggs/KonamiEffect";
import ScrollToTop from "@/lib/ScrollToTop";
import { useLenis } from "@/lib/useLenis";
import { useKonami } from "@/lib/useKonami";
import { SoundProvider, useSound } from "@/lib/SoundProvider";
import { ThemeProvider } from "@/lib/theme";
import { LangProvider } from "@/lib/i18n";

function KonamiListener() {
  const [active, setActive] = useState(false);
  const { playSuccess } = useSound();

  const onUnlock = useCallback(() => {
    setActive(true);
    playSuccess();
    setTimeout(() => setActive(false), 2600);
  }, [playSuccess]);

  useKonami(onUnlock);

  return <KonamiEffect active={active} />;
}

function PublicChrome() {
  // Lenis hijacks wheel/scroll input at the window level to smooth-
  // scroll the document — appropriate for the public site's single
  // long-scrolling page, but it doesn't know about the admin's nested
  // overflow-y-auto containers and would swallow scroll input meant for
  // them. Scoped here so it only ever mounts on non-admin routes.
  useLenis();

  // PageShape (the decorative wireframe shown on Work/About/Skills/CV)
  // pulls in a genuinely heavy shared Three.js chunk (~230KB gzipped).
  // Its own lazy() import only fires once that specific page mounts, so
  // a visitor landing directly on e.g. /about (not arriving via Home,
  // which already warms this same chunk for its hero) sees the shape
  // pop in late while the chunk cold-loads. Prefetching it here, once,
  // on any public page, means it's warm long before someone navigates
  // to a page that actually renders it.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(() => {
      import("@/components/three/PageShape");
    });
    return () => cancel(id);
  }, []);

  return (
    <>
      <div className="noise-overlay" />
      <Cursor />
      <CommandPalette />
      <ShortcutsModal />
      <KonamiListener />
    </>
  );
}

export default function App() {
  const location = useLocation();
  // The admin dashboard is a plain tool UI — skip the public site's custom
  // cursor, noise texture, command palette, and easter eggs there.
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={publicQueryClient}>
      <ThemeProvider>
        <LangProvider>
          <SoundProvider>
            {!isAdmin && <PublicChrome />}
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cv" element={<Cv />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SoundProvider>
        </LangProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
