import { useRef, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { fetchPublic, getAssetUrl } from "@/lib/api";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";

const ACCENTS = ["#432666", "#6a3f9c", "#F58963"];

interface TestimonialItem {
  id: string;
  quote: string;
  quoteAr: string | null;
  role: string;
  roleAr: string | null;
  company: string;
  avatarInitial: string | null;
  avatarBg: string | null;
  avatarFg: string | null;
  avatarUrl: string | null;
}

interface CardData {
  key: string;
  quote: string;
  roleLabel: string;
  company: string;
  accent: string;
  avatar: ReactNode;
}

export default function Testimonials() {
  const { t, lang } = useLang();
  const isRtl = lang === "ar";
  const wrapRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: () => fetchPublic<{ items: TestimonialItem[] }>("/testimonials?pageSize=20"),
  });
  const realTestimonials = data?.items ?? [];
  // Placeholder "add a quote" prompts stay as the empty-state until real
  // testimonials exist in the CMS — same cards, same layout, just swapped
  // content source once there's something real to show.
  const hasReal = realTestimonials.length > 0;

  const cards: CardData[] = hasReal
    ? realTestimonials.map((item, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        const role = lang === "ar" && item.roleAr ? item.roleAr : item.role;
        const avatarSrc = getAssetUrl(item.avatarUrl);
        return {
          key: item.id,
          quote: lang === "ar" && item.quoteAr ? item.quoteAr : item.quote,
          roleLabel: role,
          company: item.company,
          accent,
          avatar: avatarSrc ? (
            <img src={avatarSrc} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          ) : (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-semibold"
              style={{ background: item.avatarBg ?? `${accent}22`, color: item.avatarFg ?? "#ffffff" }}
            >
              {item.avatarInitial ?? role.slice(0, 1)}
            </div>
          ),
        };
      })
    : t.testimonials.items.map((item, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        return {
          key: item.company,
          quote: item.quote,
          roleLabel: t.testimonials.addRole,
          company: item.company,
          accent,
          avatar: (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-ink/20 text-xs text-ink/40"
              style={{ background: `${accent}22` }}
            >
              +
            </div>
          ),
        };
      });

  useGSAP(
    () => {
      if (prefersReducedMotion() || cards.length === 0) return;
      const strip = stripRef.current!;

      // Same trick as the bottom-of-page Marquee: the strip holds two
      // identical halves, and the tween only ever travels the first 0 to
      // -50% of it, so the viewport is always fully covered and the loop
      // wraps with zero visible seam. Duration scales with card count so
      // the perceived speed per card stays consistent regardless of how
      // many testimonials exist.
      const DURATION = Math.max(cards.length * 6, 18);
      const tween = isRtl
        ? gsap.fromTo(strip, { xPercent: -50 }, { xPercent: 0, duration: DURATION, ease: "none", repeat: -1 })
        : gsap.fromTo(strip, { xPercent: 0 }, { xPercent: -50, duration: DURATION, ease: "none", repeat: -1 });

      const pause = () => gsap.to(tween, { timeScale: 0, duration: 0.4, overwrite: true });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.4, overwrite: true });

      strip.addEventListener("mouseenter", pause);
      strip.addEventListener("mouseleave", resume);
      strip.addEventListener("touchstart", pause, { passive: true });
      strip.addEventListener("touchend", resume, { passive: true });
      strip.addEventListener("focusin", pause);
      strip.addEventListener("focusout", resume);

      return () => {
        tween.kill();
        strip.removeEventListener("mouseenter", pause);
        strip.removeEventListener("mouseleave", resume);
        strip.removeEventListener("touchstart", pause);
        strip.removeEventListener("touchend", resume);
        strip.removeEventListener("focusin", pause);
        strip.removeEventListener("focusout", resume);
      };
    },
    { scope: wrapRef, dependencies: [cards.map((c) => c.key).join(), isRtl], revertOnUpdate: true },
  );

  function renderCard(card: CardData, key: string) {
    return (
      <div
        key={key}
        tabIndex={0}
        dir={isRtl ? "rtl" : "ltr"}
        className="relative flex h-full w-[300px] shrink-0 flex-col gap-6 rounded-3xl border border-ink/[0.08] bg-ink/[0.03] p-8 backdrop-blur-xl sm:w-[380px]"
      >
        <div
          className="absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
          style={{ background: card.accent }}
          aria-hidden
        />
        <Quote className={isRtl ? "-scale-x-100 text-ink/20" : "text-ink/20"} size={28} />
        <p className="flex-1 text-[15px] italic leading-relaxed text-[var(--color-ink-secondary)]">
          {card.quote}
        </p>
        <div className="flex items-center gap-3">
          {card.avatar}
          <div>
            <div className="text-sm font-medium text-ink/70">{card.roleLabel}</div>
            <div className="text-xs text-[var(--color-ink-muted)]">{card.company}</div>
          </div>
        </div>
      </div>
    );
  }

  // Each half repeats the cards enough times to comfortably exceed the
  // viewport width, so the seam between halves never sits alone on screen.
  const REPEAT = 3;
  const half = (keyPrefix: string) =>
    Array.from({ length: REPEAT }).flatMap((_, r) =>
      cards.map((card, i) => renderCard(card, `${keyPrefix}-${r}-${i}`)),
    );

  return (
    <section className="relative overflow-hidden border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn className="mb-16 flex flex-col gap-4 sm:mb-20">
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.testimonials.eyebrow}
          </span>
          <SplitReveal
            as="h2"
            type="lines"
            className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
          >
            {t.testimonials.title}
          </SplitReveal>
        </FadeIn>
      </Container>

      <div ref={wrapRef} className="overflow-hidden">
        <div
          ref={stripRef}
          dir="ltr"
          className="flex w-max gap-6 py-4 will-change-transform"
        >
          {half("a")}
          {half("b")}
        </div>
      </div>
    </section>
  );
}
