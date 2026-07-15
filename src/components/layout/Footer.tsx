import { Volume2, VolumeX } from "lucide-react";
import Container from "@/components/ui/Container";
import { useSound } from "@/lib/SoundProvider";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { enabled, toggle } = useSound();
  const { t } = useLang();

  return (
    <footer className="border-t border-ink/[0.06] py-10">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-[var(--color-ink-muted)]">
          © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
        </p>

        <div className="flex items-center gap-5">
          <button
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? t.footer.soundOff : t.footer.soundOn}
            data-cursor="link"
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-ink-muted)] transition-colors hover:text-ink"
          >
            {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            {t.footer.sound}
          </button>
          <span className="hidden items-center gap-1.5 text-xs text-[var(--color-ink-muted)] sm:flex">
            <kbd className="rounded border border-ink/15 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            {t.footer.cmdHint}
          </span>
        </div>

        <p className="font-display text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
          {t.footer.location}
        </p>
      </Container>
    </footer>
  );
}
