import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Home,
  Languages,
  Mail,
  MessageSquareQuote,
  Moon,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useSound } from "@/lib/SoundProvider";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";

interface Command {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { enabled, toggle } = useSound();
  const { theme, toggle: toggleTheme } = useTheme();
  const { t, toggle: toggleLang } = useLang();

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", label: t.palette.goHome, icon: Home, action: () => navigate("/") },
      { id: "work", label: t.palette.goWork, icon: Briefcase, action: () => navigate("/work") },
      { id: "about", label: t.palette.goAbout, icon: MessageSquareQuote, action: () => navigate("/about") },
      { id: "skills", label: t.palette.goSkills, icon: Sparkles, action: () => navigate("/skills") },
      { id: "cv", label: t.palette.goCv, icon: Briefcase, action: () => navigate("/cv") },
      { id: "contact", label: t.palette.goContact, icon: Mail, action: () => navigate("/contact") },
      {
        id: "theme",
        label: theme === "dark" ? t.palette.themeLight : t.palette.themeDark,
        icon: theme === "dark" ? Sun : Moon,
        action: toggleTheme,
      },
      {
        id: "lang",
        label: t.palette.langSwitch,
        icon: Languages,
        action: toggleLang,
      },
      {
        id: "sound",
        label: enabled ? t.palette.soundOff : t.palette.soundOn,
        icon: enabled ? VolumeX : Volume2,
        action: toggle,
      },
      {
        id: "email",
        label: t.palette.email,
        icon: Mail,
        action: () => {
          window.location.href = "mailto:hi@mustafakamel.com";
        },
      },
    ],
    [navigate, enabled, toggle, theme, toggleTheme, t, toggleLang],
  );

  const filtered = useMemo(
    () =>
      query.trim() === ""
        ? commands
        : commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) {
          cmd.action();
          setOpen(false);
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIndex]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-bg-raised shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
              <ArrowRight size={16} className="text-ink/40 rtl:-scale-x-100" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder={t.palette.placeholder}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
              />
              <kbd className="rounded border border-ink/15 px-1.5 py-0.5 text-[10px] text-ink/40">
                esc
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink/40">{t.palette.none}</p>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    cmd.action();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors ${
                    i === activeIndex ? "bg-[var(--color-accent)]/12 text-ink" : "text-ink/75"
                  }`}
                >
                  <cmd.icon size={16} className="shrink-0 text-[var(--color-accent)]" />
                  {cmd.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
