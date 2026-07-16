import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { fetchPublic, getAssetUrl } from "@/lib/api";

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

export default function Testimonials() {
  const { t, lang } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: () => fetchPublic<{ items: TestimonialItem[] }>("/testimonials?pageSize=20"),
  });
  const realTestimonials = data?.items ?? [];
  // Placeholder "add a quote" prompts stay as the empty-state until real
  // testimonials exist in the CMS — same cards, same layout, just swapped
  // content source once there's something real to show.
  const hasReal = realTestimonials.length > 0;

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.85;
    const isRtl = getComputedStyle(track).direction === "rtl";
    track.scrollBy({ left: (isRtl ? -1 : 1) * dir * step, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn className="mb-16 flex flex-col gap-4 sm:mb-20 sm:flex-row sm:items-end sm:justify-between">
          <div>
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
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={t.testimonials.prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/[0.12] text-ink/60 transition-colors hover:border-[var(--color-accent)]/50 hover:text-ink"
            >
              <ChevronLeft className="rtl:-scale-x-100" size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={t.testimonials.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/[0.12] text-ink/60 transition-colors hover:border-[var(--color-accent)]/50 hover:text-ink"
            >
              <ChevronRight className="rtl:-scale-x-100" size={18} />
            </button>
          </div>
        </FadeIn>

        <div
          ref={trackRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 sm:mx-0 sm:px-0"
        >
          {hasReal
            ? realTestimonials.map((item, i) => {
                const accent = ACCENTS[i % ACCENTS.length];
                const quote = lang === "ar" && item.quoteAr ? item.quoteAr : item.quote;
                const role = lang === "ar" && item.roleAr ? item.roleAr : item.role;
                const avatarSrc = getAssetUrl(item.avatarUrl);
                return (
                  <FadeIn key={item.id} delay={i * 0.08} className="shrink-0 snap-start">
                    <motion.div
                      data-card
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 7 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                      className="relative flex h-full w-[85vw] max-w-sm flex-col gap-6 rounded-3xl border border-ink/[0.08] bg-ink/[0.03] p-8 backdrop-blur-xl sm:w-[380px]"
                    >
                      <div
                        className="absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      <Quote className="text-ink/20 rtl:-scale-x-100" size={28} />
                      <p className="flex-1 text-[15px] italic leading-relaxed text-[var(--color-ink-secondary)]">
                        {quote}
                      </p>
                      <div className="flex items-center gap-3">
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xs font-semibold"
                            style={{
                              background: item.avatarBg ?? `${accent}22`,
                              color: item.avatarFg ?? "#ffffff",
                            }}
                          >
                            {item.avatarInitial ?? role.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-ink/70">{role}</div>
                          <div className="text-xs text-[var(--color-ink-muted)]">{item.company}</div>
                        </div>
                      </div>
                    </motion.div>
                  </FadeIn>
                );
              })
            : t.testimonials.items.map((item, i) => {
                const accent = ACCENTS[i % ACCENTS.length];
                return (
                  <FadeIn key={item.company} delay={i * 0.08} className="shrink-0 snap-start">
                    <motion.div
                      data-card
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 7 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                      className="relative flex h-full w-[85vw] max-w-sm flex-col gap-6 rounded-3xl border border-ink/[0.08] bg-ink/[0.03] p-8 backdrop-blur-xl sm:w-[380px]"
                    >
                      <div
                        className="absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      <Quote className="text-ink/20 rtl:-scale-x-100" size={28} />
                      <p className="flex-1 text-[15px] italic leading-relaxed text-[var(--color-ink-secondary)]">
                        {item.quote}
                      </p>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-ink/20 text-xs text-ink/40"
                          style={{ background: `${accent}22` }}
                        >
                          +
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ink/70">
                            {t.testimonials.addRole}
                          </div>
                          <div className="text-xs text-[var(--color-ink-muted)]">{item.company}</div>
                        </div>
                      </div>
                    </motion.div>
                  </FadeIn>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
