import { useCallback, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import AboutPage from "@/pages/AboutPage";
import SkillsPage from "@/pages/SkillsPage";
import ContactPage from "@/pages/ContactPage";
import Cv from "@/pages/Cv";
import CaseStudy from "@/pages/CaseStudy";
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

export default function App() {
  useLenis();

  return (
    <ThemeProvider>
      <LangProvider>
        <SoundProvider>
          <div className="noise-overlay" />
          <Cursor />
          <ScrollToTop />
          <CommandPalette />
          <ShortcutsModal />
          <KonamiListener />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cv" element={<Cv />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SoundProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
